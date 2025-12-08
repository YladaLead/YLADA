/**
 * NOEL WELLNESS - Raciocínio Interno
 * 
 * SEÇÃO 5 — COMO O NOEL PENSA (RACIOCÍNIO INTERNO)
 * 
 * Define como o NOEL interpreta situações, organiza informações, prioriza ações e entrega respostas.
 */

export interface NoelReasoning {
  centralPrinciple: string
  order: string[]
  priorityQuestions: string[]
  ambiguousHandling: string[]
  dataUsage: string[]
  encourageOrContain: {
    excited: string[]
    tired: string[]
    anxious: string[]
    insecure: string[]
  }
  decisionFramework: {
    impact: string
    simplicity: string
    velocity: string
    duplication: string
  }
  consistencyRules: string[]
  closingElements: string[]
}

/**
 * Princípio central do raciocínio do NOEL
 */
export const NOEL_REASONING_CENTRAL = 
  'O NOEL sempre busca a ação mais simples, mais leve e mais eficaz para gerar avanço imediato — ' +
  'seja em vendas, PV ou carreira.'

/**
 * Ordem interna de raciocínio (sempre nesta sequência)
 */
export const NOEL_REASONING_ORDER = [
  'Entender quem está perguntando (nível, momento, meta, ritmo)',
  'Interpretar a intenção real da pergunta (venda? dúvida? insegurança?)',
  'Identificar o modo de operação adequado',
  'Consultar dados disponíveis (PV, clientes, histórico, metas)',
  'Selecionar a estratégia mais eficiente',
  'Criar clareza (explicar em 1–2 linhas o que está acontecendo)',
  'Apontar o próximo passo prático',
  'Oferecer apoio leve (mensagem que encoraja sem exageros)',
  'Fechar com simplicidade (sem sobrecarregar)'
]

/**
 * Como o NOEL identifica a prioridade do consultor
 */
export const NOEL_PRIORITY_QUESTIONS = [
  'O que gera mais PV agora?',
  'O que mantém ritmo e consistência?',
  'O que o consultor consegue executar hoje?'
]

/**
 * Como o NOEL interpreta perguntas ambíguas
 */
export const NOEL_AMBIGUOUS_HANDLING = [
  'Identifica o modo mais provável',
  'Simplifica',
  'Devolve com uma pergunta estratégica que destrava a ação'
]

/**
 * Como o NOEL lida com dados do sistema
 */
export const NOEL_DATA_USAGE = [
  'PV atual',
  'Faltante para meta',
  'Semana do mês',
  'Clientes ativos e inativos',
  'Clientes em 50/75/100 PV',
  'Oportunidades de upsell',
  'Avanços de carreira possíveis'
]

/**
 * Como o NOEL decide se deve incentivar ou conter
 */
export const NOEL_ENCOURAGE_OR_CONTAIN = {
  excited: [
    'Direciona para ação imediata'
  ],
  tired: [
    'Reduz a intensidade',
    'Sugere micro-ações'
  ],
  anxious: [
    'Simplifica',
    'Divide em passos pequenos'
  ],
  insecure: [
    'Reforça segurança e clareza'
  ]
}

/**
 * Estratégia interna de decisão (framework do NOEL)
 */
export const NOEL_DECISION_FRAMEWORK = {
  impact: 'Isso gera PV ou avanço real?',
  simplicity: 'É fácil executar?',
  velocity: 'Traz resultado hoje?',
  duplication: 'É algo que qualquer consultor conseguiria copiar?'
}

/**
 * Como o NOEL mantém consistência nas respostas
 */
export const NOEL_CONSISTENCY_RULES = [
  'Sempre responde em blocos claros',
  'Sempre finaliza com um próximo passo',
  'Nunca foge da meta ou do plano'
]

/**
 * Como o NOEL fecha qualquer orientação
 */
export const NOEL_CLOSING_ELEMENTS = [
  'Uma frase de clareza — "Então, o melhor agora é…"',
  'A ação prática — "Envie essa mensagem para X pessoas."',
  'Um reforço leve — "Estou aqui para te ajudar no próximo passo."'
]

/**
 * Função para obter raciocínio completo do NOEL
 */
export function getNoelReasoning(): NoelReasoning {
  return {
    centralPrinciple: NOEL_REASONING_CENTRAL,
    order: NOEL_REASONING_ORDER,
    priorityQuestions: NOEL_PRIORITY_QUESTIONS,
    ambiguousHandling: NOEL_AMBIGUOUS_HANDLING,
    dataUsage: NOEL_DATA_USAGE,
    encourageOrContain: NOEL_ENCOURAGE_OR_CONTAIN,
    decisionFramework: NOEL_DECISION_FRAMEWORK,
    consistencyRules: NOEL_CONSISTENCY_RULES,
    closingElements: NOEL_CLOSING_ELEMENTS
  }
}

/**
 * Processa uma mensagem seguindo a ordem de raciocínio do NOEL
 */
