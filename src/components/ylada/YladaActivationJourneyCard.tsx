'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import { trackEvent } from '@/lib/analytics-events'

const JOURNEY_DISMISS_KEY = 'ylada_activation_journey_dismissed_v1'

type LinkStats = {
  view?: number
  start?: number
  complete?: number
  cta_click?: number
  share_click?: number
}

type LinkRow = {
  id: string
  stats?: LinkStats
}

type ActivationPhase = 'need_link' | 'need_exposure' | 'need_whatsapp' | 'activated'

/**
 * Divulgação / exposição: compartilhamento, pelo menos uma view (visitante — views do dono não entram na API),
 * ou alguém iniciou/concluiu o fluxo.
 */
function aggregatePhase(links: LinkRow[]): ActivationPhase {
  if (!links.length) return 'need_link'
  const hasExposure = links.some((l) => {
    const s = l.stats
    if (!s) return false
    const share = s.share_click ?? 0
    const view = s.view ?? 0
    const start = s.start ?? 0
    const complete = s.complete ?? 0
    return share > 0 || view >= 1 || start > 0 || complete > 0
  })
  const hasWhatsapp = links.some((l) => (l.stats?.cta_click ?? 0) > 0)
  if (!hasExposure) return 'need_exposure'
  if (!hasWhatsapp) return 'need_whatsapp'
  return 'activated'
}

interface YladaActivationJourneyCardProps {
  areaCodigo: string
}

export default function YladaActivationJourneyCard({ areaCodigo }: YladaActivationJourneyCardProps) {
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const linksHref = `${prefix}/links`
  const novoLinkHref = `${prefix}/links/novo`

  const [links, setLinks] = useState<LinkRow[] | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(JOURNEY_DISMISS_KEY) === '1')
    } catch {
      setDismissed(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/ylada/links', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const list = data?.success && Array.isArray(data.data) ? (data.data as LinkRow[]) : []
        setLinks(list)
      })
      .catch(() => {
        if (!cancelled) setLinks([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const phase = useMemo(() => (links ? aggregatePhase(links) : null), [links])

  useEffect(() => {
    if (!phase || links === null) return
    if (links.length === 0) return
    trackEvent('ylada_activation_journey_view', { area: areaCodigo, phase })
  }, [phase, links, areaCodigo])

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(JOURNEY_DISMISS_KEY, '1')
    } catch {
      /* ok */
    }
    setDismissed(true)
    trackEvent('ylada_activation_journey_dismiss', { area: areaCodigo, phase: phase ?? undefined })
  }, [areaCodigo, phase])

  if (links === null || links.length === 0 || phase === null) return null

  if (phase === 'activated' && dismissed) return null

  const steps: Array<{
    id: string
    title: string
    body: string
    done: boolean
    current: boolean
  }> = [
    {
      id: '1',
      title: '1. Seu diagnóstico no ar',
      body: 'Você já tem um link que prepara a conversa antes do WhatsApp.',
      done: true,
      current: false,
    },
    {
      id: '2',
      title: '2. Coloque o link na frente de pessoas',
      body:
        phase === 'need_exposure'
          ? 'Se ninguém vê, nada acontece. Escolha três contatos, um status ou o Direct — e mande ainda hoje.'
          : 'Boa — alguém já começou. Você já saiu da maioria que não coloca o link pra rodar.',
      done: phase !== 'need_exposure',
      current: phase === 'need_exposure',
    },
    {
      id: '3',
      title: '3. Responda no WhatsApp',
      body:
        phase === 'need_whatsapp'
          ? 'Quando alguém tocar para falar com você, é aí que vira resultado. Responda em poucas linhas e convide para o próximo passo — isso é o que a maioria não faz.'
          : phase === 'activated'
            ? 'Alguém já veio pelo seu link. Agora você entendeu o jogo: é só repetir — link, conversa, agenda.'
            : 'Quando alguém quiser falar com você, responda com objetivo — sem textão. Esse é o fechamento do ciclo.',
      done: phase === 'activated',
      current: phase === 'need_whatsapp',
    },
  ]

  const headline =
    phase === 'need_exposure'
      ? 'Se ninguém vê, nada acontece. Vamos colocar isso pra rodar agora.'
      : phase === 'need_whatsapp'
        ? 'Boa notícia: já teve movimento. Falta conversar no WhatsApp.'
        : 'Agora você entendeu o jogo. É só repetir.'

  const sub =
    phase === 'need_exposure'
      ? 'Sem envio, não entra movimento — e não é falta de capricho sua; é falta de rotina. Um passo por dia já muda o jogo.'
      : phase === 'need_whatsapp'
        ? 'O diagnóstico já gerou interesse. Responda com calma, conduza e feche o próximo passo — sem textão, sem enrolação.'
        : 'Cada ciclo que você repete — link → conversa → agenda — é o método. Quanto mais você repete, mais previsível fica a agenda.'

  const primaryCta =
    phase === 'need_exposure'
      ? { href: linksHref, label: 'Mandar meu link agora', event: 'open_links' as const }
      : phase === 'need_whatsapp'
        ? { href: linksHref, label: 'Ver quem chegou pelo link', event: 'open_links_whatsapp' as const }
        : { href: novoLinkHref, label: 'Criar mais um diagnóstico', event: 'new_link' as const }

  return (
    <section
      className="mb-3 sm:mb-4 rounded-2xl border border-sky-200/80 bg-gradient-to-b from-white via-sky-50/40 to-white p-4 sm:p-5 shadow-sm shadow-sky-900/5"
      aria-labelledby="ylada-activation-journey-title"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">Seu caminho no YLADA</p>
          <h2 id="ylada-activation-journey-title" className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
            {headline}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">{sub}</p>
        </div>
        {phase === 'activated' && (
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 self-end text-xs font-medium text-gray-500 hover:text-gray-800 underline-offset-2 hover:underline sm:self-start"
          >
            Ocultar por enquanto
          </button>
        )}
      </div>

      <ol className="mt-4 space-y-3" aria-label="Passos de ativação">
        {steps.map((step) => (
          <li
            key={step.id}
            className={`rounded-xl border px-3 py-3 sm:px-4 sm:py-3 ${
              step.done
                ? 'border-emerald-200/90 bg-emerald-50/50'
                : step.current
                  ? 'border-sky-300 bg-sky-50/80 ring-1 ring-sky-200/60'
                  : 'border-gray-100 bg-gray-50/80'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-base" aria-hidden>
                {step.done ? '✓' : step.current ? '→' : '○'}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-600 leading-snug mt-0.5">{step.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href={primaryCta.href}
          onClick={() =>
            trackEvent('ylada_activation_journey_cta', { area: areaCodigo, phase: phase ?? undefined, cta: primaryCta.event })
          }
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-600/25 hover:bg-sky-700 transition-colors"
        >
          {primaryCta.label}
        </Link>
        <Link
          href={`${prefix}/home#noel-home-chat-anchor`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-800 hover:bg-sky-50 transition-colors"
          onClick={() =>
            trackEvent('ylada_activation_journey_cta', { area: areaCodigo, phase: phase ?? undefined, cta: 'noel_anchor' })
          }
        >
          Falar com o Noel
        </Link>
      </div>
      <p className="mt-3 text-xs text-gray-500 leading-relaxed">
        Na página de links você copia o endereço e manda onde quiser. Se travar, chame o Noel — peça um texto curto para enviar com o link ou para responder no WhatsApp.
      </p>
    </section>
  )
}
