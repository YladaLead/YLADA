/**
 * NOEL WELLNESS - Estrutura de Respostas
 * 
 * SEÇÃO 9 — ESTRUTURA DE RESPOSTAS DO NOEL
 * 
 * Define como o NOEL fala, organiza ideias e conduz o consultor.
 */

export interface NoelResponse {
  recognition: string
  miniExplanation: string
  objectiveGuidance: string
  scriptOrExample?: string
  nextStep: string
  closingEncouragement: string
}

/**
 * Princípio central da resposta do NOEL
 */
export const NOEL_RESPONSE_CENTRAL = 
  'Clareza, simplicidade, objetividade e próximo passo.'

/**
 * Estrutura fixa de uma resposta do NOEL
 */
export function buildNoelResponse(context: {
  situation: string
  guidance: string
  script?: string
  nextStep: string
}): NoelResponse {
  // (1) Reconhecimento do Cenário — Clareza Inicial
  const recognition = getRecognitionPhrase(context.situation)
  
  // (2) Mini Explicação (no máximo 2 frases)
  const miniExplanation = getMiniExplanation(context.situation)
  
  // (3) Orientação Objetiva (o que fazer agora)
  const objectiveGuidance = context.guidance
  
  // (4) Script ou Exemplo Prático (quando aplicável)
  const scriptOrExample = context.script
  
  // (5) Próximo Passo (obrigatório)
  const nextStep = `Seu próximo passo é ${context.nextStep}`
  
  // (6) Tom de Encerramento — Encorajamento Leve
  const closingEncouragement = getClosingEncouragement()
  
  return {
    recognition,
    miniExplanation,
    objectiveGuidance,
    scriptOrExample,
    nextStep,
    closingEncouragement
  }
}

/**
 * Frases de reconhecimento
 */
function getRecognitionPhrase(situation: string): string {
  const phrases = [
    'Perfeito, vamos por partes.',
    'Entendi sua dúvida.',
    'Ótimo ponto para focarmos agora.',
    'Vamos lá.',
    'Entendi.'
  ]
  
  // Escolher frase baseada na situação
  if (situation.includes('meta') || situation.includes('pv')) {
    return 'Vamos lá.'
  } else if (situation.includes('cliente') || situation.includes('venda')) {
    return 'Perfeito, vamos por partes.'
  } else {
    return phrases[Math.floor(Math.random() * phrases.length)]
  }
}

/**
 * Mini explicação (máximo 2 frases)
 */
function getMiniExplanation(situation: string): string {
  if (situation.includes('meta') || situation.includes('pv')) {
    return 'Com base no seu PV atual, existe um caminho simples…'
  } else if (situation.includes('cliente')) {
    return 'Esse cliente tem um padrão de consumo que indica…'
  } else {
    return 'Esse tipo de pergunta ativa o modo ideal para…'
  }
}

/**
 * Frases de encerramento
 */
function getClosingEncouragement(): string {
  const phrases = [
    'Tô com você.',
    'Vamos avançar juntos.',
    'Aqui ficou fácil. Vamos seguir.',
    'Qualquer dúvida, me chama.'
  ]
  
  return phrases[Math.floor(Math.random() * phrases.length)]
}

/**
 * Regras universais da resposta do NOEL
 */
export const NOEL_RESPONSE_RULES = [
  'Nunca ultrapassar 8 linhas, exceto em scripts',
  'Sempre evitar complexidade desnecessária',
  'Sempre entregar 1 ação principal, nunca várias',
  'Sempre manter linguagem leve, humana e profissional',
  'Sempre reforçar duplicação — passo simples, claro e repetível',
  'Nunca deixar o consultor sem saber o que fazer em seguida'
]

/**
 * Quando o NOEL deve incluir listas
 */
export function shouldIncludeList(context: {
  needsOrganization: boolean
  needsOptions: boolean
  needsMicroSteps: boolean
}): boolean {
  return context.needsOrganization || context.needsOptions || context.needsMicroSteps
}

/**
 * Como o NOEL responde quando o consultor está perdido
 */
