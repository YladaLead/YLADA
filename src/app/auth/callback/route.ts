import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /auth/callback
 * Callback handler para magic links do Supabase
 * Captura o token de autenticação e redireciona para a página correta
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  
  // O Supabase pode enviar 'code' (no callback normal) ou 'token' (no magic link verify)
  const code = requestUrl.searchParams.get('code') || requestUrl.searchParams.get('token')
  const next = requestUrl.searchParams.get('next') || requestUrl.searchParams.get('redirect_to')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Se houver erro, redirecionar para login com mensagem
  if (error) {
    console.error('❌ Erro no callback do Supabase:', error, errorDescription)
    const loginUrl = new URL('/pt/login', request.url)
    loginUrl.searchParams.set('error', error)
    if (errorDescription) {
      loginUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(loginUrl)
  }

  // Se não houver código/token, redirecionar para login
  if (!code) {
    console.warn('⚠️ Callback sem código/token, redirecionando para login')
    return NextResponse.redirect(new URL('/pt/login', request.url))
  }

  try {
    // Criar cliente Supabase SSR (gerencia cookies automaticamente)
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
            // Pode falhar em alguns casos, mas não é crítico
            console.warn('⚠️ Erro ao salvar cookie:', error)
          }
        },
      },
    })

    // Trocar código por sessão
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError || !data.session) {
      console.error('❌ Erro ao trocar código por sessão:', exchangeError)
      const loginUrl = new URL('/pt/login', request.url)
      loginUrl.searchParams.set('error', 'auth_failed')
      return NextResponse.redirect(loginUrl)
    }

    console.log('✅ Sessão criada via magic link:', {
      userId: data.session.user.id,
      email: data.session.user.email,
    })

    // Todos entram pela plataforma YLADA. Priorizar onboarding se perfil não preenchido.
    // Se tem nome+whatsapp mas falta profile_type/profession → perfil-empresarial (ex.: Nutri/Coach migrados).
    let redirectPath = '/pt/onboarding'

    const { data: yladaProfile } = await supabaseAdmin
      .from('ylada_noel_profile')
      .select('area_specific, profile_type, profession')
      .eq('user_id', data.session.user.id)
      .eq('segment', 'ylada')
      .maybeSingle()

    const as = (yladaProfile?.area_specific || {}) as Record<string, unknown>
    const temNome = as?.nome && String(as.nome).trim().length >= 2
    const temWhatsapp = as?.whatsapp && String(as.whatsapp).replace(/\D/g, '').length >= 10
    const temPerfilEmpresarial = yladaProfile?.profile_type && yladaProfile?.profession
    if (temNome && temWhatsapp && temPerfilEmpresarial) {
      redirectPath = '/pt/home'
    } else if (temNome && temWhatsapp) {
      redirectPath = '/pt/perfil-empresarial'
    }

    // Se tem 'next' na URL, usar ele (tem prioridade)
    if (next) {
      try {
        const decodedNext = decodeURIComponent(next)
        // Validar que é uma URL relativa (segurança)
        if (decodedNext.startsWith('/')) {
          redirectPath = decodedNext
          console.log('✅ Usando redirect do parâmetro next:', redirectPath)
        }
      } catch (e) {
        console.warn('⚠️ Erro ao decodificar next:', e)
      }
    } else {
      console.log('ℹ️ Sem parâmetro next, usando padrão baseado no perfil:', redirectPath)
    }

    console.log('🔄 Redirecionando para:', redirectPath)

    // Criar resposta de redirecionamento
    const redirectUrl = new URL(redirectPath, request.url)
    const response = NextResponse.redirect(redirectUrl)
    
    // Os cookies já foram salvos pelo createServerClient acima
    // Mas vamos garantir que sejam persistidos na resposta
    const allCookies = cookieStore.getAll()
    allCookies.forEach(cookie => {
      // Verificar se é um cookie do Supabase
      if (cookie.name.startsWith('sb-') || cookie.name.includes('supabase')) {
        response.cookies.set(cookie.name, cookie.value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })
      }
    })
    
    return response
  } catch (error: any) {
    console.error('❌ Erro no callback:', error)
    const loginUrl = new URL('/pt/login', request.url)
    loginUrl.searchParams.set('error', 'callback_error')
    return NextResponse.redirect(loginUrl)
  }
}

