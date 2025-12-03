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
// NOTA: Esta função só deve ser usada no SERVIDOR (API routes), nunca no browser
export const supabaseAdmin = (() => {
  // Só executar no servidor (typeof window === 'undefined')
  if (typeof window !== 'undefined') {
    // No browser, retornar null silenciosamente (não logar avisos)
    return null as unknown as SupabaseClient
  }
  
  // No servidor, verificar variáveis de ambiente
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    console.error('❌ [SERVER] Supabase Admin não configurado:')
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', url ? '✅' : '❌')
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', key ? '✅' : '❌')
    return null as unknown as SupabaseClient
  }
  
  if (!supabaseAdminInstance) {
    console.log('✅ [SERVER] Criando instância do Supabase Admin...')
    supabaseAdminInstance = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  }
  return supabaseAdminInstance
})()