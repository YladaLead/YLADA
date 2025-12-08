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
    console.log('🔄 Gerando link de recovery para:', email, 'Área:', area)
    
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${baseUrl}${resetPath}`,
      },
    })

    if (linkError || !linkData) {
      console.error('❌ Erro ao gerar link de reset:', {
        error: linkError?.message,
        code: linkError?.status,
        hasLinkData: !!linkData
      })
      // Por segurança, sempre retornar sucesso
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }

    console.log('✅ Link gerado pelo Supabase:', {
      hasProperties: !!linkData.properties,
      propertiesKeys: linkData.properties ? Object.keys(linkData.properties) : [],
      hasActionLink: !!linkData.properties?.action_link,
      hasHashedToken: !!linkData.properties?.hashed_token
    })

    // Extrair o link do objeto retornado
    // O Supabase pode retornar o link em action_link ou precisamos construir com hashed_token
    let resetLink: string | null = null
    
    console.log('🔍 Analisando linkData do Supabase:', {
      hasProperties: !!linkData.properties,
      propertiesKeys: linkData.properties ? Object.keys(linkData.properties) : [],
      hasActionLink: !!linkData.properties?.action_link,
      hasHashedToken: !!linkData.properties?.hashed_token,
      hasVerificationUrl: !!linkData.properties?.verification_url,
      hasOtp: !!linkData.properties?.otp,
      hasOtpHash: !!linkData.properties?.otp_hash
    })
    
    // Prioridade 1: action_link (link completo do Supabase)
    if (linkData.properties?.action_link) {
      resetLink = linkData.properties.action_link
      console.log('✅ Usando action_link do Supabase (link completo)')
    } 
    // Prioridade 2: Construir com hashed_token
    else if (linkData.properties?.hashed_token) {
      resetLink = `${baseUrl}${resetPath}?token=${linkData.properties.hashed_token}&type=recovery`
      console.log('✅ Construindo link com hashed_token')
    }
    // Prioridade 3: Construir com otp_hash (formato alternativo)
    else if (linkData.properties?.otp_hash) {
      resetLink = `${baseUrl}${resetPath}?token=${linkData.properties.otp_hash}&type=recovery`
      console.log('✅ Construindo link com otp_hash')
    }
    // Prioridade 4: verification_url
    else if (linkData.properties?.verification_url) {
      resetLink = linkData.properties.verification_url
      console.log('✅ Usando verification_url do Supabase')
    }
    // Prioridade 5: Tentar usar o link direto se disponível
    else if ((linkData as any).link) {
      resetLink = (linkData as any).link
      console.log('✅ Usando link direto do objeto')
    }

    if (!resetLink) {
      console.error('❌ Link de reset não gerado corretamente. Dados completos:', JSON.stringify(linkData, null, 2))
      // Por segurança, sempre retornar sucesso
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }
    
    console.log('✅ Link de reset gerado com sucesso:', resetLink.substring(0, 150) + '...')

    // Enviar email customizado usando Resend
    try {
      console.log('📧 Enviando email customizado de reset de senha:', {
        email,
        area,
        hasResetLink: !!resetLink,
        resetLinkPreview: resetLink ? resetLink.substring(0, 100) + '...' : null
      })

      // Se não temos link customizado, usar o método padrão do Supabase como fallback
      if (!resetLink) {
        console.warn('⚠️ Link customizado não disponível, usando método padrão do Supabase')
        // Tentar usar o método resetPasswordForEmail do Supabase
        const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email: email,
        })
        
        if (resetError) {
          console.error('❌ Erro ao gerar link padrão do Supabase:', resetError)
        } else {
          console.log('✅ Link padrão do Supabase gerado (email será enviado automaticamente)')
          return NextResponse.json({
            success: true,
            message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
          })
        }
      }

      await sendPasswordResetEmail({
        email,
        userName,
        area,
        resetLink: resetLink!,
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

