/**
 * Grava respostas por pergunta em ylada_diagnosis_answers (Camada 2 — Dados Comportamentais).
 * Base para análise de padrões: dores comuns, perfis por nicho, tendências.
 * @see docs/ARQUITETURA-DADOS-COMPORTAMENTAIS-YLADA.md
 * @see docs/DADOS-INTENCAO-YLADA.md
 */

import { supabaseAdmin } from '@/lib/supabase'
import { inferIntentCategory } from '@/config/intent-category-map'

export interface FormFieldForAnswers {
  id: string
  options?: string[]
}

function optionIndexToText(idx: unknown, options: string[] | undefined): string | null {
  if (!Array.isArray(options) || options.length === 0) return null
  const i = typeof idx === 'number' ? idx : parseInt(String(idx ?? ''), 10)
  if (Number.isNaN(i) || i < 0 || i >= options.length) return null
  return options[i]?.trim() || null
}

function optionIndex(idx: unknown): number | null {
  if (typeof idx === 'number' && idx >= 0 && idx <= 10) return idx
  if (typeof idx === 'string') {
    const n = parseInt(idx, 10)
    if (!Number.isNaN(n) && n >= 0 && n <= 10) return n
  }
  return null
}

export interface StoreDiagnosisAnswersParams {
  metricsId: string
  linkId: string
  userId?: string
  visitorAnswers: Record<string, unknown>
  segment?: string
  architecture: string
  theme?: string
  objective?: string
  formFields?: FormFieldForAnswers[]
}

/**
 * Insere uma linha por pergunta em ylada_diagnosis_answers.
 * Ignora chaves que começam com _ (internas).
 */
export async function storeDiagnosisAnswers(params: StoreDiagnosisAnswersParams): Promise<void> {
  if (!supabaseAdmin) return

  const {
    metricsId,
    linkId,
    userId,
    visitorAnswers,
    segment,
    architecture,
    theme,
    objective,
    formFields,
  } = params

  const fieldMap = new Map<string, FormFieldForAnswers>()
  if (formFields) {
    for (const f of formFields) fieldMap.set(f.id, f)
  }

  const rows: Array<{
    metrics_id: string
    link_id: string
    segment: string | null
    architecture: string
    question_id: string
    question_label: string | null
    answer_value: unknown
    answer_text: string | null
    answer_index: number | null
    intent_category: string | null
    theme: string | null
    objective: string | null
  }> = []

  for (const [questionId, rawVal] of Object.entries(visitorAnswers)) {
    if (questionId.startsWith('_')) continue

    const field = fieldMap.get(questionId)
    const options = field?.options
    const idx = optionIndex(rawVal)
    const text = idx !== null ? optionIndexToText(idx, options) : null
    const intentCategory = inferIntentCategory(questionId)

    let answerValue: unknown = rawVal
    if (Array.isArray(rawVal)) {
      answerValue = rawVal
    } else if (typeof rawVal === 'number' || typeof rawVal === 'string') {
      answerValue = rawVal
    } else if (rawVal != null) {
      answerValue = String(rawVal)
    }

    rows.push({
      metrics_id: metricsId,
      link_id: linkId,
      segment: segment ?? null,
      architecture,
      question_id: questionId,
      question_label: null,
      answer_value: answerValue,
      answer_text: text,
      answer_index: idx,
      intent_category: intentCategory,
      theme: theme ?? null,
      objective: objective ?? null,
    })
  }

  if (rows.length === 0) return

  const { error } = await supabaseAdmin.from('ylada_diagnosis_answers').insert(rows)
  if (error) {
    console.warn('[diagnosis-answers-store] insert:', error.message)
    return
  }

  // Evento comportamental para analytics/valuation
  if (userId) {
    const { error: eventErr } = await supabaseAdmin.from('ylada_behavioral_events').insert({
      event_type: 'diagnosis_answered',
      user_id: userId,
      link_id: linkId,
      metrics_id: metricsId,
      payload: { segment: segment ?? null, architecture, theme: theme ?? null, objective: objective ?? null },
    })
    if (eventErr) console.warn('[diagnosis-answers-store] behavioral event:', eventErr.message)
  }
}
