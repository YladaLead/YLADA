'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'

export default function ContaPage() {
  const router = useRouter()

  // Redirecionar automaticamente para a página de perfil (página principal da conta)
  useEffect(() => {
    router.replace('/pt/wellness/conta/perfil')
  }, [router])

  // Layout server-side já valida autenticação, perfil e assinatura
  return (
    <ConditionalWellnessSidebar>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    </ConditionalWellnessSidebar>
  )
}
