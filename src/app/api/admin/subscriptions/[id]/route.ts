import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import {
  getMercadoPagoPreapprovalIdStrict,
  updateMercadoPagoPreapprovalBillingDate,
} from '@/lib/mercado-pago-helpers'

/**
 * PUT /api/admin/subscriptions/[id]
 * Atualiza assinatura (data de vencimento, tipo de plano, etc)
 * Apenas admin pode atualizar
 * 
 * Body:
 * {
 *   current_period_end?: string (ISO date),
 *   plan_type?: 'monthly' | 'annual' | 'free' | 'trial',
 *   status?: 'active' | 'canceled' | 'past_due'
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const resolved =
      params !== null && typeof params === 'object' && 'then' in params && typeof (params as Promise<{ id: string }>).then === 'function'
        ? await (params as Promise<{ id: string }>)
        : (params as { id: string })
    const subscriptionId = resolved.id
    const body = await request.json()
    const { current_period_end, plan_type, status } = body

    // Preparar dados para atualização
    const updateData: any = {}
    let parsedPeriodEnd: Date | null = null

    if (current_period_end) {
      const expiryDate = new Date(current_period_end)
      if (isNaN(expiryDate.getTime())) {
        return NextResponse.json(
          { error: 'Data de vencimento inválida. Use formato ISO (ex: 2025-12-31T23:59:59Z)' },
          { status: 400 }
        )
      }
      parsedPeriodEnd = expiryDate
      updateData.current_period_end = expiryDate.toISOString()
      // Atualizar também original_expiry_date se for assinatura migrada
      updateData.original_expiry_date = expiryDate.toISOString()
    }

    if (plan_type) {
      if (!['monthly', 'annual', 'free', 'trial'].includes(plan_type)) {
        return NextResponse.json(
          { error: 'plan_type deve ser monthly, annual, free ou trial' },
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

    // Assinatura recorrente (preapproval): alinhar próxima cobrança no Mercado Pago antes de gravar no banco
    let mercadoPagoSynced = false
    if (parsedPeriodEnd) {
      const { data: existing, error: fetchError } = await supabaseAdmin
        .from('subscriptions')
        .select('stripe_subscription_id, gateway_subscription_id, plan_type, status')
        .eq('id', subscriptionId)
        .single()

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: 'Assinatura não encontrada', details: fetchError?.message },
          { status: 404 }
        )
      }

      const effectiveStatus = status !== undefined ? status : existing.status
      const effectivePlan = plan_type !== undefined ? plan_type : existing.plan_type
      const rawId =
        (existing as { gateway_subscription_id?: string | null }).gateway_subscription_id ||
        (existing as { stripe_subscription_id?: string | null }).stripe_subscription_id
      const preapprovalId = getMercadoPagoPreapprovalIdStrict(rawId)

      if (
        preapprovalId &&
        effectiveStatus !== 'canceled' &&
        effectivePlan !== 'free'
      ) {
        const mpResult = await updateMercadoPagoPreapprovalBillingDate(
          preapprovalId,
          parsedPeriodEnd
        )
        if (!mpResult.success) {
          return NextResponse.json(
            {
              error:
                'Não foi possível sincronizar a data de cobrança no Mercado Pago. Nenhuma alteração foi salva no banco.',
              mercadoPagoError: mpResult.error,
            },
            { status: 502 }
          )
        }
        mercadoPagoSynced = true
      }
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
      message: 'Assinatura atualizada com sucesso',
      mercadoPagoSynced,
    })
  } catch (error: any) {
    console.error('❌ Erro ao atualizar assinatura:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar assinatura' },
      { status: 500 }
    )
  }
}

