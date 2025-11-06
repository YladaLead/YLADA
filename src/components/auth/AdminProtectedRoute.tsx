'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkAdmin = async () => {
      try {
        console.log('🔐 AdminProtectedRoute: INICIANDO verificação...')
        
        // Verificar sessão primeiro (rápido)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (!session || sessionError) {
          console.log('❌ AdminProtectedRoute: Sem sessão')
          window.location.href = '/admin/login'
          return
        }

        console.log('✅ AdminProtectedRoute: Sessão OK! User:', session.user.email)

        // Verificar se é admin com timeout de 2 segundos
        const profilePromise = supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('user_id', session.user.id)
          .single()

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 2000)
        )

        const result = await Promise.race([profilePromise, timeoutPromise]) as any
        
        if (!mounted) return

        const { data: profile, error: profileError } = result

        if (profileError) {
          console.error('❌ AdminProtectedRoute: Erro ao buscar perfil:', profileError.message)
          await supabase.auth.signOut()
          window.location.href = '/admin/login'
          return
        }

        if (!profile?.is_admin) {
          console.log('❌ AdminProtectedRoute: Não é admin')
          await supabase.auth.signOut()
          window.location.href = '/admin/login'
          return
        }

        console.log('✅✅✅ AdminProtectedRoute: ACESSO PERMITIDO!')
        setIsAdmin(true)
        setLoading(false)
      } catch (error: any) {
        if (!mounted) return
        
        console.error('❌ AdminProtectedRoute: Erro:', error.message)
        if (error.message === 'Timeout') {
          console.log('⏳ AdminProtectedRoute: Timeout - tentando novamente...')
          setTimeout(() => {
            if (mounted) checkAdmin()
          }, 500)
        } else {
          window.location.href = '/admin/login'
        }
      }
    }

    checkAdmin()

    // Ouvir mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 AdminProtectedRoute: Auth state changed:', event)
      if (event === 'SIGNED_OUT' || !session) {
        window.location.href = '/admin/login'
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}
