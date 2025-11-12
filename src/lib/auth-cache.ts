'use client'

const ADMIN_CHECK_CACHE_KEY = 'ylada_admin_check'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

/**
 * Obtém o cache de verificação de admin
 * @returns boolean | null - true se admin, false se não admin, null se não tem cache ou expirado
 */
export function getCachedAdminCheck(): boolean | null {
  if (typeof window === 'undefined') return null
  
  try {
    const cached = sessionStorage.getItem(ADMIN_CHECK_CACHE_KEY)
    if (!cached) return null
    
    const { isAdmin, timestamp } = JSON.parse(cached)
    const now = Date.now()
    
    // Cache expirado?
    if (now - timestamp > CACHE_DURATION) {
      sessionStorage.removeItem(ADMIN_CHECK_CACHE_KEY)
      return null
    }
    
    return isAdmin
  } catch (error) {
    // Se houver erro ao ler cache, limpar e retornar null
    console.error('Erro ao ler cache de admin:', error)
    try {
      sessionStorage.removeItem(ADMIN_CHECK_CACHE_KEY)
    } catch {
      // Ignorar erro ao limpar
    }
    return null
  }
}

/**
 * Salva o resultado da verificação de admin no cache
 * @param isAdmin - true se é admin, false se não é
 */
export function setCachedAdminCheck(isAdmin: boolean) {
  if (typeof window === 'undefined') return
  
  try {
    sessionStorage.setItem(ADMIN_CHECK_CACHE_KEY, JSON.stringify({
      isAdmin,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.error('Erro ao salvar cache de admin:', error)
  }
}

/**
 * Limpa o cache de verificação de admin
 */
export function clearCachedAdminCheck() {
  if (typeof window === 'undefined') return
  
  try {
    sessionStorage.removeItem(ADMIN_CHECK_CACHE_KEY)
  } catch (error) {
    console.error('Erro ao limpar cache de admin:', error)
  }
}

