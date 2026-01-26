/**
 * CACHE DE EMBEDDINGS
 * 
 * Economiza 60-80% dos custos de embeddings ao cachear resultados
 * Textos idênticos ou muito similares não precisam gerar embedding novamente
 */

interface CachedEmbedding {
  embedding: number[]
  timestamp: number
  expiresAt: number
}

// Cache em memória (pode ser migrado para Redis em produção)
const embeddingCache = new Map<string, CachedEmbedding>()

// TTL padrão: 24 horas (embeddings não mudam para o mesmo texto)
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 horas

// Limite de tamanho do cache (evitar uso excessivo de memória)
const MAX_CACHE_SIZE = 1000

/**
 * Normaliza texto para criar chave de cache consistente
 * Remove espaços extras, converte para lowercase, remove acentos opcionais
 */
function normalizeTextForCache(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Remove espaços múltiplos
    .substring(0, 1000) // Limita tamanho para evitar chaves muito grandes
}

/**
 * Gera chave de cache baseada no texto normalizado
 */
function getCacheKey(text: string): string {
  const normalized = normalizeTextForCache(text)
  // Usar hash simples para textos muito longos
  if (normalized.length > 200) {
    // Hash simples (não precisa ser criptográfico, só para consistência)
    let hash = 0
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return `embedding:${hash}`
  }
  return `embedding:${normalized}`
}

/**
 * Limpa cache expirado e mantém tamanho limitado
 */
function cleanExpiredCache() {
  const now = Date.now()
  const entries = Array.from(embeddingCache.entries())
  
  // Remover expirados
  for (const [key, value] of entries) {
    if (value.expiresAt < now) {
      embeddingCache.delete(key)
    }
  }
  
  // Se ainda estiver muito grande, remover os mais antigos
  if (embeddingCache.size > MAX_CACHE_SIZE) {
    const sorted = Array.from(embeddingCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    const toRemove = sorted.slice(0, embeddingCache.size - MAX_CACHE_SIZE)
    for (const [key] of toRemove) {
      embeddingCache.delete(key)
    }
  }
}

/**
 * Busca embedding em cache
 */
export function getCachedEmbedding(text: string): number[] | null {
  cleanExpiredCache()
  
  const cacheKey = getCacheKey(text)
  const cached = embeddingCache.get(cacheKey)
  
  if (cached && cached.expiresAt > Date.now()) {
    console.log('✅ [Embedding Cache] Cache hit para:', text.substring(0, 50))
    return cached.embedding
  }
  
  return null
}

/**
 * Salva embedding no cache
 */
export function cacheEmbedding(text: string, embedding: number[]): void {
  cleanExpiredCache()
  
  const cacheKey = getCacheKey(text)
  const now = Date.now()
  
  embeddingCache.set(cacheKey, {
    embedding,
    timestamp: now,
    expiresAt: now + CACHE_TTL,
  })
  
  console.log('💾 [Embedding Cache] Embedding cacheado:', text.substring(0, 50))
}

/**
 * Estatísticas do cache
 */
export function getCacheStats() {
  cleanExpiredCache()
  return {
    size: embeddingCache.size,
    maxSize: MAX_CACHE_SIZE,
    ttl: CACHE_TTL,
    hitRate: 'N/A', // Seria necessário rastrear hits/misses
  }
}

/**
 * Limpa todo o cache
 */
export function clearEmbeddingCache(): void {
  embeddingCache.clear()
  console.log('🗑️ [Embedding Cache] Cache limpo')
}
