/**
 * NOEL WELLNESS - Acompanhamento de Metas e PV
 * 
 * SEÇÃO 12 — COMO O NOEL ACOMPANHA METAS E PV
 * 
 * Define como o NOEL calcula, interpreta, comunica e transforma metas em ações.
 */

export interface GoalsContext {
  pvAtual: number
  pvMeta: number
  semanaDoMes: number
  clientesAtivos: number
  clientesInativos: number
  nivelConsultor: 'iniciante' | 'intermediario' | 'avancado' | 'lider'
}

export interface GoalsAnalysis {
  faltante: number
  equivalenteKits: number
  equivalenteTurbos: number
  equivalenteClientes50PV: number
  pvPorSemana: number
  pvPorDiaUtil: number
  acaoDiaria: string
  faseDoMes: 'construcao' | 'consolidacao' | 'aceleracao' | 'fechamento'
}

/**
 * Princípio central
 */
export const NOEL_GOALS_CENTRAL = 
  'O NOEL sempre transforma metas em pequenos passos diários, práticos e realizáveis.\n' +
  'Metas grandes nunca aparecem como peso — apenas como direção.'

/**
 * Como o NOEL entende o PV mensal
 */
export const NOEL_PV_UNDERSTANDING = {
  pvDefinition: 'PV = movimento real do negócio',
  consultantRhythm: 'Cada consultor tem ritmo diferente',
  minimumHealthy: 500,
  ideal: 1000,
  advanced: [2500, 5000]
}

/**
 * Como o NOEL divide metas grandes em metas pequenas
 */
export function divideGoal(metaMensal: number): {
  semana: number
  diaUtil: number
  acaoDiaria: string
} {
  const semana = Math.ceil(metaMensal / 4)
  const diaUtil = Math.ceil(semana / 5) // 5 dias úteis por semana
  const acaoDiaria = diaUtil <= 20 
    ? '1 kit OU 1 Turbo OU 2 follow-ups estratégicos'
    : `${Math.ceil(diaUtil / 20)} kits OU ${Math.ceil(diaUtil / 30)} Turbos`
  
  return {
    semana,
    diaUtil,
    acaoDiaria
  }
}

/**
 * Como o NOEL calcula o que falta para bater a meta
 */
export function calculateRemaining(context: GoalsContext): GoalsAnalysis {
  const faltante = context.pvMeta - context.pvAtual
  const equivalenteKits = Math.ceil(faltante / 20) // 1 kit = 20 PV
  const equivalenteTurbos = Math.ceil(faltante / 30) // 1 Turbo = 30 PV
  const equivalenteClientes50PV = Math.ceil(faltante / 50)
  
  const diasRestantes = (4 - context.semanaDoMes) * 7
  const pvPorSemana = faltante / Math.max(1, 4 - context.semanaDoMes)
  const pvPorDiaUtil = diasRestantes > 0 ? faltante / (diasRestantes * 0.7) : 0 // 0.7 = 70% dias úteis
  
  let acaoDiaria = '1 kit ou 1 Turbo'
  if (pvPorDiaUtil > 30) {
    acaoDiaria = `${Math.ceil(pvPorDiaUtil / 20)} kits ou ${Math.ceil(pvPorDiaUtil / 30)} Turbos`
  } else if (pvPorDiaUtil > 20) {
    acaoDiaria = '1 kit ou 1 Turbo por dia'
  }
  
  // Determinar fase do mês
  let faseDoMes: GoalsAnalysis['faseDoMes'] = 'construcao'
  if (context.semanaDoMes === 1) {
    faseDoMes = 'construcao'
  } else if (context.semanaDoMes === 2) {
    faseDoMes = 'consolidacao'
  } else if (context.semanaDoMes === 3) {
    faseDoMes = 'aceleracao'
  } else {
    faseDoMes = 'fechamento'
  }
  
  return {
    faltante,
    equivalenteKits,
    equivalenteTurbos,
    equivalenteClientes50PV,
    pvPorSemana,
    pvPorDiaUtil,
    acaoDiaria,
    faseDoMes
  }
}

/**
 * Como o NOEL apresenta metas ao consultor
 */
export function presentGoal(analysis: GoalsAnalysis): {
  message: string
  practicalMeaning: string
  nextStep: string
} {
  const message = `Faltam ${analysis.faltante} PV. Vamos por partes.`
  
  const practicalMeaning = analysis.faltante <= 100
    ? `Isso equivale a ${analysis.equivalenteKits} kits. Super possível.`
    : `Isso equivale a ${analysis.equivalenteKits} kits ou ${analysis.equivalenteTurbos} Turbos.`
  
  const nextStep = `Seu próximo passo é falar com ${Math.min(2, analysis.equivalenteKits)} clientes ativos.`
  
  return {
    message,
    practicalMeaning,
    nextStep
  }
}

/**
 * Como o NOEL reseta a meta quando o consultor está travado
 */
export function resetGoalForStuckConsultant(): {
  newGoal: number
  message: string
  action: string
} {
  return {
    newGoal: 20, // 20 PV/dia
    message: 'Vamos simplificar. Hoje seu foco é só 1 kit. Só isso.',
    action: 'Envie 1 convite leve agora.'
  }
}

/**
 * Como o NOEL identifica oportunidades de PV
 */
