'use client'

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'

/**
 * Hook que retorna uma função fetch autenticada
 * Automaticamente adiciona access token no header quando disponível
 * Resolve problemas de sincronização de cookies
 */
export function useAuthenticatedFetch() {
  const authenticatedFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const supabase = createClient()
    
    // Obter access token da sessão atual
    let accessToken: string | null = null
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        accessToken = session.access_token
      }
    } catch (err) {
      // Se falhar, continuar sem token (vai tentar com cookies)
    }

    // Preparar headers
    const headers = new Headers(options.headers || {})
    
    // Adicionar access token se disponível (fallback quando cookies falharem)
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }

    // Garantir que credentials está incluído para cookies
    const fetchOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // Sempre incluir cookies
    }

    return fetch(url, fetchOptions)
  }, [])

  return authenticatedFetch
}

