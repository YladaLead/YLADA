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
    // IMPORTANTE: Sempre usar URL de produção para evitar redirecionamento para localhost
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                   process.env.NEXT_PUBLIC_APP_URL || 
                   'https://www.ylada.com'
    
    // Garantir que não seja localhost
    const productionUrl = baseUrl.includes('localhost') ? 'https://www.ylada.com' : baseUrl
    
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
    
    // IMPORTANTE: O Supabase precisa que o redirectTo seja uma URL completa e válida
    // E deve estar configurado nas URLs permitidas do Supabase
    // SEMPRE usar URL de produção para evitar redirecionamento para localhost
    const redirectTo = `${productionUrl}/auth/callback?next=${encodeURIComponent(finalRedirect)}`
    
    console.log('🔗 Gerando magic link com redirectTo:', redirectTo)
    console.log('🔗 Base URL usado:', productionUrl)
    
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
    // IMPORTANTE: Corrigir URL se contiver localhost (pode acontecer se Supabase estiver configurado com localhost)
    let loginUrl = linkData.properties.action_link
    
    if (loginUrl) {
      // Se contiver localhost, substituir pela URL de produção
      if (loginUrl.includes('localhost') || loginUrl.includes('127.0.0.1')) {
        loginUrl = loginUrl.replace(/https?:\/\/[^\/]+/, productionUrl)
        console.log('⚠️ Magic link corrigido de localhost para produção')
      }
      
      // IMPORTANTE: Se o link apontar para /auth/v1/verify do Supabase,
      // substituir pela nossa rota /auth/v1/verify que redireciona para /auth/callback
      // Isso garante que mesmo se o Supabase gerar link com seu próprio domínio,
      // vamos interceptar e usar nosso callback
      if (loginUrl.includes('/auth/v1/verify')) {
        // Se o link aponta para o domínio do Supabase, substituir pelo nosso domínio
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
        if (loginUrl.includes(supabaseUrl)) {
          loginUrl = loginUrl.replace(supabaseUrl, productionUrl)
          console.log('⚠️ Magic link corrigido para usar nosso domínio:', loginUrl)
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      userId: tokenData.userId,
      email: userData.user.email,
      loginUrl, // URL do magic link para login automático (já corrigida se necessário)
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

