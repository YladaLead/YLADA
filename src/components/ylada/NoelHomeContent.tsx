'use client'

import Link from 'next/link'
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
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import YladaReceptionWelcomeVideo from '@/components/ylada/YladaReceptionWelcomeVideo'

interface NoelHomeContentProps {
  areaCodigo: string
  areaLabel: string
  area: NoelArea
  subtitle: string
  /** Só para preview em dev: força banner de ativação (full/compact). */
  homeActivationPreview?: 'full' | 'compact'
  /**
   * Preview mínimo (ex.: /preview-primeira-home): só o cartão do Noel, sem banner pós-onboarding.
   * Saudação: `?genero=m` ou `?genero=f` para Dr./Dra. em médico/odonto sem título no nome.
   */
  unifiedReceptionPreview?: boolean
}

export { noelUnifiedReceptionWelcome } from '@/lib/ylada-noel-reception-copy'

type NoelHomeChatShellProps = {
  area: NoelArea
  collapsedPromptOverride?: string
  collapsedLayout?: 'inline' | 'receptionHero'
  /** Link para a página Como usar da mesma área (texto de apoio abaixo da recepção). */
  comoUsarHref?: string
}

function ReceptionCtas({
  comoUsarHref,
  onComecar,
  ctaLabel,
  area,
  layout = 'inline',
}: {
  comoUsarHref: string
  onComecar: () => void
  ctaLabel: string
  area: NoelArea
  /** `hero`: texto e lista centralizados no cartão; `inline`: alinhado à esquerda (layout compacto). */
  layout?: 'inline' | 'hero'
}) {
  const isHeroLayout = layout === 'hero'
  return (
    <div
      className={
        isHeroLayout ? 'flex w-full max-w-full flex-col items-center gap-3' : 'flex w-full flex-col gap-3'
      }
    >
      <div
        className={`text-[13px] sm:text-sm text-gray-700 leading-snug sm:leading-relaxed text-pretty space-y-2.5 ${
          isHeroLayout ? 'w-full text-center' : ''
        }`}
      >
        <p>
          Clique em <span className="font-semibold text-sky-800">Como usar</span> e descubra na prática como fazer o{' '}
          <strong className="text-gray-900">Instagram te favorecer</strong>:
        </p>
        <div className={isHeroLayout ? 'flex w-full justify-center' : ''}>
          <ul
            className={`list-none space-y-1.5 text-gray-800 ${
              isHeroLayout ? 'max-w-lg text-left pl-0' : 'pl-0'
            }`}
          >
            <li className="flex gap-2">
              <span className="text-sky-600 font-bold shrink-0" aria-hidden>
                ·
              </span>
              <span>Direct, engajamento e posicionamento.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sky-600 font-bold shrink-0" aria-hidden>
                ·
              </span>
              <span>Fluxos e diagnósticos gratuitos, leads mais preparadas no WhatsApp.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sky-600 font-bold shrink-0" aria-hidden>
                ·
              </span>
              <span>Posts que fazem a pessoa te procurar pra conversar, não só curtida.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-sky-600 font-bold shrink-0" aria-hidden>
                ·
              </span>
              <span>Lead quente × lead só curioso: como tratar cada um.</span>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={`flex w-full flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3 ${
          isHeroLayout ? 'mx-auto max-w-xl sm:max-w-2xl' : ''
        }`}
      >
        <Link
          href={comoUsarHref}
          onClick={() => trackEvent('ylada_noel_home_como_usar', { area })}
          className="flex min-h-[52px] w-full flex-1 min-w-0 items-center justify-center rounded-2xl border-2 border-sky-600 bg-white px-4 py-3 text-center text-base font-bold leading-tight text-sky-700 shadow-sm box-border hover:bg-sky-50 active:bg-sky-100/80 transition-colors touch-manipulation sm:px-5"
        >
          Abrir Como usar
        </Link>
        <button
          type="button"
          onClick={onComecar}
          className="flex min-h-[52px] w-full flex-1 min-w-0 items-center justify-center rounded-2xl border-2 border-sky-600 bg-sky-600 px-4 py-3 text-center text-base font-bold leading-tight text-white shadow-lg shadow-sky-600/25 box-border hover:bg-sky-700 active:bg-sky-800 transition-colors touch-manipulation sm:px-5"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}

function NoelHomeChatShell({
  area,
  collapsedPromptOverride,
  collapsedLayout = 'inline',
  comoUsarHref,
}: NoelHomeChatShellProps) {
  const searchParams = useSearchParams()
  const [expanded, setExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const nc = yladaNoelHomeCollapsedCopy
  const prompt = collapsedPromptOverride ?? nc.question
  const isHero = collapsedLayout === 'receptionHero'
  const sidebarReveal = useYladaSidebarReveal()
  const forceOpenFromSidebar = searchParams.get('chat') === '1'

  useEffect(() => {
    setMounted(true)
    try {
      if (forceOpenFromSidebar || localStorage.getItem(YLADA_NOEL_HOME_EXPANDED_KEY) === '1') {
        setExpanded(true)
      }
    } catch {
      /* ok */
    }
  }, [forceOpenFromSidebar])

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
            className="mb-3 sm:mb-6 rounded-2xl border border-sky-200/90 bg-gradient-to-b from-sky-50/90 via-white to-white px-4 py-5 sm:p-6 shadow-md shadow-sky-900/5 touch-manipulation"
            aria-label="Recepção do Noel"
          >
            {/* Conteúdo centralizado no cartão (mobile e desktop); largura máxima confortável para leitura. */}
            <div className="flex w-full max-w-full flex-col items-center gap-4 text-center sm:mx-auto sm:max-w-2xl sm:gap-6">
              <YladaReceptionWelcomeVideo />
              <p className="text-[15px] sm:text-lg font-medium text-gray-900 leading-[1.55] sm:leading-relaxed text-pretty whitespace-pre-line">
                {prompt}
              </p>
              {comoUsarHref ? (
                <ReceptionCtas
                  comoUsarHref={comoUsarHref}
                  onComecar={openChat}
                  ctaLabel={nc.cta}
                  area={area}
                  layout="hero"
                />
              ) : (
                <button
                  type="button"
                  onClick={openChat}
                  className="inline-flex w-full min-h-[52px] items-center justify-center rounded-2xl bg-sky-600 px-5 py-3.5 text-center text-base font-bold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700 active:bg-sky-800 transition-colors touch-manipulation"
                >
                  {nc.cta}
                </button>
              )}
            </div>
          </section>
        ) : (
          <div className="rounded-xl border border-sky-200 bg-white shadow-sm p-4 flex flex-col gap-3 mb-2 sm:mb-3">
            <p className="text-sm font-medium text-gray-900 leading-snug min-w-0">{prompt}</p>
            {comoUsarHref ? (
              <ReceptionCtas
                comoUsarHref={comoUsarHref}
                onComecar={openChat}
                ctaLabel={nc.cta}
                area={area}
              />
            ) : (
              <button
                type="button"
                onClick={openChat}
                className="min-h-[48px] rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700 w-full transition-colors"
              >
                {nc.cta}
              </button>
            )}
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

function UnifiedReceptionNoelBlock({
  area,
  areaCodigo,
  comoUsarHref,
}: {
  area: NoelArea
  areaCodigo: string
  comoUsarHref: string
}) {
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
        className="mb-3 sm:mb-4 min-h-[168px] sm:min-h-[180px] rounded-2xl border border-sky-100 bg-sky-50/50 animate-pulse"
        aria-hidden
      />
    )
  }

  return (
    <NoelHomeChatShell
      area={area}
      collapsedPromptOverride={receptionMessage}
      collapsedLayout="receptionHero"
      comoUsarHref={comoUsarHref}
    />
  )
}

export default function NoelHomeContent({
  areaCodigo,
  area,
  homeActivationPreview,
  unifiedReceptionPreview,
}: NoelHomeContentProps) {
  const comoUsarHref = `${getYladaAreaPathPrefix(areaCodigo)}/como-usar`

  const receptionSkeleton = (
    <div className="mb-3 sm:mb-4 min-h-[168px] sm:min-h-[180px] rounded-2xl border border-sky-100 bg-sky-50/50 animate-pulse" />
  )

  if (unifiedReceptionPreview) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-10rem)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Suspense fallback={receptionSkeleton}>
          <UnifiedReceptionNoelBlock area={area} areaCodigo={areaCodigo} comoUsarHref={comoUsarHref} />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <Suspense fallback={null}>
        <PosOnboardingHomePanel areaCodigo={areaCodigo} variantOverride={homeActivationPreview} />
      </Suspense>
      <NoelNeutralSpecializationNotice mentorArea={area} />
      <Suspense fallback={receptionSkeleton}>
        <UnifiedReceptionNoelBlock area={area} areaCodigo={areaCodigo} comoUsarHref={comoUsarHref} />
      </Suspense>
    </div>
  )
}
