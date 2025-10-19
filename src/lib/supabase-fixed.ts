import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Configuração global para evitar múltiplas instâncias
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

// Singleton global para evitar múltiplas instâncias
declare global {
  var __supabaseClient: SupabaseClient | undefined
  var __supabaseAdminClient: SupabaseClient | undefined
}

// Cliente único para frontend - usando singleton global
export const supabase = (() => {
  if (typeof window !== 'undefined') {
    // No browser, usar singleton global
    if (!global.__supabaseClient) {
      global.__supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storage: undefined // Desabilitar storage para evitar conflitos
        }
      })
    }
    return global.__supabaseClient
  } else {
    // No servidor, criar nova instância
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  }
})()

// Cliente único para servidor - usando singleton global
export const supabaseAdmin = (() => {
  if (typeof window !== 'undefined') {
    // No browser, usar singleton global
    if (!global.__supabaseAdminClient) {
      global.__supabaseAdminClient = createClient(
        supabaseUrl,
        serviceRoleKey || supabaseAnonKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false
          }
        }
      )
    }
    return global.__supabaseAdminClient
  } else {
    // No servidor, criar nova instância
    return createClient(
      supabaseUrl,
      serviceRoleKey || supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    )
  }
})()

// Função para limpar instâncias (útil para testes)
export function clearSupabaseInstances() {
  if (typeof window !== 'undefined') {
    global.__supabaseClient = undefined
    global.__supabaseAdminClient = undefined
  }
}

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
