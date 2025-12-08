/**
 * NOEL WELLNESS - Uso de Banco de Dados
 * 
 * SEÇÃO 6 — COMO O NOEL USA O BANCO DE DADOS
 * 
 * Define como o NOEL utiliza o banco de dados como base de todo o seu raciocínio prático.
 */

export interface NoelDataUsage {
  centralPrinciple: string
  usersTable: {
    reads: string[]
    uses: string[]
  }
  clientsTable: {
    reads: string[]
    uses: string[]
  }
  pvRecordsTable: {
    reads: string[]
    uses: string[]
  }
  scriptsTable: {
    reads: string[]
    uses: string[]
  }
  toolsTable: {
    reads: string[]
    uses: string[]
  }
  careerProgressTable: {
    reads: string[]
    uses: string[]
  }
  messageHistory: {
    reads: string[]
    uses: string[]
  }
  opportunityDetection: string[]
  missingDataHandling: string[]
}

/**
 * Princípio central de uso de dados
 */
export const NOEL_DATA_CENTRAL_PRINCIPLE = 
  'O NOEL só orienta com base em dados reais — nunca em achismos.'

/**
 * Como o NOEL usa os dados da tabela USERS
 */
export const NOEL_USERS_TABLE = {
  reads: [
    'nome do consultor',
    'nível (iniciante, 500pv, 1000pv, ativo, Equipe Mundial, GET…)',
    'tempo de conta',
    'papel (consultor / líder)'
  ],
  uses: [
    'ajustar o tom de voz',
    'entregar explicações mais simples para iniciantes',
    'dar orientações estratégicas para líderes',
    'entender se é hora de ensinar ou de direcionar'
  ]
}

/**
 * Como o NOEL usa a tabela CLIENTS
 */
export const NOEL_CLIENTS_TABLE = {
  reads: [
    'nome de cada cliente',
    'última compra',
    'categoria PV (50 / 75 / 100)',
    'notas de comportamento',
    'padrão de consumo',
    'clientes inativos'
  ],
  uses: [
    'montar listas inteligentes de ação',
    'identificar quem pode comprar hoje',
    'saber quem tem potencial para upsell',
    'sugerir scripts personalizados',
    'detectar abandono e iniciar reativação',
    'calcular impacto de cada cliente no PV'
  ]
}

/**
 * Como o NOEL usa a tabela PV_RECORDS
 */
export const NOEL_PV_RECORDS_TABLE = {
  reads: [
    'PV do mês atual',
    'PV das últimas semanas',
    'PV da equipe (quando existir)',
    'PV de kits, Turbo, Hype e produtos fechados'
  ],
  uses: [
    'calcular faltante para meta',
    'identificar tendências',
    'sugerir ações corretivas',
    'acompanhar progresso semanal'
  ]
}

/**
 * Como o NOEL usa a tabela SCRIPTS
 */
export const NOEL_SCRIPTS_TABLE = {
  reads: [
    'scripts por tipo de pessoa',
    'scripts por objetivo',
    'scripts por contexto',
    'scripts de follow-up'
  ],
  uses: [
    'selecionar automaticamente o script ideal',
    'adaptar o script ao tom do consultor',
    'personalizar conforme o momento da conversa',
    'escolher uma das 3 versões (curta, média ou longa)'
  ]
}

/**
 * Como o NOEL usa a tabela TOOLS (Ferramentas)
 */
export const NOEL_TOOLS_TABLE = {
  reads: [
    'ferramentas disponíveis',
    'descrição',
    'lógica interna',
    'resultado de diagnósticos'
  ],
  uses: [
    'transformar diagnósticos em vendas',
    'sugerir kits e produtos conforme necessidades detectadas',
    'orientar o consultor passo a passo'
  ]
}

/**
 * Como o NOEL usa a tabela CAREER_PROGRESS
 */
export const NOEL_CAREER_PROGRESS_TABLE = {
  reads: [
    'PV pessoal',
    'PV da equipe',
    'média dos últimos 4 meses',
    'nível atual',
    'proximidade de avanço'
  ],
  uses: [
    'calcular próximo nível',
    'sugerir ações para avanço',
    'acompanhar evolução',
    'identificar oportunidades de carreira'
  ]
}

/**
 * Como o NOEL usa histórico de mensagens (NOEL_INTERACTIONS)
 */
export const NOEL_MESSAGE_HISTORY = {
  reads: [
    'últimas orientações',
    'dúvidas anteriores',
    'padrões de comportamento',
    'temas recorrentes'
  ],
  uses: [
    'evitar repetições desnecessárias',
    'manter continuidade',
    'lembrar do contexto',
    'reforçar aprendizados'
  ]
}

