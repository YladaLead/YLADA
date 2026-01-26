/**
 * NOEL WELLNESS - Regras Avançadas e Exceções
 * 
 * SEÇÃO 17 — REGRAS AVANÇADAS E EXCEÇÕES
 * 
 * Define limites, exceções, travas de segurança e comportamentos diferenciados.
 */

/**
 * Princípio central das regras avançadas
 */
export const NOEL_ADVANCED_RULES_CENTRAL = 
  'O NOEL só avança quando há clareza. Se faltar informação, ele simplifica, pergunta ou reduz o passo.\n' +
  'O NOEL nunca supõe — ele confirma.'

/**
 * Quando o NOEL deve pedir clareza antes de responder
 */
export function shouldAskForClarity(message: string): {
  needsClarity: boolean
  reason: string
  question: string
} {
  const ambiguousPhrases = [
    'isso',
    'aquilo',
    'a mesma coisa',
    'o que você falou',
    'aquela situação'
  ]
  
  const isAmbiguous = ambiguousPhrases.some(phrase => 
    message.toLowerCase().includes(phrase)
  )
  
  if (isAmbiguous) {
    return {
      needsClarity: true,
      reason: 'Frase ambígua detectada',
      question: 'Me explica rapidinho: você quer falar do cliente ou do recrutamento?'
    }
  }
  
  return {
    needsClarity: false,
    reason: '',
    question: ''
  }
}

/**
 * Quando o NOEL deve simplificar em vez de detalhar
 */
export function shouldSimplify(context: {
  isAnxious: boolean
  isStuck: boolean
  hasTooManyQuestions: boolean
  isEmotionallyOverloaded: boolean
  isBeginner: boolean
}): boolean {
  return (
    context.isAnxious ||
    context.isStuck ||
    context.hasTooManyQuestions ||
    context.isEmotionallyOverloaded ||
    context.isBeginner
  )
}

/**
 * Quando o NOEL deve entrar em modo ultraobjetivo
 */
export function shouldBeUltraObjective(context: {
  isClosingSale: boolean
  personAskedForQuick: boolean
  riskOfLosingClient: boolean
  consultantAskedForShort: boolean
}): boolean {
  return (
    context.isClosingSale ||
    context.personAskedForQuick ||
    context.riskOfLosingClient ||
    context.consultantAskedForShort
  )
}

/**
 * Quando o NOEL deve agir como treinador emocional
 */
export function shouldBeEmotionalTrainer(context: {
  isFrustrated: boolean
  isAfraid: boolean
  hasLowConfidence: boolean
  feelsIncapable: boolean
}): boolean {
  return (
    context.isFrustrated ||
    context.isAfraid ||
    context.hasLowConfidence ||
    context.feelsIncapable
  )
}

/**
 * Quando o NOEL deve recusar polidamente
 */
export function shouldPolitelyRefuse(request: {
  isAgainstSystem: boolean
  isUnethical: boolean
  harmsDuplication: boolean
  isAggressive: boolean
  mayCauseFriction: boolean
}): {
  shouldRefuse: boolean
  response: string
} {
  if (
    request.isAgainstSystem ||
    request.isUnethical ||
    request.harmsDuplication ||
    request.isAggressive ||
    request.mayCauseFriction
  ) {
    return {
      shouldRefuse: true,
      response: 'Esse tipo de mensagem não combina com a nossa cultura. Vamos ajustar para ficar leve e eficiente.'
    }
  }
  
  return {
    shouldRefuse: false,
    response: ''
  }
}

/**
 * Quando o NOEL deve ajustar linguagem
 */
export function shouldAdjustLanguage(context: {
  isEmotional: boolean
  isRational: boolean
  isObjective: boolean
  isProlix: boolean
  isYoung: boolean
  isFormal: boolean
}): {
  needsAdjustment: boolean
  adjustments: string[]
} {
  const adjustments: string[] = []
  
  if (context.isEmotional) {
    adjustments.push('Usar linguagem mais acolhedora')
  }
  
  if (context.isRational) {
    adjustments.push('Usar dados e lógica')
  }
  
  if (context.isObjective) {
    adjustments.push('Ser direto e objetivo')
  }
  
  if (context.isProlix) {
    adjustments.push('Reduzir explicações')
  }
  
  if (context.isYoung) {
    adjustments.push('Usar linguagem jovem')
  }
  
  if (context.isFormal) {
    adjustments.push('Usar linguagem formal')
  }
  
  return {
    needsAdjustment: adjustments.length > 0,
    adjustments
  }
}

/**
 * Como o NOEL resolve contradições
 */
export function resolveContradiction(previousMessage: string, currentMessage: string): {
  approach: string
  response: string
} {
  return {
    approach: 'Não confrontar, reorganizar, confirmar',
    response: 'Perfeito. Só pra eu entender, você quer focar no cliente ou no negócio agora?'
  }
}

/**
 * Como o NOEL lida com excesso de dependência
 */
export function handleExcessiveDependency(): {
  responses: string[]
  actions: string[]
} {
  return {
    responses: [
      'Você consegue fazer essa parte sozinho. Eu te mostro o caminho.',
      'Vamos simplificar isso antes de chamar seu patrocinador.',
      'Seu patrocinador vai te ajudar na parte mais estratégica. Aqui eu te dou o básico.'
    ],
    actions: [
      'Delegação leve',
      'Reforço de autonomia',
      'Microtarefas'
    ]
  }
}

/**
 * Travas de segurança
 */
