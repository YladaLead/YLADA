/**
 * Identifica o estágio do funil a partir da mensagem do profissional.
 * O estágio indica em que fase o cliente/lead está (curiosidade vs decisão).
 *
 * Ex.: "As pessoas perguntam preço" → curiosidade (diagnóstico antes de preço)
 *      "Interessados não fecham" → decisão (explicar valor)
 */

import {
  NOEL_FUNNEL_STAGES,
  FUNNEL_STAGE_KEYWORDS,
  type NoelFunnelStage,
} from '@/config/noel-funnel-stages'

const TOP_N_STAGES = 2

/**
 * Retorna os estágios que melhor correspondem à mensagem.
 */
export function getFunnelStagesForMessage(message: string): NoelFunnelStage[] {
  const lower = message.toLowerCase().trim()
  if (!lower) return []

  const scored: Array<{ stage: NoelFunnelStage; score: number }> = []

  for (const [stageCode, keywords] of Object.entries(FUNNEL_STAGE_KEYWORDS)) {
    let score = 0
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) score += 1
    }
    if (score > 0) {
      const stage = NOEL_FUNNEL_STAGES.find((s) => s.stage_code === stageCode)
      if (stage) scored.push({ stage, score })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, TOP_N_STAGES).map((s) => s.stage)
}

/**
 * Retorna o primeiro estágio (compatibilidade).
 */
export function getFunnelStageForMessage(message: string): NoelFunnelStage | null {
  const stages = getFunnelStagesForMessage(message)
  return stages[0] ?? null
}

/**
 * Formata um ou mais estágios para injetar no prompt.
 */
export function formatFunnelStageForPrompt(
  stageOrStages: NoelFunnelStage | NoelFunnelStage[]
): string {
  const stages = Array.isArray(stageOrStages) ? stageOrStages : [stageOrStages]
  if (stages.length === 0) return ''

  return stages
    .map((s, i) => {
      const prefix = stages.length > 1 ? `[Estágio ${i + 1}] ` : ''
      return `${prefix}${s.stage_title}: ${s.description}`
    })
    .join('\n')
}
