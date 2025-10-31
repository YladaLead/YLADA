'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  user_id: string
  perfil: 'nutri' | 'wellness' | 'coach' | 'nutra' | 'admin' | null
  nome_completo: string | null
  email: string | null
  is_admin?: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return null
    }
  }

  useEffect(() => {
    const loadAuthData = async () => {
      // Obter sessão inicial
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      // Se houver usuário, buscar perfil
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        setUserProfile(profile)
      }

      setLoading(false)
    }

    loadAuthData()

    // Ouvir mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
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

