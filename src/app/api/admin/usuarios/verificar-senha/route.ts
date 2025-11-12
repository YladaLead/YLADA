import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/usuarios/verificar-senha
 * Verifica se um usuário tem senha definida e pode fazer login
 * Apenas admin pode executar
 * 
 * Body:
 * {
 *   email: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar usuário pelo email
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuários', details: usersError.message },
        { status: 500 }
      )
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json({
        exists: false,
        message: 'Usuário não encontrado no sistema de autenticação'
      })
    }

    // Verificar se tem assinatura migrada
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('id, is_migrated, status, area')
      .eq('user_id', user.id)
      .eq('is_migrated', true)
      .maybeSingle()

    // Verificar perfil
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('nome_completo, whatsapp, perfil')
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.json({
      exists: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        email_confirmed_at: user.email_confirmed_at
      },
      subscription: subscription ? {
        is_migrated: subscription.is_migrated,
        status: subscription.status,
        area: subscription.area
      } : null,
      profile: profile ? {
        nome_completo: profile.nome_completo,
        whatsapp: profile.whatsapp,
        perfil: profile.perfil,
        completo: !!(profile.nome_completo && profile.whatsapp)
      } : null,
      message: 'Usuário encontrado'
    })
  } catch (error: any) {
    console.error('❌ Erro ao verificar usuário:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar usuário' },
      { status: 500 }
    )
  }
}

