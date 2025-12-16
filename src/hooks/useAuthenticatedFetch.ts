'use client'

import { useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'

/**
 * Hook que retorna uma função fetch autenticada
 * Automaticamente adiciona access token no header quando disponível
 * Aguarda até 3 segundos para sessão carregar antes de fazer requisição
 * Resolve problemas de sincronização de cookies e race conditions
 */
export function useAuthenticatedFetch() {
  const authenticatedFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const supabase = createClient()
    
    // 🚀 CORREÇÃO: Aguardar até 3 segundos para sessão carregar
    // Evita fazer requisições quando autenticação ainda está carregando
    let accessToken: string | null = null
    const maxWaitTime = 3000 // 3 segundos
    const checkInterval = 100 // Verificar a cada 100ms
    let elapsed = 0
    
    while (elapsed < maxWaitTime) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
          accessToken = session.access_token
          break // Sessão encontrada, sair do loop
        }
      } catch (err) {
        // Se falhar, continuar tentando
      }
      
      // Aguardar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, checkInterval))
      elapsed += checkInterval
    }
    
    // Se ainda não tem token após aguardar, tentar uma última vez
    if (!accessToken) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
          accessToken = session.access_token
        }
      } catch (err) {
        // Se falhar, continuar sem token (vai tentar com cookies)
      }
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

