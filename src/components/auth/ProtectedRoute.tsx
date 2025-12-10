'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  perfil?: 'nutri' | 'wellness' | 'coach' | 'nutra' | 'admin'
  redirectTo?: string
  allowAdmin?: boolean // Se true, admin pode acessar qualquer área
  allowSupport?: boolean // Se true, suporte pode acessar qualquer área
}

/**
 * VERSÃO OTIMIZADA - Sem loops infinitos
 * - Timeout único de 2s
 * - Menos re-renders
 * - Verificação simplificada
 */
export default function ProtectedRoute({ 
  children, 
  perfil,
  redirectTo,
  allowAdmin = false,
  allowSupport = true // Por padrão, suporte pode acessar todas as áreas
}: ProtectedRouteProps) {
  const { user, userProfile, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  // Timeout reduzido para 1.5 segundos (melhor UX em mobile)
  useEffect(() => {
    mountedRef.current = true
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (loading) {
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          setHasTimedOut(true)
        }
      }, 1500) // Reduzido de 2000ms para 1500ms
    } else {
      setHasTimedOut(false)
    }

    return () => {
      mountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [loading])

  // Redirecionamento (apenas uma vez, evita loops)
  useEffect(() => {
    if (hasRedirected || loading || hasTimedOut) {
      return
    }

    if (!isAuthenticated || !user) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
      
      if (currentPath.includes('/login')) {
        return
      }

      const redirectPath = redirectTo || (perfil === 'admin' ? '/admin/login' : `/pt/${perfil || 'nutri'}/login`)
      
      setHasRedirected(true)
      router.replace(redirectPath)
    }
  }, [isAuthenticated, user, loading, hasTimedOut, hasRedirected, perfil, redirectTo, router])

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

  // Se não está autenticado
  if (!isAuthenticated || !user) {
    if (hasRedirected) {
      return null
    }
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    )
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

