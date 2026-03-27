/**
 * Consultas Supabase para o painel Valuation (admin).
 * Separado de eventos operacionais — ver GET /api/admin/ylada/behavioral-data.
 */
import type { SupabaseClient } from '@supabase/supabase-js'

export type ValuationApiData = {
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

export async function loadValuationPanelData(supabase: SupabaseClient): Promise<ValuationApiData> {
  const result: ValuationApiData = {
    answersTotal: 0,
    intentTop: [],
    trends: [],
    intentConversion: [],
    intentCombinations: [],
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
      .from('v_intent_top_by_segment')
      .select('segment, intent_category, answer_display, cnt, rank')
      .lte('rank', 5)
      .gte('cnt', 5)
      .order('segment')
      .order('intent_category')
      .order('rank')
      .limit(50)
    result.intentTop = (top ?? []) as ValuationApiData['intentTop']
  } catch {
    result.error = result.error ?? 'Views de intenção indisponíveis'
  }

  try {
    const { data: trends } = await supabase
      .from('v_intent_trends_monthly')
      .select('month_ref, segment, intent_category, answer_count, diagnosis_count')
      .order('month_ref', { ascending: false })
      .limit(60)
    result.trends = (trends ?? []) as ValuationApiData['trends']
  } catch {
    // view opcional
  }

  try {
    const { data: conv } = await supabase
      .from('v_intent_answer_conversion')
      .select(
        'segment, intent_category, question_id, answer_display, diagnoses, diagnoses_clicked, conversion_pct'
      )
      .gte('diagnoses', 10)
      .order('conversion_pct', { ascending: false })
      .order('diagnoses', { ascending: false })
      .limit(50)
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
      .gte('diagnosis_count', 10)
      .order('diagnosis_count', { ascending: false })
      .limit(50)
    result.intentCombinations = (comb ?? []) as ValuationApiData['intentCombinations']
  } catch {
    // migração 282
  }

  return result
}
