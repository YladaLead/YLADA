/**
 * NOEL WELLNESS - Personalização
 * 
 * SEÇÃO 16 — COMO O NOEL PERSONALIZA FLUXOS E QUIZZES
 * 
 * Define como o NOEL cria, adapta e sugere fluxos e quizzes automaticamente.
 */

export type PersonType = 
  | 'conhecido_proximo'
  | 'amigo_familia'
  | 'indicacao'
  | 'seguidor_instagram'
  | 'whatsapp_frio'
  | 'quem_chamou'
  | 'profissional'
  | 'cliente_ativo'
  | 'cliente_inativo'
  | 'potencial_recrutavel'

export type Objective = 
  | 'energia'
  | 'retencao'
  | 'foco'
  | 'metabolismo'
  | 'emagrecimento'
  | 'performance'
  | 'rotina'

export type ConversationStage = 
  | 'abertura'
  | 'curiosidade'
  | 'diagnostico'
  | 'proposta'
  | 'fechamento'
  | 'pos_venda'

/**
 * Princípio central da personalização
 */
export const NOEL_PERSONALIZATION_CENTRAL = 
  'O NOEL nunca entrega fluxos genéricos. Ele adapta tudo ao objetivo e ao perfil da pessoa.\n' +
  'Fluxo certo = mais conversão + menos esforço.'

/**
 * Como o NOEL escolhe ou cria um fluxo personalizado
 */
export interface FlowContext {
  personType: PersonType
  objective: Objective
  opennessLevel: 'fria' | 'morna' | 'quente'
  needsFastPath: boolean
}

export interface PersonalizedFlow {
  language: 'formal' | 'informal' | 'natural'
  steps: string[]
  intensity: 'leve' | 'medio' | 'direto'
  scripts: string[]
  product: 'kit' | 'turbo' | 'hype' | 'combo' | 'fechado'
  nextStep: string
}

export function createPersonalizedFlow(context: FlowContext): PersonalizedFlow {
  // Ajustar linguagem baseado no tipo de pessoa
  let language: PersonalizedFlow['language'] = 'natural'
  if (context.personType === 'profissional' || context.personType === 'quem_chamou') {
    language = 'formal'
  } else if (context.personType === 'amigo_familia' || context.personType === 'conhecido_proximo') {
    language = 'informal'
  }
  
  // Ajustar intensidade baseado no nível de abertura
  let intensity: PersonalizedFlow['intensity'] = 'leve'
  if (context.opennessLevel === 'quente') {
    intensity = 'direto'
  } else if (context.opennessLevel === 'morna') {
    intensity = 'medio'
  }
  
  // Criar passos baseado no objetivo
  const steps: string[] = []
  if (context.objective === 'energia') {
    steps.push('Abertura leve')
    steps.push('Diagnóstico de energia')
    steps.push('Oferta de kit Energia + Acelera')
    steps.push('Script de envio')
    steps.push('Follow-up')
  } else if (context.objective === 'retencao') {
    steps.push('Abertura com pergunta sobre bem-estar')
    steps.push('Diagnóstico de retenção')
    steps.push('Oferta de Litrão Turbo')
    steps.push('Script direcionado')
    steps.push('Follow-up de resultados')
  } else if (context.objective === 'foco') {
    steps.push('Abertura sobre produtividade')
    steps.push('Diagnóstico de foco')
    steps.push('Oferta de Hype Drink')
    steps.push('Script de performance')
    steps.push('Follow-up de resultados')
  }
  
  // Escolher produto baseado no objetivo
  let product: PersonalizedFlow['product'] = 'kit'
  if (context.objective === 'retencao' || context.objective === 'metabolismo') {
    product = 'turbo'
  } else if (context.objective === 'foco' || context.objective === 'performance') {
    product = 'hype'
  } else if (context.objective === 'energia' && context.opennessLevel === 'quente') {
    product = 'combo'
  }
  
  // Gerar scripts baseado no contexto
  const scripts: string[] = []
  if (context.personType === 'conhecido_proximo') {
    scripts.push('Oi! Tudo bem? Tenho algo que pode te interessar. Topa ver?')
  } else if (context.personType === 'whatsapp_frio') {
    scripts.push('Oi! Posso te perguntar uma coisa? Você tem interesse em melhorar seu bem-estar?')
  } else if (context.personType === 'indicacao') {
    scripts.push('Oi! [NOME] me indicou você. Tenho algo que pode te interessar. Quer conhecer?')
  }
  
  const nextStep = `Enviar mensagem ${intensity} para ${context.personType.replace('_', ' ')}`
  
  return {
    language,
    steps,
    intensity,
    scripts,
    product,
    nextStep
  }
}

