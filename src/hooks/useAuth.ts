'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient()

interface UserProfile {
  id: string
  user_id: string
  perfil: 'nutri' | 'wellness' | 'coach' | 'nutra' | 'admin' | null
  nome_completo: string | null
  email: string | null
  is_admin?: boolean
  is_support?: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserProfile = async (userId: string, useCache = true) => {
    try {
      // 🚀 OTIMIZAÇÃO: Verificar cache em sessionStorage primeiro (2 minutos de TTL)
      if (useCache && typeof window !== 'undefined') {
        const cacheKey = `user_profile_${userId}`
        const cached = sessionStorage.getItem(cacheKey)
        
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached)
            const age = Date.now() - timestamp
            const TTL = 2 * 60 * 1000 // 2 minutos
            
            if (age < TTL) {
              console.log('✅ useAuth: Perfil encontrado no cache (idade:', Math.round(age / 1000), 's)')
              return data as UserProfile
            } else {
              // Cache expirado, remover
              sessionStorage.removeItem(cacheKey)
            }
          } catch (e) {
            // Cache inválido, continuar normalmente
            sessionStorage.removeItem(cacheKey)
          }
        }
      }
      
      console.log('🔍 Buscando perfil para user_id:', userId)
      
      // Buscar perfil com apenas 1 tentativa (retry apenas em caso de erro de rede)
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, user_id, perfil, nome_completo, email, is_admin, is_support')
          .eq('user_id', userId)
          .maybeSingle()

        if (error) {
          console.error('❌ Erro ao buscar perfil:', {
            code: error.code,
            message: error.message
          })
          
          // Se for erro de RLS ou permissão, retornar null
          if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
            console.error('🚫 Erro de permissão RLS ao buscar perfil.')
            return null
          }
          
          // Se for erro de rede, tentar uma vez mais após 200ms
          if (error.message?.includes('network') || error.message?.includes('fetch')) {
            console.log('🔄 Erro de rede, tentando novamente...')
            await new Promise(resolve => setTimeout(resolve, 200))
            
            const { data: retryData, error: retryError } = await supabase
              .from('user_profiles')
              .select('id, user_id, perfil, nome_completo, email, is_admin, is_support')
              .eq('user_id', userId)
              .maybeSingle()
            
            if (retryError || !retryData) {
              return null
            }
            
            // Salvar no cache
            if (useCache && typeof window !== 'undefined') {
              const cacheKey = `user_profile_${userId}`
              sessionStorage.setItem(cacheKey, JSON.stringify({
                data: retryData,
                timestamp: Date.now()
              }))
            }
            
            return retryData as UserProfile
          }
          
          return null
        }

        if (!data) {
          console.log(`⚠️ Perfil não encontrado para user_id: ${userId}`)
          return null
        }

        console.log('✅ Perfil encontrado:', {
          id: data.id,
          perfil: data.perfil,
          is_admin: data.is_admin,
          is_support: data.is_support
        })

        // 🚀 OTIMIZAÇÃO: Salvar no cache
        if (useCache && typeof window !== 'undefined') {
          const cacheKey = `user_profile_${userId}`
          sessionStorage.setItem(cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
          }))
        }

        return data as UserProfile
      } catch (err: any) {
        console.error('❌ Erro ao buscar perfil:', err)
        return null
      }
    } catch (error: any) {
      console.error('❌ Erro geral ao buscar perfil:', {
        error,
        message: error?.message
      })
      return null
    }
  }

  useEffect(() => {
    let mounted = true
    let loadingTimeout: NodeJS.Timeout | null = null

    // Verificar se está em modo PWA (standalone)
    const isPWA = typeof window !== 'undefined' && (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    )

    const loadAuthData = async () => {
      if (!mounted) return
      
      console.log('🔄 useAuth: Iniciando carregamento...', { isPWA })
      
      try {
        // Buscar sessão uma única vez (sem retries excessivos)
        // Em PWA, dar um pouco mais de tempo para cookies serem lidos
        const sessionPromise = supabase.auth.getSession()
        const { data: { session: currentSession }, error } = await sessionPromise
        
        if (!mounted) return
        
        // 🚀 FASE 2: Fallback para localStorage se cookies falharem
        let sessionToUse = currentSession
        if (!sessionToUse && typeof window !== 'undefined') {
          try {
            // Tentar recuperar do localStorage (Supabase armazena lá também)
            const storedSession = localStorage.getItem(`sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`)
            if (storedSession) {
              console.log('🔄 useAuth: Tentando recuperar sessão do localStorage (fallback)')
              // O Supabase gerencia isso automaticamente, mas podemos forçar refresh
              const { data: { session: refreshedSession } } = await supabase.auth.refreshSession()
              if (refreshedSession) {
                sessionToUse = refreshedSession
                console.log('✅ useAuth: Sessão recuperada do localStorage')
              }
            }
          } catch (fallbackErr) {
            console.warn('⚠️ useAuth: Fallback para localStorage falhou:', fallbackErr)
          }
        }
        
        if (sessionToUse) {
          console.log('✅ useAuth: Sessão encontrada', {
            userId: sessionToUse.user?.id,
            email: sessionToUse.user?.email,
            isPWA,
            source: currentSession ? 'cookies' : 'localStorage'
          })
          
          setSession(sessionToUse)
          setUser(sessionToUse.user ?? null)
          
          // 🚀 OTIMIZAÇÃO: Tentar carregar perfil do cache primeiro (instantâneo)
          // Se cache existe, marcar loading=false imediatamente
          // Se não, buscar perfil e marcar loading=false após buscar
          if (typeof window !== 'undefined') {
            const cacheKey = `user_profile_${sessionToUse.user.id}`
            const cached = sessionStorage.getItem(cacheKey)
            
            if (cached) {
              try {
                const { data, timestamp } = JSON.parse(cached)
                const age = Date.now() - timestamp
                const TTL = 2 * 60 * 1000 // 2 minutos
                
                if (age < TTL) {
                  // Cache válido - usar imediatamente
                  console.log('✅ useAuth: Perfil encontrado no cache (instantâneo)')
                  setUserProfile(data as UserProfile)
                  setLoading(false)
                  
                  // Atualizar perfil em background (sem bloquear)
                  fetchUserProfile(sessionToUse.user.id, false)
                    .then(profile => {
                      if (!mounted) return
                      if (profile) {
                        setUserProfile(profile) // Atualizar se mudou
                      }
                    })
                    .catch(() => {
                      // Ignorar erros em background
                    })
                  return
                }
              } catch (e) {
                // Cache inválido, continuar normalmente
              }
            }
          }
          
          // Cache não encontrado ou inválido - buscar perfil
          // Marcar loading=false apenas após buscar (ou timeout)
          fetchUserProfile(sessionToUse.user.id, true)
            .then(profile => {
              if (!mounted) return
              if (profile) {
                console.log('✅ useAuth: Perfil carregado com sucesso')
              } else {
                console.warn('⚠️ useAuth: Perfil não encontrado')
              }
              setUserProfile(profile)
              setLoading(false) // Marcar loading=false apenas após buscar perfil
            })
            .catch(err => {
              if (!mounted) return
              console.error('❌ useAuth: Erro ao buscar perfil:', err?.message)
              setUserProfile(null)
              setLoading(false) // Marcar loading=false mesmo em caso de erro
            })
        } else {
          console.log('⚠️ useAuth: Nenhuma sessão encontrada', { isPWA, error })
          setSession(null)
          setUser(null)
          setUserProfile(null)
          setLoading(false)
        }
      } catch (err: any) {
        console.error('❌ useAuth: Exceção ao buscar sessão:', err)
        if (!mounted) return
        setSession(null)
        setUser(null)
        setUserProfile(null)
        setLoading(false)
      }
    }

    // 🚀 OTIMIZAÇÃO: Timeout reduzido (500ms PWA, 800ms web) - mais rápido
    // Não acionar se já temos uma sessão válida (mesmo que o perfil ainda esteja carregando)
    const timeoutDuration = isPWA ? 500 : 800
    loadingTimeout = setTimeout(() => {
      if (!mounted) return
      // Verificar se ainda está em loading e não temos sessão
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (!mounted) return
        // Se não temos sessão após timeout, marcar como não autenticado
        if (!currentSession) {
          console.warn('⚠️ useAuth: Timeout de carregamento sem sessão, marcando como não autenticado', { isPWA })
          setLoading(false)
        }
        // Se temos sessão, não fazer nada (já foi marcado como false no loadAuthData)
      })
    }, timeoutDuration)

    loadAuthData()

    // Ouvir mudanças na autenticação - isso é CRÍTICO para detectar sessão após redirecionamento
    let lastSessionId: string | null = null
    let profileLoading = false
    let lastAuthEventTime = 0
    // 🚀 OTIMIZAÇÃO: Debounce reduzido de 1000ms para 300ms - mais responsivo
    const AUTH_EVENT_DEBOUNCE = 300 // 300ms entre eventos (reduzido de 1s)
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
      // Debounce: evitar processar eventos muito próximos (especialmente quando app volta do background)
      const now = Date.now()
      const timeSinceLastEvent = now - lastAuthEventTime
      
      // Se o evento é SIGNED_OUT, sempre processar
      if (event !== 'SIGNED_OUT' && timeSinceLastEvent < AUTH_EVENT_DEBOUNCE) {
        console.log('⚠️ useAuth: Ignorando evento muito próximo do anterior:', event, `(${timeSinceLastEvent}ms)`)
        return
      }
      lastAuthEventTime = now
      
      // Evitar processar a mesma sessão múltiplas vezes
      const currentSessionId = session?.user?.id || null
      if (currentSessionId === lastSessionId && event !== 'SIGNED_OUT') {
        console.log('⚠️ useAuth: Ignorando evento duplicado:', event)
        return
      }
      lastSessionId = currentSessionId
      
      console.log('🔄 useAuth: Auth state changed:', event, {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email
      })
      
      // Atualizar estado imediatamente
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Evitar buscar perfil múltiplas vezes simultaneamente
        if (profileLoading) {
          console.log('⚠️ useAuth: Perfil já está sendo carregado, ignorando...')
          return
        }
        
        profileLoading = true
        console.log('🔍 useAuth: Buscando perfil após auth change para user_id:', session.user.id)
        
        try {
          // 🚀 OTIMIZAÇÃO: Não invalidar cache imediatamente - apenas atualizar se necessário
          // Cache será atualizado automaticamente quando perfil for buscado
          const shouldInvalidateCache = false // Sempre usar cache primeiro (mais rápido)
          
          const profile = await fetchUserProfile(session.user.id, !shouldInvalidateCache)
          if (!mounted) return
          
          if (profile) {
            console.log('✅ useAuth: Perfil carregado após auth change')
          } else {
            console.warn('⚠️ useAuth: Perfil não encontrado após auth change')
          }
          setUserProfile(profile)
        } catch (err: any) {
          if (!mounted) return
          console.error('❌ useAuth: Erro ao buscar perfil após auth change:', err?.message)
          setUserProfile(null)
        } finally {
          profileLoading = false
          setLoading(false)
        }
      } else {
        console.log('⚠️ useAuth: Sessão removida')
        // Limpar cache quando sessão é removida
        if (typeof window !== 'undefined') {
          const keys = Object.keys(sessionStorage)
          keys.forEach(key => {
            if (key.startsWith('user_profile_')) {
              sessionStorage.removeItem(key)
            }
          })
        }
        setUserProfile(null)
        setLoading(false)
      }

      console.log('✅ useAuth: Loading marcado como false após auth change')
    })

    // Adicionar listener para quando app volta do background
    // IMPORTANTE: Não reinicializar tudo, apenas verificar sessão se necessário
    let checkingSessionRef = false
    const handleVisibilityChange = () => {
      if (!mounted) return
      
      if (document.visibilityState === 'visible') {
        // App voltou ao foreground
        // Usar ref para evitar múltiplas verificações simultâneas
        if (checkingSessionRef) {
          console.log('🔄 useAuth: Já está verificando sessão após voltar do background')
          return
        }
        
        console.log('🔄 useAuth: App voltou ao foreground, verificando sessão...')
        checkingSessionRef = true
        
        // 🚀 OTIMIZAÇÃO: Verificar imediatamente (sem delay) - mais rápido
        // Usar requestAnimationFrame para evitar race conditions sem adicionar delay
        requestAnimationFrame(async () => {
          if (!mounted) {
            checkingSessionRef = false
            return
          }
          
          try {
            const { data: { session: currentSession } } = await supabase.auth.getSession()
            if (!mounted) {
              checkingSessionRef = false
              return
            }
            
            if (currentSession) {
              console.log('✅ useAuth: Sessão encontrada após voltar do background')
              setSession(currentSession)
              setUser(currentSession.user ?? null)
              setLoading(false)
              
              // Buscar perfil em background
              if (currentSession.user) {
                fetchUserProfile(currentSession.user.id, true)
                  .then(profile => {
                    if (mounted) setUserProfile(profile)
                    checkingSessionRef = false
                  })
                  .catch(() => {
                    if (mounted) setUserProfile(null)
                    checkingSessionRef = false
                  })
              } else {
                checkingSessionRef = false
              }
            } else {
              checkingSessionRef = false
            }
          } catch (err) {
            console.warn('⚠️ useAuth: Erro ao verificar sessão após voltar do background:', err)
            checkingSessionRef = false
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      mounted = false
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
      }
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = async () => {
    // 🚀 OTIMIZAÇÃO: Limpar cache ao fazer sign out
    if (typeof window !== 'undefined') {
      // Limpar cache de perfil
      const keys = Object.keys(sessionStorage)
      keys.forEach(key => {
        if (key.startsWith('user_profile_')) {
          sessionStorage.removeItem(key)
        }
      })
      
      // Limpar cache de assinatura
      try {
        const { clearAllSubscriptionCaches } = await import('@/lib/subscription-cache')
        clearAllSubscriptionCaches()
      } catch (error) {
        console.warn('⚠️ Erro ao limpar cache de assinatura:', error)
      }
    }
    
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setUserProfile(null)
    router.push('/pt')
  }

  return {
    user,
    session,
    userProfile,
    loading,
    signOut,
    isAuthenticated: !!user
  }
}

