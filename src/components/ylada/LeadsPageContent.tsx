'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import YladaAreaShell from './YladaAreaShell'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'

type MetricRow = {
  id: string
  link_id: string
  link_slug: string | null
  link_title: string | null
  architecture: string
  main_blocker: string
  theme: string | null
  perfume_usage: string | null
  clicked_whatsapp: boolean
  clicked_at: string | null
  created_at: string
}

type FunnelData = {
  views: number
  completes: number
  clicks: number
}

/** Labels de "uso do perfume" — só exibidos no segmento perfumaria. */
const PERFUME_USAGE_LABELS: Record<string, string> = {
  dia_a_dia: 'Dia a dia',
  trabalho: 'Trabalho',
  encontros: 'Encontros',
  eventos: 'Eventos',
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function formatRelativeDate(iso: string): string {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`
    return formatDate(iso)
  } catch {
    return iso
  }
}

/** Monta a URL do Noel com contexto do lead pré-carregado. */
function buildNoelUrl(prefix: string, m: MetricRow): string {
  const params = new URLSearchParams({ chat: '1' })
  if (m.link_title || m.link_slug) params.set('lead_diag', m.link_title || m.link_slug || '')
  if (m.main_blocker) params.set('lead_perfil', m.main_blocker)
  return `${prefix}/home?${params.toString()}`
}

/** Taxa de conversão arredondada, 0 se denominador = 0. */
function convRate(num: number, den: number): number {
  return den > 0 ? Math.round((num / den) * 100) : 0
}

interface LeadsPageContentProps {
  areaCodigo: string
  areaLabel: string
  noAreaShell?: boolean
}

type StatusFilter = '' | 'quente' | 'aguardando'

export default function LeadsPageContent({ areaCodigo, areaLabel, noAreaShell }: LeadsPageContentProps) {
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const linksPath = `${prefix}/links`
  const isPerfumaria = areaCodigo === 'perfumaria'
  const [metrics, setMetrics] = useState<MetricRow[]>([])
  const [funnel, setFunnel] = useState<FunnelData>({ views: 0, completes: 0, clicks: 0 })
  const [loading, setLoading] = useState(true)
  const [filterLinkId, setFilterLinkId] = useState<string>('')
  const [filterPerfumeUsage, setFilterPerfumeUsage] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('')
  const [links, setLinks] = useState<Array<{ id: string; slug: string; title: string | null }>>([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const params: Record<string, string> = {}
        if (filterLinkId) params.link_id = filterLinkId
        if (isPerfumaria && filterPerfumeUsage) params.perfume_usage = filterPerfumeUsage
        const [linksRes, metricsRes] = await Promise.all([
          fetch('/api/ylada/links', { credentials: 'include' }),
          fetch(
            `/api/ylada/links/metrics?${new URLSearchParams(params).toString()}`,
            { credentials: 'include' }
          ),
        ])
        const linksJson = await linksRes.json()
        const metricsJson = await metricsRes.json()
        if (linksJson?.success && Array.isArray(linksJson.data)) {
          setLinks(linksJson.data.map((l: { id: string; slug: string; title: string | null }) => ({ id: l.id, slug: l.slug, title: l.title })))
        }
        if (metricsJson?.success && Array.isArray(metricsJson.data)) {
          setMetrics(metricsJson.data)
        }
        if (metricsJson?.funnel) {
          setFunnel(metricsJson.funnel as FunnelData)
        }
      } catch (e) {
        console.error('[leads]', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filterLinkId, isPerfumaria, filterPerfumeUsage])

  // Filtro de status aplicado no cliente (sem round-trip extra)
  const filteredMetrics = metrics.filter((m) => {
    if (filterStatus === 'quente') return m.clicked_whatsapp
    if (filterStatus === 'aguardando') return !m.clicked_whatsapp
    return true
  })

  const awaiting = funnel.completes - funnel.clicks
  const rateViewToComplete = convRate(funnel.completes, funnel.views)
  const rateCompleteToClick = convRate(funnel.clicks, funnel.completes)

  const hasSomeData = funnel.views > 0 || metrics.length > 0

  const core = (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Leads dos seus diagnósticos</h1>
      <p className="text-gray-600 text-sm mb-6">
        Pessoas que responderam seus diagnósticos. Quem clicou no botão de WhatsApp já iniciou contato — são seus leads quentes.
      </p>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Diagnóstico</label>
          <select
            value={filterLinkId}
            onChange={(e) => setFilterLinkId(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Todos os diagnósticos</option>
            {links.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title || l.slug}
              </option>
            ))}
          </select>
        </div>
        {isPerfumaria && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Uso do perfume</label>
            <select
              value={filterPerfumeUsage}
              onChange={(e) => setFilterPerfumeUsage(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              {Object.entries(PERFUME_USAGE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : !hasSomeData ? (
        <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Ainda não há leads</h2>
          <p className="text-gray-700 text-sm mb-4">
            Quando alguém responde seu diagnóstico, a pessoa aparece aqui para você iniciar uma conversa.
          </p>
          <p className="text-sm font-medium text-gray-800 mb-2">Para começar:</p>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1.5 mb-6">
            <li>Crie um diagnóstico</li>
            <li>Compartilhe o link</li>
            <li>Receba respostas e converse</li>
          </ol>
          <div className="flex flex-wrap gap-3">
            <Link
              href={linksPath}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
            >
              🧪 Criar diagnóstico
            </Link>
            <Link
              href={linksPath}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sky-300 bg-white text-sky-700 text-sm font-medium hover:bg-sky-50 transition-colors"
            >
              🔗 Ver diagnósticos para compartilhar
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Funil — 4 cards clicáveis */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {/* Card 1: Abriram — informativo, não filtra */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="text-xl mb-2">👁️</div>
              <div className="text-2xl font-bold text-gray-900">{funnel.views}</div>
              <div className="text-xs font-medium text-gray-500 mt-1">Abriram o link</div>
              <div className="text-xs text-gray-400 mt-1">Topo do funil</div>
            </div>

            {/* Card 2: Responderam — filtra para "Todos" */}
            <button
              type="button"
              onClick={() => setFilterStatus('')}
              className={`rounded-xl border p-4 text-left transition-all ${
                filterStatus === ''
                  ? 'border-sky-400 bg-sky-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-sky-200 hover:bg-sky-50/40'
              }`}
            >
              <div className="text-xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-900">{funnel.completes}</div>
              <div className="text-xs font-medium text-gray-500 mt-1">Responderam</div>
              {funnel.views > 0 && (
                <div className="text-xs text-sky-600 font-medium mt-1">{rateViewToComplete}% de quem abriu</div>
              )}
            </button>

            {/* Card 3: Aguardando — filtra por "aguardando" */}
            <button
              type="button"
              onClick={() => setFilterStatus('aguardando')}
              className={`rounded-xl border p-4 text-left transition-all ${
                filterStatus === 'aguardando'
                  ? 'border-amber-400 bg-amber-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-amber-200 hover:bg-amber-50/40'
              }`}
            >
              <div className="text-xl mb-2">👀</div>
              <div className="text-2xl font-bold text-gray-900">{awaiting}</div>
              <div className="text-xs font-medium text-gray-500 mt-1">Aguardando</div>
              <div className="text-xs text-gray-400 mt-1">Não clicou no WhatsApp</div>
            </button>

            {/* Card 4: Clicaram — filtra por "quente" */}
            <button
              type="button"
              onClick={() => setFilterStatus('quente')}
              className={`rounded-xl border p-4 text-left transition-all ${
                filterStatus === 'quente'
                  ? 'border-green-400 bg-green-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-green-200 hover:bg-green-50/40'
              }`}
            >
              <div className="text-xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-gray-900">{funnel.clicks}</div>
              <div className="text-xs font-medium text-gray-500 mt-1">Clicaram no WhatsApp</div>
              {funnel.completes > 0 && (
                <div className="text-xs text-green-600 font-medium mt-1">{rateCompleteToClick}% dos que responderam</div>
              )}
            </button>
          </div>

          {filteredMetrics.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              {metrics.length === 0
                ? 'Ainda não há diagnósticos respondidos.'
                : 'Nenhum lead neste filtro.'}
            </p>
          ) : (
            <>
              {/* Desktop: tabela */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnóstico</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMetrics.map((m) => (
                      <tr key={m.id} className={`hover:bg-gray-50 ${m.clicked_whatsapp ? 'bg-green-50/40' : ''}`}>
                        <td className="px-4 py-3 text-sm">
                          {m.clicked_whatsapp ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              🔥 Iniciou contato
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                              👀 Viu o resultado
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <a href={`/l/${m.link_slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {m.link_title || m.link_slug}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{m.main_blocker}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatRelativeDate(m.created_at)}</td>
                        <td className="px-4 py-3">
                          <Link
                            href={buildNoelUrl(prefix, m)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
                          >
                            💬 Conversar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: cartões */}
              <div className="md:hidden space-y-3">
                {filteredMetrics.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-xl border bg-white p-4 shadow-sm ${
                      m.clicked_whatsapp ? 'border-green-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {m.clicked_whatsapp ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          🔥 Iniciou contato
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                          👀 Viu o resultado
                        </span>
                      )}
                      <span className="text-gray-500 text-xs">{formatRelativeDate(m.created_at)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="text-gray-500">Diagnóstico:</span>{' '}
                      {m.link_title || m.link_slug}
                    </p>
                    <p className="text-gray-800 text-sm font-medium mb-3">
                      {m.main_blocker}
                    </p>
                    <Link
                      href={buildNoelUrl(prefix, m)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors w-full justify-center"
                    >
                      💬 Conversar
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )

  if (noAreaShell) return core
  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      {core}
    </YladaAreaShell>
  )
}
