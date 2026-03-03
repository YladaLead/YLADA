/**
 * Strategy Engine — Direção Estratégica.
 * Módulo isolado: diagnóstico do profissional + 2 estratégias (activation + authority).
 * @see docs/PLANO-IMPLANTACAO-DIRECAO-ESTRATEGICA.md
 */

export type {
  ProfileInput,
  BehaviorInput,
  ProfessionalDiagnosis,
  StrategyCard,
  StrategyQuestion,
  StrategyRecommendation,
} from './types'

export { getProfessionalDiagnosis } from './profile-diagnosis'
export { getStrategyRecommendation } from './strategy-recommendation'
export { flowIdToStrategyType, enrichBehaviorWithLastLinkType } from './behavior'
