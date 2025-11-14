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
    const loadAuthData = async () => {
      console.log('🔄 useAuth: Iniciando carregamento...')
      
      // 🚀 OTIMIZAÇÃO: Reduzir delay inicial de 200ms para 100ms (suficiente para página carregar)
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 🚀 OTIMIZAÇÃO: Apenas 1 tentativa de getSession (o listener onAuthStateChange cobre mudanças)
      // Isso reduz latência de 1.2s para ~100ms na maioria dos casos
      let session = null
      let sessionError = null
      
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        session = currentSession
        sessionError = error
        
        if (session) {
          console.log('✅ useAuth: Sessão encontrada')
        } else if (error) {
          console.warn('⚠️ useAuth: Erro ao buscar sessão:', error.message)
        }
      } catch (err: any) {
        console.error('❌ useAuth: Exceção ao buscar sessão:', err)
        sessionError = err
      }
      
      console.log('📋 useAuth: Sessão inicial:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id
      })
      
      setSession(session)
      setUser(session?.user ?? null)

      // 🚀 OTIMIZAÇÃO: Marcar loading como false imediatamente após primeira tentativa
      // O listener onAuthStateChange vai atualizar se a sessão mudar
      setLoading(false)
      console.log('✅ useAuth: Loading marcado como false')

      // Buscar perfil em background (não bloqueia)
      if (session?.user) {
        console.log('🔍 useAuth: Buscando perfil em background para user_id:', session.user.id)
        // Não esperar - buscar em background (com cache)
        fetchUserProfile(session.user.id, true)
          .then(profile => {
            if (profile) {
              console.log('✅ useAuth: Perfil carregado com sucesso')
            } else {
              console.warn('⚠️ useAuth: Perfil não encontrado')
            }
            setUserProfile(profile)
          })
          .catch(err => {
            console.error('❌ useAuth: Erro ao buscar perfil em background:', err?.message)
            // Mesmo com erro, não bloquear - permitir acesso sem perfil
            setUserProfile(null)
          })
      } else {
        console.log('⚠️ useAuth: Nenhuma sessão encontrada')
        // Se não há sessão, garantir que userProfile também seja null
        setUserProfile(null)
      }
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
      
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        console.log('🔍 useAuth: Buscando perfil após auth change para user_id:', session.user.id)
        try {
          // 🚀 OTIMIZAÇÃO: Usar cache também após auth change (mas invalidar se necessário)
          const profile = await fetchUserProfile(session.user.id, true)
          if (profile) {
            console.log('✅ useAuth: Perfil carregado após auth change')
          } else {
            console.warn('⚠️ useAuth: Perfil não encontrado após auth change')
          }
          setUserProfile(profile)
        } catch (err: any) {
          console.error('❌ useAuth: Erro ao buscar perfil após auth change:', err?.message)
          // Mesmo com erro, não bloquear - permitir acesso sem perfil
          setUserProfile(null)
        }
      } else {
        console.log('⚠️ useAuth: Sessão removida')
        // 🚀 OTIMIZAÇÃO: Limpar cache quando sessão é removida
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

    return () => subscription.unsubscribe()
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

