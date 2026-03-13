'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import InstitutionalPageContent from '@/app/pt/InstitutionalPageContent'

export default function PtHomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isInstitutionalPage = pathname === '/pt' || pathname === '/pt/'

  useEffect(() => {
    if (loading || !isInstitutionalPage) return
    if (user) {
      router.replace('/pt/painel')
    }
  }, [loading, user, pathname, router, isInstitutionalPage])

  if (loading && isInstitutionalPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (user && isInstitutionalPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Redirecionando...</p>
      </div>
    )
  }

  return <InstitutionalPageContent />
}
