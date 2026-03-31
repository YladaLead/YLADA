'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import { FUNNEL_EVENT_TYPES } from '@/lib/funnel-tracking-aggregate'

/** Nomes amigáveis para o filtro e tabelas (ids = payload.area / perfil). */
const SEGMENTO_LABEL: Record<string, string> = {
  nutri: 'Nutrição',
  coach: 'Coach',
  med: 'Médicos',
  estetica: 'Estética',
  fitness: 'Fitness',
  perfumaria: 'Perfumaria',
  nutra: 'Nutra',
  seller: 'Vendas',
  psi: 'Psicologia',
  psicanalise: 'Psicanálise',
  odonto: 'Odontologia',
  'profissional-liberal': 'Outro / liberal',
}

const FUNNEL_LABELS: Record<string, string> = {
  funnel_landing_pt_view: '1. Visualizou página inicial /pt',
  funnel_landing_cta_segmentos: '2. Clicou em “Comece agora”',
  funnel_segmentos_view: '3. Abriu lista de segmentos',
  funnel_hub_segmento_clicado: '4. Clicou num segmento (hub)',
  funnel_entrada_nicho: '5. Escolheu nicho (entrada matriz)',
  funnel_cadastro_view: '6. Abriu página de cadastro',
  funnel_cadastro_area_selected: '7. Escolheu área no cadastro',
  user_created: '8. Conta criada',
}

interface FunnelApiData {
  totals: Record<string, number>
  bySegment: Record<string, Partial<Record<string, number>>>
  nichoBySegment: Record<string, Record<string, number>>
  conversionCadastroContaPct: number | null
  conversionLabel: string
  rowCount: number
  filteredRowCount: number
  period: { from: string; to: string }
  filtersApplied: { segment: string | null; nicho: string | null }
  truncated: boolean
}

function formatDayInput(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** yyyy-MM → primeiro e último dia do mês (calendário local). */
function monthRangeToDayInputs(ym: string): { from: string; to: string } | null {
  if (!ym || !/^\d{4}-\d{2}$/.test(ym)) return null
  const [yStr, mStr] = ym.split('-')
  const y = Number(yStr)
  const m = Number(mStr)
  if (!y || m < 1 || m > 12) return null
  const from = new Date(y, m - 1, 1)
  const to = new Date(y, m, 0)
  return { from: formatDayInput(from), to: formatDayInput(to) }
}

function setLastNDays(n: number): { from: string; to: string } {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - n)
  return { from: formatDayInput(from), to: formatDayInput(to) }
}

