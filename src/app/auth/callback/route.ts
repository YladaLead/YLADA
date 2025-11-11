import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * GET /auth/callback
 * Callback handler para magic links do Supabase
 * Captura o token de autenticação e redireciona para a página correta
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || requestUrl.searchParams.get('redirect_to')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Se houver erro, redirecionar para login com mensagem
  if (error) {
    console.error('❌ Erro no callback do Supabase:', error, errorDescription)
    const loginUrl = new URL('/pt/wellness/login', request.url)
    loginUrl.searchParams.set('error', error)
    if (errorDescription) {
      loginUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(loginUrl)
  }

  // Se não houver código, redirecionar para login
  if (!code) {
    console.warn('⚠️ Callback sem código, redirecionando para login')
    return NextResponse.redirect(new URL('/pt/wellness/login', request.url))
  }

  try {
    // Criar cliente Supabase no servidor
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const cookieStore = await cookies()
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: any) {
          cookieStore.delete(name)
        },
      },
    })

    // Trocar código por sessão
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError || !data.session) {
      console.error('❌ Erro ao trocar código por sessão:', exchangeError)
      const loginUrl = new URL('/pt/wellness/login', request.url)
      loginUrl.searchParams.set('error', 'auth_failed')
      return NextResponse.redirect(loginUrl)
    }

    console.log('✅ Sessão criada via magic link:', {
      userId: data.session.user.id,
      email: data.session.user.email,
    })

    // Determinar para onde redirecionar
    let redirectPath = '/pt/wellness/bem-vindo?payment=success'

    // Se houver parâmetro 'next' ou 'redirect_to', usar ele
    if (next) {
      try {
        const decodedNext = decodeURIComponent(next)
        // Validar que é uma URL relativa (segurança)
        if (decodedNext.startsWith('/')) {
          redirectPath = decodedNext
        }
      } catch (e) {
        console.warn('⚠️ Erro ao decodificar next:', e)
      }
    }

    // Se não houver 'next', sempre redirecionar para bem-vindo (pagamento)
    if (!next) {
      redirectPath = '/pt/wellness/bem-vindo?payment=success'
    }

    console.log('🔄 Redirecionando para:', redirectPath)

    // Redirecionar para a página correta
    const redirectUrl = new URL(redirectPath, request.url)
    const response = NextResponse.redirect(redirectUrl)
    
    // Garantir que os cookies de sessão sejam salvos
    const sessionCookie = cookieStore.get('sb-access-token')
    if (sessionCookie) {
      response.cookies.set('sb-access-token', sessionCookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
    }
    
    return response
  } catch (error: any) {
    console.error('❌ Erro no callback:', error)
    const loginUrl = new URL('/pt/wellness/login', request.url)
    loginUrl.searchParams.set('error', 'callback_error')
    return NextResponse.redirect(loginUrl)
  }
}