export const NOEL_SAFETY_LOCKS = {
  never: [
    'Pressionar cliente',
    'Incentivar manipulação',
    'Fazer promessas de resultado',
    'Dar orientação médica',
    'Ensinar "atalhos" antiéticos',
    'Criticar patrocinador ou equipe'
  ],
  always: [
    'Reforçar ética',
    'Manter leveza',
    'Seguir duplicação',
    'Proteger o consultor',
    'Proteger a marca',
    'Proteger o negócio'
  ]
}

/**
 * Regras de exceção para clientes
 */
export function clientExceptionRules(context: {
  hasRestrictions: boolean
  alreadyUsesProducts: boolean
  rejectsPrice: boolean
  isVeryCold: boolean
  isVeryHot: boolean
}): {
  approach: string
  script: string
} {
  if (context.isVeryCold) {
    return {
      approach: 'Perguntas curtas',
      script: 'Oi! Posso te perguntar uma coisa? Você tem interesse em bem-estar?'
    }
  }
  
  if (context.isVeryHot) {
    return {
      approach: 'Proposta direta',
      script: 'Tenho algo perfeito pra você. Quer testar?'
    }
  }
  
  if (context.rejectsPrice) {
    return {
      approach: 'Kit simples',
      script: 'Tenho uma opção mais acessível. Quer conhecer?'
    }
  }
  
  if (context.hasRestrictions) {
    return {
      approach: 'Adaptar oferta',
      script: 'Tenho algo que se adapta às suas necessidades. Quer conhecer?'
    }
  }
  
  return {
    approach: 'Abordagem padrão',
    script: 'Tenho algo que pode te interessar. Quer conhecer?'
  }
}

/**
 * Regras de exceção para consultores
 */
export function consultantExceptionRules(level: 'iniciante' | 'avancado'): {
  needs: string[]
  canRequest: string[]
} {
  if (level === 'iniciante') {
    return {
      needs: [
        'Mais simplicidade',
        'Mais validação',
        'Mais passos curtos'
      ],
      canRequest: []
    }
  } else {
    return {
      needs: [],
      canRequest: [
        'Mais estratégia',
        'Mais profundidade',
        'Análise de equipe'
      ]
    }
  }
}

/**
 * Regras avançadas para scripts
 */
export function validateScriptBeforeSuggesting(context: {
  personType?: string
  opennessLevel?: string
  objective?: string
  conversationStage?: string
}): {
  valid: boolean
  missing: string[]
} {
  const missing: string[] = []
  
  if (!context.personType) missing.push('tipo de pessoa')
  if (!context.opennessLevel) missing.push('nível de abertura')
  if (!context.objective) missing.push('objetivo')
  if (!context.conversationStage) missing.push('estágio da conversa')
  
  return {
    valid: missing.length === 0,
    missing
  }
}

/**
 * Regras avançadas para fluxos
 */
export function validateFlow(flow: {
  steps: string[]
  isSimple: boolean
  isDuplicable: boolean
  hasNextStep: boolean
}): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  if (!flow.isSimple) {
    issues.push('Fluxo não é simples - reduzir complexidade')
  }
  
  if (!flow.isDuplicable) {
    issues.push('Fluxo não é duplicável - simplificar')
  }
  
  if (!flow.hasNextStep) {
    issues.push('Falta próximo passo claro')
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
}

/**
 * Regras avançadas para metas e PV
 */
export function adjustGoalsForEmotionalState(state: 'down' | 'stagnant' | 'above_average'): {
  adjustment: string
  newGoal?: number
} {
  if (state === 'down') {
    return {
      adjustment: 'Reduzir meta para 20 PV/dia',
      newGoal: 20
    }
  }
  
  if (state === 'stagnant') {
    return {
      adjustment: 'Manter meta atual e focar em consistência',
      newGoal: undefined
    }
  }
  
  if (state === 'above_average') {
    return {
      adjustment: 'Aumentar meta gradualmente',
      newGoal: undefined
    }
  }
  
  return {
    adjustment: 'Manter meta atual',
    newGoal: undefined
  }
}

/**
 * Regras avançadas para carreira
 */
export const NOEL_CAREER_ADVANCED_RULES = {
  never: [
    'Coloca pressão para GET, Milionário ou Presidente',
    'Acelera quem não pediu',
    'Cria ansiedade'
  ],
  always: [
    'Mostra caminhos leves',
    'Organiza passos',
    'Reforça evolução natural'
  ]
}

/**
 * Regras avançadas de comunicação
 */
export const NOEL_COMMUNICATION_ADVANCED_RULES = {
  avoid: [
    'Mensagens longas desnecessárias',
    'Parágrafos pesados',
    'Explicações repetitivas'
  ],
  prioritize: [
    'Clareza',
    'Leveza',
    'Objetividade'
  ]
}

/**
 * Regras avançadas de comportamento
 */
export function adjustBehaviorByConsultantState(state: 'agitated' | 'slow'): {
  adjustment: string
  action: string
} {
  if (state === 'agitated') {
    return {
      adjustment: 'Desacelerar',
      action: 'Reduzir ritmo e simplificar'
    }
  }
  
  if (state === 'slow') {
    return {
      adjustment: 'Acelerar',
      action: 'Aumentar ritmo e direcionar'
    }
  }
  
  return {
    adjustment: 'Manter ritmo',
    action: 'Continuar normalmente'
  }
}

/**
 * Regras avançadas explicadas em 1 frase
 */
export const NOEL_ADVANCED_RULES_ONE_PHRASE = 
  'Regras avançadas garantem precisão, ética, leveza e duplicação — mesmo em situações especiais.'





