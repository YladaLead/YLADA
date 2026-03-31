/**
 * Consultas Supabase para o painel Valuation (admin).
 * Separado de eventos operacionais — ver GET /api/admin/ylada/behavioral-data.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { buildNarrativeInsights, buildTrendsMom, type NarrativeInsight, type TrendMomRow } from '@/lib/valuation-narrative'

export type ValuationLoadOptions = {
  /** Mínimo de diagnósticos para linha em conversão WhatsApp (default 5). */
  minDiagnosesConversion?: number
  /** Mínimo para combinação no mesmo diagnóstico (default 5). */
  minDiagnosesCombo?: number
  /** Mínimo de respostas (cnt) no top detalhado (default 3). */
  minCntTop?: number
  /** Até qual rank por segmento × categoria (default 5). */
  topRankMax?: number
}

const DEFAULTS: Required<ValuationLoadOptions> = {
  minDiagnosesConversion: 5,
  minDiagnosesCombo: 5,
  minCntTop: 3,
  topRankMax: 5,
}

export type ValuationApiData = {
  answersTotal: number
  intentTop: {
    segment: string
    intent_category: string
    question_id: string
    answer_display: string
    cnt: number
    rank: number
    diagnosis_count: number
  }[]
  trends: { month_ref: string; segment: string; intent_category: string; answer_count: number; diagnosis_count: number }[]
  trendsMom: TrendMomRow[]
  narrativeInsights: NarrativeInsight[]
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
  loadOptions: Required<ValuationLoadOptions>
  error?: string
}

export async function loadValuationPanelData(
  supabase: SupabaseClient,
  opts: ValuationLoadOptions = {}
): Promise<ValuationApiData> {
  const minDiagConv = opts.minDiagnosesConversion ?? DEFAULTS.minDiagnosesConversion
  const minDiagCombo = opts.minDiagnosesCombo ?? DEFAULTS.minDiagnosesCombo
  const minCntTop = opts.minCntTop ?? DEFAULTS.minCntTop
  const topRankMax = opts.topRankMax ?? DEFAULTS.topRankMax

  const loadOptions: Required<ValuationLoadOptions> = {
    minDiagnosesConversion: minDiagConv,
    minDiagnosesCombo: minDiagCombo,
    minCntTop,
    topRankMax,
  }

  const result: ValuationApiData = {
    answersTotal: 0,
    intentTop: [],
    trends: [],
    trendsMom: [],
    narrativeInsights: [],
    intentConversion: [],
    intentCombinations: [],
    loadOptions,
  }

  try {
    const { count } = await supabase
      .from('ylada_diagnosis_answers')
      .select('*', { count: 'exact', head: true })
    result.answersTotal = count ?? 0
  } catch {
    // tabela pode não existir
  }

  try {
    const { data: top } = await supabase
      .from('v_intent_top_ranked_detailed')
      .select('segment, intent_category, question_id, answer_display, cnt, diagnosis_count, rank')
      .lte('rank', topRankMax)
      .gte('cnt', minCntTop)
      .order('segment')
      .order('intent_category')
      .order('rank')
      .limit(120)
    result.intentTop = (top ?? []) as ValuationApiData['intentTop']
  } catch {
    try {
      const { data: fallback } = await supabase
        .from('v_intent_top_by_segment')
        .select('segment, intent_category, answer_display, cnt, rank')
        .lte('rank', topRankMax)
        .gte('cnt', Math.max(minCntTop, 5))
        .order('segment')
        .order('intent_category')
        .order('rank')
        .limit(80)
      result.intentTop = (fallback ?? []).map((r) => ({
        ...r,
        question_id: '',
        diagnosis_count: r.cnt,
      })) as ValuationApiData['intentTop']
    } catch {
      result.error = result.error ?? 'Views de intenção indisponíveis (rode migration 291)'
    }
  }

  try {
    const { data: trends } = await supabase
      .from('v_intent_trends_monthly')
      .select('month_ref, segment, intent_category, answer_count, diagnosis_count')
      .order('month_ref', { ascending: false })
      .limit(120)
    result.trends = (trends ?? []) as ValuationApiData['trends']
  } catch {
    // view opcional
  }

  result.trendsMom = buildTrendsMom(result.trends)

  try {
    const { data: conv } = await supabase
      .from('v_intent_answer_conversion')
      .select(
        'segment, intent_category, question_id, answer_display, diagnoses, diagnoses_clicked, conversion_pct'
      )
      .gte('diagnoses', minDiagConv)
      .order('conversion_pct', { ascending: false })
      .order('diagnoses', { ascending: false })
      .limit(80)
    result.intentConversion = (conv ?? []) as ValuationApiData['intentConversion']
  } catch {
    // migração 281
  }

  try {
    const { data: comb } = await supabase
      .from('v_intent_combinations')
      .select(
        'segment, intent_category_1, question_id_1, answer_display_1, intent_category_2, question_id_2, answer_display_2, diagnosis_count'
      )
      .gte('diagnosis_count', minDiagCombo)
      .order('diagnosis_count', { ascending: false })
      .limit(80)
    result.intentCombinations = (comb ?? []) as ValuationApiData['intentCombinations']
  } catch {
    // migração 282
  }

  result.narrativeInsights = buildNarrativeInsights({
    answersTotal: result.answersTotal,
    intentConversion: result.intentConversion,
    intentCombinations: result.intentCombinations,
    trendsMom: result.trendsMom,
  })

  return result
}