/**
 * Personalização por tipo de pessoa
 */
export function personalizeByPersonType(personType: PersonType): {
  language: string
  approach: string
  example: string
} {
  const configs: Record<PersonType, { language: string; approach: string; example: string }> = {
    conhecido_proximo: {
      language: 'Natural e próxima',
      approach: 'Linguagem natural e convite leve',
      example: 'Oi! Tudo bem? Tenho algo que pode te interessar. Topa ver?'
    },
    amigo_familia: {
      language: 'Informal e carinhosa',
      approach: 'Linguagem familiar e direta',
      example: 'Oi! Tenho algo legal pra te mostrar. Quer ver?'
    },
    indicacao: {
      language: 'Profissional e respeitosa',
      approach: 'Mencionar quem indicou e criar conexão',
      example: 'Oi! [NOME] me indicou você. Tenho algo que pode te interessar. Quer conhecer?'
    },
    seguidor_instagram: {
      language: 'Engajada e visual',
      approach: 'Usar stories e posts como ponte',
      example: 'Oi! Vi que você curte bem-estar. Tenho algo que pode te interessar. Quer ver?'
    },
    whatsapp_frio: {
      language: 'Leve e curiosa',
      approach: 'Usar perguntas-curinga',
      example: 'Oi! Posso te perguntar uma coisa? Você tem interesse em melhorar seu bem-estar?'
    },
    quem_chamou: {
      language: 'Agradecida e direta',
      approach: 'Agradecer e oferecer valor',
      example: 'Oi! Obrigado por me chamar. Tenho algo que pode te interessar. Quer ver?'
    },
    profissional: {
      language: 'Formal e respeitosa',
      approach: 'Linguagem profissional',
      example: 'Olá! Tenho uma oportunidade de bem-estar que pode te interessar. Posso te mostrar?'
    },
    cliente_ativo: {
      language: 'Cuidadosa e valorizadora',
      approach: 'Reconhecer fidelidade e oferecer upgrade',
      example: 'Oi! Vi que você já usa nossos produtos. Tenho uma novidade que pode te interessar. Quer ver?'
    },
    cliente_inativo: {
      language: 'Acolhedora e reativa',
      approach: 'Reativar com cuidado e oferta leve',
      example: 'Oi! Como você tá? Notei que não te vi essa semana. Quer que eu monte algo simples pra você retomar?'
    },
    potencial_recrutavel: {
      language: 'Curiosa e oportunista',
      approach: 'Apresentar oportunidade sem pressão',
      example: 'Oi! Vi que você tem interesse em renda extra. Tenho algo leve que pode te interessar. Quer conhecer?'
    }
  }
  
  return configs[personType]
}

/**
 * Personalização por objetivo da pessoa
 */
