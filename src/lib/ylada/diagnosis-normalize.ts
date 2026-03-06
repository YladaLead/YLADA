/**
 * Normalização de visitor_answers (q1, q2...) para as chaves esperadas pelo motor de diagnóstico.
 * O form envia q1, q2, q3...; o motor espera symptoms, barriers, current_value, etc.
 * Para RISK_DIAGNOSIS: tema emagrecimento usa mapeamento específico; outros temas usam score genérico.
 * @see docs/FLUXO-MINIMO-YLADA.md Bloco 2
 * @see docs/DIAGNOSTICO-FASE1-MAPEAMENTO.md
 */

import type { DiagnosisArchitecture } from './diagnosis-types'
import type { RiskLevel } from './diagnosis-types'

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

function optionIndex(v: unknown): number | null {
  if (typeof v === 'number' && v >= 0 && v <= 3) return v
  if (typeof v === 'string') {
    const n = parseInt(v, 10)
    if (!Number.isNaN(n) && n >= 0 && n <= 3) return n
  }
  return null
}

/**
 * Converte índice de opção (0-3) em score 1-10 para BLOCKER_DIAGNOSIS.
 * Índice 0 (primeira opção) = pior = score baixo (2) → dimensão ganha pontos.
 * Índice 3 (última opção) = melhor = score alto (8) → dimensão não ganha pontos.
 * Evita empate: cada pergunta influencia sua dimensão de forma diferenciada.
 */
function optionIndexToBlockerScore(idx: number): number {
  const map = [2, 3, 5, 8] as const
  return map[Math.min(idx, 3)]
}

function impactFromText(v: unknown): 'baixo' | 'medio' | 'alto' {
  const s = String(v ?? '').toLowerCase()
  if (/muito|bastante|demais|alto|grave|sério|forte/.test(s)) return 'alto'
  if (/pouco|um pouco|leve|raro/.test(s)) return 'baixo'
  return 'medio'
}

/** Score genérico: soma dos índices (0-3) das opções. Faixas: leve 0-33%, moderado 34-66%, alto 67-100%. */
function calcGenericScoreAndLevel(answers: Record<string, unknown>): { score: number; level: RiskLevel } | null {
  const keys = Object.keys(answers).filter((k) => /^q\d+$/i.test(k)).sort((a, b) => {
    const na = parseInt(a.slice(1), 10)
    const nb = parseInt(b.slice(1), 10)
    return na - nb
  })
  let sum = 0
  let count = 0
  for (const k of keys) {
    const idx = optionIndex(answers[k])
    if (idx !== null) {
      sum += idx
      count++
    }
  }
  if (count === 0) return null
  const maxScore = count * 3
  const third = Math.ceil(maxScore / 3)
  const twoThirds = Math.ceil((2 * maxScore) / 3)
  let level: RiskLevel = 'baixo'
  if (sum >= twoThirds) level = 'alto'
  else if (sum >= third) level = 'medio'
  return { score: sum, level }
}

/** Mapeia q1..qn para as chaves esperadas pelo motor, por arquitetura. */
export function normalizeVisitorAnswers(
  answers: Record<string, unknown>,
  architecture: DiagnosisArchitecture,
  options?: { themeRaw?: string }
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
      const themeLower = (options?.themeRaw ?? '').toLowerCase()
      const isEmagrecimento = /emagrecimento|perda de peso|emagrecer|peso/.test(themeLower)

      // Score genérico para temas não-emagrecimento (intestino, energia, etc.)
      if (!isEmagrecimento) {
        const generic = calcGenericScoreAndLevel(answers)
        if (generic) {
          out.generic_score = generic.score
          out.generic_level = generic.level
          out.symptoms = ['relatado'] // mínimo para o motor não falhar
          out.history_flags = []
          out.impact_level = generic.level === 'alto' ? 'alto' : generic.level === 'medio' ? 'medio' : 'baixo'
          out.attempts_count = 0
          break
        }
      }

      const q1Idx = optionIndex(q1)
      const q2Idx = optionIndex(q2)
      const q3Idx = optionIndex(q3)

      if (q1Idx !== null) {
        out.symptoms = Array.from({ length: Math.max(1, q1Idx) }, () => 'relatado')
      } else {
        const symptoms = toArr(out.symptoms ?? out.sintomas ?? q1)
        if (symptoms.length === 0 && typeof q1 === 'string') {
          out.symptoms = [q1.trim()].filter(Boolean)
        } else if (symptoms.length > 0) {
          out.symptoms = symptoms
        }
      }

      if (q2Idx !== null) {
        const attemptsMap = [0, 1, 3, 5] as const
        const historyMap: string[][] = [[], ['uma vez'], ['várias vezes'], ['muitas vezes']]
        out.attempts_count = attemptsMap[q2Idx]
        out.history_flags = historyMap[q2Idx]
      } else {
        const history = toArr(out.history_flags ?? out.historico ?? out.history ?? q2)
        if (history.length > 0) out.history_flags = history
        if (out.attempts_count === undefined) {
          out.attempts_count = toNum(q2, 1)
        }
      }

      const impactIdx = optionIndex(q4) ?? optionIndex(q3)
      if (impactIdx !== null) {
        const impactMap = ['baixo', 'medio', 'alto', 'alto'] as const
        out.impact_level = impactMap[impactIdx]
      } else if (out.impact_level === undefined && out.impact === undefined) {
        out.impact_level = impactFromText(q3)
      }
      if (optionIndex(q4) !== null && optionIndex(q3) !== null) {
        const kgMap = ['menos_5', '5_10', '10_20', 'mais_20'] as const
        out.target_kg_range = kgMap[optionIndex(q3)!]
      }
      break
    }
    case 'BLOCKER_DIAGNOSIS': {
      // Cada pergunta alimenta uma dimensão específica. Índice 0-3 → score 2,3,5,8.
      // q1→rotina, q2→emocional, q3→processo, q4→habitos, q5→expectativa.
      const idx1 = optionIndex(q1)
      const idx2 = optionIndex(q2)
      const idx3 = optionIndex(q3)
      const idx4 = optionIndex(q4)
      const idx5 = optionIndex(q5)

      if (out.routine_consistency === undefined) {
        out.routine_consistency = idx1 !== null ? optionIndexToBlockerScore(idx1) : inferScore(q1, 5)
      }
      if (out.emotional_triggers === undefined) {
        out.emotional_triggers = idx2 !== null ? optionIndexToBlockerScore(idx2) : inferScore(q2, 5)
      }
      if (out.process_clarity === undefined) {
        out.process_clarity = idx3 !== null ? optionIndexToBlockerScore(idx3) : inferScore(q3, 5)
      }
      if (out.habits_quality === undefined) {
        out.habits_quality = idx4 !== null ? optionIndexToBlockerScore(idx4) : inferScore(q4, 5)
      }
      if (out.goal_realism === undefined) {
        out.goal_realism = idx5 !== null ? optionIndexToBlockerScore(idx5) : 5
      }

      // barriers: se q1 for texto livre, usa para keywords; senão mantém vazio (score já cobre)
      const barriers = toArr(out.barriers ?? out.barreiras)
      if (barriers.length > 0) out.barriers = barriers
      else if (typeof q1 === 'string' && idx1 === null && q1.trim().length > 2) {
        out.barriers = [q1.trim()].filter(Boolean)
      }
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
