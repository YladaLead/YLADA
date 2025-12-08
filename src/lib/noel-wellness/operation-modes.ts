/**
 * NOEL WELLNESS - Modos de Operação
 * 
 * SEÇÃO 4 — MODOS DE OPERAÇÃO DO NOEL
 * 
 * Define os "cérebros paralelos" do NOEL - como ele pensa, prioriza e age conforme a necessidade.
 */

export type NoelOperationMode = 
  | 'venda'
  | 'upsell'
  | 'reativacao'
  | 'scripts'
  | 'ferramentas'
  | 'meta_pv'
  | 'carreira'
  | 'recrutamento'
  | 'lideranca'
  | 'diagnostico'

export interface OperationModeConfig {
  id: NoelOperationMode
  name: string
  objective: string
  actions: string[]
  thinking: string[]
  triggers: string[]
}

/**
 * MODO VENDA — Quando o consultor quer gerar movimento
 */
export const MODE_VENDA: OperationModeConfig = {
  id: 'venda',
  name: 'Modo Venda',
  objective: 'Aumentar número de kits, fechar vendas rápidas e abrir portas',
  actions: [
    'Identificar leads quentes',
    'Sugerir convites leves',
    'Oferecer kits de entrada',
    'Criar movimento diário'
  ],
  thinking: [
    'Quem já demonstrou interesse?',
    'Qual a melhor porta de entrada?',
    'Como tornar o convite leve?',
    'Qual produto oferecer primeiro?'
  ],
  triggers: [
    'vender',
    'vendas',
    'kit',
    'cliente',
    'movimento',
    'gerar',
    'fechar'
  ]
}

/**
 * MODO UPSELL — Transformar clientes pequenos em clientes grandes
 */
export const MODE_UPSELL: OperationModeConfig = {
  id: 'upsell',
  name: 'Modo Upsell',
  objective: 'Elevar de 50 → 75 → 100 PV',
  actions: [
    'Analisa consumo do cliente',
    'Identifica qual upgrade é mais natural (Turbo, Hype, fechado)',
    'Gera mensagem personalizada',
    'Mostra probabilidade de compra'
  ],
  thinking: [
    'O que esse cliente já consome?',
    'O que faz sentido oferecer agora?',
    'Qual produto aumenta mais PV com menos esforço?',
    'Como tornar o convite leve e irresistível?'
  ],
  triggers: [
    'upsell',
    'aumentar',
    'upgrade',
    'turbo',
    'hype',
    '50 pv',
    '75 pv',
    '100 pv'
  ]
}

/**
 * MODO REATIVAÇÃO — Trazer clientes sumidos de volta ao fluxo
 */
export const MODE_REATIVACAO: OperationModeConfig = {
  id: 'reativacao',
  name: 'Modo Reativação',
  objective: 'Recuperar PV perdido',
  actions: [
    'Lista clientes inativos (7+ dias)',
    'Gera mensagem personalizada por tipo de cliente',
    'Sugere oferta leve ou gatilho emocional'
  ],
  thinking: [
    'Por que esse cliente parou?',
    'O que pode motivar o retorno?',
    'Qual a abordagem mais gentil?',
    'Como tornar a retomada fácil?'
  ],
  triggers: [
    'reativar',
    'reativação',
    'sumiu',
    'inativo',
    'parou',
    'desapareceu',
    'não compra'
  ]
}

/**
 * MODO SCRIPTS — Selecionar, adaptar e criar scripts sob demanda
 */
export const MODE_SCRIPTS: OperationModeConfig = {
  id: 'scripts',
  name: 'Modo Scripts',
  objective: 'Entregar mensagens perfeitas para cada situação',
  actions: [
    'Seleciona script ideal',
    'Adapta ao contexto',
    'Personaliza conteúdo',
    'Oferece versões (curta, média, longa)'
  ],
  thinking: [
    'Qual tipo de pessoa?',
    'Qual objetivo da conversa?',
    'Qual estágio da conversa?',
    'Qual tom adequado?'
  ],
  triggers: [
    'script',
    'mensagem',
    'texto',
    'o que falar',
    'como falar',
    'mensagem pronta'
  ]
}

