'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import InstitutionalPageContent from '@/app/pt/InstitutionalPageContent'

export default function EnHomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isInstitutionalPage = pathname === '/en' || pathname === '/en/'

  useEffect(() => {
    if (loading || !isInstitutionalPage) return
    if (user) {
      router.replace('/pt/home')
    }
  }, [loading, user, pathname, router, isInstitutionalPage])

  if (loading && isInstitutionalPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (user && isInstitutionalPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Redirecting...</p>
      </div>
    )
  }

  return <InstitutionalPageContent />
}
