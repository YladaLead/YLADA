'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import NoelChatWithParams from '@/components/ylada/NoelChatWithParams'
import NoelNeutralSpecializationNotice from '@/components/ylada/NoelNeutralSpecializationNotice'
import PosOnboardingHomePanel from '@/components/ylada/PosOnboardingHomePanel'
import type { NoelArea } from '@/config/noel-ux-content'
import { buildNoelUnifiedReceptionMessage, formatReceptionVocativeName } from '@/lib/ylada-noel-reception-copy'
import { YLADA_NOEL_HOME_EXPANDED_KEY, yladaNoelHomeCollapsedCopy } from '@/lib/ylada-pos-onboarding'
import { trackEvent } from '@/lib/analytics-events'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { useYladaSidebarReveal } from '@/components/ylada/YladaSidebarRevealContext'

interface NoelHomeContentProps {
  areaCodigo: string
  areaLabel: string
  area: NoelArea
  subtitle: string
  /** Só para preview em dev: força banner de ativação (full/compact). */
  homeActivationPreview?: 'full' | 'compact'
  /**
   * Estudo interno (ex.: /preview-primeira-home): uma única carta de recepção do Noel + “Começar agora”.
   * Saudação por gênero: use `?genero=m` ou `?genero=f` na URL; sem parâmetro → “bem-vindo(a)”.
   */
  unifiedReceptionPreview?: boolean
}

export { noelUnifiedReceptionWelcome } from '@/lib/ylada-noel-reception-copy'

type NoelHomeChatShellProps = {
  area: NoelArea
  collapsedPromptOverride?: string
  collapsedLayout?: 'inline' | 'receptionHero'
}

function NoelHomeChatShell({ area, collapsedPromptOverride, collapsedLayout = 'inline' }: NoelHomeChatShellProps) {
  const [expanded, setExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const nc = yladaNoelHomeCollapsedCopy
  const prompt = collapsedPromptOverride ?? nc.question
  const isHero = collapsedLayout === 'receptionHero'
  const sidebarReveal = useYladaSidebarReveal()

  useEffect(() => {
    setMounted(true)
    try {
      if (localStorage.getItem(YLADA_NOEL_HOME_EXPANDED_KEY) === '1') {
        setExpanded(true)
      }
    } catch {
      /* ok */
    }
  }, [])

  useEffect(() => {
    if (expanded) sidebarReveal?.revealSidebar()
  }, [expanded, sidebarReveal])

  const openChat = useCallback(() => {
    setExpanded(true)
    try {
      localStorage.setItem(YLADA_NOEL_HOME_EXPANDED_KEY, '1')
    } catch {
      /* ok */
    }
    trackEvent('ylada_noel_home_expand', { area })
    requestAnimationFrame(() => {
      document.getElementById('noel-home-chat-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      window.setTimeout(() => {
        const ta = document.querySelector<HTMLTextAreaElement>('#noel-home-chat-anchor textarea')
        ta?.focus()
      }, 450)
    })
  }, [area])

  if (!mounted) {
    return (
      <div
        id="noel-home-chat-anchor"
        className="flex flex-col flex-1 min-h-0 scroll-mt-28"
        aria-busy="true"
      >
        <div className="min-h-[88px] rounded-xl bg-gray-50 animate-pulse" />
      </div>
    )
  }

  return (
    <div id="noel-home-chat-anchor" className="flex flex-col flex-1 min-h-0 scroll-mt-28">
      {!expanded ? (
        isHero ? (
          <section
            className="mb-4 sm:mb-6 rounded-2xl border border-sky-200/90 bg-gradient-to-b from-sky-50/90 via-white to-white p-5 sm:p-6 shadow-md shadow-sky-900/5"
            aria-label="Recepção do Noel"
          >
            <div className="flex flex-col gap-5 sm:gap-6">
              <p className="text-base sm:text-lg font-medium text-gray-900 leading-relaxed">{prompt}</p>
              <button
                type="button"
                onClick={openChat}
                className="inline-flex w-full min-h-[52px] items-center justify-center rounded-2xl bg-sky-600 px-5 py-3.5 text-center text-base font-bold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700 transition-colors"
              >
                {nc.cta}
              </button>
            </div>
          </section>
        ) : (
          <div className="rounded-xl border border-sky-200 bg-white shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2 sm:mb-3">
            <p className="text-sm font-medium text-gray-900 leading-snug">{prompt}</p>
            <button
              type="button"
              onClick={openChat}
              className="shrink-0 min-h-[48px] rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 w-full sm:w-auto transition-colors"
            >
              {nc.cta}
            </button>
          </div>
        )
      ) : null}

      {expanded ? (
        <Suspense fallback={<div className="flex-1 min-h-[400px] rounded-xl bg-gray-100 animate-pulse" />}>
          <NoelChatWithParams area={area} className="flex-1 min-h-0 flex flex-col" />
        </Suspense>
      ) : null}
    </div>
  )
}

