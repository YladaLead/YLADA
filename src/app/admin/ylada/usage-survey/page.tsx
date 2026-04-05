'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import {
  USAGE_SURVEY_PROFILE_LABELS,
  formatUsageSurveyObjective,
  type UsageSurveyActionItem,
} from '@/lib/ylada-usage-survey-labels'

type Row = {
  id: string
  created_at: string
  profile: string
  answers: Record<string, unknown>
}

type Stats = {
  totalInDb: number
  profileCountsGlobal: Record<string, number>
  aggregationSampleSize: number
  objectiveTop: Array<{ key: string; count: number; pct: number }>
  blockerTop: Array<{ key: string; count: number; pct: number }>
}

function truncCell(s: unknown, max: number): string {
  if (s === null || s === undefined) return '—'
  const t = String(s).replace(/\s+/g, ' ').trim()
  if (!t) return '—'
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`
}

function boolPt(v: unknown): string {
  if (v === true) return 'Sim'
  if (v === false) return 'Não'
  return '—'
}

function downloadCsv(rows: Row[], filename: string) {
  const headers = [
    'id',
    'data_hora',
    'perfil_codigo',
    'perfil_nome',
    'objetivo',
    'objetivo_outro',
    'criou_diagnostico',
    'compartilhou_link',
    'alguem_chamou',
    'trava',
    'expectativa',
    'dor_principal',
  ]
  const lines = [headers.join(';')]
  for (const r of rows) {
    const a = r.answers || {}
    const cols = [
      r.id,
      r.created_at,
      r.profile,
      USAGE_SURVEY_PROFILE_LABELS[r.profile] || r.profile,
      String(a.objective ?? ''),
      String(a.objective_other ?? ''),
      boolPt(a.created_diagnosis),
      boolPt(a.shared_link),
      boolPt(a.got_message),
      String(a.blocker ?? '').replace(/"/g, '""'),
      String(a.expectation ?? '').replace(/"/g, '""'),
      String(a.pain ?? '').replace(/"/g, '""'),
    ].map((c) => `"${String(c).replace(/"/g, '""')}"`)
    lines.push(cols.join(';'))
  }
  const bom = '\uFEFF'
  const blob = new Blob([bom + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminYladaUsageSurveyPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState<Stats | null>(null)
  const [insights, setInsights] = useState<string[]>([])
  const [recommendedActions, setRecommendedActions] = useState<UsageSurveyActionItem[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/ylada/usage-survey?limit=500', { credentials: 'include' })
      const json = await res.json()
      if (json.success) {
        setRows(json.data ?? [])
        setTotal(json.total ?? 0)
        setStats(json.stats ?? null)
        setInsights(Array.isArray(json.insights) ? json.insights : [])
        setRecommendedActions(
          Array.isArray(json.recommendedActions) ? json.recommendedActions : []
        )
      } else {
        setError(json.error || 'Erro ao carregar')
      }
    } catch {
      setError('Erro de rede')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const profileEntries = useMemo(() => {
    if (!stats) return []
    const order = ['1', '2', '3', '4'] as const
    const counts = order.map((k) => stats.profileCountsGlobal[k] ?? 0)
    const max = Math.max(1, ...counts)
    return order.map((k) => ({
      key: k,
      count: stats.profileCountsGlobal[k] ?? 0,
      label: USAGE_SURVEY_PROFILE_LABELS[k] ?? k,
      pctBar: Math.round(((stats.profileCountsGlobal[k] ?? 0) / max) * 100),
      pctTotal:
        stats.totalInDb > 0
          ? Math.round(((stats.profileCountsGlobal[k] ?? 0) / stats.totalInDb) * 100)
          : 0,
    }))
  }, [stats])

  const csvFilename = useMemo(() => {
    const d = new Date().toISOString().slice(0, 10)
    return `ylada-pesquisa-uso-${d}.csv`
  }, [])

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800">
              ← Painel admin
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Pesquisa de uso YLADA</h1>
            <p className="text-sm text-gray-600 mt-1 max-w-3xl">
              Respostas anônimas de{' '}
              <code className="text-xs bg-gray-100 px-1 rounded">/pt/pesquisa-uso-ylada</code>. Tabela Supabase:{' '}
              <code className="text-xs bg-gray-100 px-1 rounded">ylada_usage_survey_responses</code>.
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={load}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Atualizar
            </button>
            <button
              type="button"
              onClick={() => downloadCsv(rows, csvFilename)}
              disabled={rows.length === 0}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
            >
              Baixar CSV (esta página, até 500)
            </button>
            <span className="text-sm text-gray-600">
              Total no banco: <strong>{stats?.totalInDb ?? total}</strong>
              {rows.length < (stats?.totalInDb ?? 0) && (
                <> · Exibindo linhas: <strong>{rows.length}</strong> (export CSV = só estas)</>
              )}
            </span>
          </div>

          {loading && <p className="text-gray-500">Carregando…</p>}
          {error && <p className="text-red-600 text-sm rounded-lg bg-red-50 border border-red-100 p-3">{error}</p>}

          {!loading && !error && stats && stats.totalInDb === 0 && (
            <p className="text-gray-600">Nenhuma resposta ainda, ou rode a migration 296.</p>
          )}

          {stats && stats.totalInDb > 0 && (
            <>
              <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm">
                <h2 className="text-sm font-bold text-violet-900 uppercase tracking-wide mb-3">
                  O que os dados sugerem (automático)
                </h2>
                <ul className="space-y-2 text-sm text-gray-800 leading-relaxed">
                  {insights.map((line, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-violet-600 shrink-0">→</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-gray-500">
                  Objetivos e travas: baseado nas <strong>{stats.aggregationSampleSize}</strong> respostas mais
                  recentes. Perfis: contagem exata em todo o banco.
                </p>
              </section>

              {recommendedActions.length > 0 && (
                <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 to-white p-5 shadow-sm">
                  <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-wide mb-1">
                    Ações sugeridas (priorização)
                  </h2>
                  <p className="text-xs text-emerald-800/80 mb-4">
                    Ideias automáticas a partir dos perfis, objetivos e travas — ajuste ao contexto do time antes de
                    executar.
                  </p>
                  <ul className="space-y-4">
                    {recommendedActions.map((item, i) => (
                      <li
                        key={`${item.title}-${i}`}
                        className="rounded-xl border border-emerald-100 bg-white/80 p-4 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 ${
                              item.priority === 'alta'
                                ? 'bg-red-100 text-red-800'
                                : item.priority === 'media'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {item.priority === 'alta'
                              ? 'Prioridade alta'
                              : item.priority === 'media'
                                ? 'Prioridade média'
                                : 'Prioridade baixa'}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{item.basis}</p>
                        <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-800 leading-relaxed">
                          {item.steps.map((step, j) => (
                            <li key={j}>{step}</li>
                          ))}
                        </ol>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Distribuição por perfil (funil)</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {profileEntries.map((p) => (
                    <div
                      key={p.key}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <p className="text-xs font-semibold text-sky-800">Perfil {p.key}</p>
                      <p className="text-sm text-gray-700 mt-1 leading-snug min-h-[2.5rem]">{p.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{p.count}</p>
                      <p className="text-xs text-gray-500">{p.pctTotal}% do total</p>
                      <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sky-500 transition-all"
                          style={{ width: `${p.pctBar}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-xl border border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Top objetivos (amostra recente)</h3>
                  <ul className="text-sm space-y-1.5">
                    {stats.objectiveTop.length === 0 && <li className="text-gray-500">—</li>}
                    {stats.objectiveTop.map((o) => (
                      <li key={o.key} className="flex justify-between gap-2 border-b border-gray-50 pb-1">
                        <span className="text-gray-800">{formatUsageSurveyObjective(o.key)}</span>
                        <span className="shrink-0 text-gray-600 tabular-nums">
                          {o.count} ({o.pct}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
                <section className="rounded-xl border border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Top travas (texto livre agregado)</h3>
                  <ul className="text-sm space-y-1.5">
                    {stats.blockerTop.length === 0 && <li className="text-gray-500">—</li>}
                    {stats.blockerTop.map((b) => (
                      <li key={b.key.slice(0, 80)} className="flex justify-between gap-2 border-b border-gray-50 pb-1">
                        <span className="text-gray-800 break-words">{truncCell(b.key, 120)}</span>
                        <span className="shrink-0 text-gray-600 tabular-nums">
                          {b.count} ({b.pct}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </>
          )}

          <section className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Linhas (visão rápida)</h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Role horizontalmente em telas pequenas. Para análise no Excel, use o CSV.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full text-sm text-left">
                <thead className="bg-gray-100 text-xs font-semibold text-gray-700 uppercase">
                  <tr>
                    <th className="px-3 py-2 whitespace-nowrap">Data</th>
                    <th className="px-3 py-2 whitespace-nowrap">Perfil</th>
                    <th className="px-3 py-2">Objetivo</th>
                    <th className="px-3 py-2 whitespace-nowrap">Criou?</th>
                    <th className="px-3 py-2 whitespace-nowrap">Compart.?</th>
                    <th className="px-3 py-2 whitespace-nowrap">Chamou?</th>
                    <th className="px-3 py-2 min-w-[140px]">Trava</th>
                    <th className="px-3 py-2 min-w-[160px]">Expectativa</th>
                    <th className="px-3 py-2 min-w-[160px]">Dor</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const a = r.answers || {}
                    return (
                      <tr key={r.id} className="border-t border-gray-100 hover:bg-sky-50/40">
                        <td className="px-3 py-2 whitespace-nowrap text-gray-600 tabular-nums text-xs">
                          {new Date(r.created_at).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-sky-100 text-sky-900 px-2 py-0.5 text-xs font-medium">
                            {r.profile}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-800">
                          {formatUsageSurveyObjective(
                            String(a.objective ?? ''),
                            typeof a.objective_other === 'string' ? a.objective_other : undefined
                          )}
                        </td>
                        <td className="px-3 py-2">{boolPt(a.created_diagnosis)}</td>
                        <td className="px-3 py-2">{boolPt(a.shared_link)}</td>
                        <td className="px-3 py-2">{boolPt(a.got_message)}</td>
                        <td className="px-3 py-2 text-gray-700">{truncCell(a.blocker, 100)}</td>
                        <td className="px-3 py-2 text-gray-700">{truncCell(a.expectation, 90)}</td>
                        <td className="px-3 py-2 text-gray-700">{truncCell(a.pain, 90)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {rows.length === 0 && !loading && !error && (
              <p className="p-6 text-center text-gray-500 text-sm">Nenhuma linha nesta página.</p>
            )}
          </section>
        </main>
      </div>
    </AdminProtectedRoute>
  )
}
