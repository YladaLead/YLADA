'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import YladaAreaShell from './YladaAreaShell'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
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
import {
  SUGESTAO_NOEL_TEMAS_ESTETICA_CORPORAL,
  dedupeBibliotecaItensEsteticaCorporal,
  getIdeiaRapidaDoDiaEsteticaCorporal,
  ordenarItemsEsteticaCorporal,
} from '@/config/pro-estetica-corporal-biblioteca'
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

function BibliotecaCard({
  item,
  linksPath,
  creatingId,
  setCreatingId,
  setLinkCriado,
  variant,
  segmentCode,
  getCardMeta: getMeta,
  getTemaLabel,
  getQuandoUsar,
  getTituloAdaptado: getTituloAdaptadoFn,
  isTemaMaisUsado,
  badge,
}: {
  item: BibliotecaItemRow
  linksPath: string
  creatingId: string | null
  setCreatingId: (id: string | null) => void
  setLinkCriado: (v: { id: string; url: string; slug: string; titulo: string; tema?: string } | null) => void
  variant: 'default' | 'sugestao' | 'comece'
  segmentCode?: BibliotecaSegmentCode | null
  /** Selo para "Sugestões para hoje" (ex: "🔥 Mais usado"). */
  badge?: { icon: string; label: string }
  getCardMeta: (i: BibliotecaItemRow) => { tempo: string; perguntas: string }
  getTemaLabel: (t: string) => string
  getQuandoUsar: (t: string, m: BibliotecaItemRow['meta']) => string
  getTituloAdaptado: (tema: string, seg: BibliotecaSegmentCode | null) => string | null
  isTemaMaisUsado: (t: string) => boolean
}) {
  const { tempo, perguntas } = getMeta(item)
  const tituloExibido = (segmentCode && getTituloAdaptadoFn(item.tema, segmentCode)) || item.titulo
  const mostraMaisUsado = item.tipo === 'quiz' && isTemaMaisUsado(item.tema)
  const isSugestao = variant === 'sugestao'
  const isComece = variant === 'comece'

  const handleUse = async () => {
    setCreatingId(item.id)
    try {
      const res = await fetch('/api/ylada/links/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          flow_id: item.flow_id ?? 'diagnostico_risco',
          biblioteca_template_id: item.template_id || undefined,
          interpretacao: { tema: item.tema, objetivo: 'captar' },
          title: item.titulo,
        }),
      })
      const data = await res.json()
      if (data?.success && data?.data?.id) {
        const base = typeof window !== 'undefined' ? window.location.origin : ''
        const url = data.data.url || `${base}/l/${data.data.slug}`
        setLinkCriado({ id: data.data.id, url, slug: data.data.slug, titulo: item.titulo, tema: item.tema })
      } else if (data?.success && data?.data?.url) {
        window.location.href = `${linksPath}?created=1`
      } else if (data?.limit_reached && typeof data?.message === 'string' && data.message.trim()) {
        try {
          if (data.limit_type === 'active_links') {
            sessionStorage.setItem(
              'ylada_pending_link_limit_modal',
              JSON.stringify({ limit_type: 'active_links', message: data.message.trim() })
            )
          } else {
            sessionStorage.setItem('ylada_pending_freemium_link_message', data.message.trim())
          }
        } catch {
          // ignore
        }
        window.location.href = linksPath
      } else {
        window.location.href = `${linksPath}?tema=${encodeURIComponent(item.tema)}&flow_id=${item.flow_id ?? 'diagnostico_risco'}`
      }
    } catch {
      window.location.href = `${linksPath}?tema=${encodeURIComponent(item.tema)}&flow_id=${item.flow_id ?? 'diagnostico_risco'}`
    } finally {
      setCreatingId(null)
    }
  }

  const compacto = isSugestao || isComece
  const quandoUsarText = getQuandoUsar(item.tema, item.meta)
  const metaParts = [getTemaLabel(item.tema), tempo, perguntas].filter(Boolean)
  const metaLine = metaParts.join(' · ')
  const hasTags = !!(item.dor_principal || item.objetivo_principal || (item.pilar && !item.dor_principal))

  return (
    <article
      className={`rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow ${
        isSugestao ? 'border-amber-200 bg-amber-50/50 p-4' : isComece ? 'border-sky-100 p-4' : 'border-gray-200 p-5'
      }`}
    >
      <div className="flex items-start gap-4">
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
        <div className="flex shrink-0 flex-col items-end gap-2">
          {mostraMaisUsado && !isSugestao && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              <span aria-hidden>🔥</span> Mais usado
            </span>
          )}
          {isSugestao && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-medium text-amber-900">
              📈 Alta taxa de conversa
            </span>
          )}
          <button
            type="button"
            disabled={!!creatingId}
            onClick={handleUse}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              isSugestao ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            {creatingId === item.id ? 'Criando...' : 'Usar esse'}
          </button>
        </div>
      </div>
    </article>
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
}

