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
      
      // Tentar buscar com retry (até 3 tentativas)
      let lastError = null
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('id, user_id, perfil, nome_completo, email, is_admin, is_support')
            .eq('user_id', userId)
            .maybeSingle()

          if (error) {
            console.error(`❌ Erro ao buscar perfil (tentativa ${attempt}/3):`, {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint
            })
            
            // Se for erro de RLS ou permissão, logar especificamente
            if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
              console.error('🚫 Erro de permissão RLS ao buscar perfil. Verifique as políticas RLS.')
            }
            
            lastError = error
            // Se não for erro de rede, não tentar novamente
            if (error.code !== 'PGRST301' && !error.message?.includes('network')) {
              break
            }
            
            // Aguardar antes de tentar novamente
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 500))
            }
            continue
          }

          if (!data) {
            console.log(`⚠️ Perfil não encontrado para user_id: ${userId} (tentativa ${attempt}/3)`)
            if (attempt < 3) {
              await new Promise(resolve => setTimeout(resolve, 500))
              continue
            }
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
        } catch (err: any) {
          console.error(`❌ Erro na tentativa ${attempt}/3:`, err)
          lastError = err
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }
      }
      
      // Se chegou aqui, todas as tentativas falharam
      console.error('❌ Todas as tentativas de buscar perfil falharam')
      return null
    } catch (error: any) {
      console.error('❌ Erro geral ao buscar perfil:', {
        error,
        message: error?.message,
        stack: error?.stack
      })
      return null
    }
  }

  useEffect(() => {
    const loadAuthData = async () => {
      console.log('🔄 useAuth: Iniciando carregamento...')
      
      // Aguardar um pouco para garantir que a página carregou completamente
      // Isso é importante após redirecionamentos - aumentado para dar mais tempo
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Tentar obter sessão (otimizado - apenas 1 tentativa inicial, depois o listener cuida)
      console.log('🔍 useAuth: Tentando obter sessão...')
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession()
      
      let session = currentSession
      
      if (session) {
        console.log('✅ useAuth: Sessão encontrada imediatamente')
      } else {
        console.log('⚠️ useAuth: Sessão não encontrada inicialmente', {
          error: sessionError?.message
        })
        // Se não encontrou sessão, tentar novamente após um pouco mais de tempo
        // Isso ajuda após redirecionamentos do login
        await new Promise(resolve => setTimeout(resolve, 500))
        const { data: { session: retrySession } } = await supabase.auth.getSession()
        if (retrySession) {
          console.log('✅ useAuth: Sessão encontrada após retry')
          session = retrySession
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

