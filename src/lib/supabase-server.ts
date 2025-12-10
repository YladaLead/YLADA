import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Criar cliente Supabase para uso em API routes (server-side)
 * NÃO usar no browser - apenas em API routes
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {
          // Não podemos setar cookies em API routes
        },
        remove() {
          // Não podemos remover cookies em API routes
        },
      },
    }
  )
}