function BibliotecaPageContentInner({
  areaCodigo,
  areaLabel,
  embedded = false,
  esteticaCorporalScope = false,
}: BibliotecaPageContentProps) {
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const linksPath = `${prefix}/links`

  const [segmentoFiltro, setSegmentoFiltro] = useState<BibliotecaSegmentCode | ''>('')
  const [temaFiltro, setTemaFiltro] = useState<string>('')
  /** Painel corporal: filtro local por texto (título, descrição, rótulo do tema). */
  const [buscaNome, setBuscaNome] = useState('')
  const [situacaoFiltro, setSituacaoFiltro] = useState<'' | SituacaoBiblioteca>('')
  const [segmentoSugerido, setSegmentoSugerido] = useState<BibliotecaSegmentCode | null>(null)
  const [items, setItems] = useState<BibliotecaItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingId, setCreatingId] = useState<string | null>(null)
  const [linkCriado, setLinkCriado] = useState<{ id: string; url: string; slug: string; titulo: string; tema?: string } | null>(null)
  const [copiado, setCopiado] = useState(false)
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

  /** Só faz sentido escolher segmento se não há um fixo pelo perfil/URL ou se é admin/suporte. */
  const isPrivilegedBiblioteca = !!(userProfile?.is_admin || userProfile?.is_support)
  const mostrarFiltroSegmento =
    !esteticaCorporalScope && (isPrivilegedBiblioteca || !segmentoSugerido)

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
    if (esteticaCorporalScope) {
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
  }, [esteticaCorporalScope])

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
  }, [linkCriado])

  const isEsteticaLinksBiblioteca =
    (areaCodigo || '').toLowerCase().trim() === 'estetica' &&
    !esteticaCorporalScope &&
    segmentoFiltro === 'aesthetics'

  const sugestaoTemas = esteticaCorporalScope
    ? SUGESTAO_NOEL_TEMAS_ESTETICA_CORPORAL
    : getSugestaoNoelTemas(segmentoFiltro || null)

  const segParaTituloBiblioteca = (esteticaCorporalScope ? 'aesthetics' : segmentoFiltro || null) as BibliotecaSegmentCode | null

  const itemsLista = useMemo(() => {
    if (!esteticaCorporalScope) return items
    const ordenados = ordenarItemsEsteticaCorporal(items)
    return dedupeBibliotecaItensEsteticaCorporal(ordenados, 'aesthetics')
  }, [items, esteticaCorporalScope])

  const itemsListaParaEsteticaTerapia = useMemo(() => {
    if (!isEsteticaLinksBiblioteca) return itemsLista
    const linha = parseEsteticaTerapiaLinhaParam(linhaBibliotecaQueryRaw)
    const filtrados = filterBibliotecaItemsByEsteticaTerapiaLinha(itemsLista, linha)
    return dedupeEsteticaBibliotecaPorTitulo(filtrados)
  }, [isEsteticaLinksBiblioteca, itemsLista, linhaBibliotecaQueryRaw])

  const itemsListaComBusca = useMemo(() => {
    const q = buscaNome.trim().toLowerCase()
    if (!esteticaCorporalScope || !q) return itemsLista
    const seg = segParaTituloBiblioteca
    return itemsLista.filter((i) => {
      const titulo = ((seg && getTituloAdaptado(i.tema, seg)) || i.titulo).toLowerCase()
      const desc = (i.description || '').toLowerCase()
      const temaLab = getTemaLabel(i.tema).toLowerCase()
      return titulo.includes(q) || desc.includes(q) || temaLab.includes(q)
    })
  }, [buscaNome, esteticaCorporalScope, itemsLista, segParaTituloBiblioteca])

  const temasOpcoesBiblioteca = useMemo(() => {
    if (esteticaCorporalScope) {
      const seen = new Set<string>()
      for (const it of itemsLista) seen.add(it.tema)
      return Array.from(seen)
        .sort((a, b) => getTemaLabel(a).localeCompare(getTemaLabel(b), 'pt'))
        .map((value) => ({ value, label: getTemaLabel(value) }))
    }
    return getTemasParaBiblioteca(segmentoFiltro || undefined)
  }, [esteticaCorporalScope, itemsLista, segmentoFiltro])

  const itemsComecePorAqui = useMemo(() => {
    const out: BibliotecaItemRow[] = []
    if (esteticaCorporalScope) return out
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
    esteticaCorporalScope,
    isEsteticaLinksBiblioteca,
    itemsLista,
    itemsListaParaEsteticaTerapia,
    segParaTituloBiblioteca,
    sugestaoTemas,
    linhaBibliotecaQueryRaw,
  ])

  const baseLista = esteticaCorporalScope ? itemsListaComBusca : isEsteticaLinksBiblioteca ? itemsListaParaEsteticaTerapia : itemsLista

  const listaAposBuscaNome = useMemo(() => {
    if (esteticaCorporalScope) return baseLista
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
  }, [esteticaCorporalScope, baseLista, buscaNome, segParaTituloBiblioteca])

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
  const itemsListaCorporalSemRepetirSugestao = esteticaCorporalScope
    ? itemsFiltered
    : itemsFiltered.filter((i) => !idsEmSugestoesTopo.has(i.id))

  useEffect(() => {
    if (esteticaCorporalScope) {
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
  }, [areaCodigo, userProfile?.perfil, esteticaCorporalScope])

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
    if (esteticaCorporalScope) return
    if (segmentoFiltro && temaFiltro) {
      const temasDoSegmento = getTemasParaBiblioteca(segmentoFiltro)
      const temaExiste = temasDoSegmento.some((t) => t.value === temaFiltro)
      if (!temaExiste) setTemaFiltro('')
    }
  }, [segmentoFiltro, esteticaCorporalScope, temaFiltro, items, loading])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = new URLSearchParams()
    if (esteticaCorporalScope) {
      params.set('subscope', 'estetica_corporal')
    } else {
      const areaNorm = (areaCodigo || '').toLowerCase().trim()
      const implicitFromArea =
        !segmentoFiltro && areaNorm && areaNorm !== 'ylada' ? getBibliotecaSegmentFromArea(areaCodigo) : null
      const segForApi = (segmentoFiltro || implicitFromArea || '') as string
      if (segForApi) params.set('segmento', segForApi)
    }
    if (!esteticaCorporalScope && temaFiltro) params.set('tema', temaFiltro)
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
  }, [segmentoFiltro, temaFiltro, esteticaCorporalScope, areaCodigo])

  const renderNoelSugestao = () => {
    const ideiaDoDia = esteticaCorporalScope
      ? getIdeiaRapidaDoDiaEsteticaCorporal()
      : getIdeiaRapidaDoDia({
          segmentCode: (segmentoFiltro || getBibliotecaSegmentFromArea(areaCodigo)) ?? undefined,
          areaEspecifica: areaEspecifica ?? undefined,
        })
    const listaIdeiaNoel = isEsteticaLinksBiblioteca ? itemsListaParaEsteticaTerapia : itemsLista
    const itemIdeia =
      listaIdeiaNoel.find((i) => i.tema === ideiaDoDia.tema && i.tipo === 'quiz') ??
      listaIdeiaNoel.find((i) => i.tema === ideiaDoDia.tema)
    const tituloParaLink = ideiaDoDia.titulo_sugerido || itemIdeia?.titulo || getTemaLabel(ideiaDoDia.tema)
    const handleCriarDaIdeia = async () => {
      if (itemIdeia) {
        setCreatingId(`ideia-${ideiaDoDia.tema}`)
        try {
          const res = await fetch('/api/ylada/links/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              flow_id: itemIdeia.flow_id ?? 'diagnostico_risco',
              biblioteca_template_id: itemIdeia.template_id || undefined,
              interpretacao: { tema: itemIdeia.tema, objetivo: 'captar' },
              title: tituloParaLink,
            }),
          })
          const data = await res.json()
          if (data?.success && data?.data?.id) {
            const base = typeof window !== 'undefined' ? window.location.origin : ''
            const url = data.data.url || `${base}/l/${data.data.slug}`
            setLinkCriado({ id: data.data.id, url, slug: data.data.slug, titulo: tituloParaLink, tema: ideiaDoDia.tema })
          } else if (data?.success && data?.data?.url) {
            window.location.href = `${linksPath}?created=1`
          } else if (data?.limit_reached && typeof data?.message === 'string' && data.message.trim()) {
            try {
              if (data.limit_type === 'active_links') {
                sessionStorage.setItem(
                  'ylada_pending_link_limit_modal',
                  JSON.stringify({ limit_type: 'active_links', message: data.message.trim() })
                )
              } else {
                sessionStorage.setItem('ylada_pending_freemium_link_message', data.message.trim())
              }
            } catch {
              // ignore
            }
            window.location.href = linksPath
          } else {
            window.location.href = `${linksPath}?tema=${encodeURIComponent(ideiaDoDia.tema)}&flow_id=${itemIdeia.flow_id ?? 'diagnostico_risco'}`
          }
        } catch {
          window.location.href = `${linksPath}?tema=${encodeURIComponent(ideiaDoDia.tema)}&flow_id=${itemIdeia.flow_id ?? 'diagnostico_risco'}`
        } finally {
          setCreatingId(null)
        }
      } else {
        window.location.href = `${linksPath}?tema=${encodeURIComponent(ideiaDoDia.tema)}&flow_id=diagnostico_risco`
      }
    }
    return (
      <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
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
          <p className="text-sm text-gray-700 line-clamp-2 sm:line-clamp-1">{ideiaDoDia.texto}</p>
        </div>
        <button
          type="button"
          onClick={handleCriarDaIdeia}
          disabled={!!creatingId}
          className="shrink-0 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60 transition-colors"
        >
          {creatingId === `ideia-${ideiaDoDia.tema}` ? 'Criando...' : 'Usar esse'}
        </button>
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
      <span className="shrink-0">{esteticaCorporalScope ? 'Tópicos' : 'Tema'}</span>
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
              {(segmentoFiltro && !esteticaCorporalScope
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
              {!esteticaCorporalScope ? situacaoSelect : null}
              {temaSelect}
            </div>
          </div>

          {!esteticaCorporalScope && (
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
        (esteticaCorporalScope ? (
          <div className="rounded-lg border border-gray-200 bg-white p-2 sm:p-3">
            <label htmlFor="busca-biblioteca-corporal" className="sr-only">
              Buscar por nome
            </label>
            <input
              id="busca-biblioteca-corporal"
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

        {embedded && !esteticaCorporalScope && (
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
            {itemsComecePorAquiVisiveis.length > 0 && !esteticaCorporalScope && (
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
                        setLinkCriado={setLinkCriado}
                        variant="comece"
                        segmentCode={segmentoFiltro || null}
                        getCardMeta={getCardMeta}
                        getTemaLabel={getTemaLabel}
                        getQuandoUsar={getQuandoUsar}
                        getTituloAdaptado={getTituloAdaptado}
                        isTemaMaisUsado={isTemaMaisUsado}
                        badge={badges[idx]}
                      />
                    )
                  })}
                </div>
              </section>
            )}

            {/* Lista principal por situação (painel corporal: lista única por tópicos) */}
            <section>
              {situacaoFiltro === '' ? (
                esteticaCorporalScope ? (
                  <>
                    <h2 className="sr-only">Modelos disponíveis</h2>
                    {itemsListaCorporalSemRepetirSugestao.length === 0 ? (
                      <p className="text-center text-sm text-gray-500 py-8">
                        {buscaNome.trim()
                          ? `Nenhum resultado para “${buscaNome.trim()}”.`
                          : 'Nenhum modelo disponível.'}
                      </p>
                    ) : (
                      <div className={`grid gap-3 sm:grid-cols-2 ${embedded ? '' : 'gap-4'}`}>
                        {itemsListaCorporalSemRepetirSugestao.map((item) => (
                          <BibliotecaCard
                            key={item.id}
                            item={item}
                            linksPath={linksPath}
                            creatingId={creatingId}
                            setCreatingId={setCreatingId}
                            setLinkCriado={setLinkCriado}
                            variant="default"
                            segmentCode={segmentoFiltro || null}
                            getCardMeta={getCardMeta}
                            getTemaLabel={getTemaLabel}
                            getQuandoUsar={getQuandoUsar}
                            getTituloAdaptado={getTituloAdaptado}
                            isTemaMaisUsado={isTemaMaisUsado}
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
                              setLinkCriado={setLinkCriado}
                              variant="default"
                              segmentCode={segmentoFiltro || null}
                              getCardMeta={getCardMeta}
                              getTemaLabel={getTemaLabel}
                              getQuandoUsar={getQuandoUsar}
                              getTituloAdaptado={getTituloAdaptado}
                              isTemaMaisUsado={isTemaMaisUsado}
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
                        setLinkCriado={setLinkCriado}
                        variant="default"
                        segmentCode={segmentoFiltro || null}
                        getCardMeta={getCardMeta}
                        getTemaLabel={getTemaLabel}
                        getQuandoUsar={getQuandoUsar}
                        getTituloAdaptado={getTituloAdaptado}
                        isTemaMaisUsado={isTemaMaisUsado}
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
            {esteticaCorporalScope ? (
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

        {embedded && !esteticaCorporalScope && (
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

        {linkCriado && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 bg-black/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="biblioteca-link-pronto-title"
            onClick={() => setLinkCriado(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5 sm:max-h-[min(90vh,520px)] sm:overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 sm:hidden" aria-hidden />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 id="biblioteca-link-pronto-title" className="text-base font-semibold text-gray-900">
                    Link pronto
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">{linkCriado.titulo}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLinkCriado(null)}
                  className="shrink-0 rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 mb-2">O que você quer fazer?</p>
              <div className="flex flex-col gap-2">
                <a
                  href={linkCriado.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white hover:bg-sky-700"
                >
                  Ver preview
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(linkCriado!.url)
                    setCopiado(true)
                    setTimeout(() => setCopiado(false), 2000)
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  {copiado ? '✓ URL copiada' : 'Copiar URL'}
                </button>
                <Link
                  href={`${linksPath}/editar/${linkCriado.id}`}
                  className="flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800 hover:bg-sky-100"
                  onClick={() => setLinkCriado(null)}
                >
                  Editar link
                </Link>
              </div>
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
