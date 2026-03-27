'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface ValuationData {
  answersTotal: number
  intentTop: { segment: string; intent_category: string; answer_display: string; cnt: number; rank: number }[]
  trends: { month_ref: string; segment: string; intent_category: string; answer_count: number; diagnosis_count: number }[]
  intentConversion: {
    segment: string
    intent_category: string
    question_id: string
    answer_display: string
    diagnoses: number
    diagnoses_clicked: number
    conversion_pct: number
  }[]
  intentCombinations: {
    segment: string
    intent_category_1: string
    question_id_1: string
    answer_display_1: string
    intent_category_2: string
    question_id_2: string
    answer_display_2: string
    diagnosis_count: number
  }[]
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

function AdminValuationContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ValuationData | null>(null)

  useEffect(() => {
    const carregar = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/admin/ylada/valuation', { credentials: 'include' })
        const json = await res.json()
        if (json.success && json.data) {
          const d = json.data as ValuationData
          setData({
            ...d,
            intentConversion: d.intentConversion ?? [],
            intentCombinations: d.intentCombinations ?? [],
            intentTop: d.intentTop ?? [],
            trends: d.trends ?? [],
          })
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Carregando painel Valuation…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700 mb-1 inline-block">
                ← Voltar ao painel
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">Valuation — dados de intenção</h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Visão separada de Analytics: ativo de dados estruturados (o que o mercado quer), conversão no WhatsApp
                e padrões combinados — para narrativa estratégica e investidores, sem misturar com telemetria operacional.
              </p>
            </div>
            <Link
              href="/admin/ylada/behavioral-data"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 shrink-0"
            >
              Eventos operacionais →
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Respostas estruturadas</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {data.answersTotal.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-slate-400 mt-1">Linhas em ylada_diagnosis_answers (sem PII)</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Sinais de conversão</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {data.intentConversion.length.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-slate-400 mt-1">Pares resposta × taxa (amostra ≥ 10 diagnósticos)</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Combinações fortes</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {data.intentCombinations.length.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-slate-400 mt-1">Coocorrências no mesmo diagnóstico (≥ 10)</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Intenção e conversão (WhatsApp)</h2>
              <p className="text-sm text-slate-500 mb-4">
                <code className="bg-slate-100 px-1 rounded text-xs">v_intent_answer_conversion</code> — ordenado por
                taxa de conversão. Amostras pequenas: interpretar com cautela.
              </p>
              {data.intentConversion.length === 0 ? (
                <p className="text-slate-500 text-sm">Sem linhas com volume mínimo ou migração 281 pendente.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-medium text-slate-700">Segmento</th>
                        <th className="text-left py-2 font-medium text-slate-700">Tipo</th>
                        <th className="text-left py-2 font-medium text-slate-700">Resposta</th>
                        <th className="text-right py-2 font-medium text-slate-700">Diagnósticos</th>
                        <th className="text-right py-2 font-medium text-slate-700">Cliques</th>
                        <th className="text-right py-2 font-medium text-slate-700">Conv. %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.intentConversion.map((r, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-2">{r.segment || '—'}</td>
                          <td className="py-2">{INTENT_LABELS[r.intent_category] || r.intent_category}</td>
                          <td className="py-2 max-w-xs truncate" title={r.answer_display}>
                            {r.answer_display || '—'}
                          </td>
                          <td className="text-right py-2">{Number(r.diagnoses).toLocaleString('pt-BR')}</td>
                          <td className="text-right py-2">{Number(r.diagnoses_clicked).toLocaleString('pt-BR')}</td>
                          <td className="text-right py-2 font-medium text-slate-900">
                            {r.conversion_pct != null ? `${Number(r.conversion_pct).toFixed(1)}%` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Combinações no mesmo diagnóstico</h2>
              <p className="text-sm text-slate-500 mb-4">
                <code className="bg-slate-100 px-1 rounded text-xs">v_intent_combinations</code> — ex.: dificuldade +
                objetivo no mesmo lead.
              </p>
              {data.intentCombinations.length === 0 ? (
                <p className="text-slate-500 text-sm">Sem dados ou migração 282 pendente.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-medium text-slate-700">Segmento</th>
                        <th className="text-left py-2 font-medium text-slate-700">Par 1</th>
                        <th className="text-left py-2 font-medium text-slate-700">Par 2</th>
                        <th className="text-right py-2 font-medium text-slate-700">Diagnósticos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.intentCombinations.map((r, i) => (
                        <tr key={i} className="border-b border-slate-100 align-top">
                          <td className="py-2">{r.segment || '—'}</td>
                          <td className="py-2 max-w-[14rem]">
                            <span className="text-slate-500 text-xs block">
                              {INTENT_LABELS[r.intent_category_1] || r.intent_category_1}
                            </span>
                            <span className="break-words" title={r.answer_display_1}>
                              {r.answer_display_1 || '—'}
                            </span>
                          </td>
                          <td className="py-2 max-w-[14rem]">
                            <span className="text-slate-500 text-xs block">
                              {INTENT_LABELS[r.intent_category_2] || r.intent_category_2}
                            </span>
                            <span className="break-words" title={r.answer_display_2}>
                              {r.answer_display_2 || '—'}
                            </span>
                          </td>
                          <td className="text-right py-2">
                            {Number(r.diagnosis_count).toLocaleString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Top respostas por segmento e intenção</h2>
              <p className="text-sm text-slate-500 mb-4">Volume mínimo 5 respostas; até 5 ranks por segmento × categoria.</p>
              {data.intentTop.length === 0 ? (
                <p className="text-slate-500 text-sm">Ainda sem volume agregado.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-medium text-slate-700">Segmento</th>
                        <th className="text-left py-2 font-medium text-slate-700">Tipo</th>
                        <th className="text-left py-2 font-medium text-slate-700">Resposta</th>
                        <th className="text-right py-2 font-medium text-slate-700">Qtd</th>
                        <th className="text-right py-2 font-medium text-slate-700">Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.intentTop.map((r, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-2">{r.segment || '—'}</td>
                          <td className="py-2">{INTENT_LABELS[r.intent_category] || r.intent_category}</td>
                          <td className="py-2 max-w-xs truncate" title={r.answer_display}>
                            {r.answer_display || '—'}
                          </td>
                          <td className="text-right py-2">{r.cnt.toLocaleString('pt-BR')}</td>
                          <td className="text-right py-2">{r.rank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {data.trends.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Tendências mensais</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-medium text-slate-700">Mês</th>
                        <th className="text-left py-2 font-medium text-slate-700">Segmento</th>
                        <th className="text-left py-2 font-medium text-slate-700">Tipo</th>
                        <th className="text-right py-2 font-medium text-slate-700">Respostas</th>
                        <th className="text-right py-2 font-medium text-slate-700">Diagnósticos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.trends.slice(0, 36).map((t, i) => (
                        <tr key={i} className="border-b border-slate-100">
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

            <div className="bg-slate-100 rounded-lg border border-slate-200 p-4">
              <h3 className="font-medium text-slate-800 mb-2">Documentação</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>
                  •{' '}
                  <code className="bg-white px-1 rounded border border-slate-200">docs/PLANO-IMPLANTACAO-VALUATION-DADOS-INTENCAO.md</code>
                </li>
                <li>
                  •{' '}
                  <code className="bg-white px-1 rounded border border-slate-200">docs/DADOS-INTENCAO-YLADA.md</code>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function AdminValuationPage() {
  return (
    <AdminProtectedRoute>
      <AdminValuationContent />
    </AdminProtectedRoute>
  )
}