export function personalizeByObjective(objective: Objective): {
  product: PersonalizedFlow['product']
  flow: string[]
  script: string
} {
  const configs: Record<Objective, { product: PersonalizedFlow['product']; flow: string[]; script: string }> = {
    energia: {
      product: 'kit',
      flow: ['Abertura', 'Diagnóstico de energia', 'Oferta de kit Energia + Acelera', 'Script', 'Follow-up'],
      script: 'Pelo que você contou, você precisa de mais energia. Tenho um kit perfeito pra isso. Quer testar?'
    },
    retencao: {
      product: 'turbo',
      flow: ['Abertura', 'Diagnóstico de retenção', 'Oferta de Litrão Turbo', 'Script', 'Follow-up'],
      script: 'Pelo que você contou, você tem retenção. O Litrão Turbo resolve isso em 5 dias. Quer testar?'
    },
    metabolismo: {
      product: 'turbo',
      flow: ['Abertura', 'Diagnóstico de metabolismo', 'Oferta de Acelera + Turbo', 'Script', 'Follow-up'],
      script: 'Pelo que você contou, seu metabolismo está lento. O Turbo acelera isso. Quer testar?'
    },
    foco: {
      product: 'hype',
      flow: ['Abertura', 'Diagnóstico de foco', 'Oferta de Hype Drink', 'Script', 'Follow-up'],
      script: 'Pelo que você contou, você precisa de mais foco. O Hype Drink ajuda muito nisso. Quer testar?'
    },
    emagrecimento: {
      product: 'combo',
      flow: ['Abertura', 'Diagnóstico', 'Oferta de Kit → Turbo → rotina 50-75 PV', 'Script', 'Follow-up'],
      script: 'Pelo que você contou, você quer emagrecer. Vamos começar com um kit e depois intensificar. Quer testar?'
    },
    performance: {
      product: 'hype',
      flow: ['Abertura', 'Diagnóstico de performance', 'Oferta de CR7 + Hype', 'Script', 'Follow-up'],
      script: 'Pelo que você contou, você quer melhorar performance. O Hype + CR7 é perfeito pra isso. Quer testar?'
    },
    rotina: {
      product: 'kit',
      flow: ['Abertura', 'Diagnóstico de rotina', 'Oferta de kit semanal', 'Script', 'Follow-up'],
      script: 'Pelo que você contou, você quer organizar sua rotina. Tenho um kit semanal perfeito. Quer testar?'
    }
  }
  
  return configs[objective]
}

/**
 * Personalização por estágio da conversa
 */
export function personalizeByStage(stage: ConversationStage): {
  focus: string
  script: string
  nextStep: string
} {
  const configs: Record<ConversationStage, { focus: string; script: string; nextStep: string }> = {
    abertura: {
      focus: 'Criar conexão leve',
      script: 'Oi! Tudo bem? Posso te perguntar uma coisa?',
      nextStep: 'Aguardar resposta e criar curiosidade'
    },
    curiosidade: {
      focus: 'Despertar interesse',
      script: 'Tenho algo que pode te interessar. Quer que eu te mostre?',
      nextStep: 'Apresentar benefício principal'
    },
    diagnostico: {
      focus: 'Identificar necessidade',
      script: 'Pelo que você contou, você precisa de [OBJETIVO]. Tenho algo perfeito pra isso.',
      nextStep: 'Oferecer produto ideal'
    },
    proposta: {
      focus: 'Apresentar solução',
      script: 'Tenho um [PRODUTO] que resolve exatamente isso. Quer testar?',
      nextStep: 'Fechar com leveza'
    },
    fechamento: {
      focus: 'Confirmar interesse',
      script: 'Perfeito! Posso montar seu [PRODUTO] agora. Qual sabor você prefere?',
      nextStep: 'Confirmar detalhes e finalizar'
    },
    pos_venda: {
      focus: 'Acompanhar e criar rotina',
      script: 'Como você está se sentindo? Quer que eu te mostre como usar?',
      nextStep: 'Criar rotina e sugerir upsell'
    }
  }
  
  return configs[stage]
}

/**
 * Como o NOEL cria quizzes personalizados
 */
export interface QuizConfig {
  objective: string
  targetAudience: string
  targetProduct: PersonalizedFlow['product']
  showPain: boolean
  showSolution: boolean
}

export function createPersonalizedQuiz(config: QuizConfig): {
  questions: string[]
  format: string
  resultLevels: string[]
  productSuggestion: string
} {
  const questions: string[] = []
  
  if (config.objective === 'retenção') {
    questions.push('Você sente inchaço com frequência?')
    questions.push('Você retém líquidos principalmente em qual período?')
    questions.push('Você já tentou algo para reduzir retenção?')
    questions.push('Qual seu objetivo principal?')
    questions.push('Quanto tempo você tem disponível por dia?')
  } else if (config.objective === 'energia') {
    questions.push('Como você avalia seu nível de energia?')
    questions.push('Em qual período do dia você sente mais cansaço?')
    questions.push('Você pratica atividades físicas?')
    questions.push('Qual seu objetivo principal?')
    questions.push('Quanto tempo você tem disponível por dia?')
  } else {
    questions.push('Qual seu objetivo principal?')
    questions.push('Quanto tempo você tem disponível?')
    questions.push('Você já usa produtos de bem-estar?')
    questions.push('Qual sua maior dificuldade?')
    questions.push('O que você mais busca?')
  }
  
  return {
    questions,
    format: '5 a 7 perguntas curtas, linguagem leve, resultado claro em 3 níveis (leve / moderado / intenso)',
    resultLevels: ['leve', 'moderado', 'intenso'],
    productSuggestion: `Quiz para ${config.objective} → direciona automaticamente para ${config.targetProduct}`
  }
}

