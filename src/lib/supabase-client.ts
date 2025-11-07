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

  // createBrowserClient do @supabase/ssr gerencia cookies automaticamente
  // Ele usa localStorage para persistir a sessão e sincroniza com cookies
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // Verificar se estamos no browser antes de acessar document
        if (typeof document === 'undefined') {
          return []
        }
        return document.cookie.split(';').map(cookie => {
          const [name, ...rest] = cookie.split('=')
          return { name: name.trim(), value: rest.join('=') }
        })
      },
      setAll(cookiesToSet) {
        // Verificar se estamos no browser antes de acessar document
        if (typeof document === 'undefined') {
          return
        }
        cookiesToSet.forEach(({ name, value, options }) => {
          document.cookie = `${name}=${value}; path=${options?.path || '/'}; ${options?.maxAge ? `max-age=${options.maxAge};` : ''} ${options?.domain ? `domain=${options.domain};` : ''} ${options?.sameSite ? `SameSite=${options.sameSite};` : ''} ${options?.secure ? 'Secure;' : ''}`
        })
      },
    },
  })
}

