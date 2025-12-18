'use client'

import { useState, useEffect, useCallback } from 'react'

interface OfflineStatus {
  isOffline: boolean
  isOnline: boolean
  wasOffline: boolean // Flag para saber se estava offline recentemente
  lastOnlineAt: Date | null
}

interface CacheStatus {
  static: number
  dynamic: number
  api: number
  version: string
}

/**
 * Hook para detectar status de conexão offline/online
 * 
 * @example
 * const { isOffline, wasOffline } = useOffline()
 * 
 * if (isOffline) {
 *   return <OfflineBanner />
 * }
 */
export function useOffline(): OfflineStatus & {
  cacheStatus: CacheStatus | null
  clearCache: () => void
  prefetchUrls: (urls: string[]) => void
} {
  const [status, setStatus] = useState<OfflineStatus>({
    isOffline: false,
    isOnline: true,
    wasOffline: false,
    lastOnlineAt: null
  })
  
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null)

  // Atualizar status de conexão
  const updateStatus = useCallback((online: boolean) => {
    setStatus(prev => ({
      isOffline: !online,
      isOnline: online,
      wasOffline: prev.isOffline || prev.wasOffline,
      lastOnlineAt: online ? new Date() : prev.lastOnlineAt
    }))
  }, [])

  // Limpar flag wasOffline após reconectar
  const clearWasOffline = useCallback(() => {
    setStatus(prev => ({ ...prev, wasOffline: false }))
  }, [])

  // Limpar cache
  const clearCache = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({ type: 'CLEAR_CACHE' })
      })
    }
  }, [])

  // Prefetch URLs para cache
  const prefetchUrls = useCallback((urls: string[]) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({ 
          type: 'CACHE_URLS', 
          payload: { urls } 
        })
      })
    }
  }, [])

  // Buscar status do cache
  const fetchCacheStatus = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({ type: 'GET_CACHE_STATUS' })
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Estado inicial
    updateStatus(navigator.onLine)

    // Listeners para mudança de conexão
    const handleOnline = () => {
      console.log('[useOffline] Conexão restaurada')
      updateStatus(true)
      // Limpar wasOffline após 5 segundos online
      setTimeout(clearWasOffline, 5000)
    }

    const handleOffline = () => {
      console.log('[useOffline] Conexão perdida')
      updateStatus(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Listener para mensagens do Service Worker
    const handleSwMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {}
      
      if (type === 'CACHE_STATUS') {
        setCacheStatus(payload)
      }
      
      if (type === 'SW_ACTIVATED') {
        console.log('[useOffline] Service Worker ativado:', payload?.version)
        fetchCacheStatus()
      }
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage)
      // Buscar status inicial do cache
      fetchCacheStatus()
    }

    // Verificação periódica de conectividade real (não apenas navigator.onLine)
    const checkRealConnectivity = async () => {
      if (!navigator.onLine) return
      
      try {
        const response = await fetch('/api/health', { 
          method: 'HEAD', 
          cache: 'no-store',
          signal: AbortSignal.timeout(5000)
        })
        if (!response.ok) throw new Error('Not OK')
        updateStatus(true)
      } catch {
        // Se navigator.onLine mas não consegue fazer fetch, está com problema
        console.log('[useOffline] navigator.onLine mas sem conectividade real')
        updateStatus(false)
      }
    }

    // Verificar conectividade real a cada 30 segundos
    const interval = setInterval(checkRealConnectivity, 30000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage)
      }
      clearInterval(interval)
    }
  }, [updateStatus, clearWasOffline, fetchCacheStatus])

  return {
    ...status,
    cacheStatus,
    clearCache,
    prefetchUrls
  }
}

export default useOffline