/**
 * Como o NOEL transforma qualquer objetivo em fluxo
 */
export function transformObjectiveToFlow(objective: Objective): {
  abertura: string
  diagnostico: string
  oferta: string
  script: string
  followUp: string
} {
  const flows: Record<Objective, { abertura: string; diagnostico: string; oferta: string; script: string; followUp: string }> = {
    energia: {
      abertura: 'Oi! Tudo bem? Posso te perguntar sobre sua energia?',
      diagnostico: 'Como você avalia seu nível de energia hoje?',
      oferta: 'Tenho um kit Energia + Acelera perfeito pra você.',
      script: 'Pelo que você contou, você precisa de mais energia. Tenho um kit perfeito. Quer testar?',
      followUp: 'Como você está se sentindo? A energia melhorou?'
    },
    retencao: {
      abertura: 'Oi! Tudo bem? Posso te perguntar sobre retenção?',
      diagnostico: 'Você sente inchaço ou retenção com frequência?',
      oferta: 'Tenho um Litrão Turbo que resolve isso em 5 dias.',
      script: 'Pelo que você contou, você tem retenção. O Turbo resolve isso. Quer testar?',
      followUp: 'Como você está se sentindo? A retenção melhorou?'
    },
    foco: {
      abertura: 'Oi! Tudo bem? Posso te perguntar sobre foco?',
      diagnostico: 'Como você avalia seu nível de foco e produtividade?',
      oferta: 'Tenho um Hype Drink perfeito pra isso.',
      script: 'Pelo que você contou, você precisa de mais foco. O Hype ajuda muito. Quer testar?',
      followUp: 'Como você está se sentindo? O foco melhorou?'
    },
    metabolismo: {
      abertura: 'Oi! Tudo bem? Posso te perguntar sobre metabolismo?',
      diagnostico: 'Você sente que seu metabolismo está lento?',
      oferta: 'Tenho um Turbo que acelera o metabolismo.',
      script: 'Pelo que você contou, seu metabolismo está lento. O Turbo acelera isso. Quer testar?',
      followUp: 'Como você está se sentindo? O metabolismo melhorou?'
    },
    emagrecimento: {
      abertura: 'Oi! Tudo bem? Posso te perguntar sobre seus objetivos?',
      diagnostico: 'Qual seu objetivo principal com emagrecimento?',
      oferta: 'Vamos começar com um kit e depois intensificar.',
      script: 'Pelo que você contou, você quer emagrecer. Vamos começar leve. Quer testar?',
      followUp: 'Como você está se sentindo? Os resultados estão aparecendo?'
    },
    performance: {
      abertura: 'Oi! Tudo bem? Posso te perguntar sobre performance?',
      diagnostico: 'Você pratica atividades físicas?',
      oferta: 'Tenho um Hype + CR7 perfeito pra performance.',
      script: 'Pelo que você contou, você quer melhorar performance. O Hype + CR7 é perfeito. Quer testar?',
      followUp: 'Como você está se sentindo? A performance melhorou?'
    },
    rotina: {
      abertura: 'Oi! Tudo bem? Posso te perguntar sobre sua rotina?',
      diagnostico: 'Como está sua rotina de bem-estar?',
      oferta: 'Tenho um kit semanal perfeito pra organizar.',
      script: 'Pelo que você contou, você quer organizar rotina. Tenho um kit semanal. Quer testar?',
      followUp: 'Como está sua rotina? Está conseguindo manter?'
    }
  }
  
  return flows[objective]
}

/**
 * Personalização avançada
 */
