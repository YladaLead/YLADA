/**
 * Mapeamento e análise de comportamento para o Strategy Engine.
 * Converte flow_id do último link em last_link_type (activation | authority).
 * @see docs/PLANO-IMPLANTACAO-DIRECAO-ESTRATEGICA.md (Etapa 5)
 */

import { FLOW_IDS } from '@/config/ylada-flow-catalog'
import type { BehaviorInput } from './types'

/** Fluxos de activation (conversas diretas, volume). */
const ACTIVATION_FLOW_IDS = new Set([
  FLOW_IDS.checklist_prontidao,
  FLOW_IDS.diagnostico_risco,
  FLOW_IDS.diagnostico_bloqueio,
])

/** Fluxos de authority (posicionamento, autoridade). */
const AUTHORITY_FLOW_IDS = new Set([
  FLOW_IDS.perfil_comportamental,
  FLOW_IDS.calculadora_projecao,
])

/**
 * Mapeia flow_id do link para tipo de estratégia (activation | authority).
 */
export function flowIdToStrategyType(flowId: string | null | undefined): 'activation' | 'authority' | undefined {
  if (!flowId || typeof flowId !== 'string') return undefined
  const id = flowId.trim()
  if (ACTIVATION_FLOW_IDS.has(id)) return 'activation'
  if (AUTHORITY_FLOW_IDS.has(id)) return 'authority'
  return undefined
}

/**
 * Enriquece BehaviorInput com last_link_type a partir do config_json do último link.
 */
export function enrichBehaviorWithLastLinkType(
  behavior: BehaviorInput | undefined,
  lastLinkConfigJson: Record<string, unknown> | null | undefined
): BehaviorInput | undefined {
  if (!behavior) return undefined
  const meta = lastLinkConfigJson?.meta as Record<string, unknown> | undefined
  const flowId = meta?.flow_id as string | undefined
  const lastLinkType = flowIdToStrategyType(flowId)
  if (!lastLinkType) return behavior
  return { ...behavior, last_link_type: lastLinkType }
}
