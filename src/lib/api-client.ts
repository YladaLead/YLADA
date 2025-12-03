/**
 * Cliente de API que automaticamente adiciona autenticação
 * Resolve problemas de sincronização de cookies enviando access token no header
 */

import { createClient } from './supabase-client'

/**
 * Wrapper para fetch que automaticamente adiciona autenticação
 * Tenta usar cookies primeiro, mas se falhar, usa access token do header
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const supabase = createClient()
  
  // Obter sessão atual
  let accessToken: string | null = null
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      accessToken = session.access_token
    }
  } catch (err) {
    // Se falhar ao obter sessão, continuar sem token
    console.warn('⚠️ Não foi possível obter access token para requisição')
  }

  // Preparar headers
  const headers = new Headers(options.headers || {})
  
  // Adicionar access token se disponível (fallback quando cookies falharem)
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  // Garantir que credentials está incluído
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Sempre incluir cookies
  }

  return fetch(url, fetchOptions)
}

