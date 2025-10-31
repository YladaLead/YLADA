'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  perfil?: 'nutri' | 'wellness' | 'coach' | 'nutra' | 'admin'
  redirectTo?: string
  allowAdmin?: boolean // Se true, admin pode acessar qualquer área
}

export default function ProtectedRoute({ 
  children, 
  perfil,
  redirectTo,
  allowAdmin = false
}: ProtectedRouteProps) {
  const { user, userProfile, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Verificar autenticação
    if (!isAuthenticated || !user) {
      const redirectPath = redirectTo || (perfil === 'admin' ? '/admin/login' : `/pt/${perfil || 'nutri'}/login`)
      router.push(redirectPath)
      return
    }

    // Se não há perfil específico requerido, permitir acesso
    if (!perfil) {
      return
    }

    // Se requer admin, verificar se é admin
    if (perfil === 'admin') {
      if (!userProfile?.is_admin) {
        router.push('/admin/login')
        return
      }
      return
    }

    // Verificar se é admin e se admin tem permissão para acessar outras áreas
    if (allowAdmin && userProfile?.is_admin) {
      return
    }

    // Verificar se o perfil do usuário corresponde ao perfil requerido
    if (userProfile?.perfil !== perfil) {
      // Redirecionar para o dashboard do perfil correto
      if (userProfile?.perfil) {
        router.push(`/pt/${userProfile.perfil}/dashboard`)
      } else {
        router.push(`/pt/${perfil}/login`)
      }
    }
  }, [loading, isAuthenticated, user, userProfile, perfil, router, redirectTo, allowAdmin])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // Verificar perfil se especificado
  if (perfil) {
    // Se requer admin, verificar se é admin
    if (perfil === 'admin') {
      if (!userProfile?.is_admin) {
        return null
      }
      return <>{children}</>
    }

    // Admin pode acessar outras áreas se allowAdmin = true
    if (allowAdmin && userProfile?.is_admin) {
      return <>{children}</>
    }

    // Verificar se perfil corresponde
    if (userProfile?.perfil !== perfil) {
      return null
    }
  }

  return <>{children}</>
}