/**
 * MODO FERRAMENTAS — Integrar diagnósticos e quizzes com vendas
 */
export const MODE_FERRAMENTAS: OperationModeConfig = {
  id: 'ferramentas',
  name: 'Modo Ferramentas',
  objective: 'Transformar resultados de ferramentas em PV real',
  actions: [
    'Interpreta resultados da ferramenta',
    'Sugere kit, Turbo, Hype ou produto fechado',
    'Cria scripts direcionados ao diagnóstico'
  ],
  thinking: [
    'Qual foi o resultado?',
    'O que o cliente precisa?',
    'Qual produto resolve melhor?',
    'Como convidar de forma leve?'
  ],
  triggers: [
    'ferramenta',
    'quiz',
    'teste',
    'diagnóstico',
    'resultado',
    'avaliação'
  ]
}

/**
 * MODO META & PV — Acompanhar metas e mostrar o caminho diário
 */
export const MODE_META_PV: OperationModeConfig = {
  id: 'meta_pv',
  name: 'Modo Meta & PV',
  objective: 'Fazer o consultor bater a meta do mês',
  actions: [
    'Calcula PV atual + faltante',
    'Mostra quantos kits, Turbo, Hype ou produtos fechados faltam',
    'Sugere um "plano de hoje"',
    'Cria estratégia semanal'
  ],
  thinking: [
    'Quanto falta?',
    'Qual caminho mais curto?',
    'Qual cliente pode contribuir agora?',
    'O que o consultor precisa fazer hoje?'
  ],
  triggers: [
    'meta',
    'pv',
    'pontos',
    'volume',
    'faltam',
    'quanto falta',
    'bater meta'
  ]
}

/**
 * MODO CARREIRA — Ajudar o consultor a subir de nível
 */
export const MODE_CARREIRA: OperationModeConfig = {
  id: 'carreira',
  name: 'Modo Carreira',
  objective: 'Evoluir rumo à Equipe Mundial → GET → Milionário → Presidente',
  actions: [
    'Mostra próximo nível',
    'Calcula PV necessário',
    'Orienta desenvolvimento de equipe',
    'Ensina duplicação'
  ],
  thinking: [
    'Qual o nível atual?',
    'Quanto falta para o próximo?',
    'Qual o caminho mais simples?',
    'Como desenvolver profundidade?'
  ],
  triggers: [
    'carreira',
    'nível',
    'equipe mundial',
    'get',
    'milionário',
    'presidente',
    'subir',
    'evoluir'
  ]
}

/**
 * MODO RECRUTAMENTO — Transformar clientes em consultores e novos contatos em equipe
 */
export const MODE_RECRUTAMENTO: OperationModeConfig = {
  id: 'recrutamento',
  name: 'Modo Recrutamento',
  objective: 'Criar consultores novos e duplicáveis',
  actions: [
    'Identifica perfis com potencial',
    'Sugere o momento ideal para convidar',
    'Prepara scripts leves e profissionais',
    'Cria sequência de follow-up para recrutamento'
  ],
  thinking: [
    'Essa pessoa tem perfil?',
    'Qual porta de entrada funciona melhor?',
    'Como convidar sem pressão?',
    'Como guiar para a HOM?'
  ],
  triggers: [
    'recrutar',
    'recrutamento',
    'convidar',
    'equipe',
    'negócio',
    'oportunidade',
    'renda extra',
    'hom'
  ]
}

/**
 * MODO LIDERANÇA — Ajudar o consultor a formar e liderar uma equipe
 */
export const MODE_LIDERANCA: OperationModeConfig = {
  id: 'lideranca',
  name: 'Modo Liderança',
  objective: 'Ensinar ritmo, visão e duplicação',
  actions: [
    'Mostra desempenho de cada consultor da equipe',
    'Sinaliza quem precisa de ajuda',
    'Ensaia conversas de liderança'
  ],
  thinking: [
    'Qual membro está crescendo?',
    'Quem está travado?',
    'Quem pode virar líder?',
    'Como apoiar sem carregar no colo?'
  ],
  triggers: [
    'liderança',
    'equipe',
    'time',
    'consultores',
    'duplicação',
    'ensinar',
    'treinar'
  ]
}

