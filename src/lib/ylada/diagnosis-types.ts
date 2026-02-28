/**
 * Tipos do Strong Diagnosis Engine (YLADA).
 * @see docs/LINKS-INTELIGENTES-DIAGNOSIS-ENGINE-SPEC.md
 */

export type LinkObjective = 'captar' | 'educar' | 'reter' | 'propagar' | 'indicar'

export type AreaProfissional = 'saude' | 'profissional_liberal' | 'vendas' | 'wellness' | 'geral'

export type DiagnosisArchitecture =
  | 'RISK_DIAGNOSIS'
  | 'BLOCKER_DIAGNOSIS'
  | 'PROJECTION_CALCULATOR'
  | 'PROFILE_TYPE'
  | 'READINESS_CHECKLIST'

export type RiskLevel = 'baixo' | 'medio' | 'alto'

export type BlockerType = 'rotina' | 'emocional' | 'processo' | 'habitos' | 'expectativa'

export type ProfileTypeName = 'consistente' | '8ou80' | 'ansioso' | 'analitico' | 'improvisador'

export interface DiagnosisInput {
  meta: {
    objective: LinkObjective
    theme: { raw: string }
    area_profissional: AreaProfissional
    architecture: DiagnosisArchitecture
  }
  professional: { name?: string; whatsapp?: string }
  visitor_answers: Record<string, unknown>
}

/** Contrato fixo de saída: motor de decisão. Apenas 1 bloqueio; CTA imperativo; nunca solução completa. */
export interface DiagnosisDecisionOutput {
  profile_title: string
  profile_summary: string
  main_blocker: string
  consequence: string
  growth_potential: string
  cta_text: string
  whatsapp_prefill: string
}

/** Retorno de generateDiagnosis: diagnóstico + flag de fallback + level (para métricas). */
export interface DiagnosisGenerationResult {
  diagnosis: DiagnosisDecisionOutput
  fallbackUsed: boolean
  /** Nível de risco (RISK_DIAGNOSIS); undefined para outras arquiteturas. */
  level?: RiskLevel
}

export class DiagnosisValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: keyof DiagnosisDecisionOutput
  ) {
    super(message)
    this.name = 'DiagnosisValidationError'
  }
}

export interface DiagnosisResult {
  title: string
  explanation: string
  evidence_bullets: string[]
  consequence: string
  possibility: string
  next_step: string
  level?: RiskLevel
  score?: number
  profile_type?: string
  blocker_type?: string
  projection?: { min?: number; max?: number; unit?: string }
}

export interface DiagnosisCta {
  helper_text: string
  button_text: string
  whatsapp_prefill: string
}

export interface DiagnosisOutput {
  diagnosis: DiagnosisResult
  cta: DiagnosisCta
}
