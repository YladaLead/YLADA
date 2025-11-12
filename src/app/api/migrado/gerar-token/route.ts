import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/migrado/gerar-token
 * Gera token de acesso temporário para usuário migrado
 * 
 * Body:
 * {
 *   email: string,
 *   area: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, area } = body

    if (!email || !area) {
      return NextResponse.json(
        { error: 'Email e área são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário pelo email
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    if (userError) {
      console.error('❌ Erro ao buscar usuários:', userError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuário' },
        { status: 500 }
      )
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se tem assinatura migrada ativa
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('id, is_migrated, status, current_period_end')
      .eq('user_id', user.id)
      .eq('is_migrated', true)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle()

    if (!subscription) {
      return NextResponse.json(
        { error: 'Usuário não está na lista de migrados' },
        { status: 403 }
      )
    }

    // Criar token de acesso temporário (1 dia - tempo suficiente para completar cadastro)
    const { createAccessToken } = await import('@/lib/email-tokens')
    const accessToken = await createAccessToken(user.id, 1) // 1 dia

    return NextResponse.json({
      success: true,
      token: accessToken,
      area: area,
      message: 'Token gerado com sucesso'
    })
  } catch (error: any) {
    console.error('❌ Erro ao gerar token:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar token' },
      { status: 500 }
    )
  }
}

