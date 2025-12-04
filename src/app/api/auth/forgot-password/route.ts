import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendPasswordResetEmail } from '@/lib/email-templates'

/**
 * POST /api/auth/forgot-password
 * Envia email de recuperação de senha CUSTOMIZADO usando Resend
 * 
 * Body:
 * {
 *   email: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar usuário pelo email
    console.log('🔍 Buscando usuário para reset de senha:', email)
    const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Erro ao buscar usuários:', listError)
      // Por segurança, sempre retornar sucesso
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }

    const user = authUsers?.users?.find(u => 
      u.email?.toLowerCase() === email.toLowerCase()
    )

    if (!user) {
      console.log('⚠️ Usuário não encontrado para:', email)
      // Por segurança, sempre retornar sucesso (não revelar se email existe)
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }

    // Buscar perfil do usuário para determinar área
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('perfil, nome_completo')
      .eq('user_id', user.id)
      .maybeSingle()

    const area = (profile?.perfil || 'wellness') as 'wellness' | 'nutri' | 'coach' | 'nutra'
    const userName = profile?.nome_completo || undefined

    // Gerar link de reset usando Supabase Admin
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                   'https://www.ylada.com'

    // Determinar URL de reset baseado na área
    let resetPath = '/pt/wellness/reset-password'
    if (area === 'nutri') {
      resetPath = '/pt/nutri/reset-password'
    } else if (area === 'coach') {
      resetPath = '/pt/coach/reset-password'
    } else if (area === 'admin') {
      resetPath = '/admin/reset-password'
    }

    // Gerar link de recovery usando Supabase Admin
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${baseUrl}${resetPath}`,
      },
    })

    if (linkError || !linkData) {
      console.error('❌ Erro ao gerar link de reset:', linkError)
      // Por segurança, sempre retornar sucesso
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }

    // Extrair o link do objeto retornado
    const resetLink = linkData.properties?.action_link || linkData.properties?.hashed_token
      ? `${baseUrl}${resetPath}?token=${linkData.properties.hashed_token}&type=recovery`
      : null

    if (!resetLink) {
      console.error('❌ Link de reset não gerado corretamente')
      // Por segurança, sempre retornar sucesso
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }

    // Enviar email customizado usando Resend
    try {
      console.log('📧 Enviando email customizado de reset de senha:', {
        email,
        area,
        hasResetLink: !!resetLink,
      })

      await sendPasswordResetEmail({
        email,
        userName,
        area,
        resetLink,
        baseUrl,
      })

      console.log('✅ Email customizado de reset enviado com sucesso para:', email)

      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    } catch (emailError: any) {
      console.error('❌ Erro ao enviar email customizado:', emailError)
      // Por segurança, sempre retornar sucesso mesmo se email falhar
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }
  } catch (error: any) {
    console.error('❌ Erro ao processar recuperação de senha:', error)
    // Por segurança, sempre retornar sucesso
    return NextResponse.json({
      success: true,
      message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
    })
  }
}