/**
 * Como o NOEL usa dados para detectar oportunidades
 */
export const NOEL_OPPORTUNITY_DETECTION = [
  'Cliente que sempre compra kit → sugerir upgrade para Turbo',
  'Cliente 50 PV com rotina estável → sugerir 75 PV',
  'Cliente 75 PV → migrar para 100 PV',
  'Consultor sempre trava nos mesmos dias → sugerir rotina',
  'Consultor com PV baixo na 2ª semana → intensificar ação'
]

/**
 * Como o NOEL reage quando faltam dados
 */
export const NOEL_MISSING_DATA_HANDLING = [
  'Identifica o dado faltante',
  'Informa com clareza',
  'Pede exatamente o que precisa (ex: "Qual foi sua última venda?")',
  'Sugere o primeiro passo para completar o dado'
]

/**
 * Função para obter uso completo de dados do NOEL
 */
export function getNoelDataUsage(): NoelDataUsage {
  return {
    centralPrinciple: NOEL_DATA_CENTRAL_PRINCIPLE,
    usersTable: NOEL_USERS_TABLE,
    clientsTable: NOEL_CLIENTS_TABLE,
    pvRecordsTable: NOEL_PV_RECORDS_TABLE,
    scriptsTable: NOEL_SCRIPTS_TABLE,
    toolsTable: NOEL_TOOLS_TABLE,
    careerProgressTable: NOEL_CAREER_PROGRESS_TABLE,
    messageHistory: NOEL_MESSAGE_HISTORY,
    opportunityDetection: NOEL_OPPORTUNITY_DETECTION,
    missingDataHandling: NOEL_MISSING_DATA_HANDLING
  }
}

/**
 * Detecta oportunidades baseado em dados
 */
export interface OpportunityContext {
  clientes: Array<{
    nome: string
    ultimaCompra?: Date
    categoriaPV?: 50 | 75 | 100
    padraoConsumo?: 'kit' | 'turbo' | 'hype' | 'fechado'
    inativo?: boolean
    diasInativo?: number
  }>
  pvAtual?: number
  pvMeta?: number
  semanaDoMes?: number
  historicoPV?: number[]
}

export interface DetectedOpportunity {
  type: 'upsell' | 'reativacao' | 'novo_cliente' | 'intensificar'
  description: string
  action: string
  priority: 'alta' | 'media' | 'baixa'
}

export function detectOpportunities(context: OpportunityContext): DetectedOpportunity[] {
  const opportunities: DetectedOpportunity[] = []
  
  // Detectar upsell
  for (const cliente of context.clientes) {
    if (cliente.categoriaPV === 50 && cliente.padraoConsumo === 'kit') {
      opportunities.push({
        type: 'upsell',
        description: `${cliente.nome} tem potencial para 75 PV`,
        action: `Oferecer upgrade para Turbo ou Hype`,
        priority: 'alta'
      })
    }
    
    if (cliente.categoriaPV === 75) {
      opportunities.push({
        type: 'upsell',
        description: `${cliente.nome} pode migrar para 100 PV`,
        action: `Oferecer combo Turbo + Hype ou produto fechado`,
        priority: 'media'
      })
    }
  }
  
  // Detectar reativação
  for (const cliente of context.clientes) {
    if (cliente.inativo && cliente.diasInativo && cliente.diasInativo >= 7) {
      opportunities.push({
        type: 'reativacao',
        description: `${cliente.nome} está inativo há ${cliente.diasInativo} dias`,
        action: `Enviar mensagem de reativação leve`,
        priority: 'alta'
      })
    }
  }
  
  // Detectar necessidade de intensificar
  if (context.pvAtual && context.pvMeta && context.semanaDoMes) {
    const faltante = context.pvMeta - context.pvAtual
    const diasRestantes = (4 - context.semanaDoMes) * 7
    
    if (diasRestantes > 0) {
      const pvNecessarioPorDia = faltante / diasRestantes
      
      if (pvNecessarioPorDia > 30) {
        opportunities.push({
          type: 'intensificar',
          description: `Faltam ${faltante} PV. Necessário ${Math.ceil(pvNecessarioPorDia)} PV/dia`,
          action: `Intensificar ações: ${Math.ceil(pvNecessarioPorDia / 20)} kits ou ${Math.ceil(pvNecessarioPorDia / 30)} Turbos por dia`,
          priority: 'alta'
        })
      }
    }
  }
  
  return opportunities.sort((a, b) => {
    const priorityOrder = { alta: 3, media: 2, baixa: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}





