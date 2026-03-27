'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface BehavioralData {
  events: { event_type: string; count: number }[]
  eventsTotal: number
  answersTotal: number
  error?: string
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
    }
    carregar()
  }, [])

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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
                ← Voltar ao painel
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Dados comportamentais (operacional)</h1>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Eventos e volume de gravações. Para intenção, conversão WhatsApp e combinações (valuation), use o painel{' '}
                <strong>Valuation</strong> — separado de Analytics e deste painel.
              </p>
            </div>
            <Link
              href="/admin/ylada/valuation"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-white hover:bg-slate-900 shrink-0"
            >
              Abrir Valuation →
            </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500">Total de eventos</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.eventsTotal.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-gray-400 mt-1">diagnosis_answered, lead_contact_clicked, etc.</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-500">Respostas gravadas (volume)</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.answersTotal.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-gray-400 mt-1">Por pergunta em ylada_diagnosis_answers — análise em Valuation</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos por tipo</h2>
              {data.events.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhum evento registrado ainda.</p>
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
