/**
 * Normalização de visitor_answers (q1, q2...) para as chaves esperadas pelo motor de diagnóstico.
 * O form envia q1, q2, q3...; o motor espera symptoms, barriers, current_value, etc.
 * @see docs/FLUXO-MINIMO-YLADA.md Bloco 2
 */

import type { DiagnosisArchitecture } from './diagnosis-types'

function toArr(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean)
  if (typeof v === 'string') return v.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
  return []
}

function toNum(v: unknown, def: number): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v
  if (typeof v === 'string') {
    const n = parseFloat(v.replace(/\D/g, ''))
    if (!Number.isNaN(n)) return n
    const lower = v.toLowerCase()
    if (/nada|nenhum|zero|nunca/.test(lower)) return 0
    if (/uma vez|um vez|1 vez/.test(lower)) return 1
    if (/duas|duas vezes|2/.test(lower)) return 2
    if (/várias|algumas|muitas|3|4|5/.test(lower)) return 4
  }
  return def
}

function impactFromText(v: unknown): 'baixo' | 'medio' | 'alto' {
  const s = String(v ?? '').toLowerCase()
  if (/muito|bastante|demais|alto|grave|sério|forte/.test(s)) return 'alto'
  if (/pouco|um pouco|leve|raro/.test(s)) return 'baixo'
  return 'medio'
}

/** Mapeia q1..qn para as chaves esperadas pelo motor, por arquitetura. */
export function normalizeVisitorAnswers(
  answers: Record<string, unknown>,
  architecture: DiagnosisArchitecture
): Record<string, unknown> {
  const q1 = answers.q1 ?? answers.Q1
  const q2 = answers.q2 ?? answers.Q2
  const q3 = answers.q3 ?? answers.Q3
  const q4 = answers.q4 ?? answers.Q4
  const q5 = answers.q5 ?? answers.Q5

  // Se já tem as chaves esperadas, não sobrescrever
  const out = { ...answers }

  switch (architecture) {
    case 'RISK_DIAGNOSIS': {
      const symptoms = toArr(out.symptoms ?? out.sintomas ?? q1)
      if (symptoms.length === 0 && typeof q1 === 'string') {
        out.symptoms = [q1.trim()].filter(Boolean)
      } else if (symptoms.length > 0) {
        out.symptoms = symptoms
      }
      const history = toArr(out.history_flags ?? out.historico ?? out.history ?? q2)
      if (history.length > 0) out.history_flags = history
      if (out.impact_level === undefined && out.impact === undefined) {
        out.impact_level = impactFromText(q3)
      }
      if (out.attempts_count === undefined) {
        out.attempts_count = toNum(q2, 1)
      }
      break
    }
    case 'BLOCKER_DIAGNOSIS': {
      const barriers = toArr(out.barriers ?? out.barreiras ?? q1)
      if (barriers.length === 0 && typeof q1 === 'string') {
        out.barriers = [q1.trim()].filter(Boolean)
      } else if (barriers.length > 0) {
        out.barriers = barriers
      }
      if (out.routine_consistency === undefined) out.routine_consistency = inferScore(q2, 5)
      if (out.process_clarity === undefined) out.process_clarity = inferScore(q3, 5)
      if (out.goal_realism === undefined) out.goal_realism = inferScore(q4, 5)
      if (out.emotional_triggers === undefined) out.emotional_triggers = inferScore(q1, 5)
      if (out.habits_quality === undefined) out.habits_quality = inferScore(q2, 5)
      break
    }
    case 'PROJECTION_CALCULATOR': {
      if (out.current_value === undefined) out.current_value = toNum(q1, 0)
      if (out.target_value === undefined) out.target_value = toNum(q2, out.current_value as number + 10)
      if (out.days === undefined) out.days = toNum(q3, 100)
      if (out.consistency_level === undefined) {
        const n = toNum(q4, 5)
        out.consistency_level = n >= 1 && n <= 10 ? n : 5
      }
      break
    }
    case 'PROFILE_TYPE': {
      if (out.consistency === undefined) out.consistency = inferScore(q1, 5)
      if (out.planning_style === undefined && typeof q2 === 'string') out.planning_style = q2
      if (out.emotion_level === undefined) out.emotion_level = inferScore(q3, 5)
      if (out.decision_speed === undefined) out.decision_speed = inferScore(q4, 5)
      if (out.follow_through === undefined) out.follow_through = inferScore(q5 ?? q1, 5)
      break
    }
    case 'READINESS_CHECKLIST': {
      const formFields = answers._formFields as Array<{ id: string; label: string }> | undefined
      if (Array.isArray(formFields) && formFields.length > 0) {
        const checklist = formFields.map((f) => ({
          label: f.label,
          value: answers[f.id] ?? answers[f.id.toLowerCase()],
        }))
        out.checklist = checklist
      } else {
        const items = [q1, q2, q3, q4].filter((v) => v !== undefined && v !== null && v !== '')
        if (items.length > 0) {
          out.checklist = items.map((v) => ({
            label: String(v).slice(0, 50),
            value: /sim|s|yes|1|verdadeiro/i.test(String(v)) ? true : false,
          }))
        }
      }
      break
    }
  }

  return out
}

function inferScore(v: unknown, def: number): number {
  const n = toNum(v, def)
  if (n >= 1 && n <= 10) return n
  const s = String(v ?? '').toLowerCase()
  if (/muito|bastante|sempre|organizad|claro|alto/.test(s)) return 7
  if (/pouco|nunca|bagunçad|confus|baixo/.test(s)) return 3
  return def
}
