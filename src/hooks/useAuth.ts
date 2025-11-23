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
      
      // 🚀 OTIMIZAÇÃO: Reduzir de 3 para 2 tentativas (suficiente para erros de rede temporários)
      let lastError = null
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('id, user_id, perfil, nome_completo, email, is_admin, is_support')
            .eq('user_id', userId)
            .maybeSingle()

          if (error) {
            console.error(`❌ Erro ao buscar perfil (tentativa ${attempt}/2):`, {
              code: error.code,
              message: error.message
            })
            
            // Se for erro de RLS ou permissão, não tentar novamente
            if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
              console.error('🚫 Erro de permissão RLS ao buscar perfil.')
              break
            }
            
            lastError = error
            // Se não for erro de rede, não tentar novamente
            if (!error.message?.includes('network')) {
              break
            }
            
            // Aguardar antes de tentar novamente (apenas se for última tentativa)
            if (attempt < 2) {
              await new Promise(resolve => setTimeout(resolve, 300)) // Reduzido de 500ms para 300ms
            }
            continue
          }

          if (!data) {
            console.log(`⚠️ Perfil não encontrado para user_id: ${userId} (tentativa ${attempt}/2)`)
            if (attempt < 2) {
              await new Promise(resolve => setTimeout(resolve, 300))
              continue
            }
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
          console.error(`❌ Erro na tentativa ${attempt}/2:`, err)
          lastError = err
          if (attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 300))
          }
        }
      }
      
      // Se chegou aqui, todas as tentativas falharam
      console.error('❌ Todas as tentativas de buscar perfil falharam')
      return null
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
    let retryCount = 0
    const MAX_RETRIES = 3
    const RETRY_DELAY = 500

    const loadAuthData = async (isRetry = false) => {
      if (!mounted) return
      
      console.log(`🔄 useAuth: ${isRetry ? `Tentativa ${retryCount}/${MAX_RETRIES}` : 'Iniciando carregamento'}...`)
      
      // Aguardar um pouco para garantir que cookies/localStorage foram carregados
      if (!isRetry) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      let session = null
      let sessionError = null
      
      try {
        // Tentar obter sessão com retry logic
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        session = currentSession
        sessionError = error
        
        if (session) {
          console.log('✅ useAuth: Sessão encontrada', {
            userId: session.user?.id,
            email: session.user?.email
          })
        } else if (error) {
          console.warn('⚠️ useAuth: Erro ao buscar sessão:', error.message)
        } else {
          console.log('⚠️ useAuth: Nenhuma sessão encontrada')
        }
      } catch (err: any) {
        console.error('❌ useAuth: Exceção ao buscar sessão:', err)
        sessionError = err
      }
      
      // Se não encontrou sessão e ainda há tentativas, tentar novamente
      if (!session && retryCount < MAX_RETRIES && mounted) {
        retryCount++
        console.log(`⏳ useAuth: Tentando novamente em ${RETRY_DELAY}ms... (${retryCount}/${MAX_RETRIES})`)
        setTimeout(() => {
          if (mounted) {
            loadAuthData(true)
          }
        }, RETRY_DELAY)
        return // Não atualizar estado ainda
      }
      
      if (!mounted) return
      
      console.log('📋 useAuth: Sessão inicial:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        retryCount
      })
      
      setSession(session)
      setUser(session?.user ?? null)

      // Buscar perfil em background (não bloqueia)
      if (session?.user) {
        console.log('🔍 useAuth: Buscando perfil em background para user_id:', session.user.id)
        fetchUserProfile(session.user.id, true)
          .then(profile => {
            if (!mounted) return
            if (profile) {
              console.log('✅ useAuth: Perfil carregado com sucesso')
            } else {
              console.warn('⚠️ useAuth: Perfil não encontrado')
            }
            setUserProfile(profile)
          })
          .catch(err => {
            if (!mounted) return
            console.error('❌ useAuth: Erro ao buscar perfil em background:', err?.message)
            setUserProfile(null)
          })
      } else {
        console.log('⚠️ useAuth: Nenhuma sessão encontrada após todas as tentativas')
        setUserProfile(null)
      }

      // Marcar loading como false apenas após todas as tentativas
      setLoading(false)
      console.log('✅ useAuth: Loading marcado como false')
    }

    loadAuthData()

    // Ouvir mudanças na autenticação - isso é CRÍTICO para detectar sessão após redirecionamento
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 useAuth: Auth state changed:', event, {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email
      })
      
      // Atualizar estado imediatamente
      setSession(session)
      setUser(session?.user ?? null)

      // Para eventos de login/signin, verificar sessão novamente após um pequeno delay
      // Isso garante que cookies foram persistidos
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        console.log('🔍 useAuth: Evento de login detectado, verificando sessão novamente...')
        
        // Aguardar um pouco para garantir que cookies foram persistidos
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Verificar sessão novamente para garantir consistência
        try {
          const { data: { session: verifiedSession } } = await supabase.auth.getSession()
          if (verifiedSession && verifiedSession.user.id === session.user.id) {
            console.log('✅ useAuth: Sessão verificada e consistente')
            setSession(verifiedSession)
            setUser(verifiedSession.user)
          }
        } catch (verifyErr) {
          console.warn('⚠️ useAuth: Erro ao verificar sessão após login:', verifyErr)
        }
      }

      if (session?.user) {
        console.log('🔍 useAuth: Buscando perfil após auth change para user_id:', session.user.id)
        try {
          // Invalidar cache após login para garantir dados atualizados
          const shouldInvalidateCache = event === 'SIGNED_IN'
          if (shouldInvalidateCache && typeof window !== 'undefined') {
            const cacheKey = `user_profile_${session.user.id}`
            sessionStorage.removeItem(cacheKey)
          }
          
          const profile = await fetchUserProfile(session.user.id, !shouldInvalidateCache)
          if (profile) {
            console.log('✅ useAuth: Perfil carregado após auth change')
          } else {
            console.warn('⚠️ useAuth: Perfil não encontrado após auth change')
          }
          setUserProfile(profile)
        } catch (err: any) {
          console.error('❌ useAuth: Erro ao buscar perfil após auth change:', err?.message)
          setUserProfile(null)
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
      }

      setLoading(false)
      console.log('✅ useAuth: Loading marcado como false após auth change')
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    // 🚀 OTIMIZAÇÃO: Limpar cache ao fazer sign out
    if (typeof window !== 'undefined') {
      const keys = Object.keys(sessionStorage)
      keys.forEach(key => {
        if (key.startsWith('user_profile_')) {
          sessionStorage.removeItem(key)
        }
      })
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

