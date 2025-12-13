'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'

interface RequireDia1CompletoProps {
  children: React.ReactNode
  redirectTo?: string
}

/**
 * Componente que protege rotas, exigindo que o Dia 1 da Jornada seja completado
 * Redireciona para o Dia 1 se ainda não foi completado
 */
export default function RequireDia1Completo({ 
  children, 
  redirectTo = '/pt/nutri/metodo/jornada/dia/1' 
}: RequireDia1CompletoProps) {
  const router = useRouter()
  const { progress, loading } = useJornadaProgress()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (loading) {
      return
    }

    // Verificar se completou pelo menos o Dia 1
    // current_day >= 2 significa que completou o Dia 1
    const dia1Completo = progress && progress.current_day >= 2

    if (!dia1Completo) {
      console.log('🔒 [RequireDia1Completo] Dia 1 não completado, redirecionando...')
      router.push(redirectTo)
      return
    }

    setChecking(false)
  }, [progress, loading, router, redirectTo])

  // Mostrar loading enquanto verifica
  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  // Se chegou aqui, tem acesso
  return <>{children}</>
}

