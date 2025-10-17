'use client'

import { useEffect } from 'react'

export default function PWAInstaller() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Desabilitar Service Worker temporariamente para resolver cache
      console.log('🚫 Service Worker desabilitado para resolver problemas de cache')
      
      // Limpar Service Workers existentes
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
          console.log('🗑️ Service Worker removido:', registration.scope)
        })
      })
    }
  }, [])

  return null
}
