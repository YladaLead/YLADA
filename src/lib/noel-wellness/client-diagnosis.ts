/**
 * NOEL WELLNESS - Diagnóstico de Clientes
 * 
 * SEÇÃO 14 — COMO O NOEL REALIZA DIAGNÓSTICO DE CLIENTES
 * 
 * Define como o NOEL identifica necessidades e recomenda produtos.
 */

export interface ClientDiagnosis {
  energia: 'baixa' | 'normal' | 'alta' | null
  metabolismo: 'lento' | 'normal' | 'acelerado' | null
  rotina: 'disciplinada' | 'instavel' | null
  objetivo: 'comecar_leve' | 'metas_definidas' | null
  historico: 'ja_comprou' | 'novo' | null
  categoriaPV?: 50 | 75 | 100
  padraoConsumo?: 'kit' | 'turbo' | 'hype' | 'fechado'
}

export interface DiagnosisResult {
  perfil: 'iniciante_total' | 'rotina_leve' | 'dedicado_dor_clara'
  produtoIdeal: 'kit' | 'turbo' | 'hype' | 'combo' | 'fechado'
  pvEstimado: number
  abordagem: string
  script: string
}

/**
 * Princípio central
 */
export const NOEL_DIAGNOSIS_CENTRAL = 
  'Diagnóstico é identificar o que o cliente mais precisa agora e oferecer a solução mais simples para ele começar.\n' +
  'O NOEL nunca complica. Ele sempre aponta o caminho mais leve, rápido e duplicável.'

/**
 * As 5 perguntas internas que o NOEL faz para diagnosticar
 */
export function askInternalQuestions(client: {
  mensagem?: string
  comportamento?: string
  historico?: string
}): ClientDiagnosis {
  const lowerMessage = (client.mensagem || '').toLowerCase()
  const lowerComportamento = (client.comportamento || '').toLowerCase()
  
  return {
    energia: 
      lowerMessage.includes('cansado') || lowerMessage.includes('sem energia') || lowerMessage.includes('disposição')
        ? 'baixa'
        : lowerMessage.includes('energia') || lowerMessage.includes('disposto')
        ? 'alta'
        : null,
    metabolismo:
      lowerMessage.includes('retenção') || lowerMessage.includes('inchaço') || lowerMessage.includes('lento') || lowerMessage.includes('emagrecer')
        ? 'lento'
        : lowerMessage.includes('metabolismo') || lowerMessage.includes('rápido')
        ? 'acelerado'
        : null,
    rotina:
      lowerComportamento.includes('disciplinado') || lowerComportamento.includes('rotina')
        ? 'disciplinada'
        : lowerComportamento.includes('instável') || lowerComportamento.includes('irregular')
        ? 'instavel'
        : null,
    objetivo:
      lowerMessage.includes('começar') || lowerMessage.includes('testar')
        ? 'comecar_leve'
        : lowerMessage.includes('meta') || lowerMessage.includes('objetivo')
        ? 'metas_definidas'
        : null,
    historico:
      client.historico === 'ja_comprou' || lowerMessage.includes('já usei') || lowerMessage.includes('já comprei')
        ? 'ja_comprou'
        : 'novo'
  }
}

/**
 * Como o NOEL classifica perfis de clientes
 */
