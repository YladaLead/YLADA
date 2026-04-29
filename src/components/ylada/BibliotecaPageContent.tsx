'use client'

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import YladaAreaShell from './YladaAreaShell'
import { getYladaAreaConfig, getYladaAreaPathPrefix } from '@/config/ylada-areas'
import {
  BIBLIOTECA_SEGMENTOS,
  BIBLIOTECA_SITUACOES,
  BIBLIOTECA_SITUACOES_OPTIONS,
  getTemasParaBiblioteca,
  getTemaLabel,
  getBibliotecaSegmentFromProfile,
  getBibliotecaSegmentFromArea,
  getBibliotecaSegmentFromUserPerfil,
  isTemaMaisUsado,
  getDicaNoelBiblioteca,
  getQuandoUsar,
  getUsoPrincipal,
  getSugestaoNoelTemas,
  getTituloAdaptado,
  getIdeiaRapidaDoDia,
  itemCaiNaSituacao,
  TEMAS_MAIS_USADOS,
  type BibliotecaSegmentCode,
  type SituacaoBiblioteca,
} from '@/config/ylada-biblioteca'
import { getPerfilSimuladoByKey, SIMULATE_COOKIE_NAME } from '@/data/perfis-simulados'
import { DiagnosticoLinkQrPanel } from '@/components/shared/DiagnosticoLinkQrPanel'
import { useAuth } from '@/hooks/useAuth'
import { trackFreemiumConversionEvent } from '@/lib/ylada-freemium-client'
import {
  SUGESTAO_NOEL_TEMAS_ESTETICA_CORPORAL,
  dedupeBibliotecaItensEsteticaCorporal,
  getIdeiaRapidaDoDiaEsteticaCorporal,
  ordenarItemsEsteticaCorporal,
} from '@/config/pro-estetica-corporal-biblioteca'
import {
  SUGESTAO_NOEL_TEMAS_ESTETICA_CAPILAR,
  dedupeBibliotecaItensEsteticaCapilar,
  getIdeiaRapidaDoDiaEsteticaCapilar,
  ordenarItemsEsteticaCapilar,
} from '@/config/pro-estetica-capilar-biblioteca'
import { YLADA_FREEMIUM_ACTIVE_LINK_EXPLANATION_SHORT, YLADA_PRO_UPGRADE_PITCH } from '@/config/freemium-limits'
import {
  dedupeEsteticaBibliotecaPorTitulo,
  ESTETICA_BIBLIOTECA_LINHA_QUERY_KEY,
  ESTETICA_BIBLIOTECA_LINHA_QUERY_KEY_LEGACY,
  esteticaLinhaToQueryValue,
  filterBibliotecaItemsByEsteticaTerapiaLinha,
  itemMatchesTerapiaCapilar,
  itemMatchesTerapiaCorporal,
  parseEsteticaTerapiaLinhaParam,
  rawEsteticaBibliotecaLinhaFromSearchParams,
  type EsteticaTerapiaLinha,
} from '@/config/estetica-terapia-biblioteca'

function getSimulateCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${SIMULATE_COOKIE_NAME}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

interface BibliotecaItemRow {
  id: string
  tipo: string
  segment_codes: string[]
  tema: string
  pilar: string | null
  titulo: string
  description: string | null
  dor_principal: string | null
  objetivo_principal: string | null
  template_id: string | null
  flow_id: string | null
  architecture: string | null
  meta: (Record<string, unknown> & {
    num_perguntas?: number
    tempo_minutos?: number
    quando_usar?: string
    uso_principal?: 'marketing' | 'crm' | 'ambos'
  }) | null
  sort_order: number
}

/** Caminho do funil público (`/l/...`) a partir da resposta do generate. */
function funnelPathFromGeneratePayload(payload: { slug?: string; url?: string }): string | null {
  if (typeof payload.slug === 'string' && payload.slug.trim()) {
    return `/l/${payload.slug.trim()}`
  }
  if (typeof payload.url === 'string' && payload.url.includes('/l/')) {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
      const u = new URL(payload.url, base)
      if (u.pathname.startsWith('/l/')) {
        return `${u.pathname}${u.search || ''}`
      }
    } catch {
      /* ignore */
    }
  }
  return null
}

/** Checkout/preços da matriz (mesmo padrão de `ActiveLinksProModal`). */
const YLADA_MATRIX_PRECOS_HREF = '/pt/precos'

/**
 * Erro ao criar link pela biblioteca: não fica “espremido” ao lado do botão (evita sobreposição no layout compacto).
 */
