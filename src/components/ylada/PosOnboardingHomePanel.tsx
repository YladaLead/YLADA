'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import {
  yladaPosOnboardingCopy,
  yladaHomeActivationCompactCopy,
  YLADA_POS_ONBOARDING_STORAGE_KEY,
  YLADA_HOME_ACTIVATION_BANNER_KEY,
  markHomeActivationComplete,
} from '@/lib/ylada-pos-onboarding'
import { trackEvent } from '@/lib/analytics-events'

type BannerVariant = 'hidden' | 'full' | 'compact'

interface PosOnboardingHomePanelProps {
  areaCodigo: string
  /** Só para páginas de preview em dev: força o banner sem depender de sessionStorage/links. */
  variantOverride?: 'full' | 'compact'
}

export default function PosOnboardingHomePanel({ areaCodigo, variantOverride }: PosOnboardingHomePanelProps) {
  const searchParams = useSearchParams()
  const [variant, setVariant] = useState<BannerVariant>('hidden')
  const [linkCount, setLinkCount] = useState<number | null>(null)
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const novoLinkHref = `${prefix}/links/novo`
  const c = yladaPosOnboardingCopy
  const compact = yladaHomeActivationCompactCopy

  const devPreview =
    process.env.NODE_ENV === 'development' && searchParams.get('preview_pos_onboarding') === '1'

  useEffect(() => {
    let cancelled = false
    fetch('/api/ylada/links', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const n = data?.success && Array.isArray(data.data) ? data.data.length : 0
        setLinkCount(n)
        if (n > 0 && !variantOverride) {
          try {
            localStorage.setItem(YLADA_HOME_ACTIVATION_BANNER_KEY, 'off')
          } catch {
            /* ok */
          }
        }
      })
      .catch(() => {
        if (!cancelled) setLinkCount(0)
      })
    return () => {
      cancelled = true
    }
  }, [variantOverride])

  useEffect(() => {
    if (variantOverride) {
      setVariant(variantOverride)
      if (variantOverride === 'full') {
        trackEvent('ylada_pos_onboarding_view', { area: areaCodigo, preview: 'variant_override' })
      }
      return
    }

    if (devPreview) {
      setVariant('full')
      trackEvent('ylada_pos_onboarding_view', { area: areaCodigo, preview: true })
      return
    }

    if (linkCount === null) return

    if (linkCount > 0) {
      setVariant('hidden')
      return
    }

    let stored: string | null = null
    try {
      stored = localStorage.getItem(YLADA_HOME_ACTIVATION_BANNER_KEY)
    } catch {
      stored = null
    }
    if (stored === 'off') {
      setVariant('hidden')
      return
    }

    let sessionOnboarding = false
    try {
      sessionOnboarding = sessionStorage.getItem(YLADA_POS_ONBOARDING_STORAGE_KEY) === '1'
    } catch {
      /* ok */
    }

    if (sessionOnboarding) {
      setVariant('full')
      trackEvent('ylada_pos_onboarding_view', { area: areaCodigo })
      return
    }

    if (stored === 'compact') {
      setVariant('compact')
      trackEvent('ylada_home_activation_compact_view', { area: areaCodigo })
      return
    }

    setVariant('hidden')
  }, [linkCount, areaCodigo, devPreview, variantOverride])

  const dismissCompact = useCallback(() => {
    markHomeActivationComplete()
    setVariant('hidden')
    trackEvent('ylada_home_activation_compact_dismiss', { area: areaCodigo })
  }, [areaCodigo])

  if (variant === 'hidden') return null

  if (variant === 'compact') {
    return (
      <section className="mb-3 sm:mb-4 rounded-xl border border-gray-200 bg-white px-3 py-3 sm:px-4 sm:py-3 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm text-gray-800 font-medium">{compact.line}</p>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={novoLinkHref}
            onClick={() => trackEvent('ylada_home_activation_compact_cta', { area: areaCodigo })}
            className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {compact.cta}
          </Link>
          <button
            type="button"
            onClick={dismissCompact}
            className="text-xs text-gray-500 hover:text-gray-800 px-2 py-1"
          >
            {compact.dismiss}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section
      className="mb-4 sm:mb-6 rounded-2xl border border-amber-200/90 bg-gradient-to-b from-amber-50/95 via-white to-white p-4 sm:p-5 shadow-md shadow-amber-900/5"
      aria-labelledby="pos-onboarding-headline"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 id="pos-onboarding-headline" className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
            {c.headline}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{c.sub}</p>
        </div>

        <Link
          href={novoLinkHref}
          onClick={() => trackEvent('ylada_pos_onboarding_links_cta', { area: areaCodigo })}
          className="inline-flex w-full min-h-[52px] items-center justify-center rounded-2xl bg-blue-600 px-5 py-3.5 text-center text-base font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors"
        >
          {c.ctaPrimary}
        </Link>
      </div>
    </section>
  )
}
