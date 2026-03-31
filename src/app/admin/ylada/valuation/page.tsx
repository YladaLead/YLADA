'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import type { ValuationApiData } from '@/lib/admin/ylada-valuation-queries'
import { downloadValuationCsv } from '@/lib/valuation-export-csv'

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

const PRESET_QUERY: Record<string, string> = {
  '': '',
  explore: 'min_conv=3&min_combo=3&min_cnt=2&rank_max=5',
  strict: 'min_conv=15&min_combo=15&min_cnt=8&rank_max=5',
}

type DrillSample = {
  answer_row_id: string
  metrics_id: string
  created_at: string
  question_id: string
  question_label: string | null
  link_id: string | null
  clicked_whatsapp: boolean
}

function AdminValuationContent() {
  const [preset, setPreset] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ValuationApiData | null>(null)

  const [drillRow, setDrillRow] = useState<ValuationApiData['intentTop'][0] | null>(null)
  const [drillLoading, setDrillLoading] = useState(false)
  const [drillSamples, setDrillSamples] = useState<DrillSample[] | null>(null)
  const [drillNote, setDrillNote] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const q = PRESET_QUERY[preset] ?? ''
      const url = q ? `/api/admin/ylada/valuation?${q}` : '/api/admin/ylada/valuation'
      const res = await fetch(url, { credentials: 'include' })
      const json = await res.json()
      if (json.success && json.data) {
        setData(json.data as ValuationApiData)
      } else {
        setError(json.error || 'Erro ao carregar')
      }
    } catch (e) {
      setError('Erro ao carregar. Tente novamente.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [preset])

  useEffect(() => {
    load()
  }, [load])

  const openDrill = async (row: ValuationApiData['intentTop'][0]) => {
    setDrillRow(row)
    setDrillSamples(null)
    setDrillNote(null)
    setDrillLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('segment', row.segment)
      params.set('intent_category', row.intent_category)
      params.set('answer_display', row.answer_display)
      if (row.question_id) params.set('question_id', row.question_id)
      const res = await fetch(`/api/admin/ylada/valuation/drilldown?${params.toString()}`, {
        credentials: 'include',
      })
      const json = await res.json()
      if (json.success && json.data) {
        setDrillSamples(json.data.samples as DrillSample[])
        setDrillNote(json.data.note ?? null)
      } else {
        setDrillSamples([])
      }
    } catch {
      setDrillSamples([])
    } finally {
      setDrillLoading(false)
    }
  }

  const formatarData = (s: string) => {
    try {
      const d = new Date(s)
      return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    } catch {
      return s
    }
  }

  const formatarDataHora = (s: string) => {
    try {
      return new Date(s).toLocaleString('pt-BR')
    } catch {
      return s
    }
  }

  if (loading && !data) {
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
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700 mb-1 inline-block">
                ← Voltar ao painel
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">Valuation — dados de intenção</h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Profundidade: conversão, combinações, top com drill-down, tendências e variação mês a mês — para
                narrativa e valuation, sem misturar com telemetria operacional bruta.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                type="button"
                onClick={() => data && downloadValuationCsv(data)}
                disabled={!data}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                Exportar CSV
              </button>
              <Link
                href="/admin/ylada/behavioral-data"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200"
              >
                Eventos operacionais →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Amostra (limiares)</p>
            <p className="text-sm text-slate-700 mt-1">
              Ajuste para ver mais linhas (exploratório) ou menos ruído (rigoroso). Padrão = mínimos moderados.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: '', label: 'Padrão' },
              { id: 'explore', label: 'Exploratório' },
              { id: 'strict', label: 'Rigoroso' },
            ].map((p) => (
              <button
                key={p.id || 'default'}
                type="button"
                onClick={() => setPreset(p.id)}
                className={`min-h-[40px] px-3 rounded-lg text-sm font-medium border ${
                  preset === p.id
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => load()}
              disabled={loading}
              className="min-h-[40px] px-3 rounded-lg text-sm font-medium border border-slate-200 bg-slate-50 hover:bg-slate-100"
            >
              Recarregar
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading && data && (
          <p className="text-sm text-slate-500 mb-4">Atualizando dados…</p>
        )}

        {data && (
          <div className="space-y-6">
            {data.narrativeInsights.length > 0 && (
              <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Leitura automática (para valuation)</h2>
                <ul className="space-y-4">
                  {data.narrativeInsights.map((n) => (
                    <li key={n.id} className="border-b border-indigo-100 last:border-0 pb-4 last:pb-0">
                      <p className="font-semibold text-slate-900">{n.title}</p>
                      <p className="text-sm text-slate-700 mt-1 leading-relaxed">{n.detail}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-500 mt-4">
                  Parâmetros ativos: conv ≥ {data.loadOptions.minDiagnosesConversion}, combo ≥{' '}
                  {data.loadOptions.minDiagnosesCombo}, top cnt ≥ {data.loadOptions.minCntTop}, rank ≤{' '}
                  {data.loadOptions.topRankMax}.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Respostas estruturadas</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {data.answersTotal.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-slate-400 mt-1">Total histórico em ylada_diagnosis_answers</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Sinais de conversão (linhas)</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {data.intentConversion.length.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-slate-400 mt-1">Com amostra mínima aplicada nos filtros</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-medium text-slate-500">Combinações fortes</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {data.intentCombinations.length.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-slate-400 mt-1">Pares no mesmo diagnóstico</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Intenção e conversão (WhatsApp)</h2>
              <p className="text-sm text-slate-500 mb-4">
                <code className="bg-slate-100 px-1 rounded text-xs">v_intent_answer_conversion</code> — ordenado por
                taxa. Inclui <code className="text-xs">question_id</code> para cruzar com o fluxo.
              </p>
              {data.intentConversion.length === 0 ? (
                <p className="text-slate-500 text-sm">Sem linhas com o volume mínimo atual ou view indisponível.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-medium text-slate-700">Segmento</th>
                        <th className="text-left py-2 font-medium text-slate-700">Tipo</th>
                        <th className="text-left py-2 font-medium text-slate-700">Pergunta</th>
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
                          <td className="py-2 font-mono text-xs text-slate-600 max-w-[8rem] truncate" title={r.question_id}>
                            {r.question_id || '—'}
                          </td>
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
                <p className="text-slate-500 text-sm">Sem dados com o volume mínimo atual.</p>
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
              <p className="text-sm text-slate-500 mb-4">
                <code className="bg-slate-100 px-1 rounded text-xs">v_intent_top_ranked_detailed</code> — com{' '}
                <strong>question_id</strong> e diagnósticos distintos. Use <strong>Ver amostra</strong> para drill-down
                (rode migration 291 se a view não existir).
              </p>
              {data.intentTop.length === 0 ? (
                <p className="text-slate-500 text-sm">Sem volume com os filtros atuais.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-medium text-slate-700">Segmento</th>
                        <th className="text-left py-2 font-medium text-slate-700">Tipo</th>
                        <th className="text-left py-2 font-medium text-slate-700">Pergunta</th>
                        <th className="text-left py-2 font-medium text-slate-700">Resposta</th>
                        <th className="text-right py-2 font-medium text-slate-700">Qtd</th>
                        <th className="text-right py-2 font-medium text-slate-700">Diagn.</th>
                        <th className="text-right py-2 font-medium text-slate-700">Rank</th>
                        <th className="text-right py-2 font-medium text-slate-700"> </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.intentTop.map((r, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-2">{r.segment || '—'}</td>
                          <td className="py-2">{INTENT_LABELS[r.intent_category] || r.intent_category}</td>
                          <td className="py-2 font-mono text-xs text-slate-600 max-w-[7rem] truncate" title={r.question_id}>
                            {r.question_id || '—'}
                          </td>
                          <td className="py-2 max-w-xs truncate" title={r.answer_display}>
                            {r.answer_display || '—'}
                          </td>
                          <td className="text-right py-2">{r.cnt.toLocaleString('pt-BR')}</td>
                          <td className="text-right py-2">{r.diagnosis_count.toLocaleString('pt-BR')}</td>
                          <td className="text-right py-2">{r.rank}</td>
                          <td className="text-right py-2">
                            <button
                              type="button"
                              onClick={() => openDrill(r)}
                              className="text-indigo-600 font-medium hover:underline text-xs sm:text-sm"
                            >
                              Ver amostra
                            </button>
                          </td>
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
                      {data.trends.slice(0, 48).map((t, i) => (
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

            {data.trendsMom.some((x) => x.prev_month_ref) && (
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Variação mês a mês (MoM)</h2>
                <p className="text-sm text-slate-500 mb-4">
                  Comparação com o mês anterior no mesmo segmento e tipo de intenção. Linhas sem mês anterior não
                  mostram %.
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-medium text-slate-700">Mês</th>
                        <th className="text-left py-2 font-medium text-slate-700">Segmento</th>
                        <th className="text-left py-2 font-medium text-slate-700">Tipo</th>
                        <th className="text-right py-2 font-medium text-slate-700">Respostas</th>
                        <th className="text-right py-2 font-medium text-slate-700">Δ respostas %</th>
                        <th className="text-right py-2 font-medium text-slate-700">Diagnósticos</th>
                        <th className="text-right py-2 font-medium text-slate-700">Δ diagn. %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.trendsMom
                        .filter((x) => x.prev_month_ref)
                        .slice(0, 60)
                        .map((t, i) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="py-2">{formatarData(t.month_ref)}</td>
                            <td className="py-2">{t.segment}</td>
                            <td className="py-2">{INTENT_LABELS[t.intent_category] || t.intent_category}</td>
                            <td className="text-right py-2">{t.answer_count.toLocaleString('pt-BR')}</td>
                            <td className="text-right py-2 font-medium text-indigo-800">
                              {t.answer_mom_pct != null ? `${t.answer_mom_pct > 0 ? '+' : ''}${t.answer_mom_pct}%` : '—'}
                            </td>
                            <td className="text-right py-2">{t.diagnosis_count.toLocaleString('pt-BR')}</td>
                            <td className="text-right py-2 font-medium text-indigo-800">
                              {t.diagnosis_mom_pct != null
                                ? `${t.diagnosis_mom_pct > 0 ? '+' : ''}${t.diagnosis_mom_pct}%`
                                : '—'}
                            </td>
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
                <li>• Migration <code className="bg-white px-1 rounded">291-valuation-top-detailed-view.sql</code> — view com question_id</li>
              </ul>
            </div>
          </div>
        )}

        {drillRow && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              onClick={() => setDrillRow(null)}
              aria-label="Fechar"
            />
            <div className="relative z-10 max-w-2xl w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-slate-900">Amostra de diagnósticos</h3>
              <p className="text-sm text-slate-600 mt-1 mb-4">
                {INTENT_LABELS[drillRow.intent_category] || drillRow.intent_category} ·{' '}
                <span className="break-words">{drillRow.answer_display}</span>
              </p>
              {drillLoading && <p className="text-slate-500 text-sm">Carregando…</p>}
              {!drillLoading && drillSamples && (
                <>
                  {drillNote && <p className="text-xs text-slate-500 mb-3">{drillNote}</p>}
                  {drillSamples.length === 0 ? (
                    <p className="text-sm text-slate-500">Nenhuma linha encontrada (texto exato da resposta).</p>
                  ) : (
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                          <th className="py-2 pr-2">Quando</th>
                          <th className="py-2 pr-2">Pergunta</th>
                          <th className="py-2 pr-2">Link</th>
                          <th className="py-2">WA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drillSamples.map((s) => (
                          <tr key={s.answer_row_id} className="border-b border-slate-50">
                            <td className="py-2 align-top whitespace-nowrap">{formatarDataHora(s.created_at)}</td>
                            <td className="py-2 align-top">{s.question_label || s.question_id || '—'}</td>
                            <td className="py-2 align-top font-mono text-[11px] break-all max-w-[10rem]">
                              {s.link_id ? s.link_id.slice(0, 8) + '…' : '—'}
                            </td>
                            <td className="py-2 align-top">{s.clicked_whatsapp ? 'Sim' : 'Não'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
              <button
                type="button"
                onClick={() => setDrillRow(null)}
                className="mt-6 min-h-[44px] w-full rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Fechar
              </button>
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