const NOEL_SUBTITLE_PREFIX = 'Use o Noel para '

function UnifiedReceptionNoelBlock({ area, areaCodigo }: { area: NoelArea; areaCodigo: string }) {
  const searchParams = useSearchParams()
  const genero = searchParams.get('genero')
  const authenticatedFetch = useAuthenticatedFetch()
  const [receptionMessage, setReceptionMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      let nomePreferido: string | null = null
      let profession: string | null = null
      try {
        const [accRes, profRes] = await Promise.all([
          authenticatedFetch('/api/ylada/account'),
          authenticatedFetch(`/api/ylada/profile?segment=${encodeURIComponent(areaCodigo)}`),
        ])
        if (accRes.ok) {
          const acc = await accRes.json().catch(() => ({}))
          const n = typeof acc.profile?.nome === 'string' ? acc.profile.nome.trim() : ''
          if (n.length >= 2) nomePreferido = n
        }
        if (profRes.ok) {
          const body = await profRes.json().catch(() => ({}))
          const p = body?.data?.profile
          if (p && typeof p === 'object') {
            if (typeof p.profession === 'string' && p.profession.trim()) {
              profession = p.profession.trim()
            }
            const as = (p.area_specific || {}) as Record<string, unknown>
            const fromSeg = typeof as.nome === 'string' ? as.nome.trim() : ''
            if (fromSeg.length >= 2) nomePreferido = fromSeg
          }
        }
      } catch {
        /* sessão / rede */
      }
      if (cancelled) return
      const vocative = formatReceptionVocativeName(nomePreferido, profession, genero)
      setReceptionMessage(buildNoelUnifiedReceptionMessage(genero, vocative))
    })()
    return () => {
      cancelled = true
    }
  }, [areaCodigo, authenticatedFetch, genero])

  if (receptionMessage === null) {
    return (
      <div
        className="mb-4 min-h-[180px] rounded-2xl border border-sky-100 bg-sky-50/50 animate-pulse"
        aria-hidden
      />
    )
  }

  return (
    <NoelHomeChatShell
      area={area}
      collapsedPromptOverride={receptionMessage}
      collapsedLayout="receptionHero"
    />
  )
}

export default function NoelHomeContent({
  areaCodigo,
  areaLabel,
  area,
  subtitle,
  homeActivationPreview,
  unifiedReceptionPreview,
}: NoelHomeContentProps) {
  const mentorLine =
    areaLabel !== 'YLADA'
      ? `Mentor estratégico para ${areaLabel.toLowerCase()}`
      : 'Mentor estratégico'

  const subtitleBody =
    subtitle.startsWith(NOEL_SUBTITLE_PREFIX) ? subtitle.slice(NOEL_SUBTITLE_PREFIX.length) : null

  if (unifiedReceptionPreview) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-10rem)]">
        <Suspense
          fallback={
            <div className="mb-4 min-h-[180px] rounded-2xl border border-sky-100 bg-sky-50/50 animate-pulse" />
          }
        >
          <UnifiedReceptionNoelBlock area={area} areaCodigo={areaCodigo} />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)]">
      <Suspense fallback={null}>
        <PosOnboardingHomePanel areaCodigo={areaCodigo} variantOverride={homeActivationPreview} />
      </Suspense>
      <div className="mb-4">
        <h1 className="text-gray-900 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-2xl shrink-0 leading-none" aria-hidden>
            🧠
          </span>
          <span className="text-xl sm:text-2xl font-bold tracking-tight">Noel</span>
          <span className="text-gray-300 font-light select-none" aria-hidden>
            —
          </span>
          <span className="text-base sm:text-lg font-medium text-gray-600 leading-snug">{mentorLine}</span>
        </h1>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-2xl">
          {subtitleBody !== null ? (
            <>
              {NOEL_SUBTITLE_PREFIX}
              <span className="font-semibold text-gray-900 text-sm sm:text-[15px]">{subtitleBody}</span>
            </>
          ) : (
            subtitle
          )}
        </p>
      </div>
      <NoelNeutralSpecializationNotice mentorArea={area} />
      <NoelHomeChatShell area={area} />
    </div>
  )
}
