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
    const { data: authUser } = await supabaseAdmin.auth.admin.listUsers()
    const user = authUser.users.find(u => u.email === email)

    if (!user) {
      // Não revelar se o e-mail existe ou não (segurança)
      return NextResponse.json({
        success: true,
        message: 'Se o e-mail estiver cadastrado, você receberá um link de acesso em breve.',
      })
    }

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

    // Obter nome do usuário (se disponível)
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('nome_completo')
      .eq('id', user.id)
      .single()

    // Enviar e-mail
    try {
      await sendRecoveryEmail({
        email,
        userName: userProfile?.nome_completo || undefined,
        area: subscription.area as 'wellness' | 'nutri' | 'coach' | 'nutra',
        accessToken,
        baseUrl,
      })

      return NextResponse.json({
        success: true,
        message: 'Link de acesso enviado para seu e-mail!',
      })
    } catch (emailError: any) {
      console.error('❌ Erro ao enviar e-mail de recuperação:', emailError)
      return NextResponse.json(
        { error: 'Erro ao enviar e-mail. Tente novamente mais tarde.' },
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

