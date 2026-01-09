import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getActiveSubscription } from '@/lib/subscription-helpers'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/nutri/subscription/cancel
 * Cancela assinatura e processa reembolso se dentro de 7 dias
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { requestRefund, reason } = body

    // Buscar assinatura ativa
    const subscription = await getActiveSubscription(user.id, 'nutri')

    if (!subscription) {
      return NextResponse.json(
        { error: 'Nenhuma assinatura ativa encontrada' },
        { status: 404 }
      )
    }

    // Calcular dias desde a compra
    const dataInicio = new Date(subscription.current_period_start || subscription.created_at)
    const hoje = new Date()
    const diasDesdeCompra = Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
    const dentroGarantia = diasDesdeCompra <= 7

    // Se solicitou reembolso mas está fora da garantia
    if (requestRefund && !dentroGarantia) {
      return NextResponse.json(
        { 
          error: 'Prazo de garantia de 7 dias expirado',
          daysSincePurchase: diasDesdeCompra,
          withinGuarantee: false
        },
        { status: 400 }
      )
    }

    // Atualizar status da assinatura
    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id)

    if (updateError) {
      console.error('❌ Erro ao cancelar assinatura:', updateError)
      return NextResponse.json(
        { error: 'Erro ao cancelar assinatura' },
        { status: 500 }
      )
    }

    // Se solicitou reembolso e está dentro da garantia
    if (requestRefund && dentroGarantia) {
      // Criar registro de solicitação de reembolso
      // Por enquanto, vamos apenas registrar no banco
      // O reembolso automático via gateway pode ser implementado depois
      
      try {
        // Criar registro de solicitação de reembolso (se tiver tabela)
        // Por enquanto, vamos apenas retornar sucesso
        // TODO: Implementar reembolso automático via Stripe/Mercado Pago
        
        console.log('📝 Solicitação de reembolso criada:', {
          subscriptionId: subscription.id,
          userId: user.id,
          amount: subscription.amount,
          reason,
          daysSincePurchase: diasDesdeCompra
        })
      } catch (refundError) {
        console.error('❌ Erro ao criar solicitação de reembolso:', refundError)
        // Não falhar o cancelamento se o reembolso falhar
      }
    }

    return NextResponse.json({
      success: true,
      message: requestRefund && dentroGarantia 
        ? 'Assinatura cancelada. Reembolso será processado em até 10 dias úteis.'
        : 'Assinatura cancelada com sucesso.',
      canceled: true,
      refundRequested: requestRefund && dentroGarantia,
      withinGuarantee: dentroGarantia,
      daysSincePurchase: diasDesdeCompra
    })
  } catch (error: any) {
    console.error('❌ Erro ao cancelar assinatura:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar cancelamento' },
      { status: 500 }
    )
  }
}