export function advancedPersonalization(context: {
  consultantStyle: 'mae' | 'jovem' | 'profissional' | 'informal'
  intensity: 'reduzir' | 'aumentar'
  messageLength: 'curta' | 'media' | 'longa'
  detailLevel: 'simplificar' | 'detalhar'
}): {
  adjustments: string[]
  result: string
} {
  const adjustments: string[] = []
  
  if (context.intensity === 'reduzir') {
    adjustments.push('Reduzir intensidade da linguagem')
  } else {
    adjustments.push('Aumentar intensidade da linguagem')
  }
  
  if (context.consultantStyle === 'mae') {
    adjustments.push('Adaptar para linguagem materna e acolhedora')
  } else if (context.consultantStyle === 'jovem') {
    adjustments.push('Adaptar para linguagem jovem e descontraída')
  } else if (context.consultantStyle === 'profissional') {
    adjustments.push('Adaptar para linguagem profissional')
  }
  
  if (context.messageLength === 'curta') {
    adjustments.push('Reduzir tamanho das mensagens')
  } else if (context.messageLength === 'longa') {
    adjustments.push('Aumentar tamanho das mensagens')
  }
  
  if (context.detailLevel === 'simplificar') {
    adjustments.push('Simplificar explicações')
  } else {
    adjustments.push('Detalhar explicações')
  }
  
  return {
    adjustments,
    result: 'Personalização aplicada conforme perfil do consultor'
  }
}

/**
 * Personalização de fluxos para venda
 */
export function personalizeSalesFlow(product: PersonalizedFlow['product']): {
  flow: string[]
  script: string
  nextStep: string
} {
  const flows: Record<PersonalizedFlow['product'], { flow: string[]; script: string; nextStep: string }> = {
    kit: {
      flow: ['Abertura', 'Apresentação do kit', 'Benefícios principais', 'Convite leve', 'Follow-up'],
      script: 'Tenho um kit de 5 bebidas funcionais perfeito pra você começar. Quer testar?',
      nextStep: 'Posso montar seu kit?'
    },
    turbo: {
      flow: ['Abertura', 'Apresentação do Turbo', 'Benefícios de retenção', 'Convite direto', 'Follow-up'],
      script: 'Tenho um Litrão Turbo que resolve retenção em 5 dias. Quer testar?',
      nextStep: 'Posso preparar seu Turbo?'
    },
    hype: {
      flow: ['Abertura', 'Apresentação do Hype', 'Benefícios de foco', 'Convite direto', 'Follow-up'],
      script: 'Tenho um Hype Drink que melhora foco e performance. Quer testar?',
      nextStep: 'Posso preparar seu Hype?'
    },
    combo: {
      flow: ['Abertura', 'Apresentação do combo', 'Benefícios completos', 'Convite direto', 'Follow-up'],
      script: 'Tenho um combo completo que resolve energia + retenção. Quer testar?',
      nextStep: 'Posso montar seu combo?'
    },
    fechado: {
      flow: ['Abertura', 'Apresentação do produto fechado', 'Benefícios intensos', 'Convite direto', 'Follow-up'],
      script: 'Tenho um produto fechado com resultados mais intensos. Quer conhecer?',
      nextStep: 'Posso te mostrar os produtos fechados?'
    }
  }
  
  return flows[product]
}

/**
 * Como o NOEL garante duplicação
 */
export function ensureDuplication(flow: PersonalizedFlow): {
  isSimple: boolean
  isClear: boolean
  isDuplicable: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  if (flow.steps.length > 5) {
    issues.push('Fluxo muito complexo - reduzir passos')
  }
  
  if (flow.scripts.length === 0) {
    issues.push('Falta script - adicionar exemplo prático')
  }
  
  if (!flow.nextStep) {
    issues.push('Falta próximo passo - adicionar ação clara')
  }
  
  return {
    isSimple: flow.steps.length <= 5,
    isClear: flow.scripts.length > 0 && !!flow.nextStep,
    isDuplicable: issues.length === 0,
    issues
  }
}

/**
 * Personalização explicada em 1 frase
 */
export const NOEL_PERSONALIZATION_ONE_PHRASE = 
  'Personalizar é adaptar o caminho para que seja mais fácil para a pessoa agir.'





