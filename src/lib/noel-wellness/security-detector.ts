/**
 * Detector de Intenções Maliciosas e Padrões Suspeitos
 * 
 * Detecta tentativas de extração de dados, engenharia reversa e abuso
 */

export interface SecurityFlags {
  isSuspicious: boolean
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  detectedPatterns: string[]
  shouldBlock: boolean
  suggestedResponse: string | null
}

/**
 * Padrões de palavras-chave suspeitas
 */
const SUSPICIOUS_PATTERNS = {
  extraction: [
    'todos os',
    'toda a',
    'toda lista',
    'lista completa',
    'todos os fluxos',
    'todos os scripts',
    'toda biblioteca',
    'me dê tudo',
    'me passe tudo',
    'quero tudo',
    'tudo que você tem',
    'completo',
    'inteiro',
    'pdf com tudo',
    'exportar tudo',
    'baixar tudo',
  ],
  reverseEngineering: [
    'como você funciona',
    'como funciona por trás',
    'arquitetura interna',
    'estrutura interna',
    'lógica interna',
    'programação',
    'como foi programado',
    'como foi treinado',
    'rotas internas',
    'funções internas',
    'tabelas do banco',
    'estrutura do banco',
    'chaves do banco',
    'engenharia reversa',
    'copiar sistema',
    'replicar sistema',
    'fazer igual',
    'como construir',
  ],
  bulkRequest: [
    'me dá 5',
    'me dá 10',
    'vários de uma vez',
    'múltiplos',
    'vários fluxos',
    'várias ferramentas',
    'todos de uma vez',
    'tudo junto',
  ],
  bypass: [
    'não precisa chamar função',
    'manda direto',
    'pula a função',
    'sem função',
    'direto aqui',
    'aqui mesmo',
  ],
  competitive: [
    'concorrente',
    'competição',
    'copiar',
    'replicar',
    'fazer igual',
    'sistema similar',
    'alternativa',
  ],
  adminAccess: [
    'acesso admin',
    'painel admin',
    'configurações internas',
    'dados de outros',
    'informações de outros usuários',
    'base de dados completa',
  ],
}

/**
 * Detecta se uma mensagem contém intenções maliciosas
 */
export function detectMaliciousIntent(
  message: string,
  recentMessages: string[] = []
): SecurityFlags {
  const lowerMessage = message.toLowerCase()
  const detectedPatterns: string[] = []
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  let shouldBlock = false

  // Verificar padrões de extração
  for (const pattern of SUSPICIOUS_PATTERNS.extraction) {
    if (lowerMessage.includes(pattern)) {
      detectedPatterns.push(`extraction:${pattern}`)
      riskLevel = 'high'
      shouldBlock = true
    }
  }

  // Verificar padrões de engenharia reversa
  for (const pattern of SUSPICIOUS_PATTERNS.reverseEngineering) {
    if (lowerMessage.includes(pattern)) {
      detectedPatterns.push(`reverse_engineering:${pattern}`)
      riskLevel = 'critical'
      shouldBlock = true
    }
  }

  // Verificar padrões de bypass
  for (const pattern of SUSPICIOUS_PATTERNS.bypass) {
    if (lowerMessage.includes(pattern)) {
      detectedPatterns.push(`bypass:${pattern}`)
      riskLevel = 'high'
      shouldBlock = true
    }
  }

  // Verificar padrões competitivos
  for (const pattern of SUSPICIOUS_PATTERNS.competitive) {
    if (lowerMessage.includes(pattern)) {
      detectedPatterns.push(`competitive:${pattern}`)
      riskLevel = 'critical'
      shouldBlock = true
    }
  }

  // Verificar padrões de acesso admin
  for (const pattern of SUSPICIOUS_PATTERNS.adminAccess) {
    if (lowerMessage.includes(pattern)) {
      detectedPatterns.push(`admin_access:${pattern}`)
      riskLevel = 'critical'
      shouldBlock = true
    }
  }

  // Verificar padrões de bulk request
  for (const pattern of SUSPICIOUS_PATTERNS.bulkRequest) {
    if (lowerMessage.includes(pattern)) {
      detectedPatterns.push(`bulk_request:${pattern}`)
      riskLevel = 'medium'
      // Não bloquear, mas limitar
    }
  }

  // Verificar insistência (múltiplas mensagens suspeitas)
  if (recentMessages.length >= 3) {
    const suspiciousCount = recentMessages.filter(msg => {
      const lower = msg.toLowerCase()
      return SUSPICIOUS_PATTERNS.extraction.some(p => lower.includes(p)) ||
             SUSPICIOUS_PATTERNS.reverseEngineering.some(p => lower.includes(p))
    }).length

    if (suspiciousCount >= 2) {
      detectedPatterns.push('insistence')
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel
      shouldBlock = true
    }
  }

  // Gerar resposta sugerida se necessário
  let suggestedResponse: string | null = null
  if (shouldBlock || riskLevel === 'high' || riskLevel === 'critical') {
    if (riskLevel === 'critical') {
      suggestedResponse = `Eu sigo a Filosofia YLADA, que valoriza ética, transparência, respeito e comportamento profissional.

Por proteção aos distribuidores e ao ecossistema Wellness, não posso compartilhar processos internos, lógicas de funcionamento ou conteúdos proprietários.

Mas posso te ajudar com orientações práticas, fluxos oficiais autorizados, ferramentas e ações que você pode aplicar no seu negócio. O que você deseja fazer agora?`
    } else if (detectedPatterns.some(p => p.startsWith('bulk_request'))) {
      suggestedResponse = `Para manter a segurança e o uso correto do sistema, eu te ajudo com um fluxo por vez. Qual situação é prioridade agora?`
    } else {
      suggestedResponse = `Por motivos de ética e proteção do sistema, não compartilho conteúdos internos.

Mas posso te ajudar com o próximo passo no seu negócio. O que você deseja fazer agora?`
    }
  }

  return {
    isSuspicious: detectedPatterns.length > 0,
    riskLevel,
    detectedPatterns,
    shouldBlock,
    suggestedResponse,
  }
}

/**
 * Detecta se uma mensagem pede múltiplos itens
 */
export function detectBulkRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  
  // Padrões numéricos
  const numberPattern = /(me dá|quero|preciso|lista).*?(\d+).*?(fluxo|ferramenta|script|link|quiz)/i
  if (numberPattern.test(message)) {
    return true
  }

  // Palavras-chave de volume
  const volumeKeywords = ['vários', 'múltiplos', 'todos', 'tudo', 'várias', 'alguns']
  return volumeKeywords.some(keyword => lowerMessage.includes(keyword))
}

/**
 * Detecta tentativas de bypass de funções
 */
export function detectBypassAttempt(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  
  const bypassPatterns = [
    'não precisa chamar',
    'manda direto',
    'pula a função',
    'sem função',
    'direto aqui',
    'aqui mesmo',
    'sem usar função',
    'ignora a função',
  ]

  return bypassPatterns.some(pattern => lowerMessage.includes(pattern))
}
