import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Helper para proteger APIs - retorna erro JSON ao invés de redirect
 * Use para rotas de API (não páginas)
 */
export async function requireApiAuth(
  request: NextRequest,
  allowedProfiles?: ('nutri' | 'wellness' | 'coach' | 'nutra' | 'admin')[]
): Promise<{ user: any; profile: any } | NextResponse> {
  try {
    // NOVO: Tentar ler access token do header Authorization (fallback quando cookies falharem)
    const authHeader = request.headers.get('authorization')
    let accessToken: string | null = null
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.substring(7)
    }
    
    // Ler cookies diretamente do header do request (mais confiável em API routes)
    const requestCookies = request.headers.get('cookie') || ''
    
    // Também tentar usar cookies() do Next.js como fallback
    let cookieStore: any = null
    try {
      cookieStore = await cookies()
    } catch (e) {
      // Se cookies() falhar, usar apenas requestCookies
      console.warn('⚠️ cookies() falhou, usando apenas request headers')
    }
    
    // Debug: log dos cookies (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      const cookieNames: string[] = []
      if (requestCookies) {
        const matches = requestCookies.matchAll(/([^=]+)=/g)
        for (const match of matches) {
          cookieNames.push(match[1].trim())
        }
      }
      console.log('🔍 API Auth - Debug:', {
        requestCookieHeader: requestCookies ? 'present' : 'missing',
        requestCookieLength: requestCookies.length,
        cookieNames: cookieNames,
        cookieStoreAvailable: !!cookieStore
      })
    }
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            // PRIORIDADE 1: Tentar parsear do header do request (mais confiável)
            if (requestCookies) {
              // Buscar cookie com regex mais robusto
              const regex = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`, 'i')
              const match = requestCookies.match(regex)
              if (match && match[1]) {
                const value = decodeURIComponent(match[1].trim())
                if (value) {
                  return value
                }
              }
            }
            
            // PRIORIDADE 2: Tentar do cookieStore (fallback)
            if (cookieStore) {
              try {
                const cookie = cookieStore.get(name)
                if (cookie?.value) {
                  return cookie.value
                }
              } catch (e) {
                // Ignorar erro do cookieStore
              }
            }
            
            return undefined
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
    
    // ✅ CORREÇÃO: Usar getUser() ao invés de getSession() para segurança
    // getUser() valida com o servidor Supabase Auth, enquanto getSession() apenas lê dos cookies
    let user = null
    let session = null
    let sessionError = null
    
    // Primeiro tentar getUser() (mais seguro, valida com servidor)
    const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser()
    
    if (!userError && fetchedUser) {
      user = fetchedUser
      
      // Se getUser() funcionou, buscar sessão para ter o access_token
      const { data: { session: fetchedSession } } = await supabase.auth.getSession()
      session = fetchedSession
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ API Auth - Usuário autenticado via getUser()')
      }
    } else {
      // FALLBACK: Se getUser() falhou, tentar usar access token do header
      if (accessToken) {
        try {
          // Validar o access token diretamente
          const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(accessToken)
          
          if (!tokenError && tokenUser) {
            user = tokenUser
            // Criar uma sessão "sintética" a partir do token
            session = {
              user: tokenUser,
              access_token: accessToken,
              refresh_token: '', // Não temos refresh token aqui, mas não é crítico para APIs
              expires_in: 3600,
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              token_type: 'bearer'
            } as any
            
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ API Auth - Usuário autenticado via access token (fallback)')
            }
          } else {
            sessionError = tokenError
          }
        } catch (tokenErr) {
          // Se o token também falhar, continuar com o fluxo normal de erro
          sessionError = tokenErr as any
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Access token também falhou:', tokenErr)
          }
        }
      } else {
        sessionError = userError
      }
    }
    
    // Debug: log da sessão (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 API Auth - Autenticação:', {
        hasUser: !!user,
        hasSession: !!session,
        userId: user?.id || session?.user?.id,
        error: sessionError?.message,
        errorCode: sessionError?.status,
        hasCookies: !!requestCookies,
        usedAccessToken: !!accessToken && !!user
      })
    }
    
    if (sessionError || !user) {
      return NextResponse.json(
        { 
          error: 'Você precisa fazer login para continuar.',
          technical: process.env.NODE_ENV === 'development' ? {
            sessionError: sessionError?.message,
            errorCode: sessionError?.status,
            hasRequestCookies: !!requestCookies,
            cookieHeaderLength: requestCookies.length,
            hasAccessToken: !!accessToken
          } : undefined
        },
        { status: 401 }
      )
    }

    // Buscar perfil do usuário
    const userId = user.id
    let { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    // Se perfil não existe, criar automaticamente com o perfil inferido da rota
    if (!profile || profileError?.code === 'PGRST116') {
      // Tentar inferir o perfil da URL ou usar o primeiro allowedProfile
      let inferredProfile: string | null = null
      if (allowedProfiles && allowedProfiles.length > 0) {
        inferredProfile = allowedProfiles[0] // Usar o primeiro perfil permitido
      } else {
        // Tentar inferir da URL
        const url = request.url.toLowerCase()
        if (url.includes('/wellness/')) inferredProfile = 'wellness'
        else if (url.includes('/nutri/')) inferredProfile = 'nutri'
        else if (url.includes('/c/')) inferredProfile = 'coach'
        else if (url.includes('/nutra/')) inferredProfile = 'nutra'
      }

      if (inferredProfile) {
        console.log(`📝 Criando perfil automaticamente para usuário ${userId} com perfil: ${inferredProfile}`)
        
        // Buscar email do usuário usando supabaseAdmin
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId)
        const email = authUser?.user?.email || user.email || ''
        
        // Criar perfil básico usando supabaseAdmin
        const { data: newProfile, error: createError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            user_id: userId,
            perfil: inferredProfile,
            nome_completo: authUser?.user?.user_metadata?.full_name || '',
            email: email
          })
          .select()
          .single()

        if (createError) {
          console.error('❌ Erro ao criar perfil automaticamente:', createError)
          return NextResponse.json(
            { 
              error: 'Erro ao criar perfil. Tente fazer logout e login novamente.',
              technical: process.env.NODE_ENV === 'development' ? createError.message : undefined
            },
            { status: 500 }
          )
        }

        profile = newProfile
        console.log('✅ Perfil criado automaticamente:', profile)
      } else {
        return NextResponse.json(
          { error: 'Perfil não encontrado e não foi possível criar automaticamente.' },
          { status: 403 }
        )
      }
    }

    // Se o perfil existe mas não tem 'perfil' definido, atualizar usando supabaseAdmin
    if (profile && !profile.perfil && allowedProfiles && allowedProfiles.length > 0) {
      const inferredProfile = allowedProfiles[0]
      console.log(`📝 Atualizando perfil ${profile.id} para ter perfil: ${inferredProfile}`)
      
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('user_profiles')
        .update({ perfil: inferredProfile })
        .eq('user_id', userId)
        .select()
        .single()

      if (!updateError && updatedProfile) {
        profile = updatedProfile
        console.log('✅ Perfil atualizado:', profile)
      }
    }

    // Se há perfis permitidos, verificar
    if (allowedProfiles && allowedProfiles.length > 0) {
      // Admin sempre tem acesso
      if (profile.is_admin) {
        return { user: session.user, profile }
      }

      // Suporte (funcionários/parceiros) pode acessar todas as áreas para guiar usuários
      if (profile.is_support) {
        return { user: session.user, profile }
      }

      // Verificar se o perfil do usuário está na lista de permitidos
      if (!profile.perfil || !allowedProfiles.includes(profile.perfil as any)) {
        console.error('❌ Perfil não autorizado:', {
          required: allowedProfiles,
          current: profile.perfil,
          userId: userId,
          is_admin: profile.is_admin,
          is_support: profile.is_support
        })
        return NextResponse.json(
          { 
            error: 'Acesso negado. Este recurso é apenas para perfis específicos.',
            required_profiles: allowedProfiles,
            your_profile: profile.perfil || 'não definido',
            technical: process.env.NODE_ENV === 'development' ? {
              profileId: profile.id,
              userId: userId,
              is_admin: profile.is_admin,
              is_support: profile.is_support
            } : undefined
          },
          { status: 403 }
        )
      }
    }

    return { user: session.user, profile }
  } catch (error: any) {
    console.error('❌ Erro na verificação de autenticação da API:', {
      error,
      message: error?.message,
      code: error?.code,
      stack: error?.stack
    })
    return NextResponse.json(
      { 
        error: 'Erro interno na verificação de autenticação.',
        ...(process.env.NODE_ENV === 'development' && {
          technical: {
            message: error?.message,
            code: error?.code,
            stack: error?.stack?.split('\n').slice(0, 5).join('\n')
          }
        })
      },
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