/**
 * MODO DIAGNÓSTICO — Avaliar o cenário do consultor e recomendar a melhor estratégia
 */
export const MODE_DIAGNOSTICO: OperationModeConfig = {
  id: 'diagnostico',
  name: 'Modo Diagnóstico',
  objective: 'Identificar onde está o gargalo',
  actions: [
    'Analisa dados gerais (PV, clientes, vendas, equipe)',
    'Aponta o problema mais provável',
    'Propõe solução em passos simples'
  ],
  thinking: [
    'O que está abaixo da média?',
    'Onde há maior perda de PV?',
    'Qual ação gera maior impacto imediato?',
    'Qual correção mantém o ritmo a longo prazo?'
  ],
  triggers: [
    'diagnóstico',
    'problema',
    'gargalo',
    'o que está errado',
    'por que não funciona',
    'análise'
  ]
}

/**
 * Mapa de todos os modos
 */
export const NOEL_OPERATION_MODES: Record<NoelOperationMode, OperationModeConfig> = {
  venda: MODE_VENDA,
  upsell: MODE_UPSELL,
  reativacao: MODE_REATIVACAO,
  scripts: MODE_SCRIPTS,
  ferramentas: MODE_FERRAMENTAS,
  meta_pv: MODE_META_PV,
  carreira: MODE_CARREIRA,
  recrutamento: MODE_RECRUTAMENTO,
  lideranca: MODE_LIDERANCA,
  diagnostico: MODE_DIAGNOSTICO
}

/**
 * Detecta qual modo de operação deve ser ativado baseado na mensagem
 */
export function detectOperationMode(message: string, context?: {
  pvAtual?: number
  pvMeta?: number
  semanaDoMes?: number
  clientesInativos?: number
}): NoelOperationMode {
  const lowerMessage = message.toLowerCase()
  
  // Contar matches de triggers para cada modo
  const modeScores: Record<NoelOperationMode, number> = {
    venda: 0,
    upsell: 0,
    reativacao: 0,
    scripts: 0,
    ferramentas: 0,
    meta_pv: 0,
    carreira: 0,
    recrutamento: 0,
    lideranca: 0,
    diagnostico: 0
  }
  
  // Calcular scores
  for (const [mode, config] of Object.entries(NOEL_OPERATION_MODES)) {
    for (const trigger of config.triggers) {
      if (lowerMessage.includes(trigger)) {
        modeScores[mode as NoelOperationMode]++
      }
    }
  }
  
  // Ajustes baseados em contexto
  if (context?.clientesInativos && context.clientesInativos > 0) {
    modeScores.reativacao += 2
  }
  
  if (context?.pvAtual && context?.pvMeta) {
    const faltante = context.pvMeta - context.pvAtual
    if (faltante > 0 && faltante < 200) {
      modeScores.meta_pv += 2
    }
  }
  
  if (context?.semanaDoMes === 4) {
    modeScores.meta_pv += 1
  }
  
  // Encontrar modo com maior score
  let maxScore = 0
  let selectedMode: NoelOperationMode = 'venda'
  
  for (const [mode, score] of Object.entries(modeScores)) {
    if (score > maxScore) {
      maxScore = score
      selectedMode = mode as NoelOperationMode
    }
  }
  
  // Se nenhum modo teve score, usar modo padrão baseado em palavras-chave
  if (maxScore === 0) {
    if (lowerMessage.includes('como') || lowerMessage.includes('o que')) {
      return 'diagnostico'
    }
    return 'venda' // Modo padrão
  }
  
  return selectedMode
}

/**
 * Obtém configuração de um modo específico
 */
export function getOperationMode(mode: NoelOperationMode): OperationModeConfig {
  return NOEL_OPERATION_MODES[mode]
}

/**
 * Obtém todos os modos disponíveis
 */
export function getAllOperationModes(): OperationModeConfig[] {
  return Object.values(NOEL_OPERATION_MODES)
}