export function classifyClientProfile(diagnosis: ClientDiagnosis): DiagnosisResult {
  // Perfil 1 — Iniciante total
  if (diagnosis.historico === 'novo' && !diagnosis.energia && !diagnosis.metabolismo) {
    return {
      perfil: 'iniciante_total',
      produtoIdeal: 'kit',
      pvEstimado: 25, // 20-30 PV/mês
      abordagem: 'Experiência leve e simples',
      script: 'Oi! Tenho um kit de 5 bebidas funcionais perfeito para você começar. Quer testar?'
    }
  }
  
  // Perfil 2 — Cliente de rotina leve
  if (diagnosis.historico === 'ja_comprou' && diagnosis.categoriaPV === 50) {
    return {
      perfil: 'rotina_leve',
      produtoIdeal: 'turbo',
      pvEstimado: 60, // 50-75 PV/mês
      abordagem: 'Upgrade natural para resultados melhores',
      script: 'Vi que você gostou do kit! Tenho uma versão Turbo que acelera os resultados. Quer testar?'
    }
  }
  
  // Perfil 3 — Cliente dedicado ou com dor clara
  if (diagnosis.energia === 'baixa' || diagnosis.metabolismo === 'lento' || diagnosis.objetivo === 'metas_definidas') {
    return {
      perfil: 'dedicado_dor_clara',
      produtoIdeal: diagnosis.metabolismo === 'lento' ? 'turbo' : diagnosis.energia === 'baixa' ? 'combo' : 'hype',
      pvEstimado: 90, // 75-120 PV/mês
      abordagem: 'Solução direcionada para necessidade específica',
      script: `Pelo que você contou (${diagnosis.energia === 'baixa' ? 'cansaço' : diagnosis.metabolismo === 'lento' ? 'retenção' : 'foco'}), o ideal pra você é ${diagnosis.metabolismo === 'lento' ? 'o Litrão Turbo' : diagnosis.energia === 'baixa' ? 'um combo completo' : 'o Hype Drink'}. Quer experimentar?`
    }
  }
  
  // Default — Iniciante
  return {
    perfil: 'iniciante_total',
    produtoIdeal: 'kit',
    pvEstimado: 25,
    abordagem: 'Começar leve',
    script: 'Oi! Tenho um kit de 5 bebidas funcionais perfeito para você começar. Quer testar?'
  }
}

/**
 * Diagnóstico baseado em palavras-chave
 */
export function diagnoseByKeywords(message: string): {
  need: string
  product: DiagnosisResult['produtoIdeal']
} {
  const lower = message.toLowerCase()
  
  if (lower.includes('cansaço') || lower.includes('sem energia') || lower.includes('disposição')) {
    return {
      need: 'energia',
      product: 'kit' // Kit Energia + Acelera
    }
  }
  
  if (lower.includes('retenção') || lower.includes('inchaço')) {
    return {
      need: 'retenção',
      product: 'turbo'
    }
  }
  
  if (lower.includes('foco') || lower.includes('concentração')) {
    return {
      need: 'foco',
      product: 'hype'
    }
  }
  
  if (lower.includes('metabolismo') || lower.includes('emagrecer') || lower.includes('queima')) {
    return {
      need: 'metabolismo',
      product: 'turbo'
    }
  }
  
  if (lower.includes('treino') || lower.includes('performance')) {
    return {
      need: 'performance',
      product: 'hype'
    }
  }
  
  return {
    need: 'bem-estar geral',
    product: 'kit'
  }
}

/**
 * Diagnóstico baseado em comportamento
 */
export function diagnoseByBehavior(behavior: {
  responseTime: 'rapido' | 'medio' | 'lento'
  interactionLevel: 'alto' | 'medio' | 'baixo'
  asksPrice: boolean
  complainsAboutResults: boolean
}): {
  profile: DiagnosisResult['perfil']
  approach: string
  product: DiagnosisResult['produtoIdeal']
} {
  // Cliente que demora para responder
  if (behavior.responseTime === 'lento') {
    return {
      profile: 'iniciante_total',
      approach: 'Solução leve e rápida',
      product: 'kit'
    }
  }
  
  // Cliente que interage muito
  if (behavior.interactionLevel === 'alto') {
    return {
      profile: 'rotina_leve',
      approach: 'Aberto a upsell',
      product: 'turbo'
    }
  }
  
  // Cliente que pergunta preço antes de entender
  if (behavior.asksPrice) {
    return {
      profile: 'iniciante_total',
      approach: 'Precisa de benefício antes de preço',
      product: 'kit'
    }
  }
  
  // Cliente que reclama de resultado lento
  if (behavior.complainsAboutResults) {
    return {
      profile: 'dedicado_dor_clara',
      approach: 'Precisa de rotina + intensificação',
      product: 'turbo'
    }
  }
  
  return {
    profile: 'iniciante_total',
    approach: 'Começar leve',
    product: 'kit'
  }
}

/**
 * Diagnóstico técnico padrão do NOEL
 */
