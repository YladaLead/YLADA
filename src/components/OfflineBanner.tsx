'use client'

import { useOffline } from '@/hooks/useOffline'
import { useEffect, useState } from 'react'

interface OfflineBannerProps {
  /** Mostrar apenas quando estava offline e voltou */
  showReconnected?: boolean
}

/**
 * Banner que aparece quando o usuário está offline
 * 
 * @example
 * // No layout ou página
 * <OfflineBanner />
 */
export function OfflineBanner({ showReconnected = true }: OfflineBannerProps) {
  const { isOffline, wasOffline, isOnline } = useOffline()
  const [showReconnectedBanner, setShowReconnectedBanner] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Mostrar banner de reconexão
  useEffect(() => {
    if (wasOffline && isOnline) {
      setShowReconnectedBanner(true)
      const timer = setTimeout(() => {
        setShowReconnectedBanner(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [wasOffline, isOnline])

  // Reset dismissed quando ficar offline
  useEffect(() => {
    if (isOffline) {
      setDismissed(false)
    }
  }, [isOffline])

  // Banner de offline
  if (isOffline && !dismissed) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-3 shadow-lg animate-slide-down">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">📡</span>
            <div>
              <p className="font-medium text-sm">Você está offline</p>
              <p className="text-xs text-amber-100">
                Algumas funcionalidades podem não estar disponíveis
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-amber-600 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  // Banner de reconexão
  if (showReconnected && showReconnectedBanner) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white px-4 py-3 shadow-lg animate-slide-down">
        <div className="max-w-screen-xl mx-auto flex items-center justify-center gap-3">
          <span className="text-xl">✅</span>
          <p className="font-medium text-sm">Conexão restaurada!</p>
        </div>
      </div>
    )
  }

  return null
}

/**
 * Indicador compacto de status offline (para usar em headers)
 */
export function OfflineIndicator() {
  const { isOffline } = useOffline()

  if (!isOffline) return null

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
      <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
      Offline
    </div>
  )
}

/**
 * Wrapper que mostra conteúdo alternativo quando offline
 */
export function OfflineWrapper({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  const { isOffline } = useOffline()

  if (isOffline && fallback) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export default OfflineBanner
