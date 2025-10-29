import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Singleton pattern para evitar múltiplas instâncias
let supabaseInstance: SupabaseClient | null = null
let supabaseAdminInstance: SupabaseClient | null = null

// Cliente para o frontend (com autenticação)
export const supabase = (() => {
  // Verificar se as variáveis de ambiente existem
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase não configurado: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrados')
    // Retornar um cliente mock para evitar erros durante desenvolvimento
    return null as unknown as SupabaseClient
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  }
  return supabaseInstance
})()

// Cliente para operações do servidor (API routes)
export const supabaseAdmin = (() => {
  // Verificar se as variáveis de ambiente existem
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Supabase Admin não configurado: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados')
    // Retornar um cliente mock para evitar erros durante desenvolvimento
    return null as unknown as SupabaseClient
  }
  
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  }
  return supabaseAdminInstance
})()