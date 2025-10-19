import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Configuração mais simples para evitar conflitos
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

// Cliente único para frontend - sem persistência de sessão
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})

// Cliente único para servidor
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey || supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
)

// Função para testar conexão
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabaseAdmin
      .from('templates_base')
      .select('count')
      .limit(1)

    return {
      success: !error,
      error: error?.message,
      data
    }
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    }
  }
}
