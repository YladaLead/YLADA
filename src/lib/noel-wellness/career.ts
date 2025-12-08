/**
 * NOEL WELLNESS - Carreira
 * 
 * SEÇÃO 13 — COMO O NOEL AGE NA CARREIRA
 * 
 * Define como o NOEL conduz a progressão de carreira do consultor.
 */

export type CareerLevel = 
  | 'consultor_ativo'
  | 'consultor_1000pv'
  | 'equipe_mundial'
  | 'get'
  | 'milionario'
  | 'presidente'

export interface CareerLevelConfig {
  id: CareerLevel
  name: string
  requirements: string[]
  objective: string
  pvPersonal?: number
  pvTeam?: number
  months?: number
  royalties?: number
}

/**
 * Princípio central
 */
export const NOEL_CAREER_CENTRAL = 
  'O NOEL trata carreira como direção, não como cobrança.\n' +
  'Ele mostra o próximo passo de maneira simples e duplicável, sempre respeitando o ritmo da pessoa.'

/**
 * Estrutura dos níveis da carreira
 */
export const CAREER_LEVELS: Record<CareerLevel, CareerLevelConfig> = {
  consultor_ativo: {
    id: 'consultor_ativo',
    name: 'Consultor Ativo',
    requirements: ['Entre 250 e 500 PV mensais'],
    objective: 'Criar base, aprender ferramentas, ganhar confiança',
    pvPersonal: 250
  },
  consultor_1000pv: {
    id: 'consultor_1000pv',
    name: 'Consultor 1000 PV',
    requirements: ['1000 PV pessoais'],
    objective: 'Estabilizar clientes entre 50–100 PV e dominar upsell',
    pvPersonal: 1000
  },
  equipe_mundial: {
    id: 'equipe_mundial',
    name: 'Equipe Mundial',
    requirements: ['2500 PV por 4 meses (seguidos ou alternados)'],
    objective: 'Criar ritmo e ensinar duplicação simples',
    pvPersonal: 2500,
    months: 4
  },
  get: {
    id: 'get',
    name: 'GET (Global Expansion Team)',
    requirements: ['16.000 PV em 3 níveis de profundidade'],
    objective: 'Desenvolver líderes e profundidade',
    pvTeam: 16000,
    royalties: 1000
  },
  milionario: {
    id: 'milionario',
    name: 'Milionário',
    requirements: ['64.000 PV de equipe'],
    objective: 'Estabilidade organizacional e visão estratégica',
    pvTeam: 64000,
    royalties: 4000
  },
  presidente: {
    id: 'presidente',
    name: 'Presidente',
    requirements: ['160.000 PV de equipe'],
    objective: 'Liderança, cultura e construção de organização profissional',
    pvTeam: 160000,
    royalties: 10000
  }
}

/**
 * Como o NOEL conversa sobre carreira
 */
export function talkAboutCareer(currentLevel: CareerLevel): {
  phrases: string[]
  approach: 'leve' | 'orientador' | 'estrategico'
} {
  return {
    phrases: [
      'Vamos clarear seu próximo nível.',
      'Com seu ritmo atual, você está a X passos de…',
      'O caminho mais simples agora é…',
      'Seu próximo passo é esse aqui.'
    ],
    approach: 'leve'
  }
}

/**
 * Como o NOEL ensina o caminho para cada nível
 */
export interface CareerPath {
  pilar1: string // PV Pessoal
  pilar2: string // PV de Equipe
  pilar3: string // Duplicação
  steps: string[]
}

export function getCareerPath(targetLevel: CareerLevel): CareerPath {
  const paths: Record<CareerLevel, CareerPath> = {
    consultor_ativo: {
      pilar1: '250-500 PV mensais',
      pilar2: 'Ainda não aplicável',
      pilar3: 'Aprender o básico',
      steps: [
        'Criar base de clientes',
        'Aprender ferramentas',
        'Ganhar confiança',
        'Estabilizar rotina'
      ]
    },
    consultor_1000pv: {
      pilar1: '1000 PV pessoais',
      pilar2: 'Ainda não aplicável',
      pilar3: 'Dominar upsell',
      steps: [
        'Estabilizar clientes 50-100 PV',
        'Dominar upsell',
        'Criar rotina consistente',
        'Aprender scripts'
      ]
    },
    equipe_mundial: {
      pilar1: 'Estabilizar 1000 PV pessoais',
      pilar2: 'Desenvolver 2 consultores de 500-1000 PV',
      pilar3: 'Ensinar rotina, scripts e ferramentas',
      steps: [
        'Estabilizar 1000 PV pessoais',
        'Desenvolver 2 consultores de 500-1000 PV',
        'Ensinar rotina, scripts e ferramentas',
        'Manter ritmo semanal'
      ]
    },
    get: {
      pilar1: 'Manter 2500+ PV pessoais',
      pilar2: '16.000 PV em 3 níveis de profundidade',
      pilar3: 'Trabalhar 3 níveis de profundidade',
      steps: [
        'Identificar perfis de liderança',
        'Trabalhar 3 níveis de profundidade',
        'Treinar duplicação semanal',
        'Acompanhar metas da equipe'
      ]
    },
    milionario: {
      pilar1: 'Manter ritmo pessoal',
      pilar2: '64.000 PV de equipe',
      pilar3: 'Desenvolver linhas fortes',
      steps: [
        'Reforçar estabilidade',
        'Desenvolver linhas fortes',
        'Formar novos líderes',
        'Acompanhar crescimento mensal'
      ]
    },
    presidente: {
      pilar1: 'Manter excelência pessoal',
      pilar2: '160.000 PV de equipe',
      pilar3: 'Cultura e duplicação contínua',
      steps: [
        'Cultura do grupo',
        'Sustentação de linhas fortes',
        'Duplicação contínua',
        'Desenvolvimento de líderes'
      ]
    }
  }
  
  return paths[targetLevel]
}

