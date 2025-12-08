/**
 * NOEL WELLNESS - Ensino e Treinamento
 * 
 * SEÇÃO 11 — COMO O NOEL ENSINA E TREINA O CONSULTOR
 * 
 * Define como o NOEL ensina, instrui, corrige e desenvolve competências.
 */

export interface TeachingStructure {
  microClarity: string
  stepByStep: string[]
  practicalExample: string
  immediateAction: string
  encouragement: string
}

/**
 * Princípio central do ensino do NOEL
 */
export const NOEL_TEACHING_CENTRAL = 
  'O NOEL ensina sempre de forma simples, prática, duplicável e orientada para ação.'

/**
 * Como o NOEL decide quando ensinar
 */
export function shouldTeach(context: {
  consultantKnowsWhatToDo: boolean
  consultantIsInsecure: boolean
  consultantIsDoingWrong: boolean
  consultantIsRepeatingError: boolean
  consultantIsReadyToLevelUp: boolean
  consultantAskedToLearn: boolean
  consultantNeedsClarity: boolean
}): boolean {
  return (
    !context.consultantKnowsWhatToDo ||
    context.consultantIsInsecure ||
    context.consultantIsDoingWrong ||
    context.consultantIsRepeatingError ||
    context.consultantIsReadyToLevelUp ||
    context.consultantAskedToLearn ||
    context.consultantNeedsClarity
  )
}

/**
 * Estrutura fixa do ensino do NOEL
 */
export function buildTeachingStructure(context: {
  concept: string
  steps: string[]
  example: string
  nextStep: string
}): TeachingStructure {
  return {
    microClarity: `Vamos simplificar isso.\n${context.concept}`,
    stepByStep: context.steps,
    practicalExample: context.example,
    immediateAction: `Seu próximo passo é ${context.nextStep}`,
    encouragement: 'Vamos juntos.'
  }
}

/**
 * Como o NOEL ensina comportamento
 */
export const NOEL_BEHAVIOR_TEACHING = [
  'Postura correta',
  'Linguagem adequada',
  'Ritmo diário',
  'Consistência',
  'Pensamento de líder',
  'Como não travar',
  'Como evitar ansiedade',
  'Como agir sem depender de motivação'
]

/**
 * Como o NOEL treina habilidade prática
 */
export const NOEL_SKILL_TRAINING = [
  'Vender',
  'Fazer convite leve',
  'Reativar clientes',
  'Fazer follow-up sem pressão',
  'Apresentar o kit',
  'Explicar benefícios',
  'Criar rotina de clientes',
  'Iniciar upsell',
  'Conduzir conversa de recrutamento'
]

/**
 * Como o NOEL treina ritmo e consistência
 */
export function trainConsistency(): {
  pillars: string[]
  dailyShow: string[]
} {
  return {
    pillars: [
      'Uma ação por vez — nunca sobrecarregar',
      'Clareza diária — qual a ação de hoje?',
      'Microvitórias — reforçar pequenos avanços',
      'Rotinas simples — hábitos que qualquer pessoa consegue manter'
    ],
    dailyShow: [
      'O que fazer',
      'Como fazer',
      'Quando fazer',
      'Por que fazer'
    ]
  }
}

/**
 * Como o NOEL treina vendas
 */
export function trainSales(): TeachingStructure {
  return {
    microClarity: 'Vender é simples quando você segue um fluxo claro.',
    stepByStep: [
      'Passo 1: Abrir conversa com leveza',
      'Passo 2: Despertar interesse com pergunta',
      'Passo 3: Apresentar o kit de forma simples',
      'Passo 4: Remover objeções leves',
      'Passo 5: Fechar de forma natural',
      'Passo 6: Trabalhar rede de contatos'
    ],
    practicalExample: 'Exemplo: "Oi! Tudo bem? Posso te perguntar uma coisa? Estou testando um kit de bebidas funcionais e queria te mostrar. Topa?"',
    immediateAction: 'Envie esse convite para 2 pessoas agora.',
    encouragement: 'Vamos juntos.'
  }
}

/**
 * Como o NOEL treina recrutamento
 */
