'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  perfil?: 'nutri' | 'wellness' | 'coach' | 'nutra' | 'admin'
  redirectTo?: string
  allowAdmin?: boolean // Se true, admin pode acessar qualquer área
  allowSupport?: boolean // Se true, suporte pode acessar qualquer área
}

/**
 * VERSÃO OTIMIZADA FASE 2 - Apenas verificação de permissão
 * - NÃO redireciona (AutoRedirect cuida disso)
 * - Apenas verifica se usuário tem permissão
 * - Timeout reduzido para melhor UX
 */
export default function ProtectedRoute({ 
  children, 
  perfil,
  redirectTo, // Mantido para compatibilidade, mas não usado
  allowAdmin = false,
  allowSupport = true // Por padrão, suporte pode acessar todas as áreas
}: ProtectedRouteProps) {
  const { user, userProfile, loading, isAuthenticated } = useAuth()
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  // 🚀 OTIMIZAÇÃO: Timeout reduzido para 500ms (com cache, raramente necessário)
  useEffect(() => {
    mountedRef.current = true
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (loading) {
      // 🚀 OTIMIZAÇÃO: Verificar cache primeiro antes de usar timeout
      if (user && typeof window !== 'undefined') {
        const cacheKey = `user_profile_${user.id}`
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached)
            const age = Date.now() - timestamp
            const TTL = 2 * 60 * 1000 // 2 minutos
            if (age < TTL) {
              // Cache válido - não precisa timeout
              setHasTimedOut(false)
              return
            }
          } catch (e) {
            // Cache inválido, continuar com timeout
          }
        }
      }
      
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setHasTimedOut(true)
        }
      }, 500) // Reduzido de 1000ms para 500ms (com cache, raramente necessário)
    } else {
      setHasTimedOut(false)
    }

    return () => {
      mountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [loading, user])

  // 🚀 FASE 2: Removido redirecionamento - AutoRedirect cuida disso
  // Este componente apenas verifica permissão, não redireciona

  // Loading state simplificado
  if (loading && !hasTimedOut) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado, não renderizar nada (AutoRedirect vai redirecionar)
  if (!isAuthenticated || !user) {
    // Mostrar loading apenas se ainda está carregando
    if (loading && !hasTimedOut) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      )
    }
    // Se não está carregando e não está autenticado, AutoRedirect vai cuidar
    return null
  }

  // Verificar perfil se especificado
  if (perfil) {
    if (perfil === 'admin') {
      if (!userProfile?.is_admin && !hasTimedOut) {
        return (
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Verificando permissões...</p>
            </div>
          </div>
        )
      }
      
      if (!userProfile?.is_admin) {
        return null
      }
    }

    // Verificar override de admin/suporte
    if (allowAdmin && userProfile?.is_admin) {
      return <>{children}</>
    }

    if (allowSupport && userProfile?.is_support) {
      return <>{children}</>
    }

    // Verificar se perfil corresponde (após timeout, permitir acesso temporário)
    if (userProfile?.perfil !== perfil) {
      if (hasTimedOut) {
        return <>{children}</>
      }
      return null
    }
  }

  return <>{children}</>
}

