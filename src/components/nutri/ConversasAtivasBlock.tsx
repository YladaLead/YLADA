'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const META_SEMANAL_PADRAO = 5
const OPCOES_META = [5, 10, 15, 20, 30]

interface Stats {
  conversasAtivas: number
  conversasEsteMes?: number
  leadsHoje: number
  atendimentosAgendados: number
  metaSemanal?: number
}

export default function ConversasAtivasBlock() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingMeta, setSavingMeta] = useState(false)

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/nutri/painel/stats', { credentials: 'include' })
      if (!res.ok) return
      const json = await res.json()
      if (json.success && json.data) {
        setStats(json.data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const conversasMes = stats?.conversasEsteMes ?? stats?.conversasAtivas ?? 0
  const metaSemanal = stats?.metaSemanal ?? META_SEMANAL_PADRAO
  const progressoMeta = Math.min(100, metaSemanal > 0 ? Math.round(((stats?.leadsHoje ?? 0) / metaSemanal) * 100) : 0)

  const handleChangeMeta = async (novaMeta: number) => {
    if (novaMeta === metaSemanal || savingMeta) return
    setSavingMeta(true)
    try {
      const res = await fetch('/api/nutri/painel/meta', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ meta_conversas_semana: novaMeta })
      })
      if (res.ok) {
        setStats(prev => prev ? { ...prev, metaSemanal: novaMeta } : null)
        await loadStats()
      }
    } finally {
      setSavingMeta(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-xl">🔥</span>
          Seu Sistema de Conversas Ativas
        </h2>
        <p className="text-sm text-gray-600 mt-0.5">
          Método que transforma atenção em diálogo e diálogo em consultas.
        </p>
      </div>
      <div className="p-4 sm:p-5">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
            Carregando indicadores...
          </div>
        ) : (
          <>
            {/* Desafio 7 Dias */}
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-semibold text-amber-900">
                🎯 Desafio 7 Dias — Ative 10 conversas
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Use seus links (quiz, calculadora) e compartilhe; acompanhe aqui quantas conversas você iniciou.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Conversas este mês</p>
                <p className="text-2xl font-bold text-blue-600 mt-0.5">{conversasMes}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Meta semanal</p>
                  <select
                    value={metaSemanal}
                    onChange={(e) => handleChangeMeta(Number(e.target.value))}
                    disabled={savingMeta}
                    className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white text-gray-700 disabled:opacity-50"
                    title="Ajustar meta semanal"
                  >
                    {OPCOES_META.map((n) => (
                      <option key={n} value={n}>{n} conversas</option>
                    ))}
                  </select>
                </div>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">
                  {stats?.leadsHoje ?? 0} / {metaSemanal}
                </p>
                <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressoMeta}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Link
                href="/pt/nutri/ferramentas/templates"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Ativar nova conversa</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/pt/nutri/metodo/painel/diario"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Ver painel completo
              </Link>
            </div>

            {/* Onboarding: primeiros passos */}
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Primeiros passos</p>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>
                  <Link href="/pt/nutri/diagnostico" className="text-blue-600 hover:underline">1. Definir perfil</Link>
                  <span className="text-gray-400 ml-1">→ Nutri-Empresária</span>
                </li>
                <li>
                  <Link href="/pt/nutri/ferramentas/templates" className="text-blue-600 hover:underline">2. Escolher primeiro link</Link>
                  <span className="text-gray-400 ml-1">→ Quiz ou calculadora</span>
                </li>
                <li>
                  <span className="text-gray-600">3. Publicar</span>
                  <span className="text-gray-400 ml-1">→ Compartilhe nas redes</span>
                </li>
                <li>
                  <span className="text-gray-600">4. Conversar com ajuda do Noel</span>
                  <span className="text-gray-400 ml-1">→ Abra o chat ao lado</span>
                </li>
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
