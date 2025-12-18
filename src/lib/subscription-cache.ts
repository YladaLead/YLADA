'use client'

/**
 * Sistema de Cache para Verificação de Assinatura
 * 
 * Reduz drasticamente o tempo de carregamento ao evitar verificações
 * repetidas de assinatura na mesma sessão.
 * 
 * Estratégia:
 * - sessionStorage: Cache rápido que expira com a sessão (5 minutos)
 * - localStorage: Cache persistente que sobrevive refresh (1 hora)
 * - Invalidação automática quando necessário
 */

interface CachedSubscription {
  hasSubscription: boolean
  canBypass: boolean
  timestamp: number
  expiresAt: number
  userId: string
  area: string
}

const SESSION_CACHE_TTL = 5 * 60 * 1000 // 5 minutos
const PERSISTENT_CACHE_TTL = 60 * 60 * 1000 // 1 hora

/**
 * Gera chave de cache para assinatura
 */
function getCacheKey(userId: string, area: string): string {
  return `subscription_cache_${userId}_${area}`
}

/**
 * Verifica se cache está expirado
 */
function isCacheExpired(cached: CachedSubscription): boolean {
  const now = Date.now()
  return now > cached.expiresAt
}

/**
 * Busca cache de assinatura
 * Tenta sessionStorage primeiro (mais rápido), depois localStorage
 */
export function getCachedSubscription(
  userId: string,
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
): CachedSubscription | null {
  if (typeof window === 'undefined') return null

  try {
    const cacheKey = getCacheKey(userId, area)

    // Tentar sessionStorage primeiro (mais rápido)
    const sessionCached = sessionStorage.getItem(cacheKey)
    if (sessionCached) {
      const cached: CachedSubscription = JSON.parse(sessionCached)
      if (!isCacheExpired(cached) && cached.userId === userId && cached.area === area) {
        console.log('✅ subscription-cache: Cache encontrado em sessionStorage (idade:', Math.round((Date.now() - cached.timestamp) / 1000), 's)')
        return cached
      } else {
        // Cache expirado, remover
        sessionStorage.removeItem(cacheKey)
      }
    }

    // Tentar localStorage como fallback
    const persistentCached = localStorage.getItem(cacheKey)
    if (persistentCached) {
      const cached: CachedSubscription = JSON.parse(persistentCached)
      if (!isCacheExpired(cached) && cached.userId === userId && cached.area === area) {
        console.log('✅ subscription-cache: Cache encontrado em localStorage (idade:', Math.round((Date.now() - cached.timestamp) / 1000), 's)')
        // Promover para sessionStorage para acesso mais rápido
        setCachedSubscription(userId, area, cached.hasSubscription, cached.canBypass)
        return cached
      } else {
        // Cache expirado, remover
        localStorage.removeItem(cacheKey)
      }
    }

    return null
  } catch (error) {
    console.error('❌ subscription-cache: Erro ao buscar cache:', error)
    return null
  }
}

/**
 * Salva cache de assinatura
 * Salva em ambos sessionStorage e localStorage
 */
