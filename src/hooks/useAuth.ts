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

    const loadAuthData = async () => {
      if (!mounted) return
      
      console.log('🔄 useAuth: Iniciando carregamento...')
      
      try {
        // Buscar sessão uma única vez (sem retries excessivos)
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (currentSession) {
          console.log('✅ useAuth: Sessão encontrada', {
            userId: currentSession.user?.id,
            email: currentSession.user?.email
          })
          
          setSession(currentSession)
          setUser(currentSession.user ?? null)

          // Buscar perfil em background (não bloqueia)
          fetchUserProfile(currentSession.user.id, true)
            .then(profile => {
              if (!mounted) return
              if (profile) {
                console.log('✅ useAuth: Perfil carregado com sucesso')
              } else {
                console.warn('⚠️ useAuth: Perfil não encontrado')
              }
              setUserProfile(profile)
              setLoading(false)
            })
            .catch(err => {
              if (!mounted) return
              console.error('❌ useAuth: Erro ao buscar perfil:', err?.message)
              setUserProfile(null)
              setLoading(false)
            })
        } else {
          console.log('⚠️ useAuth: Nenhuma sessão encontrada')
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

    // Timeout de segurança: se não carregar em 5 segundos, marcar como não autenticado
    loadingTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('⚠️ useAuth: Timeout de carregamento, marcando como não autenticado')
        setLoading(false)
      }
    }, 5000)

    loadAuthData()

    // Ouvir mudanças na autenticação - isso é CRÍTICO para detectar sessão após redirecionamento
    let lastSessionId: string | null = null
    let profileLoading = false
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      
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
          // Invalidar cache após login para garantir dados atualizados
          const shouldInvalidateCache = event === 'SIGNED_IN'
          if (shouldInvalidateCache && typeof window !== 'undefined') {
            const cacheKey = `user_profile_${session.user.id}`
            sessionStorage.removeItem(cacheKey)
          }
          
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

    return () => {
      mounted = false
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
      }
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

