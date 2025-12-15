'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-client'
import { getCachedAdminCheck, setCachedAdminCheck, clearCachedAdminCheck } from '@/lib/auth-cache'
import { useAuth } from '@/contexts/AuthContext'

const supabase = createClient()

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, userProfile, loading: authLoading } = useAuth()
  const checkingRef = useRef(false)

  useEffect(() => {
    // Evitar múltiplas execuções simultâneas
    if (checkingRef.current) {
      return
    }
    
    // Só executar quando autenticação terminar de carregar
    if (authLoading) {
      console.log('⏳ AdminProtectedRoute: Aguardando autenticação...')
      return
    }
    
    // Se não tem usuário, redirecionar
    if (!user) {
      console.log('❌ AdminProtectedRoute: Sem usuário')
      if (loading) {
        setLoading(false)
      }
      window.location.href = '/admin/login'
      return
    }
    
    checkingRef.current = true
    let mounted = true
    let timeoutId: NodeJS.Timeout | null = null

    // Timeout de segurança: se demorar mais de 15s, redirecionar
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.error('⏰ AdminProtectedRoute: Timeout de segurança (15s) - redirecionando...')
        clearCachedAdminCheck()
        window.location.href = '/admin/login'
      }
    }, 15000)

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
            if (mounted) {
              setIsAdmin(true)
              setLoading(false)
            }
            if (timeoutId) clearTimeout(timeoutId)
            return
          } else {
            // Sessão expirada, limpar cache
            clearCachedAdminCheck()
          }
        }
        
        // Aguardar autenticação carregar (se ainda estiver carregando)
        if (authLoading) {
          console.log('⏳ AdminProtectedRoute: Aguardando autenticação carregar...')
          // Aguardar até 5s pela autenticação
          let waitCount = 0
          while (authLoading && waitCount < 50 && mounted) {
            await new Promise(resolve => setTimeout(resolve, 100))
            waitCount++
          }
        }
        
        // 🚀 OTIMIZAÇÃO: Usar user do useAuth se disponível (mais rápido)
        let currentUser = user
        let currentSession = null
        
        if (!currentUser) {
          // Se não tem user do useAuth, buscar diretamente
          console.log('🔍 AdminProtectedRoute: Buscando usuário diretamente...')
          const [userResult, sessionResult] = await Promise.all([
            supabase.auth.getUser(),
            supabase.auth.getSession()
          ])
          
          const { data: { user: fetchedUser }, error: userError } = userResult
          const { data: { session } } = sessionResult
          
          if (!mounted) return

          if (!fetchedUser || userError) {
            console.log('❌ AdminProtectedRoute: Sem usuário autenticado:', userError?.message)
            if (timeoutId) clearTimeout(timeoutId)
            if (mounted) setLoading(false)
            clearCachedAdminCheck()
            window.location.href = '/admin/login'
            return
          }

          currentUser = fetchedUser
          currentSession = session
        } else {
          // Usar sessão do useAuth ou buscar
          const { data: { session } } = await supabase.auth.getSession()
          currentSession = session
        }
        
        if (!mounted) return

        if (!currentSession?.access_token) {
          console.error('❌ AdminProtectedRoute: Sem access_token')
          if (timeoutId) clearTimeout(timeoutId)
          if (mounted) setLoading(false)
          clearCachedAdminCheck()
          window.location.href = '/admin/login'
          return
        }

        console.log('✅ AdminProtectedRoute: Usuário autenticado! User:', currentUser.email)
        
        // 🚀 OTIMIZAÇÃO: Se userProfile já estiver carregado e tiver is_admin, usar diretamente
        if (userProfile?.is_admin === true) {
          console.log('✅ AdminProtectedRoute: is_admin encontrado no userProfile!')
          if (mounted) {
            setCachedAdminCheck(true)
            setIsAdmin(true)
            setLoading(false)
          }
          if (timeoutId) clearTimeout(timeoutId)
          return
        }
        
        // Se userProfile está carregado mas is_admin é false, não é admin
        if (userProfile && userProfile.is_admin === false) {
          console.log('❌ AdminProtectedRoute: is_admin = false no userProfile')
          if (timeoutId) clearTimeout(timeoutId)
          if (mounted) setLoading(false)
          clearCachedAdminCheck()
          window.location.href = '/admin/login'
          return
        }

        // Verificar se é admin usando API route (evita problemas de RLS em produção)
        let isAdmin = false
        
        // Função auxiliar para timeout
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
          const apiStartTime = Date.now()
          
          const checkAdminResponse = await fetchWithTimeout('/api/admin/check', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${currentSession.access_token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include' // Garantir que cookies sejam enviados
          }, 5000) // 5s timeout

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
                .eq('user_id', currentUser.id)
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
              .eq('user_id', currentUser.id)
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
          checkingRef.current = false // Permitir re-verificação se necessário
        }
        // Limpar timeout de segurança
        if (timeoutId) clearTimeout(timeoutId)
      } catch (error: any) {
        if (!mounted) return
        
        console.error('❌ AdminProtectedRoute: Erro geral:', error.message)
        // Limpar timeout de segurança
        if (timeoutId) clearTimeout(timeoutId)
        // Em caso de erro, garantir que o loading seja desativado
        checkingRef.current = false
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
      checkingRef.current = false
      if (timeoutId) clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [user, userProfile, authLoading]) // Re-executar quando user, userProfile ou authLoading mudarem

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
