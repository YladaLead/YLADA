import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente para uso no cliente (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Cliente para uso no servidor (sem cookies por enquanto)
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Middleware para proteger rotas (versão simplificada)
export async function createMiddlewareSupabaseClient() {
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
  try {
    console.log('🔐 Iniciando cadastro...', { email, userType })
    
    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          ...profileData
        }
      }
    })

    if (authError) {
      console.error('❌ Erro no auth:', authError)
      throw authError
    }

    console.log('✅ Usuário criado no auth:', authData.user?.id)

    // 2. Aguardar um pouco para garantir que o usuário foi criado
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 3. Se o usuário não foi confirmado automaticamente, tentar confirmar
    if (authData.user && !authData.user.email_confirmed_at) {
      console.log('📧 Usuário não confirmado, tentando confirmar automaticamente...')
      try {
        // Tentar fazer login para forçar confirmação (se a configuração permitir)
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (loginError) {
          console.log('⚠️ Não foi possível confirmar automaticamente:', loginError.message)
        } else {
          console.log('✅ Email confirmado automaticamente!')
        }
      } catch (confirmError) {
        console.log('⚠️ Erro na confirmação automática:', confirmError)
      }
    }

           // 4. Criar perfil na tabela professionals (apenas se não existir)
           if (authData.user) {
             console.log('📝 Verificando se perfil já existe...')
             
             // Verificar se o perfil já existe
             const { data: existingProfile, error: checkError } = await supabase
               .from('professionals')
               .select('id')
               .eq('id', authData.user.id)
               .maybeSingle()

             if (checkError) {
               console.error('❌ Erro ao verificar perfil existente:', checkError)
               // Continuar mesmo com erro de verificação
             }

             if (existingProfile) {
               console.log('✅ Perfil já existe, não criando duplicado')
             } else {
               console.log('📝 Criando novo perfil...')
               
               const { data: profileResult, error: profileError } = await supabase
                 .from('professionals')
                 .insert({
                   id: authData.user.id,
                   name: profileData.name as string,
                   email: email,
                   phone: profileData.phone as string,
                   specialty: profileData.specialty as string,
                   company: profileData.company as string
                 })
                 .select()
                 .single()

               if (profileError) {
                 console.error('❌ Erro ao criar perfil:', profileError)
                 // Se for erro de duplicação, não falhar o cadastro
                 if (profileError.code === '23505') {
                   console.log('⚠️ Perfil já existe (duplicação), continuando...')
                 } else {
                   throw profileError
                 }
               } else {
                 console.log('✅ Perfil criado:', profileResult)
               }
             }
           }

    return authData
  } catch (error) {
    console.error('❌ Erro completo no signUp:', error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    console.log('🔑 Iniciando login...', { email })
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('❌ Erro no login:', error)
      throw error
    }

    console.log('✅ Login realizado:', data.user?.id)
    return data
  } catch (error) {
    console.error('❌ Erro completo no signIn:', error)
    throw error
  }
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
  try {
    console.log('👤 Buscando perfil do usuário...', { userId })
    
    const { data: professional, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Erro ao buscar perfil:', error)
      throw error
    }

    console.log('✅ Perfil encontrado:', professional?.name)
    return professional ? { ...professional, user_type: 'professional' } : null
  } catch (error) {
    console.error('❌ Erro completo no getCurrentUserProfile:', error)
    throw error
  }
}
