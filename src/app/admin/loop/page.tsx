'use client'

/**
 * Painel do loop / k-factor (Fase B). Mostra k-factor + funil + leaderboard + saúde.
 * Lê /api/admin/loop/metrics (admin). "Abre e vê" — sem rodar SQL na mão.
 */
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

type Metrics = {
  window_days: number
  kfactor: {
    usuarios_ativos: number
    indicados_cadastrados: number
    indicados_ativados: number
    k_cadastro: number
    k_honesto: number
  }
  funil: {
    landing_views: number
    signups: number
    ativacoes: number
    landing_para_cadastro: number
    cadastro_para_ativacao: number
  }
  leaderboard: Array<{
    referrer_user_id: string
    indicados: number
    ativados: number
    via_diagnostico: number
    via_conteudo: number
  }>
  saude: { codigos_gerados: number; indicacoes_total: number; indicacoes_ativadas: number }
}

const WINDOWS = [7, 30, 90]

function Card({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-bold text-gray-900 mt-1">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  )
}

function LoopDashboard() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/loop/metrics?days=${days}`, { credentials: 'include' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Erro ao carregar')
      setData(json as Metrics)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/admin">
            <h1 className="text-2xl font-bold text-gray-900">🔁 Loop / k-factor</h1>
          </Link>
          <Link href="/admin" className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-600">Janela:</span>
          {WINDOWS.map((w) => (
            <button
              key={w}
              onClick={() => setDays(w)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                days === w ? 'bg-sky-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {w} dias
            </button>
          ))}
          <button onClick={() => void load()} className="ml-auto text-sm text-sky-600 hover:underline">
            Recarregar
          </button>
        </div>

        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

        {loading || !data ? (
          <div className="text-center py-12 text-gray-500">Carregando…</div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card label="k honesto (ativados ÷ ativos)" value={data.kfactor.k_honesto} hint="alvo: >0,5 rumo a ~1" />
              <Card label="k de cadastro" value={data.kfactor.k_cadastro} hint="cedo; sempre ≥ k honesto" />
              <Card label="Usuários ativos" value={data.kfactor.usuarios_ativos} hint={`criaram link nos últimos ${data.window_days} dias`} />
            </section>

            <h2 className="text-lg font-semibold text-gray-900 mb-3">Funil do loop</h2>
            <section className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card label="Landing views" value={data.funil.landing_views} />
              <Card label="Cadastros" value={data.funil.signups} />
              <Card label="Ativações" value={data.funil.ativacoes} />
              <Card label="Landing → cadastro" value={data.funil.landing_para_cadastro} />
              <Card label="Cadastro → ativação" value={data.funil.cadastro_para_ativacao} />
            </section>

            <h2 className="text-lg font-semibold text-gray-900 mb-3">Quem mais indica</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
              {data.leaderboard.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Sem indicações no período ainda.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Indicador (user_id)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Indicados</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ativados</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnóstico</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conteúdo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.leaderboard.map((row) => (
                      <tr key={row.referrer_user_id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs font-mono text-gray-600">{row.referrer_user_id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{row.indicados}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{row.ativados}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{row.via_diagnostico}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{row.via_conteudo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Saúde: {data.saude.codigos_gerados} códigos gerados · {data.saude.indicacoes_total} indicações ·{' '}
              {data.saude.indicacoes_ativadas} ativadas.
            </p>
          </>
        )}
      </main>
    </div>
  )
}

export default function AdminLoopPage() {
  return (
    <AdminProtectedRoute>
      <LoopDashboard />
    </AdminProtectedRoute>
  )
}
