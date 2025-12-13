'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface RequireDiagnosticoProps {
  children: React.ReactNode
  area?: 'nutri' | 'wellness' | 'coach' | 'nutra'
}

/**
 * Componente que verifica se o diagnóstico foi completado
 * Se não foi, redireciona para a página de diagnóstico
 */
export default function RequireDiagnostico({ children, area = 'nutri' }: RequireDiagnosticoProps) {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [hasDiagnostico, setHasDiagnostico] = useState(false)

  useEffect(() => {
    const verificarDiagnostico = async () => {
      // Se não está autenticado, não verificar
      if (loading || !user) {
        return
      }

      // Admin e suporte podem bypassar
      if (userProfile?.is_admin || userProfile?.is_support) {
        setHasDiagnostico(true)
        setChecking(false)
        return
      }

      // Verificar flag diagnostico_completo no userProfile
      if (userProfile?.diagnostico_completo) {
        setHasDiagnostico(true)
        setChecking(false)
        return
      }

      // Se não tem flag, verificar na API
      try {
        const response = await fetch('/api/nutri/diagnostico', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.hasDiagnostico) {
            setHasDiagnostico(true)
          } else {
            // Redirecionar para diagnóstico
            router.push('/pt/nutri/diagnostico')
            return
          }
        }
      } catch (error) {
        console.error('Erro ao verificar diagnóstico:', error)
        // Em caso de erro, permitir acesso (não bloquear)
        setHasDiagnostico(true)
      } finally {
        setChecking(false)
      }
    }

    verificarDiagnostico()
  }, [user, userProfile, loading, router])

  // Mostrar loading enquanto verifica
  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não tem diagnóstico, não renderizar (já redirecionou)
  if (!hasDiagnostico) {
    return null
  }

  return <>{children}</>
}

