'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FitLeadLandingPage() {
  const router = useRouter()

  useEffect(() => {
    // Detectar se estamos no subdomínio fitlead
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const subdomain = hostname.split('.')[0]
      
      if (subdomain === 'fitlead') {
        // Redirecionar para login com contexto do projeto
        router.push('/login?project=fitlead')
      } else {
        // Se não é fitlead, redirecionar para página principal
        router.push('/')
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecionando para FitLead...</p>
      </div>
    </div>
  )
}
