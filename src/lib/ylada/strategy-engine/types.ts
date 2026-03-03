/**
 * Tipos do Strategy Engine — Direção Estratégica.
 * Entrada: perfil (ylada_noel_profile) + comportamento opcional.
 * Saída: diagnóstico + 2 estratégias (activation + authority).
 */

/** Entrada do perfil profissional (compatível com ylada_noel_profile). */
export interface ProfileInput {
  user_id?: string
  segment?: string
  profile_type?: string
  area_profissional?: string
  profession?: string
  objetivo?: string
  dor_principal?: string
  publico?: string
  maturity_stage?: string
  urgency_level?: string
  language?: 'pt' | 'en' | 'es'
  /** Campos adicionais do perfil. */
  category?: string
  sub_category?: string
  fase_negocio?: string
  prioridade_atual?: string
  objetivos_curto_prazo?: string
  metas_principais?: string
  capacidade_semana?: number
  tempo_atuacao_anos?: number
}

/** Entrada de comportamento (métricas de uso). */
export interface BehaviorInput {
  links_created_total?: number
  links_created_last_7_days?: number
  last_link_created_at?: string
  last_link_type?: 'activation' | 'authority'
  submissions_last_7_days?: number
}

/** Diagnóstico estratégico do profissional. */
export interface ProfessionalDiagnosis {
  blocker: string
  focus: string
  why: string
  tone: 'firm' | 'balanced' | 'consultive'
  summary_lines: string[]
}

/** Pergunta do formulário (para StrategyCard). */
export interface StrategyQuestion {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'multiselect'
  options?: string[]
  required?: boolean
}

/** Card de estratégia (activation ou authority). */
export interface StrategyCard {
  type: 'activation' | 'authority'
  flow_id: string
  title: string
  reason: string
  theme: string
  questions: StrategyQuestion[]
  cta_suggestion: string
}

/** Recomendação completa (diagnóstico + 2 estratégias). */
export interface StrategyRecommendation {
  professional_diagnosis: ProfessionalDiagnosis
  strategies: [StrategyCard, StrategyCard]
  meta: {
    version: string
    generated_at: string
  }
}
