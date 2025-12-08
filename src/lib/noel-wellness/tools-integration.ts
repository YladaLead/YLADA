/**
 * NOEL WELLNESS - Uso de Ferramentas
 * 
 * SEÇÃO 8 — COMO O NOEL USA FERRAMENTAS
 * 
 * Define como o NOEL integra ferramentas ao seu raciocínio e orientações.
 */

export interface ToolResult {
  toolType: 'quiz' | 'calculadora' | 'teste' | 'avaliacao' | 'diagnostico'
  toolName: string
  results: {
    energia?: 'baixa' | 'media' | 'alta'
    retencao?: 'leve' | 'moderada' | 'intensa'
    metabolismo?: 'lento' | 'normal' | 'acelerado'
    foco?: 'baixo' | 'medio' | 'alto'
    objetivo?: 'energia' | 'retencao' | 'foco' | 'metabolismo' | 'emagrecimento' | 'performance'
    [key: string]: any
  }
}

export interface ToolInterpretation {
  need: string
  pain: string
  objective: string
  idealProduct: 'kit' | 'turbo' | 'hype' | 'combo' | 'fechado'
  approach: string
  script: string
}

/**
 * Princípio central do uso de ferramentas
 */
export const NOEL_TOOLS_CENTRAL = 
  'Toda ferramenta deve gerar clareza e movimento.\nDiagnóstico → Insight → Ação → PV.'

/**
 * Tipos de ferramentas que o NOEL interpreta
 */
export const NOEL_TOOL_TYPES = [
  'ferramentas de vendas (kits, Turbo, Hype, fechados)',
  'ferramentas de diagnóstico de saúde e bem-estar',
  'ferramentas de objetivo do cliente',
  'ferramentas de análise de perfil (para venda ou recrutamento)',
  'ferramentas de parasitas, proteína, água, metabolismo etc.',
  'ferramentas personalizadas criadas pelo consultor',
  'ferramentas de recrutamento e renda extra'
]

/**
 * Como o NOEL lê e interpreta cada ferramenta
 */
export function interpretToolResult(result: ToolResult): ToolInterpretation {
  const { results } = result
  
  // Identificar necessidade principal
  let need = 'bem-estar geral'
  let pain = 'rotina desorganizada'
  let objective = 'melhorar rotina'
  
  if (results.energia === 'baixa') {
    need = 'energia'
    pain = 'cansaço e falta de disposição'
    objective = 'aumentar energia e disposição'
  } else if (results.retencao === 'intensa' || results.retencao === 'moderada') {
    need = 'retenção'
    pain = 'inchaço e retenção de líquidos'
    objective = 'reduzir retenção e se sentir mais leve'
  } else if (results.metabolismo === 'lento') {
    need = 'metabolismo'
    pain = 'metabolismo lento e dificuldade de emagrecer'
    objective = 'acelerar metabolismo'
  } else if (results.foco === 'baixo') {
    need = 'foco'
    pain = 'falta de foco e clareza mental'
    objective = 'melhorar foco e produtividade'
  } else if (results.objetivo) {
    objective = results.objetivo
    need = results.objetivo
  }
  
  // Escolher produto ideal
  let idealProduct: ToolInterpretation['idealProduct'] = 'kit'
  
  if (need === 'energia') {
    idealProduct = 'kit' // Kit Energia + Acelera
  } else if (need === 'retenção' || need === 'metabolismo') {
    idealProduct = 'turbo'
  } else if (need === 'foco' || need === 'performance') {
    idealProduct = 'hype'
  } else if (results.energia === 'baixa' && results.retencao) {
    idealProduct = 'combo' // Kit + Turbo
  }
  
  // Criar abordagem
  const approach = `Pelo seu teste, o que mais te ajuda agora é ${idealProduct === 'kit' ? 'um kit de 5 dias' : idealProduct === 'turbo' ? 'o Litrão Turbo' : idealProduct === 'hype' ? 'o Hype Drink' : 'um combo completo'}.`
  
  // Gerar script
  const script = `Olá! Pelo seu teste, identifiquei que você precisa de ${objective}.\n\n${approach}\n\nQuer experimentar por 5 dias?`
  
  return {
    need,
    pain,
    objective,
    idealProduct,
    approach,
    script
  }
}

/**
 * Como o NOEL transforma diagnóstico em venda
 */
export function transformDiagnosisToSale(interpretation: ToolInterpretation): {
  clarity: string
  product: string
  benefit: string
  script: string
  followUp: string
} {
  const productNames: Record<ToolInterpretation['idealProduct'], string> = {
    kit: 'Kit de 5 bebidas (Energia + Acelera)',
    turbo: 'Litrão Turbo (5 dias)',
    hype: 'Hype Drink',
    combo: 'Kit + Litrão Turbo',
    fechado: 'Produto fechado (NRG / Herbal Concentrate)'
  }
  
  const benefits: Record<ToolInterpretation['idealProduct'], string> = {
    kit: 'aumenta energia e acelera metabolismo',
    turbo: 'reduz retenção e acelera metabolismo',
    hype: 'melhora foco e performance',
    combo: 'energia + redução de retenção',
    fechado: 'resultados mais intensos'
  }
  
  return {
    clarity: `Pelo diagnóstico, você precisa de ${interpretation.need}.`,
    product: productNames[interpretation.idealProduct],
    benefit: benefits[interpretation.idealProduct],
    script: interpretation.script,
    followUp: 'Como você está se sentindo? Quer que eu te mostre como usar?'
  }
}

