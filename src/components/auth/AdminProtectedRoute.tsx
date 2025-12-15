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
    let timeoutId: NodeJS.Timeout | null = null

    // Timeout de segurança: se demorar mais de 10s, redirecionar
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.error('⏰ AdminProtectedRoute: Timeout de segurança (10s) - redirecionando...')
        clearCachedAdminCheck()
        window.location.href = '/admin/login'
      }
    }, 10000)

    const checkAdmin = async () => {
      try {
        console.log('🔐 AdminProtectedRoute: INICIANDO verificação...')
        
        // 🚀 OTIMIZAÇÃO: Verificar cache PRIMEIRO (antes de qualquer chamada)
        const cachedAdmin = getCachedAdminCheck()
        if (cachedAdmin === true) {
          console.log('✅ AdminProtectedRoute: Usando cache (instantâneo!)')
          // Verificar sessão rapidamente para confirmar que ainda está autenticado
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.access_token) {
            setIsAdmin(true)
            setLoading(false)
            return
          } else {
            // Sessão expirada, limpar cache
            clearCachedAdminCheck()
          }
        }
        
        // 🚀 OTIMIZAÇÃO: Paralelizar getUser() e getSession() (mais rápido)
        const [userResult, sessionResult] = await Promise.all([
          supabase.auth.getUser(),
          supabase.auth.getSession()
        ])
        
        const { data: { user }, error: userError } = userResult
        const { data: { session } } = sessionResult
        
        if (!mounted) return

        if (!user || userError) {
          console.log('❌ AdminProtectedRoute: Sem usuário autenticado:', userError?.message)
          clearCachedAdminCheck()
          window.location.href = '/admin/login'
          return
        }

        if (!session?.access_token) {
          console.error('❌ AdminProtectedRoute: Sem access_token')
          clearCachedAdminCheck()
          window.location.href = '/admin/login'
          return
        }

        console.log('✅ AdminProtectedRoute: Usuário autenticado! User:', user.email)

        // Verificar se é admin usando API route (evita problemas de RLS em produção)
        let isAdmin = false
        
        // 🚀 OTIMIZAÇÃO: Reduzir timeout de 5s para 2s (mais rápido)
        const fetchWithTimeout = (url: string, options: RequestInit, timeout = 2000) => {
          return Promise.race([
            fetch(url, options),
            new Promise<Response>((_, reject) =>
              setTimeout(() => reject(new Error('Timeout')), timeout)
            )
          ])
        }

        try {
          console.log('🔍 AdminProtectedRoute: Chamando API /api/admin/check...')
          const apiStartTime = Date.now()
          
          const checkAdminResponse = await fetchWithTimeout('/api/admin/check', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include' // Garantir que cookies sejam enviados
          }, 5000) // Aumentado para 5s para dar mais tempo em conexões lentas

          const apiDuration = Date.now() - apiStartTime
          console.log(`⏱️ AdminProtectedRoute: API respondeu em ${apiDuration}ms`)

          if (checkAdminResponse.ok) {
            const checkData = await checkAdminResponse.json()
            isAdmin = checkData.isAdmin === true
            console.log('✅ AdminProtectedRoute: Verificação via API OK:', { isAdmin, userId: checkData.userId })
          } else {
            const errorData = await checkAdminResponse.json().catch(() => ({}))
            console.error('❌ AdminProtectedRoute: Erro na API de verificação:', checkAdminResponse.status, errorData)
            // Fallback: tentar query direta
            console.log('🔄 AdminProtectedRoute: Tentando fallback (query direta)...')
            try {
              const { data: profile, error: profileError } = await supabase
                .from('user_profiles')
                .select('is_admin')
                .eq('user_id', user.id)
                .maybeSingle()

              if (!profileError && profile) {
                isAdmin = profile.is_admin === true
                console.log('✅ AdminProtectedRoute: Usando fallback (query direta):', { isAdmin })
              } else {
                console.error('❌ AdminProtectedRoute: Erro no fallback também:', profileError?.message)
                // Se fallback falhar, redirecionar
                if (!mounted) return
                if (timeoutId) clearTimeout(timeoutId)
                setLoading(false)
                clearCachedAdminCheck()
                window.location.href = '/admin/login'
                return
              }
            } catch (fallbackErr: any) {
              console.error('❌ AdminProtectedRoute: Erro ao executar fallback:', fallbackErr.message)
              if (!mounted) return
              if (timeoutId) clearTimeout(timeoutId)
              setLoading(false)
              clearCachedAdminCheck()
              window.location.href = '/admin/login'
              return
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
              .eq('user_id', user.id)
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
        if (mounted) {
          setIsAdmin(true)
          setLoading(false)
        }
        // Limpar timeout de segurança
        if (timeoutId) clearTimeout(timeoutId)
      } catch (error: any) {
        if (!mounted) return
        
        console.error('❌ AdminProtectedRoute: Erro geral:', error.message)
        // Limpar timeout de segurança
        if (timeoutId) clearTimeout(timeoutId)
        // Em caso de erro, garantir que o loading seja desativado
        setLoading(false)
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
      if (timeoutId) clearTimeout(timeoutId)
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
