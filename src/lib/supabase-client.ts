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
  const isProduction = process.env.NODE_ENV === 'production'
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // Verificar se estamos no browser antes de acessar document
        if (typeof document === 'undefined') {
          return []
        }
        try {
          return document.cookie.split(';').map(cookie => {
            const [name, ...rest] = cookie.split('=')
            return { name: name.trim(), value: rest.join('=') }
          }).filter(cookie => cookie.name && cookie.value)
        } catch (err) {
          console.error('❌ Erro ao ler cookies:', err)
          return []
        }
      },
      setAll(cookiesToSet) {
        // Verificar se estamos no browser antes de acessar document
        if (typeof document === 'undefined') {
          return
        }
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Configurações padrão para produção
            const path = options?.path || '/'
            const maxAge = options?.maxAge || (60 * 60 * 24 * 7) // 7 dias padrão
            const sameSite = options?.sameSite || (isProduction ? 'lax' : 'lax')
            const secure = options?.secure !== undefined ? options.secure : (isSecure || isProduction)
            
            // Construir string do cookie
            let cookieString = `${name}=${value}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}`
            
            // Adicionar Secure apenas se necessário (HTTPS ou produção)
            if (secure) {
              cookieString += '; Secure'
            }
            
            // Adicionar domain apenas se especificado
            if (options?.domain) {
              cookieString += `; domain=${options.domain}`
            }
            
            document.cookie = cookieString
            
            // Log apenas em desenvolvimento para debug
            if (!isProduction && name.startsWith('sb-')) {
              console.log('🍪 Cookie setado:', { name, path, secure, sameSite })
            }
          })
        } catch (err) {
          console.error('❌ Erro ao setar cookies:', err)
        }
      },
    },
  })
}

