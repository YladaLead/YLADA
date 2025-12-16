import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

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
  
  // Se for tipo 'recovery' (reset de senha), determinar área do usuário e redirecionar
  if (type === 'recovery' && token) {
    console.log('🔄 Link de recovery detectado, determinando área do usuário...')
    
    try {
      // IMPORTANTE: Não verificar o token aqui, pois isso consumiria o token
      // O token será verificado na página de reset quando o usuário submeter o formulário
      // Aqui apenas tentamos determinar a área do usuário se possível, mas não é crítico
      
      let resetPath = '/pt/wellness/reset-password' // padrão
      
      // Tentar determinar a área usando o redirectTo se disponível
      if (redirectTo) {
        try {
          const decoded = decodeURIComponent(redirectTo)
          // Se o redirectTo contém um path de reset, usar ele
          if (decoded.includes('/reset-password')) {
            // Extrair o path da URL
            const url = new URL(decoded, requestUrl.origin)
            resetPath = url.pathname
            console.log('✅ Área determinada pelo redirectTo:', resetPath)
          }
        } catch (e) {
          console.warn('⚠️ Erro ao processar redirectTo:', e)
        }
      }
      
      // Se não conseguiu determinar pelo redirectTo, tentar buscar pelo token (sem consumir)
      // Mas isso requer decodificar o token, o que pode não ser possível
      // Por segurança, vamos sempre redirecionar para wellness como padrão
      // A página de reset tentará verificar o token e determinar a área se necessário

      const resetUrl = new URL(resetPath, requestUrl.origin)
      resetUrl.searchParams.set('token', token)
      resetUrl.searchParams.set('type', type)
      if (redirectTo) {
        resetUrl.searchParams.set('redirect_to', redirectTo)
      }
      console.log('🔄 Redirecionando para página de reset:', resetPath)
      return NextResponse.redirect(resetUrl)
    } catch (err) {
      console.error('❌ Erro ao processar recovery link, usando padrão:', err)
      // Fallback: redirecionar para Wellness
      const resetUrl = new URL('/pt/wellness/reset-password', requestUrl.origin)
      resetUrl.searchParams.set('token', token)
      resetUrl.searchParams.set('type', type)
      if (redirectTo) {
        resetUrl.searchParams.set('redirect_to', redirectTo)
      }
      return NextResponse.redirect(resetUrl)
    }
  }
  
  // Se houver erro, verificar se é recovery e redirecionar para reset com erro
  if (error && type === 'recovery') {
    console.error('❌ Erro no verify (recovery):', error)
    // Usar Wellness como padrão para erro
    const resetUrl = new URL('/pt/wellness/reset-password', requestUrl.origin)
    resetUrl.searchParams.set('error', error)
    const errorDesc = requestUrl.searchParams.get('error_description')
    if (errorDesc) {
      resetUrl.searchParams.set('error_description', errorDesc)
    }
    return NextResponse.redirect(resetUrl)
  }
  
  // Se houver erro (não recovery), redirecionar para login
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

    // O Supabase magic link retorna um token_hash que precisa ser verificado
    // Tentar verificar o token usando verifyOtp primeiro
    let session = null
    let userId = null
    let userEmail = null

    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: (type as any) || 'magiclink',
    })

    if (!verifyError && verifyData?.session) {
      session = verifyData.session
      userId = verifyData.session.user.id
      userEmail = verifyData.session.user.email
      console.log('✅ Sessão criada via verifyOtp:', { userId, email: userEmail })
    } else {
      // Se falhar, tentar usar como código (fallback)
      console.log('⚠️ verifyOtp falhou, tentando exchangeCodeForSession como fallback')
      const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(token)
      
      if (!exchangeError && exchangeData?.session) {
        session = exchangeData.session
        userId = exchangeData.session.user.id
        userEmail = exchangeData.session.user.email
        console.log('✅ Sessão criada via exchangeCodeForSession (fallback):', { userId, email: userEmail })
      } else {
        console.error('❌ Erro em ambos os métodos:', verifyError, exchangeError)
        // Redirecionar para login com erro
        const loginUrl = new URL('/pt/wellness/login', requestUrl.origin)
        loginUrl.searchParams.set('error', 'auth_failed')
        loginUrl.searchParams.set('error_description', 'Token inválido ou expirado')
        return NextResponse.redirect(loginUrl)
      }
    }

    if (!session || !userId) {
      console.error('❌ Nenhuma sessão foi criada')
      const loginUrl = new URL('/pt/wellness/login', requestUrl.origin)
      loginUrl.searchParams.set('error', 'auth_failed')
      return NextResponse.redirect(loginUrl)
    }

    // Verificar se o usuário tem perfil completo
    // Se não tiver, redirecionar para completar cadastro
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('nome_completo, whatsapp')
      .eq('user_id', userId)
      .maybeSingle()

    // Determinar para onde redirecionar
    let redirectPath = '/pt/wellness/home'
    
    // Sempre redirecionar para dashboard
    // O admin já preencheu todos os dados, usuário só precisa trocar senha se necessário
    if (redirectTo) {
      // Se tem redirectTo explícito, usar ele
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
    
    // IMPORTANTE: Os cookies já foram salvos pelo createServerClient acima
    // Mas vamos garantir que sejam persistidos na resposta
    // O Supabase SSR já gerencia os cookies automaticamente, mas vamos garantir
    const allCookies = cookieStore.getAll()
    allCookies.forEach(cookie => {
      // Verificar se é um cookie do Supabase
      if (cookie.name.startsWith('sb-') || cookie.name.includes('supabase') || cookie.name.includes('auth')) {
        response.cookies.set(cookie.name, cookie.value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })
      }
    })
    
    console.log('🍪 Cookies salvos:', allCookies.filter(c => c.name.startsWith('sb-')).length)
    
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

