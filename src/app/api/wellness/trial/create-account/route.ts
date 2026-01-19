import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createTrialSubscription } from '@/lib/trial-helpers'

/**
 * POST /api/wellness/trial/create-account
 * Cria conta e trial automaticamente após validação do token
 * 
 * Body:
 * {
 *   token: string (token do convite)
 *   password: string (senha escolhida pelo usuário)
 *   confirm_password: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password, confirm_password } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token é obrigatório' },
        { status: 400 }
      )
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    if (password !== confirm_password) {
      return NextResponse.json(
        { error: 'Senhas não coincidem' },
        { status: 400 }
      )
    }

    // Buscar e validar dados do convite
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('trial_invites')
      .select('email, nome_completo, whatsapp, status, used_at, expires_at')
      .eq('token', token)
      .single()

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 400 }
      )
    }

    // Verificar se já foi usado
    if (invite.used_at || invite.status === 'used') {
      return NextResponse.json(
        { error: 'Este link já foi usado. Cada link só pode ser usado uma vez.' },
        { status: 400 }
      )
    }

    // Verificar se expirou
    const expiresAt = new Date(invite.expires_at)
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Este link expirou. Solicite um novo link.' },
        { status: 400 }
      )
    }

    // Verificar status
    if (invite.status !== 'pending') {
      return NextResponse.json(
        { error: 'Este link não está mais disponível' },
        { status: 400 }
      )
    }

    // Verificar se email já tem conta
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUsers?.users?.find(
      u => u.email?.toLowerCase() === invite.email.toLowerCase()
    )

    if (userExists) {
      return NextResponse.json(
        { error: 'Este email já possui uma conta. Faça login ou use outro email.' },
        { status: 400 }
      )
    }

    // Criar usuário no Supabase Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: invite.email,
      password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        name: invite.nome_completo || invite.email.split('@')[0],
        full_name: invite.nome_completo || invite.email.split('@')[0],
        perfil: 'wellness',
      },
    })

    if (createError || !newUser.user) {
      console.error('❌ Erro ao criar usuário:', createError)
      return NextResponse.json(
        { error: 'Erro ao criar conta. Tente novamente.' },
        { status: 500 }
      )
    }

    const userId = newUser.user.id

    // Criar perfil
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        user_id: userId,
        email: invite.email,
        nome_completo: invite.nome_completo || invite.email.split('@')[0],
        whatsapp: invite.whatsapp,
        perfil: 'wellness',
      })

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError)
      // Continuar mesmo assim - pode ser que trigger já criou
    }

    // Criar trial de 3 dias
    const { subscription_id, expires_at } = await createTrialSubscription(
      userId,
      'wellness',
      token
    )

    // Gerar magic link para login automático
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.ylada.com'
    const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent('/pt/wellness/home')}`

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: invite.email,
      options: {
        redirectTo,
      },
    })

    let loginUrl = null
    if (!linkError && linkData?.properties?.action_link) {
      loginUrl = linkData.properties.action_link
      // Corrigir localhost se necessário
      if (loginUrl.includes('localhost')) {
        loginUrl = loginUrl.replace(/https?:\/\/[^\/]+/, baseUrl)
      }
    }

    return NextResponse.json({
      success: true,
      user_id: userId,
      email: invite.email,
      subscription_id,
      expires_at,
      login_url: loginUrl,
      message: 'Conta criada com sucesso! Trial de 3 dias ativado.',
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar conta de trial:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}
