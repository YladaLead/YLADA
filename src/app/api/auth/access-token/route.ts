import { NextRequest, NextResponse } from 'next/server'
import { validateAndUseAccessToken } from '@/lib/email-tokens'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/auth/access-token
 * Valida token de acesso e retorna sessão do usuário
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 400 }
      )
    }

    // Validar token
    const tokenData = await validateAndUseAccessToken(token)

    if (!tokenData) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    // Buscar e-mail do usuário para criar magic link
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(tokenData.userId)
    
    if (userError || !userData?.user?.email) {
      console.error('❌ Erro ao buscar usuário:', userError)
      return NextResponse.json(
        { error: 'Erro ao buscar dados do usuário' },
        { status: 500 }
      )
    }

    // Criar magic link para login automático
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || process.env.NEXT_PUBLIC_APP_URL || 'https://www.ylada.com'
    
    // Verificar se veio de recuperação de acesso ou de pagamento
    // Por padrão, recuperação vai para dashboard (usuário já tem conta)
    // Pagamento vai para bem-vindo (novo usuário precisa completar cadastro)
    // O redirect será passado via query param na URL do e-mail
    const url = new URL(request.url)
    const redirectParam = url.searchParams.get('redirect')
    
    // Se tem redirect no parâmetro, usar ele
    // Se não tem, verificar se é recuperação (padrão: dashboard) ou pagamento
    let finalRedirect = '/pt/wellness/dashboard' // Padrão: dashboard (recuperação)
    
    if (redirectParam) {
      finalRedirect = decodeURIComponent(redirectParam)
    } else {
      // Se não tem redirect, assumir que é recuperação e ir para dashboard
      // (pagamento sempre terá redirect=/pt/wellness/bem-vindo no e-mail)
      finalRedirect = '/pt/wellness/dashboard'
    }
    
    // Usar /auth/callback que vai redirecionar corretamente
    const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent(finalRedirect)}`
    
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: userData.user.email,
      options: {
        redirectTo,
      },
    })

    if (linkError || !linkData) {
      console.error('❌ Erro ao gerar magic link:', linkError)
      // Mesmo com erro, retornar sucesso - o frontend pode tentar fazer login manualmente
      return NextResponse.json({
        success: true,
        userId: tokenData.userId,
        email: userData.user.email,
        message: 'Token válido. Use o link de acesso para fazer login.',
        loginUrl: linkData?.properties?.action_link || null,
      })
    }

    // Retornar o link de magic link para o frontend fazer login automático
    return NextResponse.json({
      success: true,
      userId: tokenData.userId,
      email: userData.user.email,
      loginUrl: linkData.properties.action_link, // URL do magic link para login automático
      message: 'Token válido. Redirecionando...',
    })
  } catch (error: any) {
    console.error('❌ Erro ao validar token:', error)
    return NextResponse.json(
      { error: 'Erro ao processar token' },
      { status: 500 }
    )
  }
}

