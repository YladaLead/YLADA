import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createTrialSubscription } from '@/lib/trial-helpers'

/**
 * POST /api/wellness/trial/create-public-account
 * Cria conta e trial automaticamente (link público, sem token)
 * 
 * Body:
 * {
 *   email: string
 *   nome_completo: string
 *   whatsapp?: string
 *   password: string
 *   trial_group?: string ('geral' ou 'presidentes')
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, nome_completo, whatsapp, password, trial_group = 'geral' } = body

    // Validações
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email é obrigatório e deve ser válido' },
        { status: 400 }
      )
    }

    if (!nome_completo || nome_completo.length < 3) {
      return NextResponse.json(
        { error: 'Nome completo é obrigatório (mínimo 3 caracteres)' },
        { status: 400 }
      )
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar se email já tem conta
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUsers?.users?.find(
      u => u.email?.toLowerCase() === email.toLowerCase()
    )

    if (userExists) {
      return NextResponse.json(
        { error: 'Este email já possui uma conta. Faça login ou use outro email.' },
        { status: 400 }
      )
    }

    // Criar usuário no Supabase Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        name: nome_completo,
        full_name: nome_completo,
        perfil: 'wellness',
        trial_group: trial_group, // Armazenar grupo no metadata
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
        email: email.toLowerCase().trim(),
        nome_completo: nome_completo.trim(),
        whatsapp: whatsapp?.trim() || null,
        perfil: 'wellness',
      })

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError)
      // Continuar mesmo assim - pode ser que trigger já criou
    }

    // Criar trial de 3 dias (sem token, pois é público)
    const { subscription_id, expires_at } = await createTrialSubscription(
      userId,
      'wellness'
    )

    // Registrar no trial_invites para tracking (opcional, mas útil)
    await supabaseAdmin
      .from('trial_invites')
      .insert({
        token: `public_${userId}_${Date.now()}`, // Token único para tracking
        email: email.toLowerCase().trim(),
        nome_completo: nome_completo.trim(),
        whatsapp: whatsapp?.trim() || null,
        trial_group: trial_group,
        status: 'used', // Já foi usado (criado diretamente)
        used_at: new Date().toISOString(),
        used_by_user_id: userId,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
      })
      .catch(err => {
        // Não é crítico se falhar - é apenas para tracking
        console.warn('⚠️ Erro ao registrar trial_invite (não crítico):', err)
      })

    // Gerar magic link para login automático
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.ylada.com'
    const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent('/pt/wellness/home')}`

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email.toLowerCase().trim(),
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
      email: email.toLowerCase().trim(),
      subscription_id,
      expires_at,
      trial_group,
      login_url: loginUrl,
      message: 'Conta criada com sucesso! Trial de 3 dias ativado.',
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar conta de trial público:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}
