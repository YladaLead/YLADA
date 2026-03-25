'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import PilotPageContent from '@/components/pilot/PilotPageContent'

/** Hub opcional: escolher segmento (progressivo). Entrada pública oficial: /pt/estetica. */
export default function PtSegmentosHubClient() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isHub = pathname === '/pt/segmentos' || pathname === '/pt/segmentos/'

  useEffect(() => {
    if (loading || !isHub) return
    if (user) {
      router.replace('/pt/painel')
    }
  }, [loading, user, pathname, router, isHub])

  if (loading && isHub) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (user && isHub) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Redirecionando...</p>
      </div>
    )
  }

  return <PilotPageContent />
}
