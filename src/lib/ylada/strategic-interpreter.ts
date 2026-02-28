/**
 * Camada 0 — Interpretador Estratégico (YLADA).
 * Decide intent, sensibilidade do tema, arquiteturas permitidas e regras de copy
 * antes de escolher fluxo/perguntas/diagnóstico. Evita mistura captação vs laudo
 * e reduz risco regulatório em temas sensíveis (ex.: medicamentos).
 * @see docs/ANALISE-PROMPT-CAMADA-DECISAO-SERGIO.md
 */

/** Classificação do tema (heurística local; sem IA). */
export interface ThemeClassification {
  isSensitiveMedical: boolean
  keywords: string[]
}

/** Decisão da Camada 0: o que a UI e o generate/diagnosis devem respeitar. */
export interface StrategyContextDecision {
  intent: 'captar' | 'qualificar' | 'educar' | 'reativar'
  safety_mode: boolean
  sensitivity_tags: string[]
  safe_theme: string | null
  allowed_architectures: Array<'RISK_DIAGNOSIS' | 'BLOCKER_DIAGNOSIS'>
  copy_policy: {
    forbid_risk_about_theme: boolean
    append_disclaimer: boolean
  }
}

/** Entrada mínima para o interpretador (compatível com getStrategies e generate). */
export interface StrategyContextInput {
  objective: string
  theme_raw: string
  area_profissional?: string
}

/** Contexto detectado para safe_theme (sem IA). */
export interface SafeThemeContext {
  safe_theme: string
  context_tag: string
}

// --- Mapeamento de contexto → tema seguro (evita "emagrecimento assistido" fixo) ---
const SAFE_THEME_CONTEXTS: Array<{
  context_tag: string
  keywords: string[]
  safe_theme: string
}> = [
  {
    context_tag: 'context_weight_loss',
    safe_theme: 'controle de peso',
    keywords: [
      'peso', 'emagrecer', 'emagrecimento', 'obesidade', 'imc', 'barriga', 'compulsão', 'compulsao',
      'caneta', 'injeção', 'injecao', 'injection', 'semaglutida', 'ozempic', 'mounjaro', 'tirzepatide',
      'tizerpatide', 'wegovy', 'zepbound', 'liraglutida', 'saxenda', 'orlistat', 'sibutramina',
    ],
  },
  {
    context_tag: 'context_hormonal',
    safe_theme: 'saúde hormonal',
    keywords: [
      'hormônio', 'hormonio', 'hormonal', 'menopausa', 'testosterona', 'tireoide', 'tireóide',
      'endócrino', 'endocrino', 'reposição hormonal', 'reposicao hormonal',
    ],
  },
  {
    context_tag: 'context_emotional',
    safe_theme: 'saúde emocional',
    keywords: [
      'ansiedade', 'depressão', 'depressao', 'pânico', 'panico', 'burnout', 'tdah', 'TDAH',
      'antidepressivo', 'psiquiatria', 'saúde mental', 'saude mental', 'emocional',
    ],
  },
  {
    context_tag: 'context_skin',
    safe_theme: 'saúde da pele',
    keywords: [
      'acne', 'pele', 'dermatite', 'melasma', 'dermatologia', 'isotretinoína', 'isotretinoina',
      'roacutan', 'estética facial', 'estetica facial',
    ],
  },
  {
    context_tag: 'context_metabolic',
    safe_theme: 'saúde metabólica',
    keywords: [
      'colesterol', 'triglicerídeos', 'triglicerideos', 'diabetes', 'glicemia', 'glicêmico', 'glicemico',
      'resistência à insulina', 'resistencia a insulina', 'pressão', 'pressao', 'metabólico', 'metabolico',
    ],
  },
]

/**
 * Detecta o contexto do tema (peso, hormonal, emocional, pele, metabólico) para definir
 * safe_theme quando safety_mode. Heurística por keywords; fallback = "saúde e bem-estar".
 */
export function detectSafeThemeContext(
  theme_raw: string,
  _classification: ThemeClassification
): SafeThemeContext {
  const normalized = theme_raw.toLowerCase().trim()
  if (!normalized) return { safe_theme: 'saúde e bem-estar', context_tag: 'context_generic' }

  for (const ctx of SAFE_THEME_CONTEXTS) {
    const found = ctx.keywords.some((kw) => normalized.includes(kw.toLowerCase()))
    if (found) return { safe_theme: ctx.safe_theme, context_tag: ctx.context_tag }
  }

  return { safe_theme: 'saúde e bem-estar', context_tag: 'context_generic' }
}

