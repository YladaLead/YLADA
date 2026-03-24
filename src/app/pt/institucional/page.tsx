'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import InstitutionalPageContent from '@/app/pt/InstitutionalPageContent'

function InstitucionalFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <p className="text-gray-500">Carregando...</p>
    </div>
  )
}

/**
 * Página institucional antiga (home longa) — renomeada para /pt/institucional.
 * A página oficial agora é /pt (fluxo piloto).
 */
export default function InstitucionalPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const isInstitucional = pathname === '/pt/institucional' || pathname === '/pt/institucional/'

  useEffect(() => {
    if (loading || !isInstitucional) return
    if (user) {
      router.replace('/pt/painel')
    }
  }, [loading, user, pathname, router, isInstitucional])

  if (loading && isInstitucional) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (user && isInstitucional) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Redirecionando...</p>
      </div>
    )
  }

  return (
    <Suspense fallback={<InstitucionalFallback />}>
      <InstitutionalPageContent />
    </Suspense>
  )
}
