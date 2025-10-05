'use client'

import { useEffect } from 'react'

export default function PWAInstaller() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration.scope)
        })
        .catch((error) => {
          console.log('Falha ao registrar Service Worker:', error)
        })
    }
  }, [])

  return null
}
