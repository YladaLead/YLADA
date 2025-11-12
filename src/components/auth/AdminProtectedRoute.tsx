'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { getCachedAdminCheck, setCachedAdminCheck, clearCachedAdminCheck } from '@/lib/auth-cache'

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
          // Limpar cache se não tem sessão
          clearCachedAdminCheck()
          window.location.href = '/admin/login'
          return
        }

        // ✅ NOVO: Verificar cache APÓS confirmar que tem sessão (mais seguro)
        const cachedAdmin = getCachedAdminCheck()
        if (cachedAdmin === true) {
          console.log('✅ AdminProtectedRoute: Usando cache (muito mais rápido!)')
          setIsAdmin(true)
          setLoading(false)
          return
        }
        // Se cache é false, continuar para verificar novamente (pode ter mudado)

        console.log('✅ AdminProtectedRoute: Sessão OK! User:', session.user.email)

        // Verificar se é admin usando API route (evita problemas de RLS em produção)
        let isAdmin = false
        
        // Criar promise com timeout de 5 segundos
        const fetchWithTimeout = (url: string, options: RequestInit, timeout = 5000) => {
          return Promise.race([
            fetch(url, options),
            new Promise<Response>((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), timeout)
            )
          ])
        }

        try {
          console.log('🔍 AdminProtectedRoute: Chamando API /api/admin/check...')
          const checkAdminResponse = await fetchWithTimeout('/api/admin/check', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          }, 5000) // 5 segundos de timeout

          if (checkAdminResponse.ok) {
            const checkData = await checkAdminResponse.json()
            isAdmin = checkData.isAdmin === true
            console.log('✅ AdminProtectedRoute: Verificação via API OK:', { isAdmin })
          } else {
            const errorData = await checkAdminResponse.json().catch(() => ({}))
            console.error('❌ AdminProtectedRoute: Erro na API de verificação:', checkAdminResponse.status, errorData)
            // Fallback: tentar query direta
            const { data: profile, error: profileError } = await supabase
              .from('user_profiles')
              .select('is_admin')
              .eq('user_id', session.user.id)
              .maybeSingle()

            if (!profileError && profile) {
              isAdmin = profile.is_admin === true
              console.log('✅ AdminProtectedRoute: Usando fallback (query direta):', { isAdmin })
            } else {
              console.error('❌ AdminProtectedRoute: Erro no fallback também:', profileError?.message)
            }
          }
        } catch (apiError: any) {
          console.error('❌ AdminProtectedRoute: Erro ao chamar API de verificação:', apiError.message)
          
          // Se for timeout, tentar fallback imediatamente
          if (apiError.message === 'Timeout') {
            console.log('⏳ AdminProtectedRoute: Timeout na API, tentando fallback...')
          }
          
          // Fallback: tentar query direta
          try {
            const { data: profile, error: profileError } = await supabase
              .from('user_profiles')
              .select('is_admin')
              .eq('user_id', session.user.id)
              .maybeSingle()

            if (!profileError && profile) {
              isAdmin = profile.is_admin === true
              console.log('✅ AdminProtectedRoute: Usando fallback após erro de API:', { isAdmin })
            } else {
              console.error('❌ AdminProtectedRoute: Erro no fallback também:', profileError?.message)
              // Se fallback também falhar, redirecionar para login
              if (!mounted) return
              clearCachedAdminCheck()
              window.location.href = '/admin/login'
              return
            }
          } catch (fallbackError: any) {
            console.error('❌ AdminProtectedRoute: Erro no fallback:', fallbackError.message)
            // Se tudo falhar, redirecionar para login
            if (!mounted) return
            clearCachedAdminCheck()
            window.location.href = '/admin/login'
            return
          }
        }

        if (!mounted) return

        if (!isAdmin) {
          console.log('❌ AdminProtectedRoute: Não é admin')
          // Limpar cache se não é admin (não salvar false, pode mudar)
          clearCachedAdminCheck()
          await supabase.auth.signOut()
          window.location.href = '/admin/login'
          return
        }

        // ✅ NOVO: Salvar no cache (true) apenas se for admin
        setCachedAdminCheck(true)
        console.log('✅✅✅ AdminProtectedRoute: ACESSO PERMITIDO!')
        setIsAdmin(true)
        setLoading(false)
      } catch (error: any) {
        if (!mounted) return
        
        console.error('❌ AdminProtectedRoute: Erro geral:', error.message)
        // Em caso de erro, redirecionar para login
        clearCachedAdminCheck()
        window.location.href = '/admin/login'
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