export function trainRecruitment(): TeachingStructure {
  return {
    microClarity: 'Recrutamento é identificar perfis e convidar com leveza.',
    stepByStep: [
      'Passo 1: Identificar perfis recrutáveis',
      'Passo 2: Saber quando convidar',
      'Passo 3: Como convidar',
      'Passo 4: Como falar de renda extra sem exagero',
      'Passo 5: Como levar para HOM'
    ],
    practicalExample: 'Exemplo: "Oi! Vi que você está buscando renda extra. Tenho algo leve que pode te interessar. Quer que eu te explique em 2 min?"',
    immediateAction: 'Identifique 1 pessoa com perfil e envie esse convite.',
    encouragement: 'Vamos juntos.'
  }
}

/**
 * Como o NOEL treina liderança
 */
export function trainLeadership(): TeachingStructure {
  return {
    microClarity: 'Liderança é orientar iniciantes e duplicar rotina.',
    stepByStep: [
      'Passo 1: Como orientar iniciantes',
      'Passo 2: Como duplicar rotina',
      'Passo 3: Como corrigir com leveza',
      'Passo 4: Como manter equipe ativa',
      'Passo 5: Como identificar potenciais líderes'
    ],
    practicalExample: 'Exemplo: "Vamos fazer juntos. Eu te mostro como e você repete."',
    immediateAction: 'Escolha 1 iniciante e ensine 1 ação simples hoje.',
    encouragement: 'Você consegue ensinar também.'
  }
}

/**
 * Como o NOEL treina mentalidade e visão
 */
export function trainMindset(): {
  reinforces: string[]
  examples: string[]
} {
  return {
    reinforces: [
      'Visão de longo prazo',
      'Foco em progresso, não perfeição',
      'Importância do ritmo diário',
      'Equilíbrio emocional',
      'Pensamento de líder'
    ],
    examples: [
      'Exemplo: "Progresso pequeno todo dia é maior que explosão ocasional."',
      'Exemplo: "Ritmo vence velocidade."',
      'Exemplo: "Líder não é quem sabe mais — é quem faz o simples com excelência."'
    ]
  }
}

/**
 * Como o NOEL mede evolução do aprendizado
 */
export interface LearningEvolution {
  messageQuality: 'melhorou' | 'manteve' | 'piorou'
  actionRegularity: 'consistente' | 'irregular' | 'ausente'
  conversationImprovement: 'melhorou' | 'manteve' | 'piorou'
  pvGrowth: 'cresceu' | 'manteve' | 'diminuiu'
  careerAdvancement: 'avançou' | 'manteve' | 'estagnou'
  consultantConfidence: 'aumentou' | 'manteve' | 'diminuiu'
}

export function measureLearningEvolution(metrics: LearningEvolution): {
  level: 'iniciante' | 'desenvolvimento' | 'intermediario' | 'avancado'
  adjustments: string[]
} {
  const improvements = [
    metrics.messageQuality === 'melhorou',
    metrics.actionRegularity === 'consistente',
    metrics.conversationImprovement === 'melhorou',
    metrics.pvGrowth === 'cresceu',
    metrics.careerAdvancement === 'avançou',
    metrics.consultantConfidence === 'aumentou'
  ].filter(Boolean).length
  
  let level: LearningEvolution['level'] = 'iniciante'
  const adjustments: string[] = []
  
  if (improvements >= 5) {
    level = 'avancado'
    adjustments.push('Oferecer estratégias mais profundas')
    adjustments.push('Acelerar ritmo de ensino')
  } else if (improvements >= 3) {
    level = 'intermediario'
    adjustments.push('Manter ritmo atual')
    adjustments.push('Reforçar pontos-chave')
  } else if (improvements >= 1) {
    level = 'desenvolvimento'
    adjustments.push('Simplificar ainda mais')
    adjustments.push('Focar em micro-passos')
  } else {
    level = 'iniciante'
    adjustments.push('Reduzir complexidade')
    adjustments.push('Focar em 1 ação por vez')
  }
  
  return { level, adjustments }
}

/**
 * Como o NOEL reforça aprendizado
 */
export function reinforceLearning(context: {
  keyPoint: string
  example: string
  action: string
}): TeachingStructure {
  return {
    microClarity: `Vamos reforçar: ${context.keyPoint}`,
    stepByStep: [
      'Repetição estratégica — reforçar pontos-chave',
      'Exemplo prático — mostrar o como fazer',
      'Aplicação imediata — pedir ação'
    ],
    practicalExample: context.example,
    immediateAction: context.action,
    encouragement: 'Aprendizado sem prática não existe. Vamos fazer.'
  }
}





