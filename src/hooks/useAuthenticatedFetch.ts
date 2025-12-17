'use client'

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'

/**
 * Hook que retorna uma função fetch autenticada
 * Automaticamente adiciona access token no header quando disponível
 * Aguarda até 3 segundos para sessão carregar antes de fazer requisição
 * Resolve problemas de sincronização de cookies e race conditions
 * 
 * MELHORIAS PARA RESOLVER PROBLEMA DA MONICA:
 * - Tenta múltiplas estratégias para obter token
 * - Força refresh da sessão se necessário
 * - Logs detalhados para debug
 */
export function useAuthenticatedFetch() {
  const authenticatedFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const supabase = createClient()
    const isDev = process.env.NODE_ENV === 'development'
    
    // 🚀 ESTRATÉGIA 1: Aguardar até 3 segundos para sessão carregar
    // Evita fazer requisições quando autenticação ainda está carregando
    let accessToken: string | null = null
    const maxWaitTime = 3000 // 3 segundos
    const checkInterval = 100 // Verificar a cada 100ms
    let elapsed = 0
    
    while (elapsed < maxWaitTime) {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (session?.access_token) {
          accessToken = session.access_token
          if (isDev) {
            console.log('✅ [useAuthenticatedFetch] Token obtido via getSession()')
          }
          break // Sessão encontrada, sair do loop
        }
        if (sessionError && isDev) {
          console.warn('⚠️ [useAuthenticatedFetch] Erro ao obter sessão:', sessionError.message)
        }
      } catch (err: any) {
        if (isDev) {
          console.warn('⚠️ [useAuthenticatedFetch] Exceção ao obter sessão:', err?.message)
        }
      }
      
      // Aguardar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, checkInterval))
      elapsed += checkInterval
    }
    
    // 🚀 ESTRATÉGIA 2: Se ainda não tem token, tentar getUser() (valida com servidor)
    if (!accessToken) {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (user && !userError) {
          // Se getUser() funcionou mas não temos token, tentar refresh
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
          if (refreshedSession?.access_token) {
            accessToken = refreshedSession.access_token
            if (isDev) {
              console.log('✅ [useAuthenticatedFetch] Token obtido via refreshSession() após getUser()')
            }
          } else if (isDev) {
            console.warn('⚠️ [useAuthenticatedFetch] getUser() OK mas refreshSession() falhou:', refreshError?.message)
          }
        } else if (isDev) {
          console.warn('⚠️ [useAuthenticatedFetch] getUser() falhou:', userError?.message)
        }
      } catch (err: any) {
        if (isDev) {
          console.warn('⚠️ [useAuthenticatedFetch] Exceção ao tentar getUser():', err?.message)
        }
      }
    }
    
    // 🚀 ESTRATÉGIA 3: Tentar getSession() uma última vez
    if (!accessToken) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
          accessToken = session.access_token
          if (isDev) {
            console.log('✅ [useAuthenticatedFetch] Token obtido na tentativa final')
          }
        }
      } catch (err) {
        // Se falhar, continuar sem token (vai tentar com cookies)
        if (isDev) {
          console.warn('⚠️ [useAuthenticatedFetch] Tentativa final falhou, continuando sem token (vai usar cookies)')
        }
      }
    }

    // Preparar headers
    const headers = new Headers(options.headers || {})
    
    // Adicionar access token se disponível (fallback quando cookies falharem)
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
      if (isDev) {
        console.log('✅ [useAuthenticatedFetch] Authorization header adicionado')
      }
    } else {
      if (isDev) {
        console.warn('⚠️ [useAuthenticatedFetch] Nenhum token encontrado, requisição dependerá apenas de cookies')
      }
    }

    // Garantir que credentials está incluído para cookies
    const fetchOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Sempre incluir cookies
    }

    if (isDev) {
      console.log('📤 [useAuthenticatedFetch] Fazendo requisição para:', url, {
        hasToken: !!accessToken,
        hasCredentials: fetchOptions.credentials === 'include'
      })
    }

    return fetch(url, fetchOptions)
  }, [])

  return authenticatedFetch
}

