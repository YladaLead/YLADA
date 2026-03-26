'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import NoelChatWithParams from '@/components/ylada/NoelChatWithParams'
import NoelNeutralSpecializationNotice from '@/components/ylada/NoelNeutralSpecializationNotice'
import PosOnboardingHomePanel from '@/components/ylada/PosOnboardingHomePanel'
import type { NoelArea } from '@/config/noel-ux-content'
import { YLADA_NOEL_HOME_EXPANDED_KEY, yladaNoelHomeCollapsedCopy } from '@/lib/ylada-pos-onboarding'
import { trackEvent } from '@/lib/analytics-events'

interface NoelHomeContentProps {
  areaCodigo: string
  areaLabel: string
  area: NoelArea
  subtitle: string
}

function NoelHomeChatShell({ area }: { area: NoelArea }) {
  const [expanded, setExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const nc = yladaNoelHomeCollapsedCopy

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
        <div className="rounded-xl border border-sky-200 bg-white shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2 sm:mb-3">
          <p className="text-sm font-medium text-gray-900 leading-snug">{nc.question}</p>
          <button
            type="button"
            onClick={openChat}
            className="shrink-0 min-h-[48px] rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 w-full sm:w-auto transition-colors"
          >
            {nc.cta}
          </button>
        </div>
      ) : null}

      {expanded ? (
        <Suspense fallback={<div className="flex-1 min-h-[400px] rounded-xl bg-gray-100 animate-pulse" />}>
          <NoelChatWithParams area={area} className="flex-1 min-h-0 flex flex-col" />
        </Suspense>
      ) : null}
    </div>
  )
}

export default function NoelHomeContent({ areaCodigo, areaLabel, area, subtitle }: NoelHomeContentProps) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)]">
      <Suspense fallback={null}>
        <PosOnboardingHomePanel areaCodigo={areaCodigo} />
      </Suspense>
      <div className="mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            🧠
          </span>
          Noel — Mentor estratégico{areaLabel !== 'YLADA' ? ` para ${areaLabel.toLowerCase()}` : ''}
        </h1>
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      </div>
      <NoelNeutralSpecializationNotice mentorArea={area} />
      <NoelHomeChatShell area={area} />
    </div>
  )
}
