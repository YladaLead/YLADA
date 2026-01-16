/**
 * NOEL Assistant Optimizer
 * 
 * Otimizações para melhorar performance do GPT-4.1 Mini:
 * 1. Pré-processar contexto (enviar apenas o necessário)
 * 2. Limitar histórico de mensagens
 * 3. Cachear respostas comuns
 * 4. Otimizar chamadas de functions
 * 5. Reduzir tamanho do contexto
 */

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

interface CachedResponse {
  response: string
  timestamp: number
  expiresAt: number
}

// Cache simples em memória (pode ser migrado para Redis em produção)
const responseCache = new Map<string, CachedResponse>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

/**
 * Limpa cache expirado
 */
function cleanExpiredCache() {
  const now = Date.now()
  for (const [key, value] of responseCache.entries()) {
    if (value.expiresAt < now) {
      responseCache.delete(key)
    }
  }
}

/**
 * Gera chave de cache baseada na mensagem
 */
function generateCacheKey(message: string, userId: string): string {
  // Normalizar mensagem (lowercase, remover espaços extras)
  const normalized = message.toLowerCase().trim().replace(/\s+/g, ' ')
  return `${userId}:${normalized.substring(0, 100)}` // Limitar tamanho da chave
}

/**
 * Verifica se há resposta em cache
 */
export function getCachedResponse(message: string, userId: string): string | null {
  cleanExpiredCache()
  
  const cacheKey = generateCacheKey(message, userId)
  const cached = responseCache.get(cacheKey)
  
  if (cached && cached.expiresAt > Date.now()) {
    console.log('✅ [Optimizer] Cache hit para:', message.substring(0, 50))
    return cached.response
  }
  
  return null
}

/**
 * Salva resposta no cache
 */
export function cacheResponse(message: string, userId: string, response: string) {
  const cacheKey = generateCacheKey(message, userId)
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now(),
    expiresAt: Date.now() + CACHE_TTL,
  })
  console.log('💾 [Optimizer] Resposta cacheada:', message.substring(0, 50))
}

/**
 * Limita histórico de mensagens (mantém apenas últimas N relevantes)
 */
export function optimizeMessageHistory(
  messages: Message[],
  maxMessages: number = 5
): Message[] {
  if (messages.length <= maxMessages) {
    return messages
  }
  
  // Manter sempre a primeira mensagem (contexto inicial) e últimas N-1
  const firstMessage = messages[0]
  const recentMessages = messages.slice(-(maxMessages - 1))
  
  return [firstMessage, ...recentMessages]
}

/**
 * Pré-processa mensagem removendo informações desnecessárias
 */
export function preprocessMessage(message: string): string {
  // Remover espaços extras
  let processed = message.trim().replace(/\s+/g, ' ')
  
  // Limitar tamanho máximo (evitar mensagens muito longas)
  const MAX_LENGTH = 2000
  if (processed.length > MAX_LENGTH) {
    processed = processed.substring(0, MAX_LENGTH) + '...'
    console.log('⚠️ [Optimizer] Mensagem truncada para', MAX_LENGTH, 'caracteres')
  }
  
  return processed
}

/**
 * Detecta se a mensagem precisa de function call
 * (evita chamadas desnecessárias)
 */
export function needsFunctionCall(message: string): {
  needs: boolean
  suggestedFunction?: string
} {
  const lowerMessage = message.toLowerCase()
  
  // Palavras-chave que indicam necessidade de function
  const functionKeywords: Record<string, string> = {
    'fluxo': 'getFluxoInfo',
    'ferramenta': 'getFerramentaInfo',
    'calculadora': 'getFerramentaInfo',
    'quiz': 'getQuizInfo',
    'link': 'recomendarLinkWellness',
    'perfil': 'getUserProfile',
    'meta': 'calcularObjetivosCompletos',
    'objetivo': 'calcularObjetivosCompletos',
    'cliente': 'getClientData',
    'lead': 'registerLead',
    'treino': 'buscarTreino',
    'material': 'getMaterialInfo',
  }
  
  for (const [keyword, functionName] of Object.entries(functionKeywords)) {
    if (lowerMessage.includes(keyword)) {
      return {
        needs: true,
        suggestedFunction: functionName,
      }
    }
  }
  
  return { needs: false }
}

