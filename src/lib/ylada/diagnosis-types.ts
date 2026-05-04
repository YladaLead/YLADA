/**
 * Tipos do Strong Diagnosis Engine (YLADA).
 * @see docs/LINKS-INTELIGENTES-DIAGNOSIS-ENGINE-SPEC.md
 */

export type LinkObjective = 'captar' | 'educar' | 'reter' | 'propagar' | 'indicar'

/** Vertical de entrega do diagnóstico (Pro Terapia Capilar, Pro Estética Corporal, Pro Líderes). */
export type DiagnosisVertical = 'capilar' | 'corporal' | 'pro_lideres'

export type AreaProfissional = 'saude' | 'profissional_liberal' | 'vendas' | 'wellness' | 'geral'

export type DiagnosisArchitecture =
  | 'RISK_DIAGNOSIS'
  | 'BLOCKER_DIAGNOSIS'
  | 'PROJECTION_CALCULATOR'
  | 'PROFILE_TYPE'
  | 'READINESS_CHECKLIST'
  | 'PERFUME_PROFILE'

export type RiskLevel = 'baixo' | 'medio' | 'alto'

export type BlockerType = 'rotina' | 'emocional' | 'processo' | 'habitos' | 'expectativa'

export type ProfileTypeName = 'consistente' | '8ou80' | 'ansioso' | 'analitico' | 'improvisador'

/** Perfis de fragrância para PERFUME_PROFILE (segment perfumaria). */
export type PerfumeProfileCode =
  | 'elegancia_natural'
  | 'presença_magnetica'
  | 'leveza_floral'
  | 'sofisticacao_classica'
  | 'energia_vibrante'
  | 'seducao_sutil'
  | 'intensidade_noturna'
  | 'charme_discreto'

/** Uso principal do perfume (PERFUME_USAGE) — para recomendações. */
export type PerfumeUsage = 'dia_a_dia' | 'trabalho' | 'encontros' | 'eventos'

export interface DiagnosisInput {
  meta: {
    objective: LinkObjective
    theme: { raw: string }
    area_profissional: AreaProfissional
    architecture: DiagnosisArchitecture
    /** segment_code para variantes por segmento (dentistry, aesthetics, nutrition, fitness, wellness). */
    segment_code?: string
    /** Quando definido, o motor usa copy específica da vertical (capilar / corporal / pró líderes). */
    diagnosis_vertical?: DiagnosisVertical
  }
  professional: { name?: string; whatsapp?: string }
  visitor_answers: Record<string, unknown>
}

/** Contrato fixo de saída: motor de decisão. Apenas 1 bloqueio; CTA imperativo; nunca solução completa. */
export interface DiagnosisDecisionOutput {
  profile_title: string
  /** Leitura personalizada (identificação). */
  profile_summary: string
  /** Diagnóstico: desafios/problemas identificados. */
  main_blocker: string
  /** Causa provável (não certeza). Linguagem: "provavelmente", "tende a". */
  causa_provavel?: string
  /** Preocupações: pontos de atenção para ter em mente. */
  preocupacoes?: string
  /** Espelho comportamental opcional: "Isso não é X. É Y." Remove culpa. */
  espelho_comportamental?: string
  consequence: string
  /** Providências: ações a serem tomadas. */
  growth_potential: string
  /** 2–3 ações específicas, sempre direcionando ao profissional. */
  specific_actions?: string[]
  /** Dica rápida educativa (micro-conteúdo embutido). */
  dica_rapida?: string
  /** Frase de identificação emocional: "Se você se identificou com esse resultado...". */
  frase_identificacao?: string
  /** Direcionamento: CTA discreto ao especialista. */
  cta_text: string
  whatsapp_prefill: string
}

/** Retorno de generateDiagnosis: diagnóstico + flag de fallback + level (para métricas). */
export interface DiagnosisGenerationResult {
  diagnosis: DiagnosisDecisionOutput
  fallbackUsed: boolean
  /** Nível de risco (RISK_DIAGNOSIS); undefined para outras arquiteturas. */
  level?: RiskLevel
  /** Tipo de bloqueio (BLOCKER_DIAGNOSIS); para lookup de archetype. */
  blocker_type?: BlockerType
  /** Perfil de fragrância (PERFUME_PROFILE); para lookup de archetype. */
  perfume_profile_code?: PerfumeProfileCode
  /** Uso principal do perfume (PERFUME_PROFILE); para recomendações. */
  perfume_usage?: PerfumeUsage
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