function BibliotecaLinkCreationAlert({
  message,
  showUpgradeCta,
  analyticsSurface,
}: {
  message: string
  showUpgradeCta: boolean
  analyticsSurface: 'biblioteca_card' | 'biblioteca_sugestao_noel'
}) {
  const trimmed = message.trim()
  if (!trimmed) return null

  useEffect(() => {
    if (!showUpgradeCta) return
    try {
      const k = `ylada_paywall_view_${analyticsSurface}_v1`
      if (sessionStorage.getItem(k)) return
      sessionStorage.setItem(k, '1')
      trackFreemiumConversionEvent('freemium_paywall_view', { surface: analyticsSurface, kind: 'active_link' })
    } catch {
      trackFreemiumConversionEvent('freemium_paywall_view', { surface: analyticsSurface, kind: 'active_link' })
    }
  }, [showUpgradeCta, analyticsSurface])

  if (showUpgradeCta) {
    return (
      <div
        className="mt-4 w-full rounded-xl border border-amber-200/90 bg-gradient-to-b from-amber-50 via-amber-50/95 to-amber-100/40 p-4 text-left shadow-sm ring-1 ring-amber-100/60"
        role="alert"
      >
        <p className="text-sm font-semibold tracking-tight text-amber-950">Limite do plano gratuito</p>
        <p className="mt-2 text-sm leading-relaxed text-amber-950/95">{YLADA_FREEMIUM_ACTIVE_LINK_EXPLANATION_SHORT}</p>
        <p className="mt-3 border-t border-amber-200/80 pt-3 text-sm leading-relaxed text-amber-900/90">{YLADA_PRO_UPGRADE_PITCH}</p>
        <div className="mt-4">
          <Link
            href={YLADA_MATRIX_PRECOS_HREF}
            onClick={() =>
              trackFreemiumConversionEvent('freemium_upgrade_cta_click', {
                surface: analyticsSurface,
                kind: 'active_link',
              })
            }
            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Ver planos e assinar o Pro
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="mt-4 w-full rounded-xl border border-rose-200 bg-rose-50/95 p-4 text-left shadow-sm"
      role="alert"
    >
      <p className="text-sm font-medium text-rose-950">Não foi possível criar o link</p>
      <p className="mt-2 text-sm leading-relaxed text-rose-900/95 whitespace-pre-line">{trimmed}</p>
    </div>
  )
}

/** Hub de links (`…/links`): evitar `location.href` para a mesma URL (parece “não fez nada”) e mostrar erro na UI. */
function isCurrentPathLinksHub(linksPath: string): boolean {
  if (typeof window === 'undefined') return false
  const cur = window.location.pathname.replace(/\/$/, '') || '/'
  const hub = linksPath.replace(/\/$/, '') || '/'
  return cur === hub
}

/** Painel Pro Estética (biblioteca embutida): manter query e só mudar `tab=meus` em vez de ir para `/pt/estetica/links`. */
function sameOriginUrlWithTabMeus(): string {
  if (typeof window === 'undefined') return ''
  const u = new URL(window.location.href)
  u.searchParams.set('tab', 'meus')
  return u.href
}

/** URL absoluta do funil no browser atual (evita problemas com path relativo ou host). */
function absoluteFunnelUrlFromPayload(payload: { slug?: string; url?: string }): string | null {
  if (typeof window === 'undefined') return null
  const rel = funnelPathFromGeneratePayload(payload)
  if (!rel) return null
  try {
    return new URL(rel, window.location.origin).href
  } catch {
    return null
  }
}

/** Navegação completa síncrona (replace): evita empilhar histórico a cada “Usar esse”. */
function hardNavigateTo(href: string) {
  if (typeof window === 'undefined' || !href) return
  window.location.replace(href)
}

function slugFromPublicLinkUrl(url: string): string {
  try {
    const u = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
    const m = u.pathname.match(/^\/l\/([^/]+)/)
    return m?.[1] ? decodeURIComponent(m[1]) : ''
  } catch {
    return ''
  }
}

function parseGenerateResponseData(data: Record<string, unknown>): {
  linkId: string
  slug: string
  url: string
  payload: { id?: string; slug?: string; url?: string }
} {
  let rawRoot: unknown = data?.data
  if (Array.isArray(rawRoot) && rawRoot.length > 0) rawRoot = rawRoot[0]
  const raw =
    rawRoot != null && typeof rawRoot === 'object' && !Array.isArray(rawRoot)
      ? (rawRoot as Record<string, unknown>)
      : {}
  const idRaw = raw.id ?? raw.link_id ?? raw.ylada_link_id
  const linkId =
    typeof idRaw === 'string' && idRaw.trim()
      ? idRaw.trim()
      : typeof idRaw === 'number' && Number.isFinite(idRaw)
        ? String(idRaw)
        : ''
  let slug = typeof raw.slug === 'string' ? raw.slug.trim() : ''
  const url = typeof raw.url === 'string' ? raw.url : ''
  if (!slug && url) slug = slugFromPublicLinkUrl(url)
  return {
    linkId,
    slug,
    url,
    payload: { id: linkId || undefined, slug: slug || undefined, url: url || undefined },
  }
}

function labelTipoBibliotecaItem(tipo: string): string {
  const t = (tipo || '').toLowerCase()
  if (t === 'calculadora') return 'Calculadora'
  if (t === 'quiz') return 'Quiz'
  if (t === 'link') return 'Link pronto'
  return tipo || 'Modelo'
}

function getCardMeta(item: BibliotecaItemRow): { tempo: string; perguntas: string } {
  const meta = item.meta
  const numPerg = meta?.num_perguntas ?? (item.tipo === 'quiz' ? 5 : 0)
  const tempoMin = meta?.tempo_minutos ?? (item.tipo === 'quiz' ? 1 : 0)
  const tempo = tempoMin > 0 ? (tempoMin === 1 ? '~1 minuto' : `~${tempoMin} min`) : ''
  const perguntas = numPerg > 0 ? `${numPerg} pergunta${numPerg !== 1 ? 's' : ''}` : ''
  return { tempo, perguntas }
}

type BibliotecaPreviewModel =
  | {
      kind: 'quiz'
      introTitle: string
      introSubtitle: string
      introMicro: string
      bullets: string[]
      questions: string[]
    }
  | {
      kind: 'calculator'
      titleLine: string
      resultIntro: string
      resultLabel: string
      fieldLines: string[]
      formulaLine: string
    }

/** Resume o `schema_json` para o modal de preview (quiz ou calculadora). */
function buildBibliotecaPreviewModel(
  schema: Record<string, unknown>,
  apiTemplateType: string,
  fallbackName: string
): BibliotecaPreviewModel {
  const norm = (apiTemplateType || '').toLowerCase()
  const isCalculator = norm === 'calculator' || norm === 'calculadora'
  const titleLine =
    (typeof schema.title === 'string' && schema.title.trim()) ||
    (typeof schema.quizTitle === 'string' && schema.quizTitle.trim()) ||
    fallbackName
  if (isCalculator) {
    const rawFields = Array.isArray(schema.fields) ? schema.fields : []
    const fieldLines = rawFields
      .map((raw) => {
        if (!raw || typeof raw !== 'object') return ''
        const label = (raw as { label?: string }).label
        const id = (raw as { id?: string }).id
        const typ = (raw as { type?: string }).type?.toLowerCase()
        const head =
          typeof label === 'string' && label.trim()
            ? label.trim()
            : typeof id === 'string' && id.trim()
              ? id.trim()
              : ''
        if (!head) return ''
        return typ ? `${head} (${typ})` : head
      })
      .filter(Boolean)
    return {
      kind: 'calculator',
      titleLine,
      resultIntro: typeof schema.resultIntro === 'string' ? schema.resultIntro.trim() : '',
      resultLabel: typeof schema.resultLabel === 'string' ? schema.resultLabel.trim() : '',
      fieldLines,
      formulaLine: typeof schema.formula === 'string' ? schema.formula.trim() : '',
    }
  }
  const introTitle = (typeof schema.introTitle === 'string' && schema.introTitle.trim()) || titleLine
  const introSubtitle = typeof schema.introSubtitle === 'string' ? schema.introSubtitle.trim() : ''
  const introMicro = typeof schema.introMicro === 'string' ? schema.introMicro.trim() : ''
  const bullets = Array.isArray(schema.introBullets)
    ? schema.introBullets.filter((x): x is string => typeof x === 'string' && x.trim())
    : []
  const questions = Array.isArray(schema.questions)
    ? schema.questions
        .map((q) => {
          if (!q || typeof q !== 'object') return ''
          const text = (q as { text?: string }).text
          return typeof text === 'string' ? text.trim() : ''
        })
        .filter(Boolean)
    : []
  return { kind: 'quiz', introTitle, introSubtitle, introMicro, bullets, questions }
}

function labelBibliotecaTemplateTypeForPreview(apiType: string): string {
  const t = (apiType || '').toLowerCase()
  if (t === 'calculator' || t === 'calculadora') return 'Calculadora'
  if (t === 'diagnostico') return 'Diagnóstico / quiz'
  return apiType || 'Modelo'
}

/** Navegação pós-criar link (ex.: aba pré-aberta no gesto do utilizador para o funil `/l/…`). */
export type BibliotecaLinkCreatedNavigation = {
  usePreOpenedTab: Window | null
}

/** Abre o funil público num separador novo. Sem `noopener` no about:blank para o browser devolver referência utilizável. */
function openPublicFunnelUrlInNewTab(abs: string, preOpened: Window | null | undefined): boolean {
  if (preOpened && !preOpened.closed) {
    try {
      preOpened.location.href = abs
      return true
    } catch {
      try {
        preOpened.close()
      } catch {
        /* ignore */
      }
    }
  }
  const w = window.open(abs, '_blank', 'noopener,noreferrer')
  return !!(w && !w.closed)
}

function BibliotecaCard({
  item,
  linksPath,
  creatingId,
  setCreatingId,
  onLinkCreated,
  variant,
  segmentCode,
  apiSegment,
  getCardMeta: getMeta,
  getTemaLabel,
  getQuandoUsar,
  getTituloAdaptado: getTituloAdaptadoFn,
  isTemaMaisUsado,
  badge,
  stayOnProEsteticaPanel = false,
  onRefreshMeusLinks,
}: {
  item: BibliotecaItemRow
  linksPath: string
  creatingId: string | null
  setCreatingId: (id: string | null) => void
  /**
   * Após criar o link: abre o funil público `/l/{slug}` (navegação completa, fiável no localhost);
   * se não houver slug, cai na página de edição.
   */
  onLinkCreated: (
    linkId: string,
    payload: { slug?: string; url?: string },
    navigation?: BibliotecaLinkCreatedNavigation
  ) => void
  variant: 'default' | 'sugestao' | 'comece'
  segmentCode?: BibliotecaSegmentCode | null
  /** segment da área YLADA (coluna ylada_links.segment + perfil Noel), alinhado ao Noel e às outras áreas. */
  apiSegment: string | null
  /** Selo para "Sugestões para hoje" (ex: "🔥 Mais usado"). */
  badge?: { icon: string; label: string }
  getCardMeta: (i: BibliotecaItemRow) => { tempo: string; perguntas: string }
  getTemaLabel: (t: string) => string
  getQuandoUsar: (t: string, m: BibliotecaItemRow['meta']) => string
  getTituloAdaptado: (tema: string, seg: BibliotecaSegmentCode | null) => string | null
  isTemaMaisUsado: (t: string) => boolean
  /** Biblioteca embutida no painel Pro Estética: não redirecionar para a matriz `/pt/estetica/links`. */
  stayOnProEsteticaPanel?: boolean
  /** Após criar link em modo “copiar”, atualiza a lista em “Os teus links” sem navegar. */
  onRefreshMeusLinks?: () => void
}) {
  const [criarErro, setCriarErro] = useState<string | null>(null)
  const [criarErroPrecosCta, setCriarErroPrecosCta] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewErro, setPreviewErro] = useState<string | null>(null)
  const [previewPayload, setPreviewPayload] = useState<{
    name: string
    type: string
    schema: Record<string, unknown>
    model: BibliotecaPreviewModel
  } | null>(null)
  const [copyOkFlash, setCopyOkFlash] = useState(false)
  const { tempo, perguntas } = getMeta(item)
  const tituloExibido = (segmentCode && getTituloAdaptadoFn(item.tema, segmentCode)) || item.titulo
  const mostraMaisUsado = item.tipo === 'quiz' && isTemaMaisUsado(item.tema)
  const isSugestao = variant === 'sugestao'
  const isComece = variant === 'comece'

  const handleUse = async (intent: 'use' | 'copy' = 'use') => {
    if (creatingId === item.id) return
    if (!String(item.id ?? '').trim()) {
      setCriarErro('Modelo sem identificador. Recarrega a página.')
      return
    }
    let preOpenedForFunnel: Window | null = null
    if (intent === 'use' && stayOnProEsteticaPanel && typeof window !== 'undefined') {
      try {
        preOpenedForFunnel = window.open('about:blank', '_blank')
      } catch {
        preOpenedForFunnel = null
      }
    }
    setCreatingId(item.id)
    setCriarErro(null)
    setCriarErroPrecosCta(false)
    setCopyOkFlash(false)
    try {
      const body: Record<string, unknown> = {
        flow_id: item.flow_id ?? 'diagnostico_risco',
        biblioteca_template_id: item.template_id || undefined,
        interpretacao: { tema: item.tema, objetivo: 'captar' },
        title: item.titulo,
      }
      const segmentFromMeta =
        item.meta && typeof (item.meta as { segment_code?: unknown }).segment_code === 'string'
          ? String((item.meta as { segment_code: string }).segment_code).trim()
          : ''
      const segmentToSend = (apiSegment || segmentFromMeta || '').trim() || null
      if (segmentToSend) body.segment = segmentToSend
      const res = await fetch('/api/ylada/links/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        cache: 'no-store',
        body: JSON.stringify(body),
      })
      let data: Record<string, unknown> = {}
      try {
        data = (await res.json()) as Record<string, unknown>
      } catch {
        setCriarErro('Resposta inválida do servidor. Tenta outra vez.')
        return
      }
      const { linkId, payload } = parseGenerateResponseData(data)
      const createdWithId =
        Boolean(linkId) &&
        res.ok &&
        data?.success !== false &&
        !data?.limit_reached &&
        typeof data?.error !== 'string'

      const tryCopyAndStay = async () => {
        const abs = absoluteFunnelUrlFromPayload(payload)
        const slug = typeof payload.slug === 'string' ? payload.slug.trim() : ''
        const toCopy =
          abs ||
          (slug && typeof window !== 'undefined'
            ? `${window.location.origin}/l/${encodeURIComponent(slug)}`
            : typeof payload.url === 'string'
              ? payload.url
              : '')
        if (!toCopy) {
          setCriarErro('Link criado, mas não foi possível obter o URL para copiar. Abra “Os teus links”.')
          return
        }
        try {
          await navigator.clipboard.writeText(toCopy)
          setCopyOkFlash(true)
          window.setTimeout(() => setCopyOkFlash(false), 4000)
          onRefreshMeusLinks?.()
        } catch {
          setCriarErro('Não foi possível copiar para a área de transferência. Copie manualmente em “Os teus links”.')
        }
      }

      if (data?.success && linkId && stayOnProEsteticaPanel && intent === 'copy') {
        await tryCopyAndStay()
        return
      }

      const navForUse =
        intent === 'use' && stayOnProEsteticaPanel ? { usePreOpenedTab: preOpenedForFunnel } : undefined

      if (data?.success && linkId) {
        try {
          onLinkCreated(linkId, payload, navForUse)
        } catch {
          if (stayOnProEsteticaPanel) {
            hardNavigateTo(sameOriginUrlWithTabMeus())
          } else {
            const editPath = `${linksPath.replace(/\/$/, '')}/editar/${encodeURIComponent(linkId)}`
            hardNavigateTo(new URL(editPath, window.location.origin).href)
          }
        }
      } else if (createdWithId) {
        if (stayOnProEsteticaPanel && intent === 'copy') {
          await tryCopyAndStay()
          return
        }
        try {
          onLinkCreated(linkId, payload, navForUse)
        } catch {
          if (stayOnProEsteticaPanel) {
            hardNavigateTo(sameOriginUrlWithTabMeus())
          } else {
            const editPath = `${linksPath.replace(/\/$/, '')}/editar/${encodeURIComponent(linkId)}`
            hardNavigateTo(new URL(editPath, window.location.origin).href)
          }
        }
      } else if (data?.success && (payload.slug || payload.url)) {
        if (stayOnProEsteticaPanel && intent === 'copy') {
          await tryCopyAndStay()
          return
        }
        const abs = absoluteFunnelUrlFromPayload(payload)
        if (stayOnProEsteticaPanel && intent === 'use' && abs) {
          if (!openPublicFunnelUrlInNewTab(abs, preOpenedForFunnel)) {
            window.location.href = abs
          }
          onRefreshMeusLinks?.()
          return
        }
        if (abs) hardNavigateTo(abs)
        else if (payload.slug)
          hardNavigateTo(new URL(`/l/${encodeURIComponent(payload.slug)}`, window.location.origin).href)
        else if (stayOnProEsteticaPanel) hardNavigateTo(sameOriginUrlWithTabMeus())
        else hardNavigateTo(`${window.location.origin}${linksPath}`)
      } else if (data?.limit_reached && typeof data?.message === 'string' && data.message.trim()) {
        const msg = data.message.trim()
        try {
          if (!isCurrentPathLinksHub(linksPath) && !stayOnProEsteticaPanel) {
            if (data.limit_type === 'active_links') {
              sessionStorage.setItem(
                'ylada_pending_link_limit_modal',
                JSON.stringify({ limit_type: 'active_links', message: msg })
              )
            } else {
              sessionStorage.setItem('ylada_pending_freemium_link_message', msg)
            }
          }
        } catch {
          // ignore
        }
        if (isCurrentPathLinksHub(linksPath) || stayOnProEsteticaPanel) {
          setCriarErro(msg)
          setCriarErroPrecosCta(data.limit_type === 'active_links')
        } else {
          window.location.href = linksPath
        }
      } else {
        const errMsg =
          typeof data.error === 'string'
            ? data.error
            : typeof data.message === 'string'
              ? data.message
              : !res.ok
                ? `Erro ${res.status} ao criar o link.`
                : 'Não foi possível criar o link.'
        setCriarErro(errMsg)
        setCriarErroPrecosCta(false)
      }
    } catch {
      setCriarErro('Erro de rede. Verifica a ligação e tenta de novo.')
    } finally {
      // Não fechar o separador pré-aberto aqui: após `location.href = /l/…` o href pode ainda
      // ser `about:blank` por um instante e fecharíamos o separador certo por engano.
      setCreatingId(null)
    }
  }

  const openTemplatePreview = async () => {
    const tid = item.template_id?.trim()
    if (!tid) return
    setPreviewOpen(true)
    setPreviewLoading(true)
    setPreviewErro(null)
    setPreviewPayload(null)
    try {
      const r = await fetch(`/api/ylada/link-template-schema?template_id=${encodeURIComponent(tid)}`, {
        credentials: 'include',
        cache: 'no-store',
      })
      const j = (await r.json()) as {
        success?: boolean
        error?: string
        data?: { name?: string; type?: string; schema_json?: unknown }
      }
      if (!r.ok || !j?.success || !j.data) {
        throw new Error(typeof j?.error === 'string' && j.error.trim() ? j.error : 'Erro ao carregar o modelo.')
      }
      const raw = j.data.schema_json
      const schema =
        raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {}
      const apiType =
        typeof j.data.type === 'string' && j.data.type.trim() ? j.data.type.trim() : item.tipo
      const displayName =
        typeof j.data.name === 'string' && j.data.name.trim() ? j.data.name.trim() : tituloExibido
      setPreviewPayload({
        name: displayName,
        type: apiType,
        schema,
        model: buildBibliotecaPreviewModel(schema, apiType, displayName),
      })
    } catch (e) {
      setPreviewErro(e instanceof Error ? e.message : 'Erro ao carregar preview.')
    } finally {
      setPreviewLoading(false)
    }
  }

  const closeTemplatePreview = () => {
    setPreviewOpen(false)
    setPreviewErro(null)
    setPreviewPayload(null)
    setPreviewLoading(false)
  }

  const compacto = isSugestao || isComece
  const quandoUsarText = getQuandoUsar(item.tema, item.meta)
  const metaParts = [getTemaLabel(item.tema), tempo, perguntas].filter(Boolean)
  const metaLine = metaParts.join(' · ')
  const hasTags = !!(item.dor_principal || item.objetivo_principal || (item.pilar && !item.dor_principal))

  const creatingThis = creatingId === item.id

  return (
    <>
    <article
      className={`rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow ${
        isSugestao ? 'border-amber-200 bg-amber-50/50 p-4' : isComece ? 'border-sky-100 p-4' : 'border-gray-200 p-5'
      }`}
    >
      <div
        className={
          stayOnProEsteticaPanel
            ? 'flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6'
            : 'flex items-start gap-4'
        }
      >
        <div className="min-w-0 flex-1">
          {badge && (
            <p className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-800">
              <span aria-hidden>{badge.icon}</span> {badge.label}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-semibold text-gray-900 ${compacto ? 'text-sm leading-snug' : ''}`}>{tituloExibido}</h3>
            <span className="shrink-0 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
              {labelTipoBibliotecaItem(item.tipo)}
            </span>
          </div>
          {item.description && (
            <p className={`mt-1 text-gray-500 ${compacto ? 'text-xs line-clamp-1' : 'text-sm line-clamp-1'}`}>{item.description}</p>
          )}
          {metaLine && (
            <p className={`mt-1.5 text-xs text-gray-500 ${compacto ? 'mt-1' : ''}`}>{metaLine}</p>
          )}
          {compacto ? (
            <p className="mt-1.5 text-xs text-indigo-700 line-clamp-2" title={quandoUsarText}>
              {quandoUsarText}
            </p>
          ) : (
            <details className="mt-2 group/details">
              <summary className="cursor-pointer text-xs font-medium text-indigo-700 hover:text-indigo-800 list-none flex items-center gap-1 [&::-webkit-details-marker]:hidden">
                <span>Quando usar</span>
                <span className="text-indigo-500 group-open/details:rotate-180 transition-transform" aria-hidden>▼</span>
              </summary>
              <div className="mt-2 rounded-lg border border-indigo-100 bg-indigo-50/60 px-3 py-2">
                <p className="text-sm text-indigo-900 leading-snug">{quandoUsarText}</p>
                {hasTags && (
                  <div className="mt-2 flex flex-wrap gap-1.5 pt-2 border-t border-indigo-100/80">
                    {item.dor_principal && (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                        {item.dor_principal}
                      </span>
                    )}
                    {item.objetivo_principal && (
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                        {item.objetivo_principal}
                      </span>
                    )}
                    {item.pilar && !item.dor_principal && (
                      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {item.pilar}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </details>
          )}
        </div>
        <div
          className={
            stayOnProEsteticaPanel
              ? 'relative z-10 flex w-full shrink-0 flex-col gap-3 border-t border-gray-100 pt-4 sm:w-[min(100%,13.75rem)] sm:border-l sm:border-t-0 sm:border-gray-100 sm:pl-6 sm:pt-0'
              : 'flex shrink-0 flex-col items-end gap-2'
          }
        >
          {mostraMaisUsado && !isSugestao && !badge && (
            <span
              className={`inline-flex w-fit items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 ${
                stayOnProEsteticaPanel ? 'self-start sm:self-end' : ''
              }`}
            >
              <span aria-hidden>🔥</span> Mais usado
            </span>
          )}
          {isSugestao && (
            <span
              className={`inline-flex w-fit items-center gap-1 rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-900 ${
                stayOnProEsteticaPanel ? 'self-start sm:self-end' : ''
              }`}
            >
              📈 Alta taxa de conversa
            </span>
          )}
          <div
            className={
              stayOnProEsteticaPanel
                ? 'flex w-full flex-col gap-2.5'
                : 'relative z-10 flex flex-col items-end gap-1'
            }
          >
            {stayOnProEsteticaPanel ? (
              <>
                <div
                  className={
                    item.template_id
                      ? 'grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-2'
                      : 'flex flex-col gap-2.5'
                  }
                >
                  {item.template_id ? (
                    <button
                      type="button"
                      className="touch-manipulation inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm font-medium text-sky-900 shadow-sm transition-colors hover:bg-sky-50 active:bg-sky-100 disabled:opacity-50"
                      disabled={creatingThis}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        void openTemplatePreview()
                      }}
                    >
                      Ver preview
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="touch-manipulation inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
                    disabled={creatingThis}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      void handleUse('copy')
                    }}
                  >
                    {creatingThis ? (
                      'A criar…'
                    ) : (
                      <>
                        <span className="sm:hidden">Copiar link</span>
                        <span className="hidden sm:inline">Criar e copiar link</span>
                      </>
                    )}
                  </button>
                </div>
                {copyOkFlash ? (
                  <p className="text-center text-xs font-medium text-emerald-700 sm:text-right">
                    Link copiado. Vê em «Os teus links».
                  </p>
                ) : null}
                <button
                  type="button"
                  disabled={creatingThis}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    void handleUse('use')
                  }}
                  className={`touch-manipulation inline-flex min-h-[48px] w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${
                    isSugestao ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
                  }`}
                >
                  {creatingThis ? 'Criando...' : 'Usar esse'}
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={creatingThis}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  void handleUse('use')
                }}
                className={`touch-manipulation rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                  isSugestao ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
                }`}
              >
                {creatingThis ? 'Criando...' : 'Usar esse'}
              </button>
            )}
          </div>
        </div>
      </div>
      {criarErro ? (
        <BibliotecaLinkCreationAlert
          message={criarErro}
          showUpgradeCta={criarErroPrecosCta}
          analyticsSurface="biblioteca_card"
        />
      ) : null}
    </article>
    {previewOpen ? (
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="biblioteca-preview-title"
        onClick={() => closeTemplatePreview()}
      >
        <div
          className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <h2 id="biblioteca-preview-title" className="pr-8 text-lg font-semibold text-gray-900">
              {previewPayload?.name ?? 'Preview do modelo'}
            </h2>
            <button
              type="button"
              className="shrink-0 rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              onClick={closeTemplatePreview}
            >
              Fechar
            </button>
          </div>
          {previewLoading ? <p className="text-sm text-gray-500">A carregar…</p> : null}
          {previewErro ? <p className="text-sm text-red-600">{previewErro}</p> : null}
          {!previewLoading && previewPayload ? (
            <div className="mt-2 space-y-3 text-sm text-gray-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {labelBibliotecaTemplateTypeForPreview(previewPayload.type)}
              </p>
              {previewPayload.model.kind === 'calculator' ? (
                <>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Título</p>
                    <p className="font-medium text-gray-900">{previewPayload.model.titleLine}</p>
                  </div>
                  {previewPayload.model.fieldLines.length > 0 ? (
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-gray-500">Campos (o visitante preenche no link)</p>
                      <ul className="list-disc space-y-1 pl-5">
                        {previewPayload.model.fieldLines.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Sem campos definidos neste template.</p>
                  )}
                  {previewPayload.model.formulaLine ? (
                    <div>
                      <p className="mb-1 text-xs font-medium text-gray-500">Fórmula (resumo técnico)</p>
                      <pre className="max-h-24 overflow-x-auto overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 p-2 text-xs text-gray-800">
                        {previewPayload.model.formulaLine}
                      </pre>
                    </div>
                  ) : null}
                  {(previewPayload.model.resultLabel || previewPayload.model.resultIntro) && (
                    <div className="rounded-lg border border-sky-100 bg-sky-50/50 p-3 text-xs">
                      {previewPayload.model.resultLabel ? (
                        <p className="font-medium text-sky-900">{previewPayload.model.resultLabel}</p>
                      ) : null}
                      {previewPayload.model.resultIntro ? (
                        <p className="mt-1 text-gray-600">{previewPayload.model.resultIntro}</p>
                      ) : null}
                      <p className="mt-2 text-gray-500">
                        O valor é calculado no link público com os dados do visitante (não é simulado aqui).
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Título / abertura</p>
                    <p className="font-medium text-gray-900">{previewPayload.model.introTitle}</p>
                    {previewPayload.model.introSubtitle ? (
                      <p className="mt-1 text-gray-600">{previewPayload.model.introSubtitle}</p>
                    ) : null}
                    {previewPayload.model.introMicro ? (
                      <p className="mt-1 text-gray-500">{previewPayload.model.introMicro}</p>
                    ) : null}
                  </div>
                  {previewPayload.model.bullets.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-5">
                      {previewPayload.model.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                  {previewPayload.model.questions.length > 0 ? (
                    <div>
                      <p className="mb-2 text-xs font-medium text-gray-500">Perguntas (pré-visualização)</p>
                      <ol className="list-decimal space-y-2 pl-5">
                        {previewPayload.model.questions.slice(0, 8).map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ol>
                      {previewPayload.model.questions.length > 8 ? (
                        <p className="mt-2 text-xs text-gray-500">
                          +{previewPayload.model.questions.length - 8} no link público
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">Sem perguntas listadas neste schema.</p>
                  )}
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    ) : null}
    </>
  )
}

interface BibliotecaPageContentProps {
  areaCodigo: string
  areaLabel: string
  /** Quando true, não renderiza YladaAreaShell (para uso em Links hub com abas). */
  embedded?: boolean
  /**
   * Painel Pro Estética Corporal: lista só modelos de corpo/metabolismo/hábitos (API `subscope=estetica_corporal`),
   * sem misturar fluxos faciais/capilar/unhas.
   */
  esteticaCorporalScope?: boolean
  /** Pro Estética Capilar: API `subscope=estetica_capilar`, quizzes capilares (migração 284). */
  esteticaCapilarScope?: boolean
}

function BibliotecaPageContentInner({
  areaCodigo,
  areaLabel,
  embedded = false,
  esteticaCorporalScope = false,
  esteticaCapilarScope = false,
}: BibliotecaPageContentProps) {
  const proEsteticaNarrow = esteticaCorporalScope || esteticaCapilarScope
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const linksPath = `${prefix}/links`
  /** Mesmo `segment` que o Noel envia ao generate — grava em ylada_links e alinha WhatsApp/perfil. */
  const segmentForLinkGenerate = useMemo(() => {
    const code = (areaCodigo || '').toLowerCase().trim()
    return getYladaAreaConfig(code)?.segment_code ?? null
  }, [areaCodigo])

  const [segmentoFiltro, setSegmentoFiltro] = useState<BibliotecaSegmentCode | ''>('')
  const [temaFiltro, setTemaFiltro] = useState<string>('')
  /** Painel corporal: filtro local por texto (título, descrição, rótulo do tema). */
  const [buscaNome, setBuscaNome] = useState('')
  const [situacaoFiltro, setSituacaoFiltro] = useState<'' | SituacaoBiblioteca>('')
  const [segmentoSugerido, setSegmentoSugerido] = useState<BibliotecaSegmentCode | null>(null)
  const [items, setItems] = useState<BibliotecaItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingId, setCreatingId] = useState<string | null>(null)
  const [meusLinksRefreshTick, setMeusLinksRefreshTick] = useState(0)
  const [progressao, setProgressao] = useState<{
    passo1: boolean
    passo2: boolean
    passo3: boolean
    linksCount: number
  }>({ passo1: false, passo2: false, passo3: false, linksCount: 0 })
  const [linksCreatedToday, setLinksCreatedToday] = useState<number | null>(null)
  const [meusLinks, setMeusLinks] = useState<
    Array<{ id: string; slug: string; title: string | null; url: string; theme_raw?: string | null; stats?: { diagnosis_count?: number } }>
  >([])
  const [ideiaLinkErro, setIdeiaLinkErro] = useState<string | null>(null)
  const [ideiaLinkPrecosCta, setIdeiaLinkPrecosCta] = useState(false)
  const [linkQrModal, setLinkQrModal] = useState<{
    id: string
    slug: string
    title: string | null
    url: string
    theme_raw?: string | null
    stats?: { diagnosis_count?: number }
  } | null>(null)
  const [areaEspecifica, setAreaEspecifica] = useState<Record<string, unknown> | null>(null)
  const { userProfile } = useAuth()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const linhaBibliotecaQueryRaw = rawEsteticaBibliotecaLinhaFromSearchParams(searchParams)

  /**
   * Biblioteca corporal/capilar só existe embutida no painel Pro — não depender do `pathname`
   * (evita cair na matriz `/pt/estetica/links` quando o prefixo da rota difere).
   */
  const stayInProEsteticaHub = embedded && proEsteticaNarrow

  const navigateAfterLinkCreated = useCallback(
    (
      linkId: string,
      payload: { slug?: string; url?: string },
      navigation?: BibliotecaLinkCreatedNavigation
    ) => {
      if (typeof window === 'undefined') return
      const funnelAbs = absoluteFunnelUrlFromPayload(payload)
      if (stayInProEsteticaHub) {
        if (funnelAbs) {
          if (!openPublicFunnelUrlInNewTab(funnelAbs, navigation?.usePreOpenedTab)) {
            window.location.href = funnelAbs
          }
          setMeusLinksRefreshTick((n) => n + 1)
          return
        }
        const base = pathname.split('?')[0]
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', 'meus')
        router.replace(params.toString() ? `${base}?${params.toString()}` : base, { scroll: false })
        setMeusLinksRefreshTick((n) => n + 1)
        return
      }
      const editPath = `${linksPath.replace(/\/$/, '')}/editar/${encodeURIComponent(linkId)}`
      const editAbs = new URL(editPath, window.location.origin).href
      const slugOnly = typeof payload.slug === 'string' && payload.slug.trim()
      const target = funnelAbs || (linkId ? editAbs : slugOnly ? new URL(`/l/${encodeURIComponent(slugOnly)}`, window.location.origin).href : null)
      if (!target) return
      // Navegar ANTES de setState: o tick refaz GET /api/ylada/links (pesado) e um re-render pode atrasar/atrasar o replace no main thread.
      hardNavigateTo(target)
      setMeusLinksRefreshTick((n) => n + 1)
    },
    [linksPath, stayInProEsteticaHub, pathname, searchParams, router]
  )

  /** Só faz sentido escolher segmento se não há um fixo pelo perfil/URL ou se é admin/suporte. */
  const isPrivilegedBiblioteca = !!(userProfile?.is_admin || userProfile?.is_support)
  const mostrarFiltroSegmento =
    !proEsteticaNarrow && (isPrivilegedBiblioteca || !segmentoSugerido)

  const terapiaLinhaAtual = parseEsteticaTerapiaLinhaParam(linhaBibliotecaQueryRaw)
  const setTerapiaLinhaUrl = (linha: EsteticaTerapiaLinha) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(ESTETICA_BIBLIOTECA_LINHA_QUERY_KEY)
    params.delete(ESTETICA_BIBLIOTECA_LINHA_QUERY_KEY_LEGACY)
    const qv = esteticaLinhaToQueryValue(linha)
    if (qv) params.set(ESTETICA_BIBLIOTECA_LINHA_QUERY_KEY, qv)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  useEffect(() => {
    if (proEsteticaNarrow) {
      setLinksCreatedToday(null)
      return
    }
    let cancelled = false
    fetch('/api/ylada/stats/links-created-today', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.success && typeof data.count === 'number') setLinksCreatedToday(data.count)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [proEsteticaNarrow])

  useEffect(() => {
    let cancelled = false
    fetch('/api/ylada/links', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data?.success || !Array.isArray(data.data)) return
        const links = data.data as Array<{
          id: string
          slug: string
          title: string | null
          url: string
          theme_raw?: string | null
          stats?: { complete?: number; cta_click?: number; diagnosis_count?: number }
        }>
        setMeusLinks(links)
        const linksCount = links.length
        const totalRespostas = links.reduce((s, l) => s + (l.stats?.diagnosis_count ?? l.stats?.complete ?? 0), 0)
        const totalConversas = links.reduce((s, l) => s + (l.stats?.cta_click ?? 0), 0)
        setProgressao({
          passo1: linksCount >= 1,
          passo2: linksCount >= 1,
          passo3: totalRespostas > 0 || totalConversas > 0,
          linksCount,
        })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [meusLinksRefreshTick])

  const isEsteticaLinksBiblioteca =
    (areaCodigo || '').toLowerCase().trim() === 'estetica' &&
    !proEsteticaNarrow &&
    segmentoFiltro === 'aesthetics'

  const sugestaoTemas = esteticaCorporalScope
    ? SUGESTAO_NOEL_TEMAS_ESTETICA_CORPORAL
    : esteticaCapilarScope
      ? SUGESTAO_NOEL_TEMAS_ESTETICA_CAPILAR
      : getSugestaoNoelTemas(segmentoFiltro || null)

  const segParaTituloBiblioteca = (proEsteticaNarrow ? 'aesthetics' : segmentoFiltro || null) as BibliotecaSegmentCode | null

  const itemsLista = useMemo(() => {
    if (esteticaCorporalScope) {
      const ordenados = ordenarItemsEsteticaCorporal(items)
      return dedupeBibliotecaItensEsteticaCorporal(ordenados, 'aesthetics')
    }
    if (esteticaCapilarScope) {
      const ordenados = ordenarItemsEsteticaCapilar(items)
      return dedupeBibliotecaItensEsteticaCapilar(ordenados, 'aesthetics')
    }
    return items
  }, [items, esteticaCorporalScope, esteticaCapilarScope])

  const itemsListaParaEsteticaTerapia = useMemo(() => {
    if (!isEsteticaLinksBiblioteca) return itemsLista
    const linha = parseEsteticaTerapiaLinhaParam(linhaBibliotecaQueryRaw)
    const filtrados = filterBibliotecaItemsByEsteticaTerapiaLinha(itemsLista, linha)
    return dedupeEsteticaBibliotecaPorTitulo(filtrados)
  }, [isEsteticaLinksBiblioteca, itemsLista, linhaBibliotecaQueryRaw])

  const itemsListaComBusca = useMemo(() => {
    const q = buscaNome.trim().toLowerCase()
    if (!proEsteticaNarrow || !q) return itemsLista
    const seg = segParaTituloBiblioteca
    return itemsLista.filter((i) => {
      const titulo = ((seg && getTituloAdaptado(i.tema, seg)) || i.titulo).toLowerCase()
      const desc = (i.description || '').toLowerCase()
      const temaLab = getTemaLabel(i.tema).toLowerCase()
      return titulo.includes(q) || desc.includes(q) || temaLab.includes(q)
    })
  }, [buscaNome, proEsteticaNarrow, itemsLista, segParaTituloBiblioteca])

  const temasOpcoesBiblioteca = useMemo(() => {
    if (proEsteticaNarrow) {
      const seen = new Set<string>()
      for (const it of itemsLista) seen.add(it.tema)
      return Array.from(seen)
        .sort((a, b) => getTemaLabel(a).localeCompare(getTemaLabel(b), 'pt'))
        .map((value) => ({ value, label: getTemaLabel(value) }))
    }
    return getTemasParaBiblioteca(segmentoFiltro || undefined)
  }, [proEsteticaNarrow, itemsLista, segmentoFiltro])

  const itemsComecePorAqui = useMemo(() => {
    const out: BibliotecaItemRow[] = []
    if (proEsteticaNarrow) return out
    const sourceList = isEsteticaLinksBiblioteca ? itemsListaParaEsteticaTerapia : itemsLista
    const linhaEstetica = parseEsteticaTerapiaLinhaParam(linhaBibliotecaQueryRaw)

    if (isEsteticaLinksBiblioteca) {
      if (linhaEstetica === 'capilar') {
        return sourceList.filter(itemMatchesTerapiaCapilar).slice(0, 3)
      }
      if (linhaEstetica === 'corporal') {
        return sourceList.filter(itemMatchesTerapiaCorporal).slice(0, 3)
      }
      const cap = sourceList.filter(itemMatchesTerapiaCapilar).slice(0, 1)
      const corp = sourceList.filter(itemMatchesTerapiaCorporal).slice(0, 3)
      const byId = new Map<string, BibliotecaItemRow>()
      for (const it of [...cap, ...corp]) byId.set(it.id, it)
      return Array.from(byId.values()).slice(0, 3)
    }

    const titulosSugestaoVistos = new Set<string>()
    for (const tema of sugestaoTemas) {
      const found = sourceList.find((i) => i.tema === tema && !out.includes(i))
      if (!found) continue
      const display =
        (segParaTituloBiblioteca && getTituloAdaptado(found.tema, segParaTituloBiblioteca)) || found.titulo
      const key = display.trim().toLowerCase().replace(/\s+/g, ' ')
      if (titulosSugestaoVistos.has(key)) continue
      titulosSugestaoVistos.add(key)
      out.push(found)
    }
    return out
  }, [
    proEsteticaNarrow,
    isEsteticaLinksBiblioteca,
    itemsLista,
    itemsListaParaEsteticaTerapia,
    segParaTituloBiblioteca,
    sugestaoTemas,
    linhaBibliotecaQueryRaw,
  ])

  const baseLista = proEsteticaNarrow ? itemsListaComBusca : isEsteticaLinksBiblioteca ? itemsListaParaEsteticaTerapia : itemsLista

  const listaAposBuscaNome = useMemo(() => {
    if (proEsteticaNarrow) return baseLista
    const q = buscaNome.trim().toLowerCase()
    if (!q) return baseLista
    const seg = segParaTituloBiblioteca
    return baseLista.filter((i) => {
      const titulo = ((seg && getTituloAdaptado(i.tema, seg)) || i.titulo).toLowerCase()
      const desc = (i.description || '').toLowerCase()
      const temaLab = getTemaLabel(i.tema).toLowerCase()
      const tipoLab = labelTipoBibliotecaItem(i.tipo).toLowerCase()
      return titulo.includes(q) || desc.includes(q) || temaLab.includes(q) || tipoLab.includes(q)
    })
  }, [proEsteticaNarrow, baseLista, buscaNome, segParaTituloBiblioteca])

  const itemsComecePorAquiVisiveis = useMemo(() => {
    if (!buscaNome.trim()) return itemsComecePorAqui
    const ok = new Set(listaAposBuscaNome.map((i) => i.id))
    return itemsComecePorAqui.filter((i) => ok.has(i.id))
  }, [buscaNome, itemsComecePorAqui, listaAposBuscaNome])

  const itemsFiltered = situacaoFiltro
    ? listaAposBuscaNome.filter((i) => itemCaiNaSituacao(getUsoPrincipal(i.tema, i.meta), situacaoFiltro))
    : listaAposBuscaNome

  const dicaNoelBibliotecaTooltip = useMemo(() => {
    if (!segmentoSugerido || segmentoFiltro !== segmentoSugerido) return ''
    return getDicaNoelBiblioteca(
      segmentoSugerido,
      isEsteticaLinksBiblioteca ? terapiaLinhaAtual : null,
    )
  }, [segmentoSugerido, segmentoFiltro, isEsteticaLinksBiblioteca, terapiaLinhaAtual])

  const idsEmSugestoesTopo = new Set(itemsComecePorAquiVisiveis.slice(0, 3).map((i) => i.id))
  const itemsListaCorporalSemRepetirSugestao = proEsteticaNarrow
    ? itemsFiltered
    : itemsFiltered.filter((i) => !idsEmSugestoesTopo.has(i.id))

  useEffect(() => {
    if (proEsteticaNarrow) {
      setSegmentoSugerido('aesthetics')
      setSegmentoFiltro('aesthetics')
      setTemaFiltro('')
      setSituacaoFiltro('')
      return
    }
    const key = getSimulateCookie()
    if (key) {
      const perfil = getPerfilSimuladoByKey(key)
      if (perfil?.profession) {
        const seg = getBibliotecaSegmentFromProfile(perfil.profession)
        setSegmentoSugerido(seg)
        setSegmentoFiltro(seg)
      }
    } else {
      // Matriz (/pt/links): segmento vem do perfil do usuário; demais rotas → área na URL
      let seg: BibliotecaSegmentCode | null = null
      if ((areaCodigo || '').toLowerCase().trim() === 'ylada') {
        seg = getBibliotecaSegmentFromUserPerfil(userProfile?.perfil ?? null)
      }
      if (!seg) {
        seg = getBibliotecaSegmentFromArea(areaCodigo)
      }
      if (seg) {
        setSegmentoSugerido(seg)
        setSegmentoFiltro(seg)
      }
    }
  }, [areaCodigo, userProfile?.perfil, proEsteticaNarrow])

  // Buscar perfil (area_specific) para personalizar Sugestão do Noel quando segmento = aesthetics
  useEffect(() => {
    if (segmentoFiltro !== 'aesthetics') return
    let cancelled = false
    fetch(`/api/ylada/profile?segment=${encodeURIComponent('estetica')}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.success && data?.data?.profile) {
          const p = data.data.profile as { area_specific?: Record<string, unknown> | null }
          setAreaEspecifica(p?.area_specific && typeof p.area_specific === 'object' ? p.area_specific : null)
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [segmentoFiltro])

  useEffect(() => {
    if (proEsteticaNarrow) return
    if (segmentoFiltro && temaFiltro) {
      const temasDoSegmento = getTemasParaBiblioteca(segmentoFiltro)
      const temaExiste = temasDoSegmento.some((t) => t.value === temaFiltro)
      if (!temaExiste) setTemaFiltro('')
    }
  }, [segmentoFiltro, proEsteticaNarrow, temaFiltro, items, loading])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = new URLSearchParams()
    if (esteticaCorporalScope) {
      params.set('subscope', 'estetica_corporal')
    } else if (esteticaCapilarScope) {
      params.set('subscope', 'estetica_capilar')
    } else {
      const areaNorm = (areaCodigo || '').toLowerCase().trim()
      const implicitFromArea =
        !segmentoFiltro && areaNorm && areaNorm !== 'ylada' ? getBibliotecaSegmentFromArea(areaCodigo) : null
      const segForApi = (segmentoFiltro || implicitFromArea || '') as string
      if (segForApi) params.set('segmento', segForApi)
    }
    if (!esteticaCorporalScope && !esteticaCapilarScope && temaFiltro) params.set('tema', temaFiltro)
    fetch(`/api/ylada/biblioteca?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.items)) setItems(data.items)
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [segmentoFiltro, temaFiltro, esteticaCorporalScope, esteticaCapilarScope, areaCodigo])

  const renderNoelSugestao = () => {
    const ideiaDoDia = esteticaCorporalScope
      ? getIdeiaRapidaDoDiaEsteticaCorporal()
      : esteticaCapilarScope
        ? getIdeiaRapidaDoDiaEsteticaCapilar()
        : getIdeiaRapidaDoDia({
            segmentCode: (segmentoFiltro || getBibliotecaSegmentFromArea(areaCodigo)) ?? undefined,
            areaEspecifica: areaEspecifica ?? undefined,
          })
    const listaIdeiaNoel = isEsteticaLinksBiblioteca ? itemsListaParaEsteticaTerapia : itemsLista
    const itemIdeia =
      listaIdeiaNoel.find((i) => i.tema === ideiaDoDia.tema && i.tipo === 'quiz') ??
      listaIdeiaNoel.find((i) => i.tema === ideiaDoDia.tema)
    const tituloParaLink = ideiaDoDia.titulo_sugerido || itemIdeia?.titulo || getTemaLabel(ideiaDoDia.tema)
    const ideiaCreatingKey = `ideia-${ideiaDoDia.tema}`
    const handleCriarDaIdeia = async () => {
      if (creatingId === ideiaCreatingKey) return
      if (itemIdeia) {
        setCreatingId(ideiaCreatingKey)
        setIdeiaLinkErro(null)
        setIdeiaLinkPrecosCta(false)
        let preOpenedIdeia: Window | null = null
        if (stayInProEsteticaHub && typeof window !== 'undefined') {
          try {
            preOpenedIdeia = window.open('about:blank', '_blank')
          } catch {
            preOpenedIdeia = null
          }
        }
        const ideiaNav = stayInProEsteticaHub ? { usePreOpenedTab: preOpenedIdeia } : undefined
        try {
          const body: Record<string, unknown> = {
            flow_id: itemIdeia.flow_id ?? 'diagnostico_risco',
            biblioteca_template_id: itemIdeia.template_id || undefined,
            interpretacao: { tema: itemIdeia.tema, objetivo: 'captar' },
            title: tituloParaLink,
          }
          const metaI = itemIdeia.meta as { segment_code?: unknown } | null | undefined
          const segMeta =
            metaI && typeof metaI.segment_code === 'string' ? metaI.segment_code.trim() : ''
          const segIdeia = (segmentForLinkGenerate || segMeta || '').trim()
          if (segIdeia) body.segment = segIdeia
          const res = await fetch('/api/ylada/links/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            cache: 'no-store',
            body: JSON.stringify(body),
          })
          let data: Record<string, unknown> = {}
          try {
            data = (await res.json()) as Record<string, unknown>
          } catch {
            setIdeiaLinkErro('Resposta inválida do servidor. Tenta outra vez.')
            return
          }
          const { linkId, payload } = parseGenerateResponseData(data)
          const createdWithId =
            Boolean(linkId) &&
            res.ok &&
            data?.success !== false &&
            !data?.limit_reached &&
            typeof data?.error !== 'string'
          if (data?.success && linkId) {
            try {
              navigateAfterLinkCreated(linkId, payload, ideiaNav)
            } catch {
              if (stayInProEsteticaHub) {
                hardNavigateTo(sameOriginUrlWithTabMeus())
              } else {
                const editPath = `${linksPath.replace(/\/$/, '')}/editar/${encodeURIComponent(linkId)}`
                hardNavigateTo(new URL(editPath, window.location.origin).href)
              }
            }
          } else if (createdWithId) {
            try {
              navigateAfterLinkCreated(linkId, payload, ideiaNav)
            } catch {
              if (stayInProEsteticaHub) {
                hardNavigateTo(sameOriginUrlWithTabMeus())
              } else {
                const editPath = `${linksPath.replace(/\/$/, '')}/editar/${encodeURIComponent(linkId)}`
                hardNavigateTo(new URL(editPath, window.location.origin).href)
              }
            }
          } else if (data?.success && (payload.slug || payload.url)) {
            const abs = absoluteFunnelUrlFromPayload(payload)
            if (stayInProEsteticaHub && abs) {
              if (!openPublicFunnelUrlInNewTab(abs, preOpenedIdeia)) {
                window.location.href = abs
              }
              setMeusLinksRefreshTick((n) => n + 1)
            } else if (abs) hardNavigateTo(abs)
            else if (payload.slug)
              hardNavigateTo(new URL(`/l/${encodeURIComponent(payload.slug)}`, window.location.origin).href)
            else if (stayInProEsteticaHub) hardNavigateTo(sameOriginUrlWithTabMeus())
            else hardNavigateTo(`${window.location.origin}${linksPath}`)
          } else if (data?.limit_reached && typeof data?.message === 'string' && data.message.trim()) {
            const msg = data.message.trim()
            try {
              if (!isCurrentPathLinksHub(linksPath) && !stayInProEsteticaHub) {
                if (data.limit_type === 'active_links') {
                  sessionStorage.setItem(
                    'ylada_pending_link_limit_modal',
                    JSON.stringify({ limit_type: 'active_links', message: msg })
                  )
                } else {
                  sessionStorage.setItem('ylada_pending_freemium_link_message', msg)
                }
              }
            } catch {
              // ignore
            }
            if (isCurrentPathLinksHub(linksPath) || stayInProEsteticaHub) {
              setIdeiaLinkErro(msg)
              setIdeiaLinkPrecosCta(data.limit_type === 'active_links')
            } else {
              window.location.href = linksPath
            }
          } else {
            const errMsg =
              typeof data.error === 'string'
                ? data.error
                : typeof data.message === 'string'
                  ? data.message
                  : !res.ok
                    ? `Erro ${res.status} ao criar o link.`
                    : 'Não foi possível criar o link.'
            setIdeiaLinkErro(errMsg)
            setIdeiaLinkPrecosCta(false)
          }
        } catch {
          setIdeiaLinkErro('Erro de rede. Verifica a ligação e tenta de novo.')
        } finally {
          setCreatingId(null)
        }
      } else {
        setIdeiaLinkErro('Modelo do dia indisponível na lista. Escolhe um cartão abaixo.')
      }
    }
    return (
      <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-sky-900 mb-0.5">🧠 Sugestão do Noel</h2>
            {isEsteticaLinksBiblioteca ? (
              <p className="text-xs text-sky-800/85 mb-1">
                {terapiaLinhaAtual === 'capilar'
                  ? 'Noel nesta linha (terapia capilar): a ideia do dia conversa com os modelos capilares da lista.'
                  : terapiaLinhaAtual === 'corporal'
                    ? 'Noel nesta linha (estética corporal): a ideia do dia conversa com contorno, retenção e protocolo.'
                    : 'Noel mostra uma ideia por dia; use o filtro Linha para priorizar terapia capilar ou estética corporal na lista.'}
              </p>
            ) : null}
            <p className="text-sm text-gray-700 line-clamp-2 sm:line-clamp-2">{ideiaDoDia.texto}</p>
          </div>
          <div className="relative z-10 flex shrink-0 flex-col items-stretch sm:items-end sm:pt-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                void handleCriarDaIdeia()
              }}
              disabled={creatingId === ideiaCreatingKey}
              className="touch-manipulation rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60 transition-colors"
            >
              {creatingId === ideiaCreatingKey ? 'Criando...' : 'Usar esse'}
            </button>
          </div>
        </div>
        {ideiaLinkErro ? (
          <BibliotecaLinkCreationAlert
            message={ideiaLinkErro}
            showUpgradeCta={ideiaLinkPrecosCta}
            analyticsSurface="biblioteca_sugestao_noel"
          />
        ) : null}
      </div>
    )
  }

  const segmentoSelect = mostrarFiltroSegmento ? (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <span className="shrink-0">Segmento</span>
      <select
        value={segmentoFiltro}
        onChange={(e) => setSegmentoFiltro(e.target.value as BibliotecaSegmentCode | '')}
        className="min-w-0 max-w-[min(100%,200px)] sm:max-w-[220px] md:max-w-[200px] rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
      >
        {isPrivilegedBiblioteca || !segmentoSugerido ? (
          <>
            <option value="">Todos</option>
            {BIBLIOTECA_SEGMENTOS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </>
        ) : (
          <>
            <option value="">Todos</option>
            <option value={segmentoSugerido}>
              {BIBLIOTECA_SEGMENTOS.find((s) => s.value === segmentoSugerido)?.label ?? segmentoSugerido} (seu perfil)
            </option>
          </>
        )}
      </select>
    </label>
  ) : null

  const situacaoSelect = (
    <label className="flex items-center gap-2 text-xs text-gray-600">
      <span className="shrink-0">Situação</span>
      <select
        value={situacaoFiltro}
        onChange={(e) => setSituacaoFiltro((e.target.value || '') as '' | SituacaoBiblioteca)}
        className="rounded border border-gray-200 px-2 py-1.5 text-sm text-gray-700 focus:ring-2 focus:ring-sky-500 min-w-0 w-[min(100%,10rem)] md:w-36"
      >
        {BIBLIOTECA_SITUACOES_OPTIONS.map((o) => (
          <option key={o.value || 'todas'} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )

  const temaSelect = (
    <label className="flex items-center gap-2 text-xs text-gray-600">
      <span className="shrink-0">{proEsteticaNarrow ? 'Tópicos' : 'Tema'}</span>
      <select
        value={temaFiltro}
        onChange={(e) => setTemaFiltro(e.target.value)}
        className="rounded border border-gray-200 px-2 py-1.5 text-sm text-gray-700 focus:ring-2 focus:ring-sky-500 min-w-0 w-[min(100%,11rem)] sm:w-40 md:max-w-[11rem]"
      >
        <option value="">Todos</option>
        {temasOpcoesBiblioteca.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  )

  const inner = (
    <div className={`max-w-4xl mx-auto ${embedded ? 'space-y-3' : 'space-y-6'}`}>
      {!embedded && (
        <>
          <header className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Biblioteca</h1>
            <p className="text-gray-600 text-sm">
              {segmentoFiltro && BIBLIOTECA_SEGMENTOS.find((s) => s.value === segmentoFiltro)?.label
                ? `Mostrando diagnósticos para ${BIBLIOTECA_SEGMENTOS.find((s) => s.value === segmentoFiltro)!.label}.`
                : 'Escolha um modelo e use.'}
            </p>
          </header>

          {linksCreatedToday !== null && (
            <p className="text-xs text-gray-500 text-right">
              {linksCreatedToday} criado{linksCreatedToday !== 1 ? 's' : ''} hoje
            </p>
          )}

          {renderNoelSugestao()}

          {!progressao.passo1 && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span aria-hidden>🚀</span> Primeiros passos
              </h2>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xs text-gray-400">1</span>
                  Criar seu primeiro diagnóstico
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xs text-gray-400">2</span>
                  Compartilhar o link
                </li>
                <li className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xs text-gray-400">3</span>
                  Receber respostas e conversar
                </li>
              </ol>
              <p className="mt-3 text-xs text-gray-600">
                Use o botão acima ou escolha na lista abaixo.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {segmentoSelect}
            {mostrarFiltroSegmento ? <span className="text-gray-300">|</span> : null}
            <div className="flex flex-wrap items-center gap-2">
              {dicaNoelBibliotecaTooltip ? (
                <span className="cursor-help" title={dicaNoelBibliotecaTooltip} aria-label="Dica do Noel">
                  💡
                </span>
              ) : null}
              {(segmentoFiltro && !proEsteticaNarrow
                ? temasOpcoesBiblioteca
                : (TEMAS_MAIS_USADOS as readonly string[]).map((value) => ({ value, label: getTemaLabel(value) }))
              )
                .slice(0, 8)
                .map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTemaFiltro(temaFiltro === t.value ? '' : t.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      temaFiltro === t.value
                        ? 'bg-amber-200 text-amber-900 ring-1 ring-amber-400'
                        : 'bg-white/80 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
            </div>
          </div>

          {isEsteticaLinksBiblioteca && (
            <div
              className="flex flex-wrap items-center gap-2 pt-1"
              role="group"
              aria-label="Filtro da biblioteca: terapia capilar ou estética corporal"
            >
              <span className="text-xs font-medium text-gray-600 shrink-0">Linha</span>
              {(
                [
                  { value: 'todos' as const, label: 'Tudo' },
                  { value: 'capilar' as const, label: 'Terapia capilar' },
                  { value: 'corporal' as const, label: 'Estética corporal' },
                ] as const
              ).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTerapiaLinhaUrl(value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    terapiaLinhaAtual === value
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <span aria-hidden>📚</span> Todos os diagnósticos
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              {!proEsteticaNarrow ? situacaoSelect : null}
              {temaSelect}
            </div>
          </div>

          {!proEsteticaNarrow && (
            <div className="pt-2">
              <label htmlFor="busca-biblioteca-nome-full" className="sr-only">
                Buscar por nome ou palavra-chave
              </label>
              <input
                id="busca-biblioteca-nome-full"
                type="search"
                value={buscaNome}
                onChange={(e) => setBuscaNome(e.target.value)}
                placeholder="Buscar por nome, tema ou tipo…"
                autoComplete="off"
                className="w-full max-w-xl rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
              />
            </div>
          )}
        </>
      )}

      {embedded &&
        (proEsteticaNarrow ? (
          <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-3">
            <label htmlFor="busca-biblioteca-pro-estetica" className="sr-only">
              Buscar por nome
            </label>
            <input
              id="busca-biblioteca-pro-estetica"
              type="search"
              value={buscaNome}
              onChange={(e) => setBuscaNome(e.target.value)}
              placeholder="Buscar por nome…"
              autoComplete="off"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
        ) : (
          <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-white p-2 sm:p-2.5">
            <p className="sr-only">
              {segmentoFiltro && BIBLIOTECA_SEGMENTOS.find((s) => s.value === segmentoFiltro)?.label
                ? `Modelos para ${BIBLIOTECA_SEGMENTOS.find((s) => s.value === segmentoFiltro)!.label}.`
                : 'Biblioteca de modelos.'}
            </p>
            {/* Linha 1: segmento + situação + tema; contador à direita (evita sobrepor os chips) */}
            <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-2">
              <div className="flex min-w-0 flex-1 flex-wrap items-end gap-x-2 gap-y-1.5 sm:gap-x-2.5">
                {segmentoSelect ? (
                  <div className="shrink-0 [&_label]:items-center [&_label]:gap-1.5 [&_label]:text-xs [&_label]:text-gray-700 [&_select]:max-w-[7.75rem] sm:[&_select]:max-w-[9rem] [&_select]:py-1.5 [&_select]:text-sm">
                    {segmentoSelect}
                  </div>
                ) : null}
                {dicaNoelBibliotecaTooltip ? (
                  <span
                    className="cursor-help shrink-0 self-center text-base leading-none"
                    title={dicaNoelBibliotecaTooltip}
                    aria-label="Dica do Noel"
                  >
                    💡
                  </span>
                ) : null}
                <div className="shrink-0 [&_label]:items-center [&_label]:gap-1.5 [&_label]:text-xs [&_select]:max-w-[9.5rem] sm:[&_select]:max-w-[10.5rem] [&_select]:py-1.5 [&_select]:text-sm">
                  {situacaoSelect}
                </div>
                <div className="min-w-0 flex-1 basis-[min(100%,9.5rem)] sm:basis-[11rem] [&_label]:items-center [&_label]:gap-1.5 [&_label]:text-xs [&_select]:w-full [&_select]:max-w-full [&_select]:py-1.5 [&_select]:text-sm">
                  {temaSelect}
                </div>
              </div>
              {linksCreatedToday !== null ? (
                <span className="shrink-0 self-end whitespace-nowrap pb-0.5 text-right text-[11px] leading-tight text-gray-500 sm:text-xs">
                  {linksCreatedToday} criado{linksCreatedToday !== 1 ? 's' : ''} hoje
                </span>
              ) : null}
            </div>
            {isEsteticaLinksBiblioteca ? (
              <div
                className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-gray-100 pt-2"
                role="group"
                aria-label="Filtro da biblioteca: terapia capilar ou estética corporal"
              >
                <span className="text-xs font-medium text-gray-600">Linha</span>
                {(
                  [
                    { value: 'todos' as const, label: 'Tudo' },
                    { value: 'capilar' as const, label: 'Terapia capilar' },
                    { value: 'corporal' as const, label: 'Estética corporal' },
                  ] as const
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTerapiaLinhaUrl(value)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors sm:px-3 ${
                      terapiaLinhaAtual === value
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {embedded && !proEsteticaNarrow && (
          <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-3">
            <label htmlFor="busca-biblioteca-nome-embedded" className="sr-only">
              Buscar por nome ou palavra-chave
            </label>
            <input
              id="busca-biblioteca-nome-embedded"
              type="search"
              value={buscaNome}
              onChange={(e) => setBuscaNome(e.target.value)}
              placeholder="Buscar por nome, tema ou tipo…"
              autoComplete="off"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
            />
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-500 border-t-transparent mx-auto" />
            <p className="mt-4 text-sm text-gray-500">Carregando...</p>
          </div>
        ) : itemsFiltered.length > 0 ? (
          <div className="space-y-8">
            {/* Sugestões para hoje — 3 recomendados com selos (camada 2) */}
            {itemsComecePorAquiVisiveis.length > 0 && !proEsteticaNarrow && (
              <section className={embedded ? '-mt-0.5' : ''}>
                <h2 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <span aria-hidden>💡</span> Sugestões para hoje
                </h2>
                {isEsteticaLinksBiblioteca ? (
                  <p className="text-xs text-gray-600 mb-2 sm:mb-3">
                    Noel monta estes três com base na linha ativa (terapia capilar, estética corporal ou mistura em «Tudo»).
                  </p>
                ) : null}
                <div className={`grid sm:grid-cols-3 ${embedded ? 'gap-3' : 'gap-4'}`}>
                  {itemsComecePorAquiVisiveis.slice(0, 3).map((item, idx) => {
                    const badges: { icon: string; label: string }[] = [
                      { icon: '🔥', label: 'Mais usado' },
                      { icon: '⭐', label: 'Alta taxa de resposta' },
                      { icon: '📈', label: 'Mais compartilhado' },
                    ]
                    return (
                      <BibliotecaCard
                        key={item.id}
                        item={item}
                        linksPath={linksPath}
                        creatingId={creatingId}
                        setCreatingId={setCreatingId}
                        onLinkCreated={navigateAfterLinkCreated}
                        variant="comece"
                        segmentCode={segmentoFiltro || null}
                        apiSegment={segmentForLinkGenerate}
                        getCardMeta={getCardMeta}
                        getTemaLabel={getTemaLabel}
                        getQuandoUsar={getQuandoUsar}
                        getTituloAdaptado={getTituloAdaptado}
                        isTemaMaisUsado={isTemaMaisUsado}
                        badge={badges[idx]}
                        stayOnProEsteticaPanel={stayInProEsteticaHub}
                        onRefreshMeusLinks={
                          stayInProEsteticaHub ? () => setMeusLinksRefreshTick((n) => n + 1) : undefined
                        }
                      />
                    )
                  })}
                </div>
              </section>
            )}

            {/* Lista principal por situação (painel corporal: lista única por tópicos) */}
            <section>
              {situacaoFiltro === '' ? (
                proEsteticaNarrow ? (
                  <>
                    <h2 className="sr-only">Modelos disponíveis</h2>
                    {itemsListaCorporalSemRepetirSugestao.length === 0 ? (
                      <p className="text-center text-sm text-gray-500 py-8">
                        {buscaNome.trim()
                          ? `Nenhum resultado para “${buscaNome.trim()}”.`
                          : 'Nenhum modelo disponível.'}
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                        {itemsListaCorporalSemRepetirSugestao.map((item) => (
                          <BibliotecaCard
                            key={item.id}
                            item={item}
                            linksPath={linksPath}
                            creatingId={creatingId}
                            setCreatingId={setCreatingId}
                            onLinkCreated={navigateAfterLinkCreated}
                            variant="default"
                            segmentCode={segmentoFiltro || null}
                            apiSegment={segmentForLinkGenerate}
                            getCardMeta={getCardMeta}
                            getTemaLabel={getTemaLabel}
                            getQuandoUsar={getQuandoUsar}
                            getTituloAdaptado={getTituloAdaptado}
                            isTemaMaisUsado={isTemaMaisUsado}
                            stayOnProEsteticaPanel={stayInProEsteticaHub}
                            onRefreshMeusLinks={
                              stayInProEsteticaHub ? () => setMeusLinksRefreshTick((n) => n + 1) : undefined
                            }
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                <>
                  {BIBLIOTECA_SITUACOES.map((situacao) => {
                    const itensSituacao = itemsFiltered.filter((i) =>
                      itemCaiNaSituacao(getUsoPrincipal(i.tema, i.meta), situacao.value)
                    )
                    if (itensSituacao.length === 0) return null
                    const icon =
                      situacao.value === 'gerar_contatos'
                        ? '🎯'
                        : situacao.value === 'iniciar_conversa'
                          ? '💬'
                          : situacao.value === 'entender_cliente'
                            ? '📋'
                            : '🔁'
                    return (
                      <div key={situacao.value} className="mb-8 last:mb-0">
                        <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <span aria-hidden>{icon}</span> {situacao.label}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {itensSituacao.map((item) => (
                            <BibliotecaCard
                              key={item.id}
                              item={item}
                              linksPath={linksPath}
                              creatingId={creatingId}
                              setCreatingId={setCreatingId}
                              onLinkCreated={navigateAfterLinkCreated}
                              variant="default"
                              segmentCode={segmentoFiltro || null}
                              apiSegment={segmentForLinkGenerate}
                              getCardMeta={getCardMeta}
                              getTemaLabel={getTemaLabel}
                              getQuandoUsar={getQuandoUsar}
                              getTituloAdaptado={getTituloAdaptado}
                              isTemaMaisUsado={isTemaMaisUsado}
                              stayOnProEsteticaPanel={stayInProEsteticaHub}
                              onRefreshMeusLinks={
                                stayInProEsteticaHub ? () => setMeusLinksRefreshTick((n) => n + 1) : undefined
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </>
              )
            ) : (
                <>
                  <h2 className="text-sm font-semibold text-gray-800 mb-3">
                    {BIBLIOTECA_SITUACOES.find((s) => s.value === situacaoFiltro)?.label ?? situacaoFiltro}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {itemsFiltered.map((item) => (
                      <BibliotecaCard
                        key={item.id}
                        item={item}
                        linksPath={linksPath}
                        creatingId={creatingId}
                        setCreatingId={setCreatingId}
                        onLinkCreated={navigateAfterLinkCreated}
                        variant="default"
                        segmentCode={segmentoFiltro || null}
                        apiSegment={segmentForLinkGenerate}
                        getCardMeta={getCardMeta}
                        getTemaLabel={getTemaLabel}
                        getQuandoUsar={getQuandoUsar}
                        getTituloAdaptado={getTituloAdaptado}
                        isTemaMaisUsado={isTemaMaisUsado}
                        stayOnProEsteticaPanel={stayInProEsteticaHub}
                        onRefreshMeusLinks={
                          stayInProEsteticaHub ? () => setMeusLinksRefreshTick((n) => n + 1) : undefined
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Nenhum item encontrado</h2>
            {proEsteticaNarrow ? (
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                {buscaNome.trim()
                  ? `Nenhum resultado para “${buscaNome.trim()}”. Tente outras palavras.`
                  : 'Nenhum modelo disponível neste momento.'}
              </p>
            ) : buscaNome.trim() ? (
              <>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                  Nenhum resultado para &quot;{buscaNome.trim()}&quot;. Tente outro termo ou limpe a busca para ver a lista completa.
                </p>
                <button
                  type="button"
                  onClick={() => setBuscaNome('')}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  Limpar busca
                </button>
              </>
            ) : segmentoFiltro ? (
              <>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                  Nenhum diagnóstico específico para{' '}
                  <strong>{BIBLIOTECA_SEGMENTOS.find((s) => s.value === segmentoFiltro)?.label ?? segmentoFiltro}</strong> no momento.
                  Alterar o segmento para &quot;Todos&quot; mostra todos os diagnósticos disponíveis.
                </p>
                <button
                  type="button"
                  onClick={() => setSegmentoFiltro('')}
                  className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
                >
                  Ver todos os diagnósticos
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Tente ajustar os filtros ou use o Noel para criar um link do zero.
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  Filtros: {segmentoFiltro || 'todos'} | {temaFiltro ? getTemaLabel(temaFiltro) : 'todos'}
                  {buscaNome.trim() ? ` | busca: “${buscaNome.trim()}”` : ''}
                </p>
              </>
            )}
          </div>
        )}

        {embedded && !proEsteticaNarrow && (
          <details className="rounded-xl border border-dashed border-gray-200 bg-gray-50/40">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 list-none [&::-webkit-details-marker]:hidden">
              Sugestão do Noel e guia rápido{' '}
              <span className="text-xs font-normal text-gray-500">— toque para expandir</span>
            </summary>
            <div className="px-4 pb-4 pt-0 space-y-4 border-t border-gray-100">
              {renderNoelSugestao()}
              {!progressao.passo1 && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span aria-hidden>🚀</span> Primeiros passos
                  </h2>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xs text-gray-400">1</span>
                      Criar seu primeiro diagnóstico
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xs text-gray-400">2</span>
                      Compartilhar o link
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xs text-gray-400">3</span>
                      Receber respostas e conversar
                    </li>
                  </ol>
                  <p className="mt-3 text-xs text-gray-600">Use a sugestão acima ou escolha um modelo na lista.</p>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Meus diagnósticos — oculto quando embedded (hub tem "Ver meus links") */}
        {!embedded && (
        <section className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span aria-hidden>📂</span> Meus diagnósticos
          </h2>
          {meusLinks.length === 0 ? (
            <p className="text-sm text-gray-600 mb-3">Você ainda não criou nenhum diagnóstico.</p>
          ) : (
            <ul className="space-y-3">
              {meusLinks.slice(0, 10).map((link) => (
                <li key={link.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">{link.title || link.slug}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(link.url)
                      }}
                      className="rounded px-2 py-1 text-xs font-medium text-sky-600 hover:bg-sky-50"
                    >
                      Copiar link
                    </button>
                    <button
                      type="button"
                      onClick={() => setLinkQrModal(link)}
                      className="rounded px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      QR Code
                    </button>
                    <Link
                      href={`${linksPath}/editar/${link.id}`}
                      className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Editar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {meusLinks.length > 0 && (
            <Link href={linksPath} className="mt-3 inline-block text-sm font-medium text-sky-600 hover:underline">
              Ver todos os meus links →
            </Link>
          )}
        </section>
        )}

        {linkQrModal && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 bg-black/50"
            aria-modal="true"
            role="dialog"
            onClick={() => setLinkQrModal(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-xl shadow-xl border border-gray-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-gray-900">QR Code do link</h3>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{linkQrModal.title || linkQrModal.slug}</p>
              <div className="mt-4">
                <DiagnosticoLinkQrPanel url={linkQrModal.url} />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={linkQrModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white hover:bg-sky-700"
                >
                  Ver preview
                </a>
                <Link
                  href={`${linksPath}/editar/${linkQrModal.id}`}
                  className="flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800 hover:bg-sky-100"
                  onClick={() => setLinkQrModal(null)}
                >
                  Editar link
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setLinkQrModal(null)}
                className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

      </div>
  )

  if (embedded) return inner
  return <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>{inner}</YladaAreaShell>
}

export default function BibliotecaPageContent(props: BibliotecaPageContentProps) {
  const fallback = (
    <div className="flex min-h-[30vh] items-center justify-center py-10">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
        <p className="mt-3 text-sm text-gray-500">Carregando biblioteca…</p>
      </div>
    </div>
  )
  return (
    <Suspense fallback={fallback}>
      <BibliotecaPageContentInner {...props} />
    </Suspense>
  )
}