/**
 * Reduz tamanho do contexto removendo informações redundantes
 */
export function optimizeContext(context: any): any {
  if (!context) return null
  
  // Remover campos vazios ou nulos
  const optimized: any = {}
  
  for (const [key, value] of Object.entries(context)) {
    // Manter apenas valores relevantes
    if (value !== null && value !== undefined && value !== '') {
      // Limitar tamanho de strings longas
      if (typeof value === 'string' && value.length > 500) {
        optimized[key] = value.substring(0, 500) + '...'
      } else {
        optimized[key] = value
      }
    }
  }
  
  return optimized
}

/**
 * Estima tokens de uma mensagem (aproximação)
 */
export function estimateTokens(text: string): number {
  // Aproximação: 1 token ≈ 4 caracteres (para português)
  return Math.ceil(text.length / 4)
}

/**
 * Verifica se a mensagem é muito longa para o Mini
 */
export function isMessageTooLong(message: string, maxTokens: number = 1000): boolean {
  const estimatedTokens = estimateTokens(message)
  return estimatedTokens > maxTokens
}

/**
 * Otimiza mensagem para o Mini (reduz tamanho se necessário)
 */
export function optimizeMessageForMini(message: string): string {
  const MAX_TOKENS = 1000 // Limite conservador para Mini
  
  if (!isMessageTooLong(message, MAX_TOKENS)) {
    return message
  }
  
  // Se muito longa, resumir mantendo informações essenciais
  const sentences = message.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  // Manter primeiras e últimas frases (mais relevantes)
  const keepFirst = Math.ceil(sentences.length * 0.3)
  const keepLast = Math.ceil(sentences.length * 0.2)
  
  const optimized = [
    ...sentences.slice(0, keepFirst),
    '...',
    ...sentences.slice(-keepLast),
  ].join('. ')
  
  console.log('⚠️ [Optimizer] Mensagem otimizada:', {
    original: estimateTokens(message),
    optimized: estimateTokens(optimized),
  })
  
  return optimized
}

/**
 * Verifica se deve usar cache baseado no tipo de pergunta
 */
export function shouldUseCache(message: string): boolean {
  const lowerMessage = message.toLowerCase()
  
  // Perguntas que podem ser cacheadas (perguntas simples, sem contexto dinâmico)
  const cacheablePatterns = [
    'quem é você',
    'o que você faz',
    'como funciona',
    'o que é o sistema',
    'explique',
  ]
  
  // Perguntas que NÃO devem ser cacheadas (precisam de dados atualizados)
  const nonCacheablePatterns = [
    'meu perfil',
    'meus dados',
    'meu cliente',
    'minha meta',
    'hoje',
    'agora',
    'atual',
  ]
  
  // Se contém padrão não-cacheável, não usar cache
  if (nonCacheablePatterns.some(pattern => lowerMessage.includes(pattern))) {
    return false
  }
  
  // Se contém padrão cacheável, pode usar cache
  if (cacheablePatterns.some(pattern => lowerMessage.includes(pattern))) {
    return true
  }
  
  // Por padrão, não usar cache (mais seguro)
  return false
}

/**
 * Estatísticas de otimização
 */
export function getOptimizationStats() {
  cleanExpiredCache()
  return {
    cacheSize: responseCache.size,
    cacheKeys: Array.from(responseCache.keys()).map(k => k.substring(0, 50)),
  }
}

/**
 * Limpa todo o cache
 */
export function clearCache() {
  responseCache.clear()
  console.log('🗑️ [Optimizer] Cache limpo')
}