/**
 * Caminho para Equipe Mundial
 */
export function pathToEquipeMundial(): {
  requirements: string[]
  guidance: string
  example: string
} {
  return {
    requirements: ['2500 PV por 4 meses'],
    guidance: 'Estabilizar seu 1000 PV e ajudar dois consultores a atingirem 500 PV cada',
    example: 'Vamos focar em estabilizar seu 1000 PV e ajudar dois consultores a atingirem 500 PV cada.'
  }
}

/**
 * Caminho para GET (16.000 PV)
 */
export function pathToGET(): {
  requirements: string[]
  guidance: string
  example: string
} {
  return {
    requirements: ['16.000 PV em 3 níveis de profundidade'],
    guidance: 'GET vem de profundidade: identificar perfis de liderança, trabalhar 3 níveis, treinar duplicação semanal',
    example: 'GET é consequência natural quando você desenvolve 3 níveis com ritmo e consistência.'
  }
}

/**
 * Caminho para Milionário (64.000 PV)
 */
export function pathToMilionario(): {
  requirements: string[]
  guidance: string
  example: string
} {
  return {
    requirements: ['64.000 PV de equipe'],
    guidance: 'Trabalhar visão de organização: reforçar estabilidade, desenvolver linhas fortes, formar novos líderes',
    example: 'Milionário vem da profundidade consistente, não de explosões isoladas.'
  }
}

/**
 * Caminho para Presidente (160.000 PV)
 */
export function pathToPresidente(): {
  requirements: string[]
  guidance: string
  example: string
} {
  return {
    requirements: ['160.000 PV de equipe'],
    guidance: 'Foco avançado: cultura do grupo, sustentação de linhas fortes, duplicação contínua, desenvolvimento de líderes',
    example: 'Ele está perto de criar profundidade real. Vou reforçar liderança e visão.'
  }
}

/**
 * Quando o consultor NÃO quer carreira
 */
export function handleNoCareerInterest(): {
  response: string
  focus: string
  rhythm: string
} {
  return {
    response: 'Perfeito. Vamos focar só na sua renda.',
    focus: 'Renda pessoal',
    rhythm: 'PV ideal para você'
  }
}

/**
 * Como o NOEL evita pressão
 */
export const NOEL_CAREER_NO_PRESSURE = {
  never: [
    'Compara consultores',
    'Força metas de carreira',
    'Usa tom de urgência agressiva'
  ],
  always: [
    'Adapta ritmo',
    'Simplifica caminho',
    'Mantém leveza',
    'Reforça confiança'
  ]
}

/**
 * Carreira explicada em 1 frase
 */
export const NOEL_CAREER_ONE_PHRASE = 
  'Carreira é consequência de ritmo pessoal + duplicação + profundidade.'

/**
 * Calcula próximo nível baseado em PV atual
 */
export function calculateNextLevel(context: {
  pvPersonal: number
  pvTeam?: number
  monthsAtCurrentLevel?: number
}): {
  currentLevel: CareerLevel
  nextLevel: CareerLevel | null
  progress: number // 0-100
  stepsRemaining: string[]
} {
  let currentLevel: CareerLevel = 'consultor_ativo'
  let nextLevel: CareerLevel | null = null
  let progress = 0
  const stepsRemaining: string[] = []
  
  // Determinar nível atual
  if (context.pvPersonal >= 1000) {
    if (context.pvPersonal >= 2500 && context.monthsAtCurrentLevel && context.monthsAtCurrentLevel >= 4) {
      currentLevel = 'equipe_mundial'
      if (context.pvTeam && context.pvTeam >= 16000) {
        currentLevel = 'get'
        if (context.pvTeam >= 64000) {
          currentLevel = 'milionario'
          if (context.pvTeam >= 160000) {
            currentLevel = 'presidente'
          }
        }
      }
    } else if (context.pvPersonal >= 2500) {
      currentLevel = 'consultor_1000pv' // Ainda não completou 4 meses
    } else {
      currentLevel = 'consultor_1000pv'
    }
  }
  
  // Determinar próximo nível
  const levelOrder: CareerLevel[] = [
    'consultor_ativo',
    'consultor_1000pv',
    'equipe_mundial',
    'get',
    'milionario',
    'presidente'
  ]
  
  const currentIndex = levelOrder.indexOf(currentLevel)
  if (currentIndex < levelOrder.length - 1) {
    nextLevel = levelOrder[currentIndex + 1]
  }
  
  // Calcular progresso
  if (nextLevel) {
    const nextLevelConfig = CAREER_LEVELS[nextLevel]
    if (nextLevelConfig.pvPersonal) {
      progress = Math.min(100, (context.pvPersonal / nextLevelConfig.pvPersonal) * 100)
    } else if (nextLevelConfig.pvTeam && context.pvTeam) {
      progress = Math.min(100, (context.pvTeam / nextLevelConfig.pvTeam) * 100)
    }
  }
  
  // Gerar passos restantes
  if (nextLevel) {
    const path = getCareerPath(nextLevel)
    stepsRemaining.push(...path.steps)
  }
  
  return {
    currentLevel,
    nextLevel,
    progress: Math.round(progress),
    stepsRemaining
  }
}





