import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { createAccessToken } from '@/lib/email-tokens'
import { sendRecoveryEmail } from '@/lib/email-templates'

/**
 * POST /api/email/send-access-link
 * Envia link de acesso por e-mail (recuperação de acesso)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      )
    }

    // Buscar usuário pelo e-mail
    // Usar user_profiles (email indexado) + getUserById para não depender de listUsers()
    // (listUsers retorna só os primeiros 50 usuários).
    console.log('🔍 Buscando usuário pelo e-mail:', email)
    const normalizedEmail = email.trim().toLowerCase()

    // limit(1) para não falhar quando há duplicatas no mesmo email
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, nome_completo')
      .ilike('email', normalizedEmail)
      .order('updated_at', { ascending: false })
      .limit(1)

    if (profileError) {
      console.error('❌ Erro ao buscar perfil por email:', profileError)
      return NextResponse.json({
        success: true,
        message: 'Se o e-mail estiver cadastrado, você receberá um link de acesso em breve.',
      })
    }

    const profile = profiles?.[0] ?? null
    if (!profile) {
      console.warn('⚠️ Nenhum perfil encontrado para o e-mail:', email)
      return NextResponse.json({
        success: true,
        message: 'Se o e-mail estiver cadastrado, você receberá um link de acesso em breve.',
      })
    }

    const { data: authUserData, error: userError } = await supabaseAdmin.auth.admin.getUserById(profile.user_id)
    const user = authUserData?.user

    if (userError || !user || !user.email || user.email.toLowerCase() !== normalizedEmail) {
      console.warn('❌ Usuário auth não encontrado ou email não confere:', profile.user_id, userError)
      return NextResponse.json({
        success: true,
        message: 'Se o e-mail estiver cadastrado, você receberá um link de acesso em breve.',
      })
    }

    console.log('🔍 Resultado da busca:', {
      found: true,
      userId: user.id,
      userEmail: user.email,
    })

    // Verificar se o usuário tem assinatura ativa
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('id, area, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (!subscription) {
      // Não revelar se tem assinatura ou não (segurança)
      return NextResponse.json({
        success: true,
        message: 'Se o e-mail estiver cadastrado, você receberá um link de acesso em breve.',
      })
    }

    // Obter base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                   process.env.NEXT_PUBLIC_APP_URL || 
                   'https://www.ylada.com'

    // Criar token de acesso
    const accessToken = await createAccessToken(user.id, 30)

    // Enviar e-mail
    try {
      console.log('📧 Tentando enviar e-mail de recuperação:', {
        email: user.email,
        userId: user.id,
        area: subscription.area,
        hasToken: !!accessToken,
        baseUrl,
      })
      
      await sendRecoveryEmail({
        email: user.email,
        userName: profile.nome_completo || undefined,
        area: subscription.area as 'wellness' | 'nutri' | 'coach' | 'nutra',
        accessToken,
        baseUrl,
      })

      console.log('✅ E-mail de recuperação enviado com sucesso para:', user.email)

      return NextResponse.json({
        success: true,
        message: 'Link de acesso enviado para seu e-mail!',
      })
    } catch (emailError: any) {
      console.error('❌ Erro ao enviar e-mail de recuperação:', {
        email: user.email,
        error: emailError.message,
        stack: emailError.stack,
        details: emailError,
      })
      return NextResponse.json(
        { 
          error: 'Erro ao enviar e-mail. Tente novamente mais tarde.',
          details: process.env.NODE_ENV === 'development' ? emailError.message : undefined
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ Erro ao processar solicitação de acesso:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

