'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import PilotLandingIntro from '@/components/pilot/PilotLandingIntro'

/** /pt — só hero; segmentos após “Comece agora” em /pt/segmentos. */
export default function PtHomeLandingClient() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isPtRoot = pathname === '/pt' || pathname === '/pt/'

  useEffect(() => {
    if (loading || !isPtRoot) return
    if (user) {
      router.replace('/pt/painel')
    }
  }, [loading, user, pathname, router, isPtRoot])

  if (loading && isPtRoot) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (user && isPtRoot) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Redirecionando...</p>
      </div>
    )
  }

  return <PilotLandingIntro />
}
