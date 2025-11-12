import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * GET /auth/v1/verify
 * Intercepta magic links do Supabase que apontam para /auth/v1/verify
 * Processa o token e redireciona para a página correta
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  
  // Pegar parâmetros do Supabase
  const token = requestUrl.searchParams.get('token')
  const type = requestUrl.searchParams.get('type')
  const redirectTo = requestUrl.searchParams.get('redirect_to')
  const error = requestUrl.searchParams.get('error')
  
  // Se houver erro, redirecionar para login
  if (error) {
    console.error('❌ Erro no verify:', error)
    const loginUrl = new URL('/pt/wellness/login', requestUrl)
    loginUrl.searchParams.set('error', error)
    return NextResponse.redirect(loginUrl)
  }
  
  // Se não houver token, redirecionar para login
  if (!token) {
    console.warn('⚠️ Verify sem token, redirecionando para login')
    return NextResponse.redirect(new URL('/pt/wellness/login', requestUrl))
  }
  
  try {
    // Criar cliente Supabase SSR
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const cookieStore = await cookies()
    
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch (error) {
            console.warn('⚠️ Erro ao salvar cookie:', error)
          }
        },
      },
    })

    // O Supabase magic link usa o token como código para trocar por sessão
    // Tentar trocar token por sessão
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(token)

    if (exchangeError || !data.session) {
      console.error('❌ Erro ao trocar token por sessão:', exchangeError)
      // Se falhar, pode ser que o token precise ser usado de outra forma
      // Redirecionar para callback que tentará processar
      const callbackUrl = new URL('/auth/callback', requestUrl.origin)
      callbackUrl.searchParams.set('code', token)
      if (redirectTo) {
        callbackUrl.searchParams.set('next', redirectTo)
      }
      return NextResponse.redirect(callbackUrl)
    }

    console.log('✅ Sessão criada via verify:', {
      userId: data.session.user.id,
      email: data.session.user.email,
    })

    // Determinar para onde redirecionar
    let redirectPath = '/pt/wellness/dashboard'
    
    if (redirectTo) {
      try {
        const decoded = decodeURIComponent(redirectTo)
        if (decoded.startsWith('/')) {
          redirectPath = decoded
        }
      } catch (e) {
        console.warn('⚠️ Erro ao decodificar redirect_to:', e)
      }
    }

    console.log('🔄 Redirecionando para:', redirectPath)

    // Criar resposta de redirecionamento
    const redirectUrl = new URL(redirectPath, requestUrl.origin)
    const response = NextResponse.redirect(redirectUrl)
    
    // Garantir que cookies sejam persistidos
    const allCookies = cookieStore.getAll()
    allCookies.forEach(cookie => {
      if (cookie.name.startsWith('sb-') || cookie.name.includes('supabase')) {
        response.cookies.set(cookie.name, cookie.value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
      }
    })
    
    return response
  } catch (error: any) {
    console.error('❌ Erro no verify:', error)
    // Fallback: redirecionar para callback com token como code
    const callbackUrl = new URL('/auth/callback', requestUrl.origin)
    callbackUrl.searchParams.set('code', token || '')
    if (redirectTo) {
      callbackUrl.searchParams.set('next', redirectTo)
    }
    return NextResponse.redirect(callbackUrl)
  }
}

