'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface LibraryUploadProtectedRouteProps {
  children: React.ReactNode
}

export default function LibraryUploadProtectedRoute({ 
  children 
}: LibraryUploadProtectedRouteProps) {
  const { user, userProfile, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkPermission = async () => {
      try {
        // Se ainda está carregando, aguardar
        if (loading) {
          return
        }

        // Se não está autenticado, redirecionar para login
        if (!isAuthenticated || !user) {
          if (mounted) {
            router.push('/pt/wellness/login?redirect=/pt/wellness/biblioteca/upload')
          }
          return
        }

        // Verificar permissão via API (mais seguro)
        try {
          const response = await fetch('/api/wellness/biblioteca/check-permission', {
            method: 'GET',
            credentials: 'include'
          })

          if (!mounted) return

          if (response.ok) {
            const data = await response.json()
            if (data.hasPermission) {
              setHasPermission(true)
              setChecking(false)
              return
            }
          }
        } catch (apiError) {
          console.error('Erro ao verificar permissão via API:', apiError)
          // Fallback: verificar diretamente no perfil
        }

        // Fallback: verificar no perfil carregado
        if (userProfile) {
          const canUpload = 
            userProfile.is_admin === true || 
            userProfile.can_upload_library === true

          if (mounted) {
            setHasPermission(canUpload)
            setChecking(false)
          }
          return
        }

        // Se não tem perfil carregado, buscar diretamente
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('is_admin, can_upload_library')
          .eq('user_id', user.id)
          .maybeSingle()

        if (!mounted) return

        if (error) {
          console.error('Erro ao buscar perfil:', error)
          setHasPermission(false)
          setChecking(false)
          return
        }

        const canUpload = 
          profile?.is_admin === true || 
          profile?.can_upload_library === true

        setHasPermission(canUpload)
        setChecking(false)

        // Se não tem permissão, redirecionar
        if (!canUpload) {
          router.push('/pt/wellness/home?error=no_upload_permission')
        }
      } catch (error) {
        console.error('Erro ao verificar permissão:', error)
        if (mounted) {
          setHasPermission(false)
          setChecking(false)
          router.push('/pt/wellness/home?error=permission_check_failed')
        }
      }
    }

    checkPermission()

    return () => {
      mounted = false
    }
  }, [user, userProfile, loading, isAuthenticated, router])

  // Mostrar loading enquanto verifica
  if (checking || loading || hasPermission === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Se não tem permissão, não renderizar (já redirecionou)
  if (!hasPermission) {
    return null
  }

  // Renderizar conteúdo
  return <>{children}</>
}