// --- Lista local de termos sensíveis (medicamentos / substâncias / prescrição) ---
const SENSITIVE_MEDICAL_KEYWORDS: string[] = [
  // Medicamentos (pt + en, variações comuns)
  'tirzepatide',
  'tizerpatide',
  'tirzepatida',
  'semaglutida',
  'semaglutide',
  'ozempic',
  'wegovy',
  'mounjaro',
  'zepbound',
  'liraglutida',
  'liraglutide',
  'saxenda',
  'victoza',
  'orlistat',
  'sibutramina',
  'anfetamina',
  'metformina',
  'gliclazida',
  'canagliflozina',
  'empagliflozina',
  'dapagliflozina',
  'injetável',
  'injetavel',
  // Termos de uso / prescrição
  'caneta',
  'injeção',
  'injecao',
  'injection',
  'dose',
  'dosagem',
  'prescrição',
  'prescricao',
  'prescription',
  'medicamento',
  'remédio',
  'remedio',
  'medication',
  'tratamento medicamentoso',
  'uso de medicamento',
  'medicamento para emagrecer',
  'remédio para emagrecer',
  'fármaco',
  'farmaco',
]

/**
 * Classifica o tema em sensível (medicamento/prescrição) ou não.
 * Heurística local: lista de palavras-chave; sem IA.
 */
export function classifyTheme(theme_raw: string): ThemeClassification {
  const normalized = theme_raw.toLowerCase().trim()
  if (!normalized) return { isSensitiveMedical: false, keywords: [] }

  const keywords: string[] = []
  for (const kw of SENSITIVE_MEDICAL_KEYWORDS) {
    if (normalized.includes(kw.toLowerCase())) keywords.push(kw)
  }

  return {
    isSensitiveMedical: keywords.length > 0,
    keywords,
  }
}

function normalizeIntent(obj: string): StrategyContextDecision['intent'] {
  const o = obj.toLowerCase().trim()
  if (o === 'qualificar' || o === 'educar' || o === 'reativar') return o as StrategyContextDecision['intent']
  return 'captar'
}

function isAreaSaude(area_profissional?: string): boolean {
  if (!area_profissional) return false
  const a = area_profissional.toLowerCase()
  return /medico|médico|nutri|nutricionista|dentista|psicolog|odont|fisio|enferm|saude|saúde/.test(a)
}

/**
 * Interpretador Estratégico (Camada 0).
 * Retorna decisão de intent, safety_mode, safe_theme, allowed_architectures e copy_policy.
 */
export function interpretStrategyContext(input: StrategyContextInput): StrategyContextDecision {
  const objective = (input.objective || 'captar').toString().trim()
  const theme_raw = (input.theme_raw || '').toString().trim()
  const classification = classifyTheme(theme_raw)
  const intent = normalizeIntent(objective)
  const areaSaude = isAreaSaude(input.area_profissional)

  // Regra A: tema sensível médico + objetivo captar → safety_mode, só BLOCKER, tema por contexto
  if (objective === 'captar' && classification.isSensitiveMedical) {
    const { safe_theme, context_tag } = detectSafeThemeContext(theme_raw, classification)
    return {
      intent: 'captar',
      safety_mode: true,
      sensitivity_tags: ['medical_medication', context_tag],
      safe_theme,
      allowed_architectures: ['BLOCKER_DIAGNOSIS'],
      copy_policy: {
        forbid_risk_about_theme: true,
        append_disclaimer: true,
      },
    }
  }

  // Regra B: saúde + captar (tema não sensível) → permitir RISK e BLOCKER como hoje
  if (areaSaude && objective === 'captar') {
    return {
      intent: 'captar',
      safety_mode: false,
      sensitivity_tags: [],
      safe_theme: null,
      allowed_architectures: ['RISK_DIAGNOSIS', 'BLOCKER_DIAGNOSIS'],
      copy_policy: {
        forbid_risk_about_theme: false,
        append_disclaimer: false,
      },
    }
  }

  // Fallback: outros casos (educar, reter, outras áreas) — permitir ambos por padrão
  return {
    intent: intent as StrategyContextDecision['intent'],
    safety_mode: false,
    sensitivity_tags: [],
    safe_theme: null,
    allowed_architectures: ['RISK_DIAGNOSIS', 'BLOCKER_DIAGNOSIS'],
    copy_policy: {
      forbid_risk_about_theme: false,
      append_disclaimer: false,
    },
  }
}
