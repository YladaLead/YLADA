'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface BehavioralData {
  events: { event_type: string; count: number }[]
  eventsTotal: number
  answersTotal: number
  period: { from: string; to: string }
  truncated: boolean
  error?: string
}

function formatDayInput(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

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

const EVENT_LABELS: Record<string, string> = {
  user_created: 'Conta criada',
  diagnosis_created: 'Diagnóstico criado',
  diagnosis_answered: 'Diagnóstico respondido',
  noel_analysis_used: 'Análise Noel usada',
  diagnosis_shared: 'Diagnóstico compartilhado',
  lead_contact_clicked: 'Clique no WhatsApp',
  upgrade_to_pro: 'Upgrade para Pro',
  funnel_landing_pt_view: '[Funil] Landing /pt',
  funnel_landing_cta_segmentos: '[Funil] CTA Comece agora',
  funnel_segmentos_view: '[Funil] Hub segmentos',
  funnel_cadastro_view: '[Funil] Página cadastro',
  funnel_cadastro_area_selected: '[Funil] Área escolhida',
  funnel_hub_segmento_clicado: '[Funil] Clique segmento (hub)',
  funnel_entrada_nicho: '[Funil] Nicho na entrada matriz',
  freemium_limit_hit: '[Freemium] Limite atingido (servidor)',
  freemium_paywall_view: '[Freemium] Viu paywall / upgrade',
  freemium_upgrade_cta_click: '[Freemium] Clique em assinar Pro',
}

function AdminBehavioralDataContent() {
  const defaultTo = useMemo(() => new Date(), [])
  const defaultFrom = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    return d
  }, [])

  const [dateFrom, setDateFrom] = useState(() => formatDayInput(defaultFrom))
  const [dateTo, setDateTo] = useState(() => formatDayInput(defaultTo))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<BehavioralData | null>(null)

  const monthPickerValue = useMemo(() => {
    if (!dateFrom || !/^\d{4}-\d{2}-\d{2}$/.test(dateFrom)) return ''
    return dateFrom.slice(0, 7)
  }, [dateFrom])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = new URLSearchParams()
      params.set('date_from', dateFrom)
      params.set('date_to', dateTo)
      const res = await fetch(`/api/admin/ylada/behavioral-data?${params.toString()}`, {
        credentials: 'include',
      })
      const json = await res.json()
      if (json.success && json.data) {
        setData(json.data as BehavioralData)
      } else {
        setError(json.error || 'Erro ao carregar')
      }
    } catch (e) {
      setError('Erro ao carregar. Tente novamente.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [dateFrom, dateTo])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
                ← Voltar ao painel
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Dados comportamentais (operacional)</h1>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Eventos por tipo e respostas gravadas <strong>no período abaixo</strong> (funil público, freemium,
                Noel, etc.). O funil detalhado com segmento/nicho está em{' '}
                <Link href="/admin/tracking" className="text-cyan-700 font-medium hover:underline">
                  Funil visitante (Tracking)
                </Link>
                . Para intenção e WhatsApp, use <strong>Valuation</strong>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link
                href="/admin/tracking"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700"
              >
                Funil visitante →
              </Link>
              <Link
                href="/admin/ylada/valuation"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-white hover:bg-slate-900"
              >
                Valuation →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Período</h2>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center mb-4 pb-4 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500 shrink-0">Rápido:</span>
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
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
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
            <button
              type="button"
              onClick={() => load()}
              className="min-h-[44px] px-5 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700"
            >
              Atualizar
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Contagem por <code className="bg-gray-100 px-1 rounded">created_at</code> dos registros. Padrão ao
            abrir: últimos 7 dias.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12 text-gray-500">Carregando…</div>
        )}

        {!loading && data && (
          <div className="space-y-6">
            {data.truncated && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-sm">
                Muitos eventos no período — a lista foi limitada para agregação. Reduza o intervalo se precisar de
                totais exatos.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500">Total de eventos (no período)</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.eventsTotal.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-gray-400 mt-1">Inclui funil, freemium, Noel, diagnóstico, etc.</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500">Respostas gravadas (no período)</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.answersTotal.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Linhas em ylada_diagnosis_answers — análise fina em Valuation
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Eventos por tipo</h2>
              <p className="text-xs text-gray-500 mb-4">
                Intervalo:{' '}
                {new Date(data.period.from).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} —{' '}
                {new Date(data.period.to).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
              </p>
              {data.events.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhum evento neste período.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-700">Evento</th>
                        <th className="text-right py-2 font-medium text-gray-700">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.events
                        .sort((a, b) => b.count - a.count)
                        .map((e) => (
                          <tr key={e.event_type} className="border-b border-gray-100">
                            <td className="py-2">{EVENT_LABELS[e.event_type] || e.event_type}</td>
                            <td className="text-right py-2">{e.count.toLocaleString('pt-BR')}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-700 mb-2">Documentação</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <code className="bg-gray-200 px-1 rounded">docs/ARQUITETURA-DADOS-COMPORTAMENTAIS-YLADA.md</code></li>
                <li>• <code className="bg-gray-200 px-1 rounded">docs/DADOS-INTENCAO-YLADA.md</code> — contexto de intenção</li>
                <li>• <code className="bg-gray-200 px-1 rounded">docs/PLANO-IMPLANTACAO-VALUATION-DADOS-INTENCAO.md</code></li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function AdminBehavioralDataPage() {
  return (
    <AdminProtectedRoute>
      <AdminBehavioralDataContent />
    </AdminProtectedRoute>
  )
}
