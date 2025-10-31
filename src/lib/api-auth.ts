import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * Helper para proteger APIs - retorna erro JSON ao invés de redirect
 * Use para rotas de API (não páginas)
 */
export async function requireApiAuth(
  request: NextRequest,
  allowedProfiles?: ('nutri' | 'wellness' | 'coach' | 'nutra' | 'admin')[]
): Promise<{ user: any; profile: any } | NextResponse> {
  try {
    // Criar cliente Supabase server-side
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // Não podemos setar cookies em API routes
          },
          remove(name: string, options: any) {
            // Não podemos remover cookies em API routes
          },
        },
      }
    )
    
    // Obter sessão do cookie
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session || !session.user) {
      return NextResponse.json(
        { error: 'Não autenticado. Faça login para continuar.' },
        { status: 401 }
      )
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Perfil não encontrado.' },
        { status: 403 }
      )
    }

    // Se há perfis permitidos, verificar
    if (allowedProfiles && allowedProfiles.length > 0) {
      // Admin sempre tem acesso
      if (profile.is_admin) {
        return { user: session.user, profile }
      }

      // Verificar se o perfil do usuário está na lista de permitidos
      if (!allowedProfiles.includes(profile.perfil as any)) {
        return NextResponse.json(
          { 
            error: 'Acesso negado. Este recurso é apenas para perfis específicos.',
            required_profiles: allowedProfiles,
            your_profile: profile.perfil
          },
          { status: 403 }
        )
      }
    }

    return { user: session.user, profile }
  } catch (error: any) {
    console.error('Erro na verificação de autenticação da API:', error)
    return NextResponse.json(
      { error: 'Erro interno na verificação de autenticação.' },
      { status: 500 }
    )
  }
}

/**
 * Garantir que o user_id fornecido pertence ao usuário autenticado
 * Use quando precisar validar propriedade de recursos
 */
export async function validateUserId(userId: string): Promise<{ valid: boolean; auth?: any } | NextResponse> {
  const authResult = await requireApiAuth({} as NextRequest)
  
  if (authResult instanceof NextResponse) {
    return authResult
  }

  const { user, profile } = authResult

  // Admin pode acessar qualquer user_id
  if (profile.is_admin) {
    return { valid: true, auth: { user, profile } }
  }

  // Validar que o user_id pertence ao usuário autenticado
  if (user.id !== userId) {
    return NextResponse.json(
      { error: 'Acesso negado. Você só pode acessar seus próprios recursos.' },
      { status: 403 }
    )
  }

  return { valid: true, auth: { user, profile } }
}

/**
 * Obter user_id do token (seguro, não pode ser falsificado)
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set() {},
          remove() {},
        },
      }
    )
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id || null
  } catch (error) {
    console.error('Erro ao obter user_id autenticado:', error)
    return null
  }
}