export function setCachedSubscription(
  userId: string,
  area: 'wellness' | 'nutri' | 'coach' | 'nutra',
  hasSubscription: boolean,
  canBypass: boolean = false
): void {
  if (typeof window === 'undefined') return

  try {
    const cacheKey = getCacheKey(userId, area)
    const now = Date.now()

    const cached: CachedSubscription = {
      hasSubscription,
      canBypass,
      timestamp: now,
      expiresAt: now + SESSION_CACHE_TTL, // sessionStorage expira em 5 min
      userId,
      area,
    }

    // Salvar em sessionStorage (cache rápido)
    sessionStorage.setItem(cacheKey, JSON.stringify(cached))

    // Salvar em localStorage com TTL maior (cache persistente)
    const persistentCached: CachedSubscription = {
      ...cached,
      expiresAt: now + PERSISTENT_CACHE_TTL, // localStorage expira em 1 hora
    }
    localStorage.setItem(cacheKey, JSON.stringify(persistentCached))

    console.log('✅ subscription-cache: Cache salvo para', area, '- expires em', Math.round(SESSION_CACHE_TTL / 1000 / 60), 'min (session) /', Math.round(PERSISTENT_CACHE_TTL / 1000 / 60), 'min (persistent)')
  } catch (error) {
    console.error('❌ subscription-cache: Erro ao salvar cache:', error)
    // Se storage estiver cheio, tentar limpar cache antigo
    try {
      clearExpiredCaches()
      // Tentar novamente
      const cacheKey = getCacheKey(userId, area)
      const now = Date.now()
      const cached: CachedSubscription = {
        hasSubscription,
        canBypass,
        timestamp: now,
        expiresAt: now + SESSION_CACHE_TTL,
        userId,
        area,
      }
      sessionStorage.setItem(cacheKey, JSON.stringify(cached))
    } catch (retryError) {
      console.error('❌ subscription-cache: Erro ao salvar após limpeza:', retryError)
    }
  }
}

/**
 * Limpa cache de assinatura para um usuário/área específica
 */
export function clearCachedSubscription(
  userId: string,
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
): void {
  if (typeof window === 'undefined') return

  try {
    const cacheKey = getCacheKey(userId, area)
    sessionStorage.removeItem(cacheKey)
    localStorage.removeItem(cacheKey)
    console.log('✅ subscription-cache: Cache limpo para', area)
  } catch (error) {
    console.error('❌ subscription-cache: Erro ao limpar cache:', error)
  }
}

/**
 * Limpa TODOS os caches de assinatura (útil em logout)
 */
export function clearAllSubscriptionCaches(): void {
  if (typeof window === 'undefined') return

  try {
    // Limpar sessionStorage
    const sessionKeys = Object.keys(sessionStorage)
    sessionKeys.forEach(key => {
      if (key.startsWith('subscription_cache_')) {
        sessionStorage.removeItem(key)
      }
    })

    // Limpar localStorage
    const localKeys = Object.keys(localStorage)
    localKeys.forEach(key => {
      if (key.startsWith('subscription_cache_')) {
        localStorage.removeItem(key)
      }
    })

    console.log('✅ subscription-cache: Todos os caches limpos')
  } catch (error) {
    console.error('❌ subscription-cache: Erro ao limpar todos os caches:', error)
  }
}

/**
 * Limpa caches expirados (manutenção)
 */
function clearExpiredCaches(): void {
  if (typeof window === 'undefined') return

  try {
    const now = Date.now()

    // Limpar sessionStorage expirado
    const sessionKeys = Object.keys(sessionStorage)
    sessionKeys.forEach(key => {
      if (key.startsWith('subscription_cache_')) {
        try {
          const cached = JSON.parse(sessionStorage.getItem(key) || '{}')
          if (cached.expiresAt && now > cached.expiresAt) {
            sessionStorage.removeItem(key)
          }
        } catch {
          // Se não conseguir parsear, remover
          sessionStorage.removeItem(key)
        }
      }
    })

    // Limpar localStorage expirado
    const localKeys = Object.keys(localStorage)
    localKeys.forEach(key => {
      if (key.startsWith('subscription_cache_')) {
        try {
          const cached = JSON.parse(localStorage.getItem(key) || '{}')
          if (cached.expiresAt && now > cached.expiresAt) {
            localStorage.removeItem(key)
          }
        } catch {
          // Se não conseguir parsear, remover
          localStorage.removeItem(key)
        }
      }
    })
  } catch (error) {
    console.error('❌ subscription-cache: Erro ao limpar caches expirados:', error)
  }
}

/**
 * Invalida cache quando assinatura muda (útil após checkout)
 */
export function invalidateSubscriptionCache(
  userId: string,
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
): void {
  clearCachedSubscription(userId, area)
  console.log('🔄 subscription-cache: Cache invalidado para', area, '(assinatura mudou)')
}

















