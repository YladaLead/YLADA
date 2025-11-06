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

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 Buscando perfil para user_id:', userId)
      
      // Usar maybeSingle() ao invés de single() para não dar erro se não encontrar
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_id, perfil, nome_completo, email, is_admin, is_support')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('❌ Erro ao buscar perfil:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        
        // Se for erro de RLS ou permissão, logar especificamente
        if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
          console.error('🚫 Erro de permissão RLS ao buscar perfil. Verifique as políticas RLS.')
        }
        
        return null
      }

      if (!data) {
        console.log('⚠️ Perfil não encontrado para user_id:', userId)
        return null
      }

      console.log('✅ Perfil encontrado:', {
        id: data.id,
        perfil: data.perfil,
        is_admin: data.is_admin,
        is_support: data.is_support,
        email: data.email,
        nome_completo: data.nome_completo
      })

      return data as UserProfile
    } catch (error: any) {
      console.error('❌ Erro geral ao buscar perfil:', {
        error,
        message: error?.message,
        stack: error?.stack
      })
      // Retornar null mas não bloquear o fluxo
      return null
    }
  }

  useEffect(() => {
    const loadAuthData = async () => {
      console.log('🔄 useAuth: Iniciando carregamento...')
      
      // Aguardar um pouco para garantir que a página carregou completamente
      // Isso é importante após redirecionamentos
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Tentar obter sessão múltiplas vezes se necessário
      let session = null
      let attempts = 0
      const maxAttempts = 3
      
      while (!session && attempts < maxAttempts) {
        attempts++
        console.log(`🔍 useAuth: Tentativa ${attempts} de obter sessão...`)
        
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
        
        if (currentSession) {
          session = currentSession
          console.log('✅ useAuth: Sessão encontrada na tentativa', attempts)
          break
        } else {
          console.log(`⚠️ useAuth: Sessão não encontrada na tentativa ${attempts}`, {
            error: sessionError?.message
          })
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 300))
          }
        }
      }
      
      console.log('📋 useAuth: Sessão final:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email
      })
      
      setSession(session)
      setUser(session?.user ?? null)

      // Marcar como não loading imediatamente para não bloquear UI
      setLoading(false)
      console.log('✅ useAuth: Loading marcado como false')

      // Buscar perfil em background (não bloqueia)
      if (session?.user) {
        console.log('🔍 useAuth: Buscando perfil em background...')
        // Não esperar - buscar em background
        fetchUserProfile(session.user.id).then(profile => {
          console.log('✅ useAuth: Perfil carregado:', profile ? 'Sim' : 'Não')
          setUserProfile(profile)
        }).catch(err => {
          console.error('❌ useAuth: Erro ao buscar perfil em background:', err)
        })
      } else {
        console.log('⚠️ useAuth: Nenhuma sessão encontrada após todas as tentativas')
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
        console.log('🔍 useAuth: Buscando perfil após auth change...')
        const profile = await fetchUserProfile(session.user.id)
        console.log('✅ useAuth: Perfil carregado após auth change:', profile ? 'Sim' : 'Não')
        setUserProfile(profile)
      } else {
        console.log('⚠️ useAuth: Sessão removida')
        setUserProfile(null)
      }

      setLoading(false)
      console.log('✅ useAuth: Loading marcado como false após auth change')
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
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

