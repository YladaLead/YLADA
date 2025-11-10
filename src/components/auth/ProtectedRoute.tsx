'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  perfil?: 'nutri' | 'wellness' | 'coach' | 'nutra' | 'admin'
  redirectTo?: string
  allowAdmin?: boolean // Se true, admin pode acessar qualquer área
  allowSupport?: boolean // Se true, suporte pode acessar qualquer área
}

export default function ProtectedRoute({ 
  children, 
  perfil,
  redirectTo,
  allowAdmin = false,
  allowSupport = true // Por padrão, suporte pode acessar todas as áreas
}: ProtectedRouteProps) {
  const { user, userProfile, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loadingTimeout, setLoadingTimeout] = useState(false)
  const [authCheckTimeout, setAuthCheckTimeout] = useState(false)

  // Timeout de loading - após 2 segundos, marcar como timeout (aumentado para dar mais tempo)
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        console.warn('⚠️ Loading demorou mais de 2s, continuando mesmo assim...')
        setLoadingTimeout(true)
      }, 2000) // Aumentado de 1s para 2s
      return () => clearTimeout(timer)
    } else {
      setLoadingTimeout(false)
    }
  }, [loading])

  // Timeout para verificação de autenticação - aguardar 5 segundos antes de redirecionar
  // Isso dá tempo suficiente para o useAuth detectar a sessão após redirecionamento
  useEffect(() => {
    if (!isAuthenticated || !user) {
      const timer = setTimeout(() => {
        // Verificar novamente antes de marcar timeout (pode ter mudado)
        if (!isAuthenticated || !user) {
          console.log('❌ Não autenticado após 5s, marcando para redirecionar...')
          setAuthCheckTimeout(true)
        }
      }, 5000) // Aumentado para 5 segundos para dar mais tempo
      return () => clearTimeout(timer)
    } else {
      // Se autenticado, resetar o timeout
      setAuthCheckTimeout(false)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    // Não fazer nada se ainda está carregando (será tratado no render)
    if (loading && !loadingTimeout) {
      console.log('⏳ ProtectedRoute: Aguardando carregamento...')
      return
    }
    
    // Se loading timeout, continuar mesmo sem perfil completo
    if (loading && loadingTimeout) {
      console.log('⚠️ ProtectedRoute: Timeout de loading, continuando mesmo assim...')
    }

    console.log('🔐 ProtectedRoute: Verificando acesso...', {
      isAuthenticated,
      hasUser: !!user,
      hasProfile: !!userProfile,
      perfilRequerido: perfil,
      perfilUsuario: userProfile?.perfil,
      is_admin: userProfile?.is_admin,
      is_support: userProfile?.is_support,
      allowAdmin,
      allowSupport,
      loading,
      loadingTimeout
    })

    // Verificar autenticação - aguardar mais tempo antes de redirecionar
    // Isso dá tempo para o useAuth detectar a sessão
    if (!isAuthenticated || !user) {
      // Se ainda está carregando, aguardar mais
      if (loading && !loadingTimeout) {
        console.log('⏳ ProtectedRoute: Ainda carregando, aguardando...')
        return
      }
      
      // Se já passou o timeout de auth check, redirecionar
      if (authCheckTimeout) {
        const redirectPath = redirectTo || (perfil === 'admin' ? '/admin/login' : `/pt/${perfil || 'nutri'}/login`)
        console.log('❌ Não autenticado após timeout, redirecionando para:', redirectPath)
        router.push(redirectPath)
        return
      }
      
      // Se não passou o timeout, aguardar mais
      console.log('⏳ ProtectedRoute: Aguardando autenticação...')
      return
    }

    // Se não há perfil específico requerido, permitir acesso
    if (!perfil) {
      console.log('✅ Sem perfil requerido, permitindo acesso')
      return
    }

    // Se requer admin, verificar se é admin
    if (perfil === 'admin') {
      // Se ainda não carregou o perfil mas já passou o timeout, permitir acesso temporariamente
      if (!userProfile && loadingTimeout) {
        console.warn('⚠️ Perfil ainda não carregou, mas permitindo acesso temporário para admin')
        return
      }
      
      if (!userProfile?.is_admin) {
        console.log('❌ Não é admin, redirecionando para login')
        router.push('/admin/login')
        return
      }
      console.log('✅ Admin confirmado, permitindo acesso')
      return
    }

    // IMPORTANTE: Se allowAdmin está ativo, verificar se é admin ANTES de verificar perfil
    // Isso permite que admin acesse outras áreas mesmo quando o perfil ainda está carregando
    if (allowAdmin) {
      // Se o perfil já foi carregado e é admin, permitir acesso imediatamente
      if (userProfile?.is_admin) {
        console.log('✅ Admin detectado, permitindo acesso à área:', perfil)
        return
      }
      
      // Se o perfil ainda não carregou mas já passou o timeout, fazer uma busca rápida
      // para verificar se é admin antes de bloquear
      if (!userProfile && loadingTimeout && user?.id) {
        console.log('🔍 Perfil não carregou ainda, verificando se é admin...')
        // Não bloquear aqui - deixar o render decidir
        return
      }
    }

    // Verificar se é suporte e se suporte tem permissão para acessar outras áreas
    if (allowSupport && userProfile?.is_support) {
      console.log('✅ Suporte detectado, permitindo acesso à área:', perfil)
      return
    }

    // Se ainda está carregando o perfil e não é admin/suporte, aguardar um pouco mais
    // antes de tomar decisão de redirecionamento
    if (!userProfile && !loadingTimeout) {
      console.log('⏳ Aguardando carregamento do perfil para verificação...')
      return
    }

    // Verificar se o perfil do usuário corresponde ao perfil requerido
    if (userProfile?.perfil !== perfil) {
      // Se allowAdmin está ativo e ainda não temos certeza se é admin, não redirecionar ainda
      if (allowAdmin && !userProfile) {
        console.log('⏳ Aguardando confirmação de admin antes de redirecionar...')
        return
      }
      
      // Redirecionar para o dashboard do perfil correto
      if (userProfile?.perfil) {
        console.log('❌ Perfil não corresponde, redirecionando para:', `/pt/${userProfile.perfil}/dashboard`)
        router.push(`/pt/${userProfile.perfil}/dashboard`)
      } else {
        console.log('❌ Perfil não encontrado, redirecionando para login:', `/pt/${perfil}/login`)
        router.push(`/pt/${perfil}/login`)
      }
    } else {
      console.log('✅ Perfil corresponde, permitindo acesso')
    }
  }, [loading, isAuthenticated, user, userProfile, perfil, router, redirectTo, allowAdmin, allowSupport, loadingTimeout])

  // Timeout de loading - após 1 segundo, continuar mesmo sem perfil completo
  if (loading && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se timeout mas ainda loading, aguardar mais um pouco antes de continuar
  if (loading && loadingTimeout) {
    // Aguardar mais 500ms antes de permitir acesso temporário
    // Isso evita múltiplos re-renders
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  // Verificar autenticação - se não autenticado, aguardar um pouco antes de redirecionar
  // Isso dá tempo para o useAuth detectar a sessão após redirecionamento
  if (!isAuthenticated || !user) {
    // Se ainda está carregando, aguardar mais
    if (loading && !loadingTimeout) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      )
    }
    
    // Se já passou o timeout, redirecionar
    if (authCheckTimeout) {
      const redirectPath = redirectTo || (perfil === 'admin' ? '/admin/login' : `/pt/${perfil || 'nutri'}/login`)
      console.log('❌ Não autenticado após timeout, redirecionando para:', redirectPath)
      router.push(redirectPath)
      return null
    }
    
    // Enquanto aguarda, mostrar loading
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Verificar perfil se especificado
  if (perfil) {
    // Se requer admin, verificar se é admin
    if (perfil === 'admin') {
      // Se ainda não carregou o perfil mas já passou o timeout, permitir acesso temporariamente
      if (!userProfile && loadingTimeout) {
        console.warn('⚠️ Perfil ainda não carregou, mas permitindo acesso temporário para admin')
        return <>{children}</>
      }
      
      if (!userProfile?.is_admin) {
        return null
      }
      return <>{children}</>
    }

    // IMPORTANTE: Admin pode acessar outras áreas se allowAdmin = true
    // Verificar mesmo quando o perfil ainda está carregando (após timeout)
    if (allowAdmin) {
      if (userProfile?.is_admin) {
        console.log('✅ Render: Admin confirmado, permitindo acesso')
        return <>{children}</>
      }
      
      // Se ainda não carregou mas já passou timeout, aguardar mais um pouco
      // Não permitir acesso temporário imediatamente para evitar múltiplos re-renders
      if (!userProfile && loadingTimeout) {
        // Mostrar loading enquanto aguarda perfil carregar
        return (
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Verificando permissões...</p>
            </div>
          </div>
        )
      }
    }

    // Suporte pode acessar outras áreas se allowSupport = true
    if (allowSupport && userProfile?.is_support) {
      console.log('✅ Render: Suporte confirmado, permitindo acesso')
      return <>{children}</>
    }

    // Se ainda está carregando o perfil e não temos certeza de admin/suporte, aguardar
    if (!userProfile && !loadingTimeout) {
      // Retornar loading (já está sendo tratado acima)
      return null
    }

    // Verificar se perfil corresponde
    if (userProfile?.perfil !== perfil) {
      // Se allowAdmin está ativo e ainda não temos certeza, aguardar
      if (allowAdmin && !userProfile) {
        return null
      }
      return null
    }
    
    console.log('✅ Render: Perfil corresponde, permitindo acesso')
  }

  return <>{children}</>
}