export function performStandardDiagnosis(context: {
  pain?: string
  moment?: 'iniciante' | 'intermediario' | 'dedicado'
  product?: string
}): {
  painIdentified: string
  moment: string
  productIdeal: DiagnosisResult['produtoIdeal']
  nextStep: string
} {
  const pain = context.pain || 'bem-estar geral'
  const moment = context.moment || 'iniciante'
  
  let productIdeal: DiagnosisResult['produtoIdeal'] = 'kit'
  
  if (pain.includes('retenção') || pain.includes('inchaço')) {
    productIdeal = 'turbo'
  } else if (pain.includes('foco') || pain.includes('concentração')) {
    productIdeal = 'hype'
  } else if (pain.includes('energia') && moment === 'dedicado') {
    productIdeal = 'combo'
  }
  
  const nextStep = productIdeal === 'kit'
    ? 'Quer testar por 5 dias?'
    : productIdeal === 'turbo'
    ? 'Quer experimentar o Litrão Turbo por 5 dias?'
    : productIdeal === 'hype'
    ? 'Quer testar o Hype Drink?'
    : 'Posso montar o combo ideal pra você começar hoje?'
  
  return {
    painIdentified: pain,
    moment,
    productIdeal,
    nextStep
  }
}

/**
 * Diagnóstico com base em ferramentas do sistema
 */
export function diagnoseFromTool(toolResult: {
  energia?: 'baixa' | 'media' | 'alta'
  retencao?: 'leve' | 'moderada' | 'intensa'
  foco?: 'baixo' | 'medio' | 'alto'
  metabolismo?: 'lento' | 'normal' | 'acelerado'
}): {
  interpretation: string
  keywords: string[]
  profile: DiagnosisResult['perfil']
  recommendation: string
  script: string
} {
  const keywords: string[] = []
  
  if (toolResult.energia === 'baixa') keywords.push('energia baixa')
  if (toolResult.retencao === 'intensa' || toolResult.retencao === 'moderada') keywords.push('retenção')
  if (toolResult.metabolismo === 'lento') keywords.push('metabolismo lento')
  if (toolResult.foco === 'baixo') keywords.push('falta de foco')
  
  const interpretation = `O teste dela mostra ${keywords.join(' + ')}.`
  
  let profile: DiagnosisResult['perfil'] = 'iniciante_total'
  let recommendation = 'Kit de 5 bebidas'
  
  if (toolResult.energia === 'baixa' && toolResult.retencao) {
    profile = 'dedicado_dor_clara'
    recommendation = 'Kit + Turbo'
  } else if (toolResult.retencao === 'intensa') {
    profile = 'dedicado_dor_clara'
    recommendation = 'Litrão Turbo'
  } else if (toolResult.foco === 'baixo') {
    profile = 'rotina_leve'
    recommendation = 'Hype Drink'
  }
  
  const script = `Pelo seu teste, o que mais te ajuda agora é ${recommendation.toLowerCase()}. Quer experimentar por 5 dias?`
  
  return {
    interpretation,
    keywords,
    profile,
    recommendation,
    script
  }
}

/**
 * Como o NOEL sugere o próximo passo após diagnosticar
 */
export function suggestNextStepAfterDiagnosis(diagnosis: DiagnosisResult): {
  message: string
  action: string
} {
  const messages: Record<DiagnosisResult['produtoIdeal'], string> = {
    kit: 'Quer testar por 5 dias?',
    turbo: 'Quer experimentar o Litrão Turbo por 5 dias?',
    hype: 'Quer testar o Hype Drink?',
    combo: 'Posso montar o combo ideal pra você começar hoje?',
    fechado: 'Você prefere foco, retenção ou metabolismo?'
  }
  
  return {
    message: messages[diagnosis.produtoIdeal],
    action: `Enviar mensagem com ${diagnosis.produtoIdeal}`
  }
}

/**
 * O que o NOEL nunca faz em diagnóstico
 */
export const NOEL_DIAGNOSIS_NEVER = [
  'Oferece 3 ou mais produtos ao mesmo tempo',
  'Cria rotinas complexas',
  'Sugere algo caro sem necessidade',
  'Ignora o que o cliente falou',
  'Inventa soluções sem base no sistema'
]

/**
 * Diagnóstico explicado em 1 frase
 */
export const NOEL_DIAGNOSIS_ONE_PHRASE = 
  'Diagnóstico é descobrir a dor e oferecer a solução mais simples e adequada para ela.'