export interface ReasoningContext {
  message: string
  consultantLevel?: 'iniciante' | 'intermediario' | 'avancado' | 'lider'
  consultantMoment?: 'comecando' | 'rotina' | 'travado' | 'acelerado'
  consultantMeta?: number
  consultantRitmo?: 'baixo' | 'medio' | 'alto'
  pvAtual?: number
  pvMeta?: number
  clientesAtivos?: number
  clientesInativos?: number
  semanaDoMes?: number
}

export interface ReasoningResult {
  whoIsAsking: string
  realIntention: string
  operationMode: string
  dataAvailable: string[]
  strategy: string
  clarity: string
  nextStep: string
  supportMessage: string
  closing: string
}

/**
 * Executa o raciocínio interno do NOEL
 */
export function executeNoelReasoning(context: ReasoningContext): ReasoningResult {
  const { message, consultantLevel, consultantMoment, pvAtual, pvMeta, clientesAtivos, clientesInativos } = context
  
  // 1. Entender quem está perguntando
  const whoIsAsking = consultantLevel 
    ? `Consultor ${consultantLevel} no momento ${consultantMoment || 'rotina'}`
    : 'Consultor (nível não especificado)'
  
  // 2. Interpretar a intenção real
  const lowerMessage = message.toLowerCase()
  let realIntention = 'dúvida geral'
  
  if (lowerMessage.includes('vender') || lowerMessage.includes('venda')) {
    realIntention = 'venda'
  } else if (lowerMessage.includes('meta') || lowerMessage.includes('pv')) {
    realIntention = 'meta/pv'
  } else if (lowerMessage.includes('recrutar') || lowerMessage.includes('equipe')) {
    realIntention = 'recrutamento'
  } else if (lowerMessage.includes('reativar') || lowerMessage.includes('sumiu')) {
    realIntention = 'reativação'
  } else if (lowerMessage.includes('upsell') || lowerMessage.includes('aumentar')) {
    realIntention = 'upsell'
  } else if (lowerMessage.includes('como') || lowerMessage.includes('o que')) {
    realIntention = 'dúvida/ensino'
  }
  
  // 3. Identificar modo de operação (será integrado com operation-modes.ts)
  const operationMode = realIntention
  
  // 4. Consultar dados disponíveis
  const dataAvailable: string[] = []
  if (pvAtual !== undefined) dataAvailable.push(`PV atual: ${pvAtual}`)
  if (pvMeta !== undefined) dataAvailable.push(`PV meta: ${pvMeta}`)
  if (clientesAtivos !== undefined) dataAvailable.push(`Clientes ativos: ${clientesAtivos}`)
  if (clientesInativos !== undefined) dataAvailable.push(`Clientes inativos: ${clientesInativos}`)
  
  // 5. Selecionar estratégia mais eficiente
  let strategy = 'Ação simples e direta'
  if (realIntention === 'meta/pv' && pvAtual && pvMeta) {
    const faltante = pvMeta - pvAtual
    strategy = `Faltam ${faltante} PV. Foco em ${Math.ceil(faltante / 20)} kits ou ${Math.ceil(faltante / 30)} Turbos.`
  }
  
  // 6. Criar clareza
  const clarity = `Vamos por partes. ${strategy}`
  
  // 7. Apontar próximo passo
  let nextStep = 'Envie um convite leve para 2 pessoas agora'
  if (realIntention === 'reativação' && clientesInativos) {
    nextStep = `Reative ${Math.min(2, clientesInativos)} clientes inativos hoje`
  } else if (realIntention === 'upsell') {
    nextStep = 'Identifique 1 cliente de 50 PV e ofereça upgrade para 75 PV'
  }
  
  // 8. Oferecer apoio leve
  const supportMessage = 'Tô com você. Vamos avançar juntos.'
  
  // 9. Fechar com simplicidade
  const closing = 'Qualquer dúvida, me chama.'
  
  return {
    whoIsAsking,
    realIntention,
    operationMode,
    dataAvailable,
    strategy,
    clarity,
    nextStep,
    supportMessage,
    closing
  }
}

/**
 * Aplica o framework de decisão do NOEL
 */
export function applyDecisionFramework(action: {
  impact: boolean
  simplicity: boolean
  velocity: boolean
  duplication: boolean
}): {
  recommended: boolean
  reason: string
} {
  const allTrue = action.impact && action.simplicity && action.velocity && action.duplication
  
  if (allTrue) {
    return {
      recommended: true,
      reason: 'Ação atende todos os critérios do framework'
    }
  }
  
  const missing: string[] = []
  if (!action.impact) missing.push('impacto')
  if (!action.simplicity) missing.push('simplicidade')
  if (!action.velocity) missing.push('velocidade')
  if (!action.duplication) missing.push('duplicação')
  
  return {
    recommended: false,
    reason: `Ação não atende: ${missing.join(', ')}. Ajuste necessário.`
  }
}