/**
 * Como o NOEL escolhe o produto ideal com base na ferramenta
 */
export function selectProductFromTool(result: ToolResult): {
  product: ToolInterpretation['idealProduct']
  reason: string
} {
  const interpretation = interpretToolResult(result)
  
  const reasons: Record<ToolInterpretation['idealProduct'], string> = {
    kit: 'Ideal para começar e testar',
    turbo: 'Resolve retenção e acelera metabolismo',
    hype: 'Melhora foco e performance',
    combo: 'Solução completa para múltiplas necessidades',
    fechado: 'Para resultados mais intensos'
  }
  
  return {
    product: interpretation.idealProduct,
    reason: reasons[interpretation.idealProduct]
  }
}

/**
 * Como o NOEL integra ferramentas ao Modo Venda
 */
export function integrateToolToSaleMode(toolResult: ToolResult): {
  priority: 'alta' | 'media' | 'baixa'
  action: string
  script: string
} {
  const interpretation = interpretToolResult(toolResult)
  
  // Determinar prioridade baseado na intensidade da dor
  let priority: 'alta' | 'media' | 'baixa' = 'media'
  
  if (toolResult.results.energia === 'baixa' || 
      toolResult.results.retencao === 'intensa' ||
      toolResult.results.metabolismo === 'lento') {
    priority = 'alta'
  }
  
  return {
    priority,
    action: `Oferecer ${interpretation.idealProduct} para ${interpretation.need}`,
    script: interpretation.script
  }
}

/**
 * Como o NOEL integra ferramentas ao Modo Upsell
 */
export function integrateToolToUpsellMode(
  toolResult: ToolResult,
  currentConsumption: 'kit' | 'turbo' | 'hype'
): {
  upgrade: ToolInterpretation['idealProduct']
  reason: string
  script: string
} {
  const interpretation = interpretToolResult(toolResult)
  
  // Determinar upgrade baseado no consumo atual e necessidade
  let upgrade: ToolInterpretation['idealProduct'] = 'turbo'
  
  if (currentConsumption === 'kit') {
    if (interpretation.need === 'retenção' || interpretation.need === 'metabolismo') {
      upgrade = 'turbo'
    } else if (interpretation.need === 'foco') {
      upgrade = 'hype'
    } else {
      upgrade = 'combo'
    }
  } else if (currentConsumption === 'turbo') {
    upgrade = 'hype'
  } else if (currentConsumption === 'hype') {
    upgrade = 'fechado'
  }
  
  const reason = `O teste mostra que você precisa de ${interpretation.need}. O ${upgrade} resolve isso melhor.`
  
  const script = `Vi que você já usa ${currentConsumption}. Pelo seu teste, o ${upgrade} vai potencializar seus resultados. Quer testar?`
  
  return {
    upgrade,
    reason,
    script
  }
}

/**
 * Como o NOEL integra ferramentas ao Modo Recrutamento
 */
export function integrateToolToRecruitmentMode(toolResult: ToolResult): {
  hasProfile: boolean
  angle: string
  script: string
  homInvite: string
} {
  // Verificar se tem perfil recrutável baseado no resultado
  const hasProfile = 
    toolResult.results.objetivo === 'renda_extra' ||
    toolResult.results.objetivo === 'independencia' ||
    (toolResult.results.energia === 'baixa' && toolResult.results.retencao)
  
  const angle = hasProfile
    ? 'Pessoa com necessidade clara + potencial de interesse em renda'
    : 'Ainda não identificado perfil recrutável'
  
  const script = hasProfile
    ? 'Oi! Vi que você tem interesse em melhorar seu bem-estar. Tenho um projeto onde pessoas transformam isso em renda também. Quer conhecer?'
    : 'Continue acompanhando o cliente. Pode surgir interesse em renda depois.'
  
  const homInvite = 'Vai ter uma apresentação rápida do projeto hoje. Quer que eu te mande o link?'
  
  return {
    hasProfile,
    angle,
    script,
    homInvite
  }
}

/**
 * Como o NOEL integra ferramentas ao Modo Diagnóstico
 */
export function integrateToolToDiagnosisMode(
  toolResult: ToolResult,
  clientHistory?: {
    consumoAtual?: string
    rotina?: string
    metasPessoais?: string
  }
): {
  probableCause: string
  idealProduct: ToolInterpretation['idealProduct']
  strategy: string
} {
  const interpretation = interpretToolResult(toolResult)
  
  // Combinar resultado da ferramenta com histórico
  let probableCause = interpretation.pain
  
  if (clientHistory?.consumoAtual === 'kit' && interpretation.need === 'retenção') {
    probableCause = 'Cliente precisa intensificar - kit sozinho não está resolvendo retenção'
  } else if (clientHistory?.rotina === 'desorganizada') {
    probableCause = 'Rotina desorganizada + ' + interpretation.pain
  }
  
  const strategy = `1. Oferecer ${interpretation.idealProduct}\n2. Criar rotina de 5 dias\n3. Acompanhar resultados\n4. Ajustar conforme necessidade`
  
  return {
    probableCause,
    idealProduct: interpretation.idealProduct,
    strategy
  }
}





