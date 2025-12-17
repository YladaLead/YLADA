'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface RequireDia1CompletoProps {
  children: React.ReactNode
  area?: 'nutri' | 'wellness' | 'coach' | 'nutra'
  redirectTo?: string
}

/**
 * Componente que verifica se o Dia 1 da Jornada foi completado
 * Se não foi, redireciona para o Dia 1 da Jornada
 * 
 * Usado para controlar acesso a funcionalidades que só devem estar disponíveis
 * após completar o Dia 1 (ex: chat livre da LYA)
 */
export default function RequireDia1Completo({ 
  children, 
  area = 'nutri',
  redirectTo 
}: RequireDia1CompletoProps) {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [dia1Completo, setDia1Completo] = useState(false)

  useEffect(() => {
    const verificarDia1 = async () => {
      // Se não está autenticado, não verificar
      if (loading || !user) {
        return
      }

      // Admin e suporte podem bypassar
      if (userProfile?.is_admin || userProfile?.is_support) {
        setDia1Completo(true)
        setChecking(false)
        return
      }

      // Verificar se Dia 1 foi completado
      try {
        const response = await fetch('/api/nutri/metodo/jornada', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data?.stats) {
            const stats = data.data.stats
            
            // Verificar se há progresso no Dia 1
            // Se current_day >= 2, significa que Dia 1 foi completado
            // OU se completed_days >= 1
            const dia1FoiCompletado = stats.current_day >= 2 || stats.completed_days >= 1
            
            if (dia1FoiCompletado) {
              setDia1Completo(true)
            } else {
              // Redirecionar para Dia 1 da Jornada
              const redirectPath = redirectTo || '/pt/nutri/metodo/jornada/dia/1'
              router.push(redirectPath)
              return
            }
          } else {
            // Se não há progresso, redirecionar para Dia 1
            const redirectPath = redirectTo || '/pt/nutri/metodo/jornada/dia/1'
            router.push(redirectPath)
            return
          }
        } else {
          // Em caso de erro na API, permitir acesso (não bloquear)
          setDia1Completo(true)
        }
      } catch (error) {
        console.error('Erro ao verificar Dia 1:', error)
        // Em caso de erro, permitir acesso (não bloquear)
        setDia1Completo(true)
      } finally {
        setChecking(false)
      }
    }

    verificarDia1()
  }, [user, userProfile, loading, router, redirectTo])

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

  // Se não completou Dia 1, não renderizar (já redirecionou)
  if (!dia1Completo) {
    return null
  }

  return <>{children}</>
}
