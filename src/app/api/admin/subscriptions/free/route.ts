import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/subscriptions/free
 * Cria assinatura gratuita para um usuário
 * Apenas admin pode criar
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { user_id, area, expires_in_days } = body

    // Validar campos obrigatórios
    if (!user_id || !area) {
      return NextResponse.json(
        { error: 'user_id e area são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar área
    if (!['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
      return NextResponse.json(
        { error: 'Área inválida. Use: wellness, nutri, coach ou nutra' },
        { status: 400 }
      )
    }

    // Verificar se usuário existe
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id)
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já tem assinatura ativa para esta área
    const { data: existing } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', user_id)
      .eq('area', area)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Usuário já tem assinatura ativa para esta área' },
        { status: 400 }
      )
    }

    // Calcular datas
    const now = new Date()
    const periodStart = now.toISOString()
    
    // Se expires_in_days não for fornecido, usar 365 dias (1 ano)
    const days = expires_in_days || 365
    const periodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString()

    // Criar assinatura gratuita
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id,
        area,
        plan_type: 'free',
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
        // Campos Stripe vazios para plano gratuito
        stripe_account: 'br',
        stripe_subscription_id: `free_${user_id}_${area}_${Date.now()}`,
        stripe_customer_id: `free_${user_id}`,
        stripe_price_id: 'free',
        amount: 0,
        currency: 'brl',
        requires_manual_renewal: false, // Plano gratuito não precisa renovação manual
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar plano gratuito:', error)
      return NextResponse.json(
        { error: 'Erro ao criar plano gratuito', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: data,
      message: `Plano gratuito criado com sucesso. Válido por ${days} dias.`
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar plano gratuito:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar plano gratuito' },
      { status: 500 }
    )
  }
}

