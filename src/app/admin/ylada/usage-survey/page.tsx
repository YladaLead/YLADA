'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import {
  USAGE_SURVEY_PROFILE_LABELS,
  formatUsageSurveyObjective,
} from '@/lib/ylada-usage-survey-labels'

type Row = {
  id: string
  created_at: string
  profile: string
  answers: Record<string, unknown>
}

type SurveyStats = {
  totalInDb: number
  profileCountsGlobal: Record<string, number>
  aggregationSampleSize: number
  objectiveTop: Array<{ key: string; count: number; pct: number }>
  blockerTop: Array<{ key: string; count: number; pct: number }>
}

export default function AdminYladaUsageSurveyPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)
  const [stats, setStats] = useState<SurveyStats | null>(null)
  const [insights, setInsights] = useState<string[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/ylada/usage-survey?limit=200', { credentials: 'include' })
      const json = await res.json()
      if (json.success) {
        setRows(json.data ?? [])
        setTotal(json.total ?? 0)
        setStats(json.stats ?? null)
        setInsights(Array.isArray(json.insights) ? json.insights : [])
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

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800">
              ← Painel admin
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Pesquisa de uso YLADA (anônima)</h1>
            <p className="text-sm text-gray-600 mt-1 max-w-3xl">
              Respostas da página pública <code className="text-xs bg-gray-100 px-1 rounded">/pt/pesquisa-uso-ylada</code>.
              Sem nome ou e-mail. No Supabase: tabela <code className="text-xs bg-gray-100 px-1 rounded">ylada_usage_survey_responses</code> (migration 296).
            </p>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={load}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              Atualizar
            </button>
            <span className="text-sm text-gray-600">
              Total no banco: <strong>{total}</strong> · Exibindo: {rows.length}
            </span>
          </div>
          {loading && <p className="text-gray-500">Carregando…</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {!loading && !error && rows.length === 0 && (
            <p className="text-gray-600">Nenhuma resposta ainda ou execute a migration 296 no Supabase.</p>
          )}
          {!loading && !error && stats && total > 0 && (
            <div className="mb-6 space-y-4">
              <div className="rounded-xl border border-sky-100 bg-sky-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-800 mb-2">
                  Perfis (total no banco)
                </p>
                <ul className="text-sm text-gray-800 space-y-1">
                  {(['1', '2', '3', '4'] as const).map((k) => (
                    <li key={k}>
                      <strong>{stats.profileCountsGlobal[k] ?? 0}</strong> — Perfil {k}
                      {USAGE_SURVEY_PROFILE_LABELS[k] ? `: ${USAGE_SURVEY_PROFILE_LABELS[k]}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
              {insights.length > 0 && (
                <div className="rounded-xl border border-amber-100 bg-amber-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-900 mb-2">
                    Leitura rápida
                  </p>
                  <ul className="list-disc list-inside text-sm text-amber-950 space-y-2">
                    {insights.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(stats.objectiveTop.length > 0 || stats.blockerTop.length > 0) && (
                <div className="rounded-xl border border-gray-200 bg-white p-4 grid sm:grid-cols-2 gap-4">
                  {stats.objectiveTop.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">
                        Objetivos (amostra {stats.aggregationSampleSize} mais recentes)
                      </p>
                      <ul className="text-xs text-gray-700 space-y-1">
                        {stats.objectiveTop.slice(0, 6).map((o) => (
                          <li key={o.key}>
                            {formatUsageSurveyObjective(o.key)} — {o.count} ({o.pct}%)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {stats.blockerTop.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2">Travas citadas (top)</p>
                      <ul className="text-xs text-gray-700 space-y-1">
                        {stats.blockerTop.slice(0, 6).map((b, i) => (
                          <li key={i} className="break-words">
                            {b.count}× — {b.key.length > 120 ? `${b.key.slice(0, 117)}…` : b.key}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="space-y-4">
            {rows.map((r) => (
              <article
                key={r.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                  <span>{new Date(r.created_at).toLocaleString('pt-BR')}</span>
                  <span className="font-semibold text-sky-800">
                    Perfil {r.profile}
                    {USAGE_SURVEY_PROFILE_LABELS[r.profile]
                      ? ` — ${USAGE_SURVEY_PROFILE_LABELS[r.profile]}`
                      : ''}
                  </span>
                  <span className="font-mono text-gray-400">{r.id.slice(0, 8)}…</span>
                </div>
                <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words overflow-x-auto max-h-64 overflow-y-auto bg-gray-50 rounded-lg p-3">
                  {JSON.stringify(r.answers, null, 2)}
                </pre>
              </article>
            ))}
          </div>
        </main>
      </div>
    </AdminProtectedRoute>
  )
}
