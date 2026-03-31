'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import PilotLandingIntro from '@/components/pilot/PilotLandingIntro'
import { trackYladaFunnelEvent } from '@/lib/ylada-funnel-client'

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

  useEffect(() => {
    if (loading || !isPtRoot || user) return
    trackYladaFunnelEvent('funnel_landing_pt_view', undefined, {
      oncePerSessionKey: 'ylada_funnel_landing_pt_v1',
    })
  }, [loading, user, isPtRoot])

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
