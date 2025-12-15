'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'

export default function NutriDashboard() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <RequireSubscription area="nutri">
        <NutriDashboardRedirect />
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function NutriDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect automático para /home (página principal otimizada)
    router.replace('/pt/nutri/home')
  }, [router])

  // Mostrar loading durante o redirect
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  )
}

/* 
 * CÓDIGO ANTIGO DO DASHBOARD REMOVIDO
 * Esta página agora redireciona automaticamente para /pt/nutri/home
 * para evitar confusão e manter foco na Jornada e LYA.
 * 
 * Todos os links antigos que apontam para /dashboard continuam funcionando,
 * mas agora levam para a Home otimizada.
 */
