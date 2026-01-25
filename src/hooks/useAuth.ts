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
  const [isStable, setIsStable] = useState(false) // Flag para indicar quando estado está completamente consolidado
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
      
      // 🚨 CORREÇÃO: Adicionar timeout para evitar travamento
      // Criar uma Promise com timeout de 15 segundos (aumentado)
      const profileQuery = supabase
        .from('user_profiles')
        .select('id, user_id, perfil, nome_completo, email, is_admin, is_support')
        .eq('user_id', userId)
        .maybeSingle()
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout ao buscar perfil (15s)')), 15000)
      })
      
      // Buscar perfil com timeout de 15 segundos
      try {
        const { data, error } = await Promise.race([
          profileQuery,
          timeoutPromise
        ]) as any

        if (error) {
          // Se for timeout, apenas logar como warning (não é crítico)
          if (error.message?.includes('Timeout')) {
            console.warn('⚠️ Timeout ao buscar perfil (15s) - continuando sem perfil')
            return null
          }
          
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
      
      // Verificar se supabase está configurado
      if (!supabase) {
        console.warn('⚠️ useAuth: Supabase não está configurado. Verifique as variáveis de ambiente.')
        setLoading(false)
        setIsStable(true)
        return
      }
      
      console.log('🔄 useAuth: Iniciando carregamento...', { isPWA })
      setIsStable(false) // Marcar como instável durante carregamento
      
      try {
        // Buscar sessão uma única vez (sem retries excessivos)
        // Em PWA, dar um pouco mais de tempo para cookies serem lidos
        const sessionPromise = supabase.auth.getSession()
        const { data: { session: currentSession }, error } = await sessionPromise
        
        if (!mounted) return
        
        // 🚀 FASE 2: Fallback para localStorage se cookies falharem
        let sessionToUse = currentSession
        if (!sessionToUse && typeof window !== 'undefined' && supabase) {
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
                      setIsStable(true) // Estável após carregar perfil do cache
                    })
                    .catch(() => {
                      // Ignorar erros em background
                      if (mounted) setIsStable(true) // Estável mesmo em erro
                    })
                  setIsStable(true) // Estável quando usa cache
                  return
                }
              } catch (e) {
                // Cache inválido, continuar normalmente
              }
            }
          }
          
          // Cache não encontrado ou inválido - buscar perfil
          // Marcar loading=false apenas após buscar (ou timeout)
          // 🚨 CORREÇÃO: Adicionar timeout para evitar travamento
          const profilePromise = fetchUserProfile(sessionToUse.user.id, true)
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout ao buscar perfil (15s)')), 15000)
          })
          
          Promise.race([profilePromise, timeoutPromise])
            .then(profile => {
              if (!mounted) return
              if (profile) {
                console.log('✅ useAuth: Perfil carregado com sucesso')
              } else {
                console.warn('⚠️ useAuth: Perfil não encontrado')
              }
              setUserProfile(profile as UserProfile | null)
              setLoading(false) // Marcar loading=false apenas após buscar perfil
            })
            .catch(err => {
              if (!mounted) return
              // Se for timeout, apenas logar como warning (não é crítico)
              if (err?.message?.includes('Timeout')) {
                console.warn('⚠️ useAuth: Timeout ao buscar perfil (15s) - continuando sem perfil')
              } else {
                console.error('❌ useAuth: Erro ao buscar perfil:', err?.message || err)
              }
              setUserProfile(null)
              setLoading(false) // Marcar loading=false mesmo em caso de erro ou timeout
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

    // 🚀 CORREÇÃO: Timeout aumentado significativamente para evitar race conditions
    // O problema era que o timeout disparava ANTES do SIGNED_IN chegar
    // PWA: 6000ms, Web: 8000ms (aumentado para dar mais tempo)
    const timeoutDuration = isPWA ? 6000 : 8000
    loadingTimeout = setTimeout(() => {
      if (!mounted) return
      if (!supabase) {
        setLoading(false)
        setIsStable(true)
        return
      }
      // Verificar se ainda está em loading e não temos sessão
      supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
        if (!mounted) return
        // Se não temos sessão após timeout, marcar como não autenticado
        // Mas apenas se realmente não há sessão (não marcar prematuramente)
        if (!currentSession) {
          console.warn('⚠️ useAuth: Timeout de carregamento sem sessão após', timeoutDuration, 'ms', { isPWA })
          // 🚀 CORREÇÃO: Aguardar mais tempo antes de confirmar ausência
          // Especialmente importante após redirecionamento de login
          setTimeout(() => {
            if (!mounted) return
            // Verificar novamente antes de marcar como não autenticado
            if (!supabase) {
              setLoading(false)
              setIsStable(true)
              return
            }
            supabase.auth.getSession().then(({ data: { session: finalSession } }) => {
              if (!mounted) return
              if (!finalSession && supabase) {
                // Tentar refresh da sessão como último recurso
                supabase.auth.refreshSession().then(({ data: { session: refreshedSession } }) => {
                  if (!mounted) return
                  if (refreshedSession) {
                    console.log('✅ useAuth: Sessão recuperada via refresh após timeout')
                    setSession(refreshedSession)
                    setUser(refreshedSession.user)
                    // Buscar perfil
                    fetchUserProfile(refreshedSession.user.id, true).then(profile => {
                      if (mounted) {
                        setUserProfile(profile)
                        setLoading(false)
                        setIsStable(true)
                      }
                    })
                  } else {
                    console.warn('⚠️ useAuth: Confirmando ausência de sessão após timeout estendido')
                    setLoading(false)
                    setIsStable(true)
                  }
                })
              } else {
                console.log('✅ useAuth: Sessão encontrada após timeout estendido')
                setSession(finalSession)
                setUser(finalSession.user)
                setLoading(false)
                setIsStable(true)
              }
            })
          }, 2000) // Aguardar 2 segundos antes de confirmar ausência (aumentado de 1s)
        } else {
          // Se temos sessão mas ainda está em loading, aguardar mais um pouco
          // Isso evita marcar como não autenticado quando a sessão está carregando
          console.log('✅ useAuth: Sessão encontrada durante timeout, aguardando carregamento completo')
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
    
    if (!supabase) {
      setLoading(false)
      setIsStable(true)
      return () => {}
    }
    
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
      
      // Atualizar estado imediatamente - PRIMEIRO setar user/session
      // DEPOIS setar loading=false para garantir que componentes vejam os valores corretos
      setSession(session)
      setUser(session?.user ?? null)
      
      // 🚀 CORREÇÃO: Quando SIGNED_IN chega, garantir que loading seja false
      // Isso resolve race condition onde timeout marca como não autenticado antes do evento chegar
      // IMPORTANTE: Setar loading DEPOIS de user/session para que componentes
      // vejam os valores corretos quando loading mudar
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ useAuth: SIGNED_IN detectado, garantindo que loading seja false')
        // Usar requestAnimationFrame para garantir que o React processe user/session primeiro
        requestAnimationFrame(() => {
          setLoading(false) // Forçar loading=false quando SIGNED_IN chega
          setIsStable(true) // Marcar como estável
        })
      }

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

          // 🚨 CORREÇÃO: Adicionar timeout para evitar travamento
          const profilePromise = fetchUserProfile(session.user.id, !shouldInvalidateCache)
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Timeout ao buscar perfil após auth change (10s)')), 10000)
          })
          
          const profile = await Promise.race([profilePromise, timeoutPromise]) as UserProfile | null
          if (!mounted) return

          if (profile) {
            console.log('✅ useAuth: Perfil carregado após auth change')
          } else {
            console.warn('⚠️ useAuth: Perfil não encontrado após auth change')
          }
          setUserProfile(profile)
          setLoading(false) // 🚨 IMPORTANTE: Garantir que loading seja false mesmo se perfil não for encontrado
        } catch (err: any) {
          if (!mounted) return
          console.error('❌ useAuth: Erro ao buscar perfil após auth change:', err?.message || err)
          setUserProfile(null)
          setLoading(false) // 🚨 IMPORTANTE: Garantir que loading seja false em caso de erro ou timeout
        } finally {
          profileLoading = false
          if (mounted) {
            setLoading(false) // Garantir que loading seja false no finally também
          }
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
            if (!supabase) {
              checkingSessionRef = false
              return
            }
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
    
    // Detectar área atual baseado na URL para redirecionar para login da mesma área
    let redirectPath = '/pt' // padrão: página inicial
    
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      
      // Detectar área baseado no path
      if (currentPath.includes('/nutri/')) {
        redirectPath = '/pt/nutri/login'
      } else if (currentPath.includes('/coach/')) {
        redirectPath = '/pt/coach/login'
      } else if (currentPath.includes('/wellness/')) {
        redirectPath = '/pt/wellness/login'
      } else if (currentPath.includes('/nutra/')) {
        redirectPath = '/pt/nutra/login'
      } else if (currentPath.includes('/admin/')) {
        redirectPath = '/admin/login'
      }
    }
    
    if (!supabase) {
      console.warn('⚠️ signOut: Supabase não está configurado')
      setUser(null)
      setSession(null)
      setUserProfile(null)
      router.push(redirectPath)
      return
    }
    
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setUserProfile(null)
    router.push(redirectPath)
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

