/**
 * Identifica o objetivo estratégico do profissional a partir da mensagem.
 * Fluxo: Mensagem → SITUAÇÃO → PERFIL → OBJETIVO (este matcher) → biblioteca.
 *
 * O objetivo orienta o foco da resposta: gerar_contatos vs melhorar_conversão vs criar_posicionamento.
 */

import {
  NOEL_STRATEGIC_OBJECTIVES,
  OBJECTIVE_KEYWORDS,
  type NoelStrategicObjective,
} from '@/config/noel-strategic-objectives'

const TOP_N_OBJECTIVES = 2

/**
 * Retorna os objetivos que melhor correspondem à mensagem.
 * Prioridade: match por keywords (primeiro match com mais keywords ganha).
 */
export function getStrategicObjectivesForMessage(message: string): NoelStrategicObjective[] {
  const lower = message.toLowerCase().trim()
  if (!lower) return []

  const scored: Array<{ objective: NoelStrategicObjective; score: number }> = []

  for (const [objectiveCode, keywords] of Object.entries(OBJECTIVE_KEYWORDS)) {
    let score = 0
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) score += 1
    }
    if (score > 0) {
      const objective = NOEL_STRATEGIC_OBJECTIVES.find((o) => o.objective_code === objectiveCode)
      if (objective) scored.push({ objective, score })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, TOP_N_OBJECTIVES).map((s) => s.objective)
}

/**
 * Retorna o primeiro objetivo (compatibilidade).
 */
export function getStrategicObjectiveForMessage(message: string): NoelStrategicObjective | null {
  const objectives = getStrategicObjectivesForMessage(message)
  return objectives[0] ?? null
}

/**
 * Formata um ou mais objetivos para injetar no prompt.
 */
export function formatStrategicObjectiveForPrompt(
  objectiveOrObjectives: NoelStrategicObjective | NoelStrategicObjective[]
): string {
  const objectives = Array.isArray(objectiveOrObjectives) ? objectiveOrObjectives : [objectiveOrObjectives]
  if (objectives.length === 0) return ''

  return objectives
    .map((obj, i) => {
      const prefix = objectives.length > 1 ? `[Objetivo ${i + 1}] ` : ''
      return `${prefix}${obj.objective_title}: ${obj.description}`
    })
    .join('\n')
}
