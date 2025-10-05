import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para uso no cliente (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para uso no servidor (sem cookies por enquanto)
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Middleware para proteger rotas (versão simplificada)
export async function createMiddlewareSupabaseClient(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  return { supabase, response: NextResponse.next() }
}

// Tipos de usuário
export type UserType = 'professional' | 'user'

export interface AuthUser {
  id: string
  email: string
  user_type: UserType
  profile?: {
    name: string
    phone?: string
    specialty?: string
    company?: string
  }
}

// Funções de autenticação
export async function signUp(email: string, password: string, userType: UserType, profileData: Record<string, unknown>) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: userType,
        ...profileData
      }
    }
  })

  if (error) throw error

  // Criar perfil baseado no tipo de usuário
  if (data.user) {
    if (userType === 'professional') {
      await supabase.from('professionals').insert({
        id: data.user.id,
        name: profileData.name,
        email: email,
        phone: profileData.phone,
        specialty: profileData.specialty,
        company: profileData.company
      })
    } else {
      await supabase.from('user_profiles').insert({
        user_id: data.user.id,
        name: profileData.name,
        email: email,
        phone: profileData.phone,
        age: profileData.age,
        gender: profileData.gender
      })
    }
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function getCurrentUserProfile(userId: string) {
  // Verificar se é profissional
  const { data: professional } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', userId)
    .single()

  if (professional) {
    return { ...professional, user_type: 'professional' }
  }

  // Se não for profissional, buscar perfil de usuário
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  return userProfile ? { ...userProfile, user_type: 'user' } : null
}
