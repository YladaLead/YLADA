'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

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
  const [profileCheckTimeout, setProfileCheckTimeout] = useState(false)

  // 🚀 OTIMIZAÇÃO: Timeout unificado e simplificado (reduzido de 2s/3s para 1.5s)
  // Isso reduz latência percebida sem comprometer funcionalidade
  useEffect(() => {
    let loadingTimer: NodeJS.Timeout | null = null
    let authTimer: NodeJS.Timeout | null = null
    let profileTimer: NodeJS.Timeout | null = null
    
    if (loading) {
      loadingTimer = setTimeout(() => {
        setLoadingTimeout(true)
      }, 1500) // Reduzido de 2s para 1.5s
    } else {
      setLoadingTimeout(false)
    }
    
    if (!isAuthenticated || !user) {
      if (!loading) {
        authTimer = setTimeout(() => {
          if (!isAuthenticated || !user) {
            setAuthCheckTimeout(true)
          }
        }, 2000) // Reduzido de 3s para 2s
      }
    } else {
      setAuthCheckTimeout(false)
    }
    
    if (user && !userProfile && !loading) {
      profileTimer = setTimeout(() => {
        if (user && !userProfile) {
          console.warn('⚠️ ProtectedRoute: Perfil não carregou após 2s, permitindo acesso temporário')
          setProfileCheckTimeout(true)
        }
      }, 2000) // Reduzido de 3s para 2s
    } else {
      setProfileCheckTimeout(false)
    }
    
    return () => {
      if (loadingTimer) clearTimeout(loadingTimer)
      if (authTimer) clearTimeout(authTimer)
      if (profileTimer) clearTimeout(profileTimer)
    }
  }, [loading, isAuthenticated, user, userProfile])

  useEffect(() => {
    // Se ainda está carregando, aguardar
    if (loading && !loadingTimeout) {
      return
    }

    // Verificar autenticação - simples e direto
    if (!isAuthenticated || !user) {
      // Se ainda está carregando, aguardar
      if (loading) {
        return
      }
      
      // Se passou o timeout, redirecionar
      if (authCheckTimeout) {
        const redirectPath = redirectTo || (perfil === 'admin' ? '/admin/login' : `/pt/${perfil || 'nutri'}/login`)
        router.push(redirectPath)
        return
      }
      
      // Aguardar timeout
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
      
      // Se o perfil ainda não carregou mas já passou o timeout de loading (2s), permitir acesso
      // Isso evita bloqueios desnecessários quando o perfil demora para carregar
      if (!userProfile && loadingTimeout) {
        console.log('⚠️ Perfil não carregou ainda, mas allowAdmin=true e loadingTimeout passou, permitindo acesso temporário')
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
  }, [loading, isAuthenticated, user, userProfile, perfil, router, redirectTo, allowAdmin, allowSupport, loadingTimeout, profileCheckTimeout, authCheckTimeout])

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
  if (loading && loadingTimeout && !profileCheckTimeout) {
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
    // Se ainda está carregando, aguardar mais (dar mais tempo)
    if (loading) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando autenticação...</p>
          </div>
        </div>
      )
    }
    
    // Se já passou o timeout E não está mais carregando, redirecionar
    if (authCheckTimeout && !loading) {
      const redirectPath = redirectTo || (perfil === 'admin' ? '/admin/login' : `/pt/${perfil || 'nutri'}/login`)
      console.log('❌ Não autenticado após timeout, redirecionando para:', redirectPath)
      router.push(redirectPath)
      return null
    }
    
    // Enquanto aguarda, mostrar loading (mesmo que não esteja carregando, aguardar timeout)
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
      
      // Se passou timeout do perfil e allowAdmin está ativo, permitir acesso
      if (!userProfile && profileCheckTimeout) {
        console.warn('⚠️ Render: Perfil não carregou, mas allowAdmin=true, permitindo acesso temporário')
        return <>{children}</>
      }
      
      // Se allowAdmin está ativo e já passou o timeout de loading (2s), permitir acesso imediatamente
      // Não precisa esperar o profileCheckTimeout (3s)
      if (!userProfile && loadingTimeout) {
        console.warn('⚠️ Render: Perfil não carregou, mas allowAdmin=true e loadingTimeout passou, permitindo acesso')
        return <>{children}</>
      }
    }

    // Suporte pode acessar outras áreas se allowSupport = true
    if (allowSupport && userProfile?.is_support) {
      console.log('✅ Render: Suporte confirmado, permitindo acesso')
      return <>{children}</>
    }

    // Se ainda está carregando o perfil e não temos certeza de admin/suporte, aguardar
    if (!userProfile && !loadingTimeout && !profileCheckTimeout) {
      // Retornar loading (já está sendo tratado acima)
      return null
    }

    // Se passou timeout do perfil e não temos perfil, permitir acesso (perfil pode ser criado depois)
    if (!userProfile && profileCheckTimeout) {
      console.warn('⚠️ Render: Perfil não carregou após timeout, permitindo acesso temporário')
      return <>{children}</>
    }

    // Verificar se perfil corresponde
    if (userProfile?.perfil !== perfil) {
      // Se allowAdmin está ativo e ainda não temos certeza, aguardar ou permitir após timeout
      if (allowAdmin) {
        // Se já passou o timeout de loading (2s), permitir acesso mesmo sem perfil
        if (!userProfile && loadingTimeout) {
          console.warn('⚠️ Render: Perfil não carregou, mas allowAdmin=true e loadingTimeout passou, permitindo acesso')
          return <>{children}</>
        }
        if (!userProfile && profileCheckTimeout) {
          console.warn('⚠️ Render: Perfil não carregou, mas allowAdmin=true, permitindo acesso')
          return <>{children}</>
        }
        if (!userProfile) {
          return null
        }
      }
      return null
    }
    
    console.log('✅ Render: Perfil corresponde, permitindo acesso')
  }

  return <>{children}</>
}