function AdminTrackingContent() {
  const defaultTo = useMemo(() => new Date(), [])
  const defaultFrom = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    return d
  }, [])

  const [dateFrom, setDateFrom] = useState(() => formatDayInput(defaultFrom))
  const [dateTo, setDateTo] = useState(() => formatDayInput(defaultTo))
  const [segment, setSegment] = useState<string>('')
  const [nicho, setNicho] = useState<string>('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<FunnelApiData | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      params.set('date_from', dateFrom)
      params.set('date_to', dateTo)
      if (segment) params.set('segment', segment)
      if (nicho.trim()) params.set('nicho', nicho.trim())
      const res = await fetch(`/api/admin/ylada/funnel-tracking?${params.toString()}`, {
        credentials: 'include',
      })
      const json = await res.json()
      if (json.success && json.data) {
        setData(json.data as FunnelApiData)
      } else {
        setError(json.error || 'Erro ao carregar')
      }
    } catch (e) {
      setError('Erro ao carregar. Tente novamente.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [dateFrom, dateTo, segment, nicho])

  useEffect(() => {
    load()
  }, [load])

  const order = useMemo(() => FUNNEL_EVENT_TYPES.filter((k) => FUNNEL_LABELS[k]), [])

  const segmentKeysSorted = useMemo(() => {
    if (!data?.bySegment) return []
    return Object.keys(data.bySegment).sort((a, b) =>
      (SEGMENTO_LABEL[a] || a).localeCompare(SEGMENTO_LABEL[b] || b, 'pt')
    )
  }, [data?.bySegment])

  /** Nichos com evento no período atual, para o segmento escolhido (mesma fonte da tabela abaixo). */
  const nichoOptions = useMemo(() => {
    if (!segment || !data?.nichoBySegment?.[segment]) return []
    return Object.keys(data.nichoBySegment[segment]).sort((a, b) => a.localeCompare(b, 'pt'))
  }, [segment, data?.nichoBySegment])

  const monthPickerValue = useMemo(() => {
    if (!dateFrom || !/^\d{4}-\d{2}-\d{2}$/.test(dateFrom)) return ''
    return dateFrom.slice(0, 7)
  }, [dateFrom])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← Voltar ao painel
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Funil visitante (Tracking)</h1>
          <p className="text-sm text-gray-600 mt-1 max-w-3xl">
            Veja <strong>quantas pessoas</strong> passam por cada etapa, com <strong>filtro por data</strong>,{' '}
            <strong>segmento</strong> (área) e <strong>nicho</strong> quando já existir dado. Os números da
            página inicial são gerais; a partir do clique no segmento e da escolha de nicho dá para enxergar por
            público. Aplique as migrations <code className="bg-gray-100 px-1 rounded text-xs">288</code> e{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">289</code> no banco se algo falhar ao gravar.
          </p>
          <p className="text-sm mt-2">
            <Link href="/admin/inteligencia-ylada" className="text-indigo-700 font-medium hover:underline">
              → Ver visão executiva (Inteligência YLADA)
            </Link>
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Filtros</h2>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center mb-4 pb-4 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500 shrink-0">Período rápido:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const { from, to } = setLastNDays(7)
                  setDateFrom(from)
                  setDateTo(to)
                }}
                className="min-h-[40px] px-3 rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-900 text-sm font-medium hover:bg-cyan-100"
              >
                Últimos 7 dias
              </button>
              <button
                type="button"
                onClick={() => {
                  const { from, to } = setLastNDays(30)
                  setDateFrom(from)
                  setDateTo(to)
                }}
                className="min-h-[40px] px-3 rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-900 text-sm font-medium hover:bg-cyan-100"
              >
                Últimos 30 dias
              </button>
            </div>
            <label className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-gray-600">Por mês</span>
              <input
                type="month"
                value={monthPickerValue}
                onChange={(e) => {
                  const r = monthRangeToDayInputs(e.target.value)
                  if (r) {
                    setDateFrom(r.from)
                    setDateTo(r.to)
                  }
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 min-h-[40px] bg-white"
              />
            </label>
          </div>

          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4 items-end">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">Data inicial</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 min-h-[44px]"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">Data final</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 min-h-[44px]"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm min-w-[200px]">
              <span className="text-gray-600">Segmento (área)</span>
              <select
                value={segment}
                onChange={(e) => {
                  setSegment(e.target.value)
                  setNicho('')
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 min-h-[44px] bg-white"
              >
                <option value="">Todos</option>
                {Object.entries(SEGMENTO_LABEL).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm min-w-[200px]">
              <span className="text-gray-600">Nicho</span>
              <select
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                disabled={!segment}
                className="border border-gray-300 rounded-lg px-3 py-2 min-h-[44px] bg-white disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">{segment ? 'Todos os nichos deste segmento' : 'Escolha um segmento primeiro'}</option>
                {nicho &&
                  !nichoOptions.includes(nicho) && (
                    <option value={nicho}>
                      {nicho} (mantido — sem evento neste período)
                    </option>
                  )}
                {nichoOptions.map((slug) => (
                  <option key={slug} value={slug}>
                    {slug}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => load()}
              className="min-h-[44px] px-5 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700"
            >
              Atualizar
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Os nichos listados vêm dos eventos do período (mesma base da tabela “Nichos na entrada matriz”). Clique
            em <strong>Atualizar</strong> após mudar datas para recarregar a lista. Com segmento ou nicho, a tabela
            de totais só conta linhas que trazem esse dado no registro (etapas sem segmento somem do filtro — é
            normal).
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}

        {loading && (
          <div className="text-center py-12 text-gray-500">Carregando…</div>
        )}

        {!loading && data && (
          <>
            {data.truncated && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm">
                Muitos eventos no período — a leitura foi limitada. Enxugue o intervalo de datas se precisar de
                precisão total.
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Totais (com filtros acima)</h2>
              <p className="text-xs text-gray-500 mb-4">
                Registros no período: {data.rowCount.toLocaleString('pt-BR')} · Após filtro:{' '}
                {data.filteredRowCount.toLocaleString('pt-BR')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-lg bg-cyan-50 border border-cyan-100 p-4">
                  <p className="text-sm text-cyan-900">{data.conversionLabel}</p>
                  <p className="text-3xl font-bold text-cyan-950 mt-1">
                    {data.conversionCadastroContaPct != null
                      ? `${data.conversionCadastroContaPct.toLocaleString('pt-BR')}%`
                      : '—'}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-700">Etapa</th>
                      <th className="text-right py-2 font-medium text-gray-700">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.map((key) => (
                      <tr key={key} className="border-b border-gray-100">
                        <td className="py-2 pr-4">{FUNNEL_LABELS[key] || key}</td>
                        <td className="text-right py-2">{(data.totals[key] ?? 0).toLocaleString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 overflow-x-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Por segmento (todo o período, sem filtro de segmento/nicho)</h2>
              <p className="text-sm text-gray-600 mb-4">
                Útil para ver onde está a demanda (cliques no hub, nicho, cadastro) por área. Colunas principais:
                clique no hub, nicho na entrada, escolha no cadastro, conta criada.
              </p>
              {segmentKeysSorted.length === 0 ? (
                <p className="text-gray-500 text-sm">Ainda não há eventos com segmento neste intervalo.</p>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-700">Segmento</th>
                      <th className="text-right py-2 font-medium text-gray-700">Clicou (hub)</th>
                      <th className="text-right py-2 font-medium text-gray-700">Nicho (entrada)</th>
                      <th className="text-right py-2 font-medium text-gray-700">Área no cadastro</th>
                      <th className="text-right py-2 font-medium text-gray-700">Conta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segmentKeysSorted.map((seg) => {
                      const b = data.bySegment[seg] ?? {}
                      return (
                        <tr key={seg} className="border-b border-gray-100">
                          <td className="py-2 pr-4 font-medium text-gray-900">
                            {SEGMENTO_LABEL[seg] || seg}
                          </td>
                          <td className="text-right py-2">
                            {(b.funnel_hub_segmento_clicado ?? 0).toLocaleString('pt-BR')}
                          </td>
                          <td className="text-right py-2">
                            {(b.funnel_entrada_nicho ?? 0).toLocaleString('pt-BR')}
                          </td>
                          <td className="text-right py-2">
                            {(b.funnel_cadastro_area_selected ?? 0).toLocaleString('pt-BR')}
                          </td>
                          <td className="text-right py-2">{(b.user_created ?? 0).toLocaleString('pt-BR')}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 overflow-x-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Nichos na entrada matriz (por segmento)</h2>
              <p className="text-sm text-gray-600 mb-4">
                Só preenche para áreas que usam a tela <code className="bg-gray-100 px-1 rounded">/pt/entrada/…</code> com
                lista de nichos.
              </p>
              {Object.keys(data.nichoBySegment).length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhum evento de nicho ainda neste período.</p>
              ) : (
                <div className="space-y-6">
                  {Object.keys(data.nichoBySegment)
                    .sort((a, b) => (SEGMENTO_LABEL[a] || a).localeCompare(SEGMENTO_LABEL[b] || b, 'pt'))
                    .map((seg) => (
                      <div key={seg}>
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">
                          {SEGMENTO_LABEL[seg] || seg}
                        </h3>
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2">Nicho (slug)</th>
                              <th className="text-right py-2">Pessoas</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(data.nichoBySegment[seg])
                              .sort((x, y) => y[1] - x[1])
                              .map(([nic, count]) => (
                                <tr key={nic} className="border-b border-gray-50">
                                  <td className="py-1.5">{nic}</td>
                                  <td className="text-right py-1.5">{count.toLocaleString('pt-BR')}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600 bg-gray-100 rounded-lg p-4">
              <strong className="text-gray-800">Como usar isso para valuation e operação:</strong> compare segmentos
              com mais cliques no hub mas poucas contas (foco em mensagem ou fluxo); compare nichos com volume para
              priorizar conteúdo e oferta; use o filtro de datas em campanhas para ver antes/depois.
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default function AdminTrackingPage() {
  return (
    <AdminProtectedRoute>
      <AdminTrackingContent />
    </AdminProtectedRoute>
  )
}
