import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/migrado/verificar
 * Verifica se um email está na lista de usuários migrados
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

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Buscar usuário pelo email
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    if (userError) {
      console.error('❌ Erro ao buscar usuários:', userError)
      return NextResponse.json(
        { error: 'Erro ao verificar email' },
        { status: 500 }
      )
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json({
        isMigrado: false,
        message: 'Email não encontrado'
      })
    }

    // Verificar se tem assinatura migrada ativa
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('area, is_migrated, status, current_period_end')
      .eq('user_id', user.id)
      .eq('is_migrated', true)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle()

    if (subError) {
      console.error('❌ Erro ao buscar assinatura:', subError)
      return NextResponse.json(
        { error: 'Erro ao verificar assinatura' },
        { status: 500 }
      )
    }

    if (!subscription) {
      return NextResponse.json({
        isMigrado: false,
        message: 'Email não está na lista de usuários migrados'
      })
    }

    return NextResponse.json({
      isMigrado: true,
      area: subscription.area,
      message: 'Email encontrado na lista de migrados'
    })
  } catch (error: any) {
    console.error('❌ Erro ao verificar email migrado:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar email' },
      { status: 500 }
    )
  }
}

