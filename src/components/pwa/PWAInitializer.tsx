'use client'

import { useEffect, useRef } from 'react'
import { isPWAInstalled, isServiceWorkerActive } from '@/lib/pwa-utils'

/**
 * Componente que inicializa o PWA de forma segura
 * Evita loops e problemas quando o app é reaberto como PWA ou volta do background
 */
export default function PWAInitializer() {
  const initializedRef = useRef(false)
  const lastVisibilityChangeRef = useRef<number>(0)
  const isHandlingVisibilityRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const initializePWA = async () => {
      if (typeof window === 'undefined') return

      const isPWA = isPWAInstalled()
      
      if (isPWA) {
        console.log('[PWA Initializer] App está rodando em modo PWA')
        
        // Aguardar um pouco para garantir que tudo está carregado
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Verificar se service worker já está ativo
        try {
          const swActive = await isServiceWorkerActive()
          if (swActive) {
            console.log('[PWA Initializer] ✅ Service Worker já está ativo, não precisa registrar novamente')
          } else {
            console.log('[PWA Initializer] ⚠️ Service Worker não está ativo, mas não vamos forçar registro aqui')
          }
        } catch (error) {
          console.warn('[PWA Initializer] Erro ao verificar service worker:', error)
        }
      }

      // Adicionar listener para detectar quando o app volta do background
      // IMPORTANTE: Evitar múltiplas execuções quando app volta do background
      const handleVisibilityChange = () => {
        const now = Date.now()
        const timeSinceLastChange = now - lastVisibilityChangeRef.current
        
        // Debounce: só processar se passou pelo menos 500ms desde a última mudança
        if (timeSinceLastChange < 500) {
          console.log('[PWA Initializer] Ignorando mudança de visibilidade muito rápida')
          return
        }

        // Evitar processar se já está processando
        if (isHandlingVisibilityRef.current) {
          console.log('[PWA Initializer] Já está processando mudança de visibilidade')
          return
        }

        lastVisibilityChangeRef.current = now

        if (document.visibilityState === 'visible') {
          console.log('[PWA Initializer] App voltou ao foreground (visível)')
          
          // Não fazer nada aqui - apenas logar
          // O useAuth já vai verificar a sessão automaticamente
          // Não vamos forçar reinicialização para evitar loops
        } else if (document.visibilityState === 'hidden') {
          console.log('[PWA Initializer] App foi para background (oculto)')
          // Não fazer nada quando vai para background
        }
      }

      // Adicionar listeners para detectar quando app volta
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      // Para PWA, também ouvir eventos de pageshow (quando volta de cache)
      const handlePageShow = (event: PageTransitionEvent) => {
        // Se veio do cache (back/forward), não fazer nada especial
        if (event.persisted) {
          console.log('[PWA Initializer] Página restaurada do cache (back/forward)')
          // Não reinicializar - o estado já está preservado
        }
      }

      window.addEventListener('pageshow', handlePageShow)

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('pageshow', handlePageShow)
      }
    }

    initializePWA()
  }, [])

  // Este componente não renderiza nada
  return null
}
