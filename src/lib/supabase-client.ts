'use client'

import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Cliente Supabase para o browser (com persistência correta de cookies)
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase não configurado: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrados')
    return null as unknown as SupabaseClient
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