export function identifyPVOpportunities(context: {
  clientes: Array<{
    nome: string
    categoriaPV?: 50 | 75 | 100
    padraoConsumo?: 'kit' | 'turbo' | 'hype'
    inativo?: boolean
  }>
}): Array<{
  type: 'upsell' | 'reativacao' | 'novo_cliente'
  description: string
  pvPotential: number
  action: string
}> {
  const opportunities: Array<{
    type: 'upsell' | 'reativacao' | 'novo_cliente'
    description: string
    pvPotential: number
    action: string
  }> = []
  
  for (const cliente of context.clientes) {
    // Upsell opportunities
    if (cliente.categoriaPV === 50 && cliente.padraoConsumo === 'kit') {
      opportunities.push({
        type: 'upsell',
        description: `${cliente.nome} tem perfil de Turbo`,
        pvPotential: 25, // 75 - 50
        action: `Oferecer upgrade para Turbo`
      })
    }
    
    if (cliente.categoriaPV === 75) {
      opportunities.push({
        type: 'upsell',
        description: `${cliente.nome} é 75 PV facilmente`,
        pvPotential: 25, // 100 - 75
        action: `Migrar para 100 PV`
      })
    }
    
    // Reativação opportunities
    if (cliente.inativo) {
      opportunities.push({
        type: 'reativacao',
        description: `${cliente.nome} está inativo`,
        pvPotential: cliente.categoriaPV || 50,
        action: `Reativar com mensagem leve`
      })
    }
  }
  
  return opportunities.sort((a, b) => b.pvPotential - a.pvPotential)
}

/**
 * Como o NOEL monitora progresso ao longo do mês
 */
export function monitorMonthlyProgress(semanaDoMes: number): {
  fase: string
  focus: string[]
  pvTarget: number
} {
  const phases = {
    1: {
      fase: 'Construção da base',
      focus: [
        'Ativação de clientes',
        'Primeiras vendas',
        '25% da meta'
      ],
      pvTarget: 0.25
    },
    2: {
      fase: 'Consolidação',
      focus: [
        'Upsell leve',
        'Reativação',
        'Estabilizar clientes 50 PV'
      ],
      pvTarget: 0.5
    },
    3: {
      fase: 'Aceleração',
      focus: [
        'Novos clientes',
        'Chamadas estratégicas',
        'Ritmo diário'
      ],
      pvTarget: 0.75
    },
    4: {
      fase: 'Fechamento',
      focus: [
        'Ações diretas',
        'Acelerar 20–40 PV/dia',
        'Uso de ferramentas com scripts fortes'
      ],
      pvTarget: 1.0
    }
  }
  
  return phases[semanaDoMes as keyof typeof phases] || phases[1]
}

/**
 * Como o NOEL conversa sobre metas
 */
export function talkAboutGoals(analysis: GoalsAnalysis): {
  phrases: string[]
  approach: 'leve' | 'direto' | 'motivador'
} {
  return {
    phrases: [
      'Isso é totalmente possível.',
      'Vamos por partes.',
      'Seu próximo passo é esse aqui. Simples.',
      'A gente faz isso junto.'
    ],
    approach: analysis.faltante > 200 ? 'leve' : 'direto'
  }
}

/**
 * Como o NOEL ajusta metas conforme o nível do consultor
 */
export function adjustGoalByLevel(
  nivel: GoalsContext['nivelConsultor'],
  pvAtual: number
): {
  idealMeta: number
  message: string
  ritmo: string
} {
  const levels = {
    iniciante: {
      idealMeta: 500,
      message: 'Foco em criar base e aprender',
      ritmo: '250-500 PV'
    },
    intermediario: {
      idealMeta: 1000,
      message: 'Estabilizar clientes e dominar upsell',
      ritmo: '500-1000 PV'
    },
    avancado: {
      idealMeta: 2500,
      message: 'Criar ritmo e ensinar duplicação',
      ritmo: '1000-2500 PV'
    },
    lider: {
      idealMeta: 5000,
      message: 'Desenvolver profundidade e equipe',
      ritmo: '2500+ PV'
    }
  }
  
  return levels[nivel]
}

/**
 * Como o NOEL acompanha evolução mês a mês
 */
export interface MonthlyEvolution {
  mes: number
  pv: number
  novosClientes: number
  upsellSuccess: number
  consistency: number
}

export function trackMonthlyEvolution(evolution: MonthlyEvolution[]): {
  progression: string
  nextMonthGoal: number
  recommendations: string[]
} {
  if (evolution.length === 0) {
    return {
      progression: 'Primeiro mês - estrutura e começo',
      nextMonthGoal: 250,
      recommendations: ['Focar em criar base', 'Aprender ferramentas', 'Ganhar confiança']
    }
  }
  
  const lastMonth = evolution[evolution.length - 1]
  const previousMonth = evolution.length > 1 ? evolution[evolution.length - 2] : null
  
  let progression = ''
  let nextMonthGoal = lastMonth.pv
  const recommendations: string[] = []
  
  if (evolution.length === 1) {
    progression = '1º mês: estrutura e começo'
    nextMonthGoal = 500
    recommendations.push('Estabilizar em 500 PV')
    recommendations.push('Criar rotina de clientes')
  } else if (evolution.length === 2) {
    progression = '2º mês: estabilidade'
    nextMonthGoal = 750
    recommendations.push('Fortalecer base de clientes')
    recommendations.push('Iniciar upsell')
  } else if (evolution.length === 3) {
    progression = '3º mês: fortalecimento'
    nextMonthGoal = 1000
    recommendations.push('Estabilizar 1000 PV')
    recommendations.push('Dominar upsell')
  } else {
    progression = '4º mês: ritmo de 1000 PV'
    nextMonthGoal = 1000
    recommendations.push('Manter consistência')
    recommendations.push('Desenvolver equipe')
  }
  
  return {
    progression,
    nextMonthGoal,
    recommendations
  }
}