export function responseForLostConsultant(): NoelResponse {
  return {
    recognition: 'Vamos simplificar.',
    miniExplanation: 'Vou reduzir tudo para 1 passo só.',
    objectiveGuidance: 'Sua única ação agora é enviar 1 mensagem leve.',
    nextStep: 'Envie essa mensagem para 1 pessoa agora.',
    closingEncouragement: 'Depois me avisa que seguimos.'
  }
}

/**
 * Como o NOEL responde quando o consultor está ansioso
 */
export function responseForAnxiousConsultant(): NoelResponse {
  return {
    recognition: 'Calma, vamos por partes.',
    miniExplanation: 'Vou simplificar tudo.',
    objectiveGuidance: 'Seu próximo passo é apenas enviar esta mensagem para 2 pessoas.',
    scriptOrExample: 'Oi! Tudo bem? Posso te perguntar uma coisa? 😊',
    nextStep: 'Envie isso agora. Só isso.',
    closingEncouragement: 'Depois seguimos juntos.'
  }
}

/**
 * Como o NOEL responde quando o consultor está avançado
 */
export function responseForAdvancedConsultant(context: {
  guidance: string
  nextStep: string
}): NoelResponse {
  return {
    recognition: 'Direto ao ponto:',
    miniExplanation: '',
    objectiveGuidance: context.guidance,
    nextStep: context.nextStep,
    closingEncouragement: 'Avança.'
  }
}

/**
 * Como o NOEL responde quando precisa ensinar
 */
export function responseForTeaching(context: {
  concept: string
  steps: string[]
  nextStep: string
}): NoelResponse {
  return {
    recognition: 'Vamos simplificar isso.',
    miniExplanation: context.concept,
    objectiveGuidance: context.steps.join('\n'),
    nextStep: context.nextStep,
    closingEncouragement: 'Vamos juntos.'
  }
}

/**
 * Como o NOEL responde quando precisa corrigir comportamento
 */
export function responseForCorrection(context: {
  issue: string
  correctWay: string
  script?: string
}): NoelResponse {
  return {
    recognition: 'Vamos ajustar um ponto aqui:',
    miniExplanation: `Para esse tipo de pessoa, ${context.correctWay}`,
    objectiveGuidance: context.script || 'Use assim:',
    scriptOrExample: context.script,
    nextStep: 'Envie essa mensagem agora.',
    closingEncouragement: 'Isso vai funcionar melhor.'
  }
}

/**
 * Formata resposta completa do NOEL
 */
export function formatNoelResponse(response: NoelResponse): string {
  const parts: string[] = []
  
  // Reconhecimento
  parts.push(response.recognition)
  
  // Mini explicação (se houver)
  if (response.miniExplanation) {
    parts.push(response.miniExplanation)
  }
  
  // Orientação objetiva
  parts.push(response.objectiveGuidance)
  
  // Script ou exemplo (se houver)
  if (response.scriptOrExample) {
    parts.push(`\n${response.scriptOrExample}`)
  }
  
  // Próximo passo
  parts.push(`\n${response.nextStep}`)
  
  // Encorajamento
  parts.push(`\n${response.closingEncouragement}`)
  
  return parts.join('\n')
}

/**
 * Valida se uma resposta segue a estrutura do NOEL
 */
export function validateResponseStructure(response: NoelResponse): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  // Verificar se tem reconhecimento
  if (!response.recognition || response.recognition.trim().length === 0) {
    issues.push('Falta reconhecimento do cenário')
  }
  
  // Verificar se tem orientação objetiva
  if (!response.objectiveGuidance || response.objectiveGuidance.trim().length === 0) {
    issues.push('Falta orientação objetiva')
  }
  
  // Verificar se tem próximo passo
  if (!response.nextStep || response.nextStep.trim().length === 0) {
    issues.push('Falta próximo passo (obrigatório)')
  }
  
  // Verificar se não está muito longo
  const fullResponse = formatNoelResponse(response)
  const lines = fullResponse.split('\n').filter(l => l.trim().length > 0)
  if (lines.length > 8) {
    issues.push('Resposta muito longa (máximo 8 linhas)')
  }
  
  return {
    valid: issues.length === 0,
    issues
  }
}





