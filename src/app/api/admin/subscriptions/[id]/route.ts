import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * PUT /api/admin/subscriptions/[id]
 * Atualiza assinatura (data de vencimento, tipo de plano, etc)
 * Apenas admin pode atualizar
 * 
 * Body:
 * {
 *   current_period_end?: string (ISO date),
 *   plan_type?: 'monthly' | 'annual' | 'free',
 *   status?: 'active' | 'canceled' | 'past_due'
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const subscriptionId = params.id
    const body = await request.json()
    const { current_period_end, plan_type, status } = body

    // Preparar dados para atualização
    const updateData: any = {}
    
    if (current_period_end) {
      const expiryDate = new Date(current_period_end)
      if (isNaN(expiryDate.getTime())) {
        return NextResponse.json(
          { error: 'Data de vencimento inválida. Use formato ISO (ex: 2025-12-31T23:59:59Z)' },
          { status: 400 }
        )
      }
      updateData.current_period_end = expiryDate.toISOString()
      // Atualizar também original_expiry_date se for assinatura migrada
      updateData.original_expiry_date = expiryDate.toISOString()
    }

    if (plan_type) {
      if (!['monthly', 'annual', 'free'].includes(plan_type)) {
        return NextResponse.json(
          { error: 'plan_type deve ser monthly, annual ou free' },
          { status: 400 }
        )
      }
      updateData.plan_type = plan_type
    }

    if (status) {
      if (!['active', 'canceled', 'past_due'].includes(status)) {
        return NextResponse.json(
          { error: 'status deve ser active, canceled ou past_due' },
          { status: 400 }
        )
      }
      updateData.status = status
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Nenhum campo para atualizar' },
        { status: 400 }
      )
    }

    // Atualizar assinatura
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .update(updateData)
      .eq('id', subscriptionId)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar assinatura:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar assinatura', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: data,
      message: 'Assinatura atualizada com sucesso'
    })
  } catch (error: any) {
    console.error('❌ Erro ao atualizar assinatura:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar assinatura' },
      { status: 500 }
    )
  }
}

