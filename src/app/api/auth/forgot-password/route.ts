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
    // IMPORTANTE: NÃO usar listUsers() - ele retorna só os primeiros 50 usuários e quem
    // não está nessa primeira página nunca recebe o e-mail. Buscar por user_profiles (tem
    // email indexado) e depois getUserById.
    console.log('🔍 Buscando usuário para reset de senha:', email)
    const normalizedEmail = email.trim().toLowerCase()

    // limit(1) + pegar primeiro: evita falha quando há duplicatas no mesmo email (maybeSingle falharia)
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, perfil, nome_completo')
      .ilike('email', normalizedEmail)
      .order('updated_at', { ascending: false })
      .limit(1)

    if (profileError) {
      console.error('❌ Erro ao buscar perfil por email:', profileError)
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }

    const profile = profiles?.[0] ?? null
    if (!profile) {
      console.log('⚠️ Nenhum perfil encontrado para:', email)
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }

    const { data: authUserData, error: userError } = await supabaseAdmin.auth.admin.getUserById(profile.user_id)
    const user = authUserData?.user

    if (userError || !user) {
      console.error('❌ Erro ao buscar usuário auth por id:', userError || 'user null')
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }

    if (!user.email || user.email.toLowerCase() !== normalizedEmail) {
      console.log('⚠️ Email do auth não confere para user_id:', profile.user_id)
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }

    const area = (profile.perfil || 'wellness') as 'wellness' | 'nutri' | 'coach' | 'nutra'
    const userName = profile.nome_completo || undefined

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
      email: user.email,
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
    
    // Prioridade 1: Extrair token do action_link e construir link direto para nossa aplicação
    // O action_link do Supabase aponta para o domínio do Supabase, mas precisamos que aponte para nossa aplicação
    if (linkData.properties?.action_link) {
      try {
        const actionLinkUrl = new URL(linkData.properties.action_link)
        const token = actionLinkUrl.searchParams.get('token')
        const type = actionLinkUrl.searchParams.get('type') || 'recovery'
        
        if (token) {
          // Construir link direto para nossa aplicação usando /auth/v1/verify que processa o token
          resetLink = `${baseUrl}/auth/v1/verify?token=${encodeURIComponent(token)}&type=${type}`
          console.log('✅ Extraído token do action_link e construído link direto para aplicação')
        } else {
          // Se não conseguir extrair token, usar o action_link original (fallback)
          resetLink = linkData.properties.action_link
          console.log('⚠️ Não foi possível extrair token do action_link, usando link original')
        }
      } catch (err) {
        console.warn('⚠️ Erro ao processar action_link, tentando usar diretamente:', err)
        resetLink = linkData.properties.action_link
      }
    } 
    // Prioridade 2: Construir com hashed_token
    else if (linkData.properties?.hashed_token) {
      resetLink = `${baseUrl}/auth/v1/verify?token=${encodeURIComponent(linkData.properties.hashed_token)}&type=recovery`
      console.log('✅ Construindo link com hashed_token via /auth/v1/verify')
    }
    // Prioridade 3: Construir com otp_hash (formato alternativo)
    else if (linkData.properties?.otp_hash) {
      resetLink = `${baseUrl}/auth/v1/verify?token=${encodeURIComponent(linkData.properties.otp_hash)}&type=recovery`
      console.log('✅ Construindo link com otp_hash via /auth/v1/verify')
    }
    // Prioridade 4: verification_url (extrair token se possível)
    else if (linkData.properties?.verification_url) {
      try {
        const verifyUrl = new URL(linkData.properties.verification_url)
        const token = verifyUrl.searchParams.get('token')
        if (token) {
          resetLink = `${baseUrl}/auth/v1/verify?token=${encodeURIComponent(token)}&type=recovery`
          console.log('✅ Extraído token do verification_url e construído link direto')
        } else {
          resetLink = linkData.properties.verification_url
          console.log('⚠️ Usando verification_url original (não foi possível extrair token)')
        }
      } catch (err) {
        resetLink = linkData.properties.verification_url
        console.log('⚠️ Erro ao processar verification_url, usando original:', err)
      }
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
      console.log('📧 Enviando email customizado de reset de senha via Resend:', {
        email: user.email,
        area,
        hasResetLink: !!resetLink,
        resetLinkPreview: resetLink ? resetLink.substring(0, 100) + '...' : null
      })

      // Verificar se Resend está configurado ANTES de tentar enviar
      const { isResendConfigured } = await import('@/lib/resend')
      if (!isResendConfigured()) {
        console.error('❌ Resend não está configurado! Verifique RESEND_API_KEY.')
        // Por segurança, sempre retornar sucesso mesmo se Resend não estiver configurado
        return NextResponse.json({
          success: true,
          message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
        })
      }

      // Enviar email via Resend
      await sendPasswordResetEmail({
        email: user.email,
        userName,
        area,
        resetLink: resetLink!,
        baseUrl,
      })

      console.log('✅ Email customizado de reset enviado com sucesso via Resend para:', user.email)

      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    } catch (emailError: any) {
      console.error('❌ Erro ao enviar email customizado via Resend:', {
        error: emailError.message,
        stack: emailError.stack,
        name: emailError.name
      })
      
      // Log detalhado para debug
      console.error('❌ Detalhes do erro de envio de email:', JSON.stringify(emailError, null, 2))
      
      // Por segurança, sempre retornar sucesso mesmo se email falhar
      // (não revelar se o email existe ou não)
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

