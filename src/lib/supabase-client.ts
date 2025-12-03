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
            // MELHORIA: Usar 'lax' por padrão, mas 'none' para cookies críticos em cross-site
            // Isso melhora compatibilidade com mobile e iframes
            let sameSite = options?.sameSite || 'lax'
            
            // Se o cookie é crítico (sb-access-token, sb-refresh-token) e estamos em HTTPS,
            // usar 'none' para garantir funcionamento em todos os contextos
            if (isSecure && (name.includes('access-token') || name.includes('refresh-token'))) {
              // Verificar se precisa de 'none' (cross-site)
              // Por padrão, manter 'lax' que é mais seguro, mas permitir override
              sameSite = options?.sameSite || 'lax'
            }
            
            // Secure apenas em HTTPS (não forçar em HTTP local)
            const secure = options?.secure !== undefined ? options.secure : isSecure
            
            // Construir string do cookie
            let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}`
            
            // Adicionar Secure apenas se necessário (HTTPS)
            if (secure) {
              cookieString += '; Secure'
            }
            
            // Adicionar domain apenas se especificado (evitar problemas de subdomínio)
            if (options?.domain) {
              cookieString += `; domain=${options.domain}`
            }
            
            // Tentar setar o cookie
            try {
              document.cookie = cookieString
              
              // Verificar se o cookie foi realmente setado (importante para debug)
              const wasSet = document.cookie.includes(`${name}=`)
              if (!wasSet && name.startsWith('sb-')) {
                console.warn('⚠️ Cookie pode não ter sido setado:', name)
              }
              
              // Log apenas em desenvolvimento para debug
              if (!isProduction && name.startsWith('sb-')) {
                console.log('🍪 Cookie setado:', { name, path, secure, sameSite, wasSet })
              }
            } catch (cookieErr) {
              console.error('❌ Erro ao setar cookie individual:', name, cookieErr)
            }
          })
        } catch (err) {
          console.error('❌ Erro ao setar cookies:', err)
        }
      },
    },
  })
}

