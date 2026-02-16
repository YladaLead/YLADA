'use client'

import { useState, useEffect } from 'react'

/**
 * Mini-MVP Noel: chama GET /api/trilha/me/plano-semana e exibe o plano da semana gerado.
 */
export default function TrilhaPlanoSemana() {
  const [plano, setPlano] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/trilha/me/plano-semana', { credentials: 'include' })
      const data = await res.json()
      if (data.success && data.data?.plano_semana) {
        setPlano(data.data.plano_semana)
      } else {
        setPlano(null)
        setError(data.error || 'Não foi possível gerar o plano.')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar')
      setPlano(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700">Plano da semana</h2>
        <p className="mt-2 text-sm text-gray-500">Gerando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700">Plano da semana</h2>
        <p className="mt-2 text-sm text-amber-800">{error}</p>
        <button type="button" onClick={load} className="mt-2 text-sm text-blue-600 hover:underline">
          Tentar de novo
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-800">Plano da semana (Noel)</h2>
      <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{plano || '—'}</div>
      <button type="button" onClick={load} className="mt-3 text-xs text-blue-600 hover:underline">
        Atualizar plano
      </button>
    </div>
  )
}
