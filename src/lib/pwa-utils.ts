/**
 * Utilitários para detectar e lidar com PWA instalado
 */

/**
 * Verifica se o app está rodando em modo PWA (standalone)
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  )
}

/**
 * Verifica se o service worker já está registrado e ativo
 */
export async function isServiceWorkerActive(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration('/')
    return !!registration?.active
  } catch (error) {
    console.warn('[PWA Utils] Erro ao verificar service worker:', error)
    return false
  }
}

/**
 * Aguarda o app estar pronto antes de executar ações
 * Útil para evitar race conditions quando PWA é aberto
 */
export async function waitForAppReady(): Promise<void> {
  if (typeof window === 'undefined') return

  // Se já está carregado, retornar imediatamente
  if (document.readyState === 'complete') {
    return Promise.resolve()
  }

  // Aguardar o DOM estar pronto
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve(), { once: true })
    } else {
      window.addEventListener('load', () => resolve(), { once: true })
    }
  })
}

/**
 * Debounce para evitar múltiplas execuções simultâneas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
