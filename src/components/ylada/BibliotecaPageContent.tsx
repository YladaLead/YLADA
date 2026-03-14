'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import YladaAreaShell from './YladaAreaShell'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import {
  BIBLIOTECA_TIPOS,
  BIBLIOTECA_SEGMENTOS,
  BIBLIOTECA_SITUACOES,
  BIBLIOTECA_SITUACOES_OPTIONS,
  getTemasParaBiblioteca,
  getTemaLabel,
  getBibliotecaSegmentFromProfile,
  getBibliotecaSegmentFromArea,
  isTemaMaisUsado,
  getDicaNoelBiblioteca,
  getQuandoUsar,
  getUsoPrincipal,
  getSugestaoNoelTemas,
  getTituloAdaptado,
  getIdeiaRapidaDoDia,
  itemCaiNaSituacao,
  TEMAS_MAIS_USADOS,
  type BibliotecaTipo,
  type BibliotecaSegmentCode,
  type SituacaoBiblioteca,
} from '@/config/ylada-biblioteca'
import { getPerfilSimuladoByKey, SIMULATE_COOKIE_NAME } from '@/data/perfis-simulados'
import { useAuth } from '@/hooks/useAuth'
import { CompartilharDiagnosticoContent } from './CompartilharDiagnosticoContent'

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
  setLinkCriado: (v: { url: string; slug: string; titulo: string } | null) => void
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
        if (item.tipo === 'calculadora' && data?.data?.url) {
          const base = typeof window !== 'undefined' ? window.location.origin : ''
          const url = data.data.url || `${base}/l/${data.data.slug}`
          setLinkCriado({ url, slug: data.data.slug, titulo: item.titulo })
        } else {
          window.location.href = `${linksPath}/editar/${data.data.id}`
        }
      } else if (data?.success && data?.data?.url) {
        window.location.href = `${linksPath}?created=1`
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
          <h3 className={`font-semibold text-gray-900 ${compacto ? 'text-sm leading-snug' : ''}`}>{tituloExibido}</h3>
          {item.description && (
            <p className={`mt-1 text-gray-500 ${compacto ? 'text-xs line-clamp-1' : 'text-sm line-clamp-2'}`}>{item.description}</p>
          )}
          <div
            className={`mt-2 rounded-lg border border-indigo-100 bg-indigo-50/90 px-3 py-2 ${compacto ? 'py-1.5' : ''}`}
          >
            <p className="text-sm text-indigo-900 leading-snug">
              <span className="font-medium text-indigo-800">💡 Quando usar:</span>{' '}
              <span className="text-indigo-800">{getQuandoUsar(item.tema, item.meta)}</span>
            </p>
          </div>
          <div className={`flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 ${compacto ? 'mt-2' : 'mt-3'}`} role="list">
            <span className="flex items-center gap-1">
              <span aria-hidden>🧠</span> {getTemaLabel(item.tema)}
            </span>
            {tempo && (
              <span className="flex items-center gap-1">
                <span aria-hidden>⏱</span> {tempo}
              </span>
            )}
            {perguntas && (
              <span className="flex items-center gap-1">
                <span aria-hidden>📊</span> {perguntas}
              </span>
            )}
          </div>
          {!compacto && (
            <div className="mt-2 flex flex-wrap gap-1.5">
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
          {compacto && (item.dor_principal || item.objetivo_principal) && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {item.dor_principal && (
                <span className="inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
                  {item.dor_principal}
                </span>
              )}
              {item.objetivo_principal && (
                <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">
                  {item.objetivo_principal}
                </span>
              )}
            </div>
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
            {creatingId === item.id ? 'Criando...' : isSugestao ? 'Usar agora' : 'Usar'}
          </button>
        </div>
      </div>
    </article>
  )
}

interface BibliotecaPageContentProps {
  areaCodigo: string
  areaLabel: string
}

export default function BibliotecaPageContent({ areaCodigo, areaLabel }: BibliotecaPageContentProps) {
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const linksPath = `${prefix}/links`

  const [tipoAtivo, setTipoAtivo] = useState<BibliotecaTipo>('quiz')
  const [segmentoFiltro, setSegmentoFiltro] = useState<BibliotecaSegmentCode | ''>('')
  const [temaFiltro, setTemaFiltro] = useState<string>('')
  const [situacaoFiltro, setSituacaoFiltro] = useState<'' | SituacaoBiblioteca>('')
  const [segmentoSugerido, setSegmentoSugerido] = useState<BibliotecaSegmentCode | null>(null)
  const [items, setItems] = useState<BibliotecaItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingId, setCreatingId] = useState<string | null>(null)
  const [linkCriado, setLinkCriado] = useState<{ url: string; slug: string; titulo: string } | null>(null)
  const [copiado, setCopiado] = useState(false)
  const [progressao, setProgressao] = useState<{
    passo1: boolean
    passo2: boolean
    passo3: boolean
    linksCount: number
  }>({ passo1: false, passo2: false, passo3: false, linksCount: 0 })
  const [linksCreatedToday, setLinksCreatedToday] = useState<number | null>(null)
  const [meusLinks, setMeusLinks] = useState<Array<{ id: string; slug: string; title: string | null; url: string; stats?: { diagnosis_count?: number } }>>([])
  const [divulgarMeuLink, setDivulgarMeuLink] = useState<{ id: string; slug: string; title: string | null; url: string; stats?: { diagnosis_count?: number } } | null>(null)
  const { userProfile } = useAuth()

  useEffect(() => {
    let cancelled = false
    fetch('/api/ylada/stats/links-created-today', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data?.success && typeof data.count === 'number') setLinksCreatedToday(data.count)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/ylada/links', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled || !data?.success || !Array.isArray(data.data)) return
        const links = data.data as Array<{ id: string; slug: string; title: string | null; url: string; stats?: { complete?: number; cta_click?: number; diagnosis_count?: number } }>
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

  const sugestaoTemas = getSugestaoNoelTemas(segmentoFiltro || null)
  const itemSugestao = items.find((i) => i.tema === sugestaoTemas[0])
  const itemsComecePorAqui: BibliotecaItemRow[] = []
  for (const tema of sugestaoTemas) {
    const found = items.find((i) => i.tema === tema && !itemsComecePorAqui.includes(i))
    if (found) itemsComecePorAqui.push(found)
  }
  const itemsFiltered = situacaoFiltro
    ? items.filter((i) => itemCaiNaSituacao(getUsoPrincipal(i.tema, i.meta), situacaoFiltro))
    : items

  useEffect(() => {
    const key = getSimulateCookie()
    if (key) {
      const perfil = getPerfilSimuladoByKey(key)
      if (perfil?.profession) {
        const seg = getBibliotecaSegmentFromProfile(perfil.profession)
        setSegmentoSugerido(seg)
        setSegmentoFiltro(seg)
      }
    } else {
      // Sem cookie de simulação: usar segmento da área (ex: /pt/estetica/biblioteca → aesthetics)
      const segFromArea = getBibliotecaSegmentFromArea(areaCodigo)
      if (segFromArea) {
        setSegmentoSugerido(segFromArea)
        setSegmentoFiltro(segFromArea)
      }
    }
  }, [areaCodigo])

  useEffect(() => {
    if (segmentoFiltro && temaFiltro) {
      const temasDoSegmento = getTemasParaBiblioteca(segmentoFiltro)
      const temaExiste = temasDoSegmento.some((t) => t.value === temaFiltro)
      if (!temaExiste) setTemaFiltro('')
    }
  }, [segmentoFiltro])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const params = new URLSearchParams()
    if (tipoAtivo) params.set('tipo', tipoAtivo)
    if (segmentoFiltro) params.set('segmento', segmentoFiltro)
    if (temaFiltro) params.set('tema', temaFiltro)
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
  }, [tipoAtivo, segmentoFiltro, temaFiltro])

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Biblioteca</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            {segmentoSugerido && segmentoFiltro === segmentoSugerido
              ? 'Diagnósticos adaptados ao seu perfil profissional. Cada um traz orientação de quando usar.'
              : 'Biblioteca estratégica de geração de clientes. Cada item traz orientação de quando usar — Marketing para atrair ou CRM para aprofundar.'}
          </p>
          {segmentoSugerido && segmentoFiltro === segmentoSugerido && (
            <p className="text-sm font-medium text-indigo-700 flex items-center gap-2">
              <span aria-hidden>💡</span> Sugestão baseada no seu perfil
            </p>
          )}
        </header>

        {/* Contador: sensação de movimento e comunidade */}
        {linksCreatedToday !== null && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center">
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900" aria-hidden>📊</span>{' '}
              Hoje já foram criados <strong>{linksCreatedToday}</strong> diagnóstico{linksCreatedToday !== 1 ? 's' : ''} na plataforma
            </p>
          </div>
        )}

        {/* Ação primeiro: bloco grande "Criar diagnóstico agora" + Sugestão do Noel */}
        {(() => {
          const ideiaDoDia = getIdeiaRapidaDoDia()
          const itemIdeia = items.find((i) => i.tema === ideiaDoDia.tema && i.tipo === 'quiz')
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
                  if (itemIdeia.tipo === 'calculadora' && data?.data?.url) {
                    const base = typeof window !== 'undefined' ? window.location.origin : ''
                    const url = data.data.url || `${base}/l/${data.data.slug}`
                    setLinkCriado({ url, slug: data.data.slug, titulo: tituloParaLink })
                  } else {
                    window.location.href = `${linksPath}/editar/${data.data.id}`
                  }
                } else if (data?.success && data?.data?.url) {
                  window.location.href = `${linksPath}?created=1`
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
            <div className="rounded-2xl border-2 border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                <span aria-hidden>🎯</span> Criar diagnóstico agora
              </h2>
              <p className="text-sm font-medium text-sky-900 mb-2 flex items-center gap-1.5">
                <span aria-hidden>🧠</span> Sugestão do Noel
              </p>
              <p className="text-sm text-gray-700 mb-5">{ideiaDoDia.texto}</p>
              <button
                type="button"
                onClick={handleCriarDaIdeia}
                disabled={!!creatingId}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-8 py-4 text-base font-semibold text-white hover:bg-sky-700 disabled:opacity-60 transition-colors shadow-sm"
              >
                {creatingId === `ideia-${ideiaDoDia.tema}` ? 'Criando...' : 'Criar diagnóstico'}
              </button>
            </div>
          )
        })()}

        {/* Progressão guiada — primeiro cliente com o YLADA */}
        <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/90 to-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <span aria-hidden>🚀</span> Sua primeira conversa com cliente
          </h2>
          <p className="text-xs text-gray-600 mb-4">
            Siga os passos abaixo. Assim você entende na prática como usar a plataforma.
          </p>
          <ol className="space-y-3">
            <li className="flex items-center gap-3">
              {progressao.passo1 ? (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-medium" aria-hidden>✓</span>
              ) : (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400 text-sm" aria-hidden>1</span>
              )}
              <div className="min-w-0">
                <span className={`text-sm font-medium ${progressao.passo1 ? 'text-emerald-800' : 'text-gray-900'}`}>
                  Passo 1 — Criar seu primeiro diagnóstico
                </span>
                {progressao.passo1 && <span className="ml-2 text-xs text-emerald-600">Concluído</span>}
              </div>
            </li>
            <li className="flex items-center gap-3">
              {progressao.passo2 ? (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-medium" aria-hidden>✓</span>
              ) : (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400 text-sm" aria-hidden>2</span>
              )}
              <div className="min-w-0">
                <span className={`text-sm font-medium ${progressao.passo2 ? 'text-emerald-800' : 'text-gray-900'}`}>
                  Passo 2 — Compartilhar o link no Instagram ou WhatsApp
                </span>
                {progressao.passo2 && <span className="ml-2 text-xs text-emerald-600">Pronto para compartilhar</span>}
                {!progressao.passo2 && progressao.passo1 && (
                  <p className="text-xs text-gray-500 mt-0.5">Crie um diagnóstico acima e copie a URL para compartilhar.</p>
                )}
              </div>
            </li>
            <li className="flex items-center gap-3">
              {progressao.passo3 ? (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-medium" aria-hidden>✓</span>
              ) : (
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-gray-400 text-sm" aria-hidden>3</span>
              )}
              <div className="min-w-0">
                <span className={`text-sm font-medium ${progressao.passo3 ? 'text-emerald-800' : 'text-gray-900'}`}>
                  Passo 3 — Receber respostas e iniciar conversa
                </span>
                {progressao.passo3 && <span className="ml-2 text-xs text-emerald-600">Concluído</span>}
                {!progressao.passo3 && progressao.passo2 && (
                  <p className="text-xs text-gray-500 mt-0.5">Quem responder aparecerá em Leads. Responda e converta.</p>
                )}
              </div>
            </li>
          </ol>
          {progressao.passo1 && progressao.passo2 && progressao.passo3 && (
            <p className="mt-4 pt-3 border-t border-emerald-100 text-sm font-medium text-emerald-800">
              🎉 Parabéns! Você concluiu os primeiros passos. Continue criando diagnósticos e compartilhando.
            </p>
          )}
          {!progressao.passo1 && (
            <p className="mt-4 text-xs text-gray-600">
              Use o botão <strong>Criar diagnóstico</strong> acima ou escolha outro diagnóstico na lista abaixo.
            </p>
          )}
          {progressao.passo1 && (
            <p className="mt-3 text-xs text-gray-500">
              Parte do <strong>Método YLADA</strong>: Atrair → Filtrar → Conversar → Converter.
              {progressao.linksCount > 0 && (
                <Link href={`${prefix}/links`} className="ml-2 text-sky-600 hover:underline">
                  Ver meus links →
                </Link>
              )}
            </p>
          )}
        </div>

        {/* Destaque do segmento ativo */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-3">
          <span className="text-sm font-medium text-blue-900">
            Segmento ativo:{' '}
            <span className="font-semibold">
              {segmentoFiltro && BIBLIOTECA_SEGMENTOS.find((s) => s.value === segmentoFiltro)?.label
                ? BIBLIOTECA_SEGMENTOS.find((s) => s.value === segmentoFiltro)!.label
                : 'Todos'}
            </span>
          </span>
          <label className="flex items-center gap-1.5 text-sm text-blue-800 cursor-pointer">
            <span className="shrink-0">Alterar segmento ▼</span>
            <select
              value={segmentoFiltro}
              onChange={(e) => setSegmentoFiltro(e.target.value as BibliotecaSegmentCode | '')}
              className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
            {segmentoSugerido ? (
              <>
                <option value="">Todos</option>
                <option value={segmentoSugerido}>
                  {BIBLIOTECA_SEGMENTOS.find((s) => s.value === segmentoSugerido)?.label ?? segmentoSugerido} (seu perfil)
                </option>
              </>
            ) : (
              <>
                <option value="">Todos</option>
                {BIBLIOTECA_SEGMENTOS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </>
            )}
            </select>
          </label>
          <span className="text-xs text-blue-700/90 w-full sm:w-auto">
            {segmentoSugerido && segmentoFiltro === segmentoSugerido ? (
              <>
                Preparei diagnósticos que costumam funcionar bem para profissionais de{' '}
                <strong>{BIBLIOTECA_SEGMENTOS.find((s) => s.value === segmentoSugerido)?.label ?? segmentoSugerido}</strong>.
              </>
            ) : (
              'Esses itens foram selecionados para o seu tipo de negócio.'
            )}
          </span>
        </div>

        {/* Dica do Noel */}
        {segmentoSugerido && segmentoFiltro === segmentoSugerido && getDicaNoelBiblioteca(segmentoSugerido) && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3">
            <span className="text-lg shrink-0" aria-hidden>💡</span>
            <div>
              <p className="text-sm font-medium text-amber-900">Dica do Noel</p>
              <p className="text-sm text-amber-800 mt-0.5">{getDicaNoelBiblioteca(segmentoSugerido)}</p>
            </div>
          </div>
        )}

        {/* Diagnósticos mais usados / temas do segmento — efeito tendência */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
          <p className="text-xs font-semibold text-amber-900 mb-2 flex items-center gap-1.5">
            <span aria-hidden>📊</span>
            {segmentoFiltro
              ? `Temas para ${BIBLIOTECA_SEGMENTOS.find((s) => s.value === segmentoFiltro)?.label ?? segmentoFiltro}`
              : 'Diagnósticos mais usados'}
          </p>
          <div className="flex flex-wrap gap-2">
            {(segmentoFiltro
              ? getTemasParaBiblioteca(segmentoFiltro)
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

        <h2 className="text-lg font-semibold text-gray-900 pt-2 flex items-center gap-2">
          <span aria-hidden>📚</span> Outros diagnósticos disponíveis
        </h2>

        <div className="flex gap-1 p-1 rounded-xl bg-gray-100">
          {BIBLIOTECA_TIPOS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTipoAtivo(t.value)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tipoAtivo === t.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Situação</label>
            <select
              value={situacaoFiltro}
              onChange={(e) => setSituacaoFiltro((e.target.value || '') as '' | SituacaoBiblioteca)}
              className="block w-72 max-w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {BIBLIOTECA_SITUACOES_OPTIONS.map((o) => (
                <option key={o.value || 'todas'} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Tema</label>
            <select
              value={temaFiltro}
              onChange={(e) => setTemaFiltro(e.target.value)}
              className="block w-56 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              {getTemasParaBiblioteca(segmentoFiltro || undefined).map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-500 border-t-transparent mx-auto" />
            <p className="mt-4 text-sm text-gray-500">Carregando...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-8">
            {/* Sugestões para hoje — 3 recomendados com selos (camada 2) */}
            {itemsComecePorAqui.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span aria-hidden>💡</span> Sugestões para hoje
                </h2>
                <p className="text-sm text-gray-600 mb-4">3 diagnósticos recomendados para você.</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {itemsComecePorAqui.slice(0, 3).map((item, idx) => {
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

            {/* Lista principal por situação */}
            <section>
              {situacaoFiltro === '' ? (
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
                        <h2 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
                          <span aria-hidden>{icon}</span> {situacao.label}
                        </h2>
                        <p className="text-xs text-gray-500 mb-3">{situacao.description}</p>
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
              ) : (
                <>
                  <h2 className="text-sm font-semibold text-gray-800 mb-3">
                    {BIBLIOTECA_SITUACOES.find((s) => s.value === situacaoFiltro)?.label ?? situacaoFiltro}
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">
                    {BIBLIOTECA_SITUACOES.find((s) => s.value === situacaoFiltro)?.description}
                  </p>
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
            {segmentoFiltro ? (
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
                  Filtros: {tipoAtivo} | {segmentoFiltro || 'todos'} | {temaFiltro ? getTemaLabel(temaFiltro) : 'todos'}
                </p>
              </>
            )}
          </div>
        )}

        {/* Camada 4: Diagnósticos do profissional */}
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
                      onClick={() => setDivulgarMeuLink(link)}
                      className="rounded px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      Divulgar
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

        {divulgarMeuLink && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" aria-modal="true" role="dialog" onClick={() => setDivulgarMeuLink(null)}>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Divulgar</h3>
              <p className="text-xs text-gray-600 mb-4">{divulgarMeuLink.title || divulgarMeuLink.slug}</p>
              <CompartilharDiagnosticoContent
                titulo={divulgarMeuLink.title || divulgarMeuLink.slug || 'Diagnóstico'}
                url={divulgarMeuLink.url}
                nomeProfissional={userProfile?.nome_completo ?? 'Profissional'}
                contador={divulgarMeuLink.stats?.diagnosis_count}
              />
              <button type="button" onClick={() => setDivulgarMeuLink(null)} className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700">
                Fechar
              </button>
            </div>
          </div>
        )}

        {linkCriado && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Link criado!</h3>
              <p className="text-sm text-gray-600">{linkCriado.titulo}</p>
              <div className="flex flex-col gap-3">
                <a
                  href={linkCriado.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-100 text-sky-700 font-medium hover:bg-sky-200 transition-colors"
                >
                  <span>👁</span> Ver preview
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(linkCriado!.url)
                    setCopiado(true)
                    setTimeout(() => setCopiado(false), 2000)
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  {copiado ? '✓ Copiado!' : '📋 Copiar URL'}
                </button>
                <a
                  href={linksPath}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                >
                  Ir para meus links
                </a>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <CompartilharDiagnosticoContent
                  titulo={linkCriado.titulo}
                  url={linkCriado.url}
                  nomeProfissional={userProfile?.nome_completo ?? 'Profissional'}
                />
              </div>
              <button
                type="button"
                onClick={() => setLinkCriado(null)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </YladaAreaShell>
  )
}
