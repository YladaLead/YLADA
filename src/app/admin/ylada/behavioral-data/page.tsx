'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface BehavioralData {
  events: { event_type: string; count: number }[]
  eventsTotal: number
  answersTotal: number
  intentTop: { segment: string; intent_category: string; answer_display: string; cnt: number; rank: number }[]
  trends: { month_ref: string; segment: string; intent_category: string; answer_count: number; diagnosis_count: number }[]
  error?: string
}

const INTENT_LABELS: Record<string, string> = {
  dificuldade: 'Maior dificuldade',
  objetivo: 'Objetivo',
  sintoma: 'Sintoma',
  barreira: 'Barreira',
  tentativa: 'O que já tentou',
  causa: 'Causa provável',
  contexto: 'Contexto',
  preferencia: 'Preferência',
  historico: 'Histórico',
  outro: 'Outro',
}

const EVENT_LABELS: Record<string, string> = {
  user_created: 'Conta criada',
  diagnosis_created: 'Diagnóstico criado',
  diagnosis_answered: 'Diagnóstico respondido',
  noel_analysis_used: 'Análise Noel usada',
  diagnosis_shared: 'Diagnóstico compartilhado',
  lead_contact_clicked: 'Clique no WhatsApp',
  upgrade_to_pro: 'Upgrade para Pro',
}

function AdminBehavioralDataContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<BehavioralData | null>(null)

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/admin/ylada/behavioral-data', { credentials: 'include' })
        const json = await res.json()
        if (json.success && json.data) {
          setData(json.data)
        } else {
          setError(json.error || 'Erro ao carregar')
        }
      } catch (e) {
        setError('Erro ao carregar. Tente novamente.')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  const formatarData = (s: string) => {
    try {
      const d = new Date(s)
      return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    } catch {
      return s
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
                ← Voltar ao painel
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Dados Comportamentais & Intenção</h1>
              <p className="text-sm text-gray-600 mt-1">
                Eventos, respostas por pergunta e padrões de intenção da plataforma. Base para valuation e inteligência de mercado.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Cards de resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500">Total de eventos</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.eventsTotal.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-gray-400 mt-1">diagnosis_answered, lead_contact_clicked, etc.</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500">Respostas armazenadas</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.answersTotal.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-gray-400 mt-1">Por pergunta em ylada_diagnosis_answers</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500">Padrões de intenção</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.intentTop.length}</p>
                <p className="text-xs text-gray-400 mt-1">Top respostas por segmento e categoria</p>
              </div>
            </div>

            {/* Eventos por tipo */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos comportamentais por tipo</h2>
              {data.events.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhum evento registrado ainda. Os eventos são gravados quando diagnósticos são respondidos e quando há cliques no WhatsApp.</p>
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

            {/* Top intenções */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Top respostas por segmento e intenção</h2>
              <p className="text-sm text-gray-500 mb-4">
                Dados de intenção mais citados (mín. 5 respostas). Alimenta o Noel e relatórios de tendências.
              </p>
              {data.intentTop.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhum dado ainda. As respostas são gravadas automaticamente quando leads respondem diagnósticos.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-700">Segmento</th>
                        <th className="text-left py-2 font-medium text-gray-700">Tipo</th>
                        <th className="text-left py-2 font-medium text-gray-700">Resposta</th>
                        <th className="text-right py-2 font-medium text-gray-700">Qtd</th>
                        <th className="text-right py-2 font-medium text-gray-700">Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.intentTop.map((r, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2">{r.segment || '—'}</td>
                          <td className="py-2">{INTENT_LABELS[r.intent_category] || r.intent_category}</td>
                          <td className="py-2 max-w-xs truncate" title={r.answer_display}>{r.answer_display || '—'}</td>
                          <td className="text-right py-2">{r.cnt.toLocaleString('pt-BR')}</td>
                          <td className="text-right py-2">{r.rank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Tendências mensais */}
            {data.trends.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Tendências mensais</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-700">Mês</th>
                        <th className="text-left py-2 font-medium text-gray-700">Segmento</th>
                        <th className="text-left py-2 font-medium text-gray-700">Tipo</th>
                        <th className="text-right py-2 font-medium text-gray-700">Respostas</th>
                        <th className="text-right py-2 font-medium text-gray-700">Diagnósticos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.trends.slice(0, 30).map((t, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-2">{formatarData(t.month_ref)}</td>
                          <td className="py-2">{t.segment || '—'}</td>
                          <td className="py-2">{INTENT_LABELS[t.intent_category] || t.intent_category}</td>
                          <td className="text-right py-2">{t.answer_count.toLocaleString('pt-BR')}</td>
                          <td className="text-right py-2">{t.diagnosis_count.toLocaleString('pt-BR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Links úteis */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-700 mb-2">Documentação</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <code className="bg-gray-200 px-1 rounded">docs/ARQUITETURA-DADOS-COMPORTAMENTAIS-YLADA.md</code> — 5 camadas de dados</li>
                <li>• <code className="bg-gray-200 px-1 rounded">docs/DADOS-INTENCAO-YLADA.md</code> — Dados de intenção</li>
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
