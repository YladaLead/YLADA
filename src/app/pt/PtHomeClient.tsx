'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import PilotPageContent from '@/components/pilot/PilotPageContent'

export default function PtHomeClient() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/pt' || pathname === '/pt/'

  useEffect(() => {
    if (loading || !isHome) return
    if (user) {
      router.replace('/pt/painel')
    }
  }, [loading, user, pathname, router, isHome])

  if (loading && isHome) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (user && isHome) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Redirecionando...</p>
      </div>
    )
  }

  return <PilotPageContent />
}
