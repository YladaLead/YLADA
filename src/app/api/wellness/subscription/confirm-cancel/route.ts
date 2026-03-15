import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { cancelMercadoPagoSubscription, getMercadoPagoPreapprovalIdForCancel, refundMercadoPagoPayment } from '@/lib/mercado-pago-helpers'
import { notifyAdminRefundRequest } from '@/lib/refund-notifications'

/**
 * POST /api/wellness/subscription/confirm-cancel
 * Cancela definitivamente a assinatura (após retenção ou direto)
 * Cancela no banco E no Mercado Pago automaticamente
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { cancelAttemptId, requestRefund, reason } = body

    if (!cancelAttemptId) {
      return NextResponse.json(
        { error: 'cancelAttemptId é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar tentativa de cancelamento
    const { data: cancelAttempt, error: fetchError } = await supabaseAdmin
      .from('cancel_attempts')
      .select('*, subscriptions(*)')
      .eq('id', cancelAttemptId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !cancelAttempt) {
      return NextResponse.json(
        { error: 'Tentativa de cancelamento não encontrada' },
        { status: 404 }
      )
    }

    // Buscar subscription separadamente se necessário
    let subscription: any
    if (cancelAttempt.subscriptions && typeof cancelAttempt.subscriptions === 'object') {
      subscription = Array.isArray(cancelAttempt.subscriptions) 
        ? cancelAttempt.subscriptions[0] 
        : cancelAttempt.subscriptions
    } else {
      // Se não veio no join, buscar separadamente
      const { data: subData, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('id', cancelAttempt.subscription_id)
        .single()
      
      if (subError || !subData) {
        return NextResponse.json(
          { error: 'Assinatura não encontrada' },
          { status: 404 }
        )
      }
      subscription = subData
    }

    // Verificar se já está cancelada
    if (subscription.status === 'canceled') {
      return NextResponse.json({
        success: true,
        canceled: true,
        message: 'Assinatura já estava cancelada.'
      })
    }

    // Calcular dias desde a compra
    const dataInicio = new Date(subscription.current_period_start || subscription.created_at)
    const hoje = new Date()
    const diasDesdeCompra = Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
    const dentroGarantia = diasDesdeCompra <= 7

    // Validar reembolso
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

    // Tentar cancelar no Mercado Pago quando for assinatura MP (sempre notificar o MP para evitar cobranças futuras)
    let mercadoPagoCanceled = false
    let mercadoPagoError: string | null = null

    const rawSubscriptionId = (subscription as any).gateway_subscription_id ||
                              (subscription as any).stripe_subscription_id
    const isMercadoPago = (subscription as any).gateway === 'mercadopago' ||
                         (typeof rawSubscriptionId === 'string' && (rawSubscriptionId.startsWith('mp_') || rawSubscriptionId.startsWith('mp_sub_')))
    const preapprovalId = getMercadoPagoPreapprovalIdForCancel(rawSubscriptionId)

    if (isMercadoPago && preapprovalId) {
      console.log(`🔄 Tentando cancelar no Mercado Pago (preapproval_id): ${preapprovalId}`)
      const cancelResult = await cancelMercadoPagoSubscription(preapprovalId)

      if (cancelResult.success) {
        mercadoPagoCanceled = true
        console.log('✅ Cancelado no Mercado Pago com sucesso')
      } else {
        mercadoPagoError = cancelResult.error || 'Erro desconhecido'
        console.error('⚠️ Erro ao cancelar no Mercado Pago:', mercadoPagoError)
        // Continuar mesmo assim - cancelar no banco
      }
    } else if (rawSubscriptionId && !isMercadoPago) {
      console.log('ℹ️ Assinatura Stripe - cancelamento será processado via webhook')
    } else {
      console.log('ℹ️ Nenhum ID do gateway encontrado, cancelando apenas no banco')
    }

    // Cancelar no banco de dados (sempre, mesmo se Mercado Pago falhar)
    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id)

    if (updateError) {
      console.error('❌ Erro ao cancelar assinatura no banco:', updateError)
      return NextResponse.json(
        { error: 'Erro ao cancelar assinatura' },
        { status: 500 }
      )
    }

    // Atualizar cancel_attempt
    await supabaseAdmin
      .from('cancel_attempts')
      .update({
        final_action: 'canceled',
        canceled_at: new Date().toISOString(),
        request_refund: requestRefund && dentroGarantia,
        updated_at: new Date().toISOString()
      })
      .eq('id', cancelAttemptId)

    // Se solicitou reembolso e está dentro da garantia: tentar reembolso automático no MP
    let refundRequested = false
    let refundSuccess = false
    let refundError: string | null = null

    if (requestRefund && dentroGarantia) {
      // Buscar último pagamento da assinatura para reembolsar no Mercado Pago
      const { data: lastPayment } = await supabaseAdmin
        .from('payments')
        .select('id, stripe_payment_intent_id, amount, status')
        .eq('subscription_id', subscription.id)
        .eq('status', 'succeeded')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const mpPaymentId = lastPayment?.stripe_payment_intent_id
      if (mpPaymentId && isMercadoPago) {
        refundRequested = true
        const idempotencyKey = `refund_cancel_${cancelAttemptId}_${subscription.id}`
        const refundResult = await refundMercadoPagoPayment(
          String(mpPaymentId),
          lastPayment?.amount,
          idempotencyKey
        )
        refundSuccess = refundResult.success
        if (!refundResult.success) refundError = refundResult.error || null
        console.log(refundResult.success ? '✅ Reembolso solicitado no MP com sucesso' : '⚠️ Reembolso no MP falhou:', { mpPaymentId, error: refundError })
      }

      // Registrar e notificar admin (para auditoria)
      console.log('📝 Solicitação de reembolso:', {
        subscriptionId: subscription.id,
        userId: user.id,
        amount: subscription.amount,
        reason,
        daysSincePurchase: diasDesdeCompra,
        mercadoPagoCanceled,
        refundRequested,
        refundSuccess
      })

      // Buscar dados do usuário para notificação
      let userEmail = user.email || ''
      let userName = user.user_metadata?.full_name || user.user_metadata?.name || 'Usuário'

      try {
        const { data: profile } = await supabaseAdmin
          .from('wellness_profiles')
          .select('nome, email')
          .eq('user_id', user.id)
          .single()

        if (profile) {
          userName = profile.nome || userName
          userEmail = profile.email || userEmail
        }
      } catch (error) {
        console.warn('[Refund Notification] Erro ao buscar perfil do usuário:', error)
      }

      // Enviar notificação por email e WhatsApp
      try {
        await notifyAdminRefundRequest({
          subscriptionId: subscription.id,
          userId: user.id,
          userEmail,
          userName,
          area: 'wellness',
          amount: subscription.amount || 0,
          reason: reason || cancelAttempt.cancel_reason || 'other',
          daysSincePurchase: diasDesdeCompra,
          cancelAttemptId: cancelAttemptId
        })
      } catch (notificationError) {
        console.error('[Refund Notification] Erro ao enviar notificação:', notificationError)
        // Não falhar o cancelamento se a notificação falhar
      }
    }

    // Mensagem de sucesso
    let message = 'Assinatura cancelada com sucesso.'

    if (requestRefund && dentroGarantia) {
      if (refundSuccess) {
        message = 'Assinatura cancelada. Reembolso foi solicitado no cartão e deve aparecer em alguns dias úteis.'
      } else if (refundRequested && refundError) {
        message = 'Assinatura cancelada. Não foi possível processar o reembolso automaticamente; nossa equipe irá processar em até 10 dias úteis.'
      } else {
        message = 'Assinatura cancelada. Reembolso será processado em até 10 dias úteis.'
      }
    }

    if (mercadoPagoError) {
      message += ' (Houve um problema ao cancelar no Mercado Pago, mas a assinatura foi cancelada no sistema. Entre em contato com o suporte se necessário.)'
    }

    return NextResponse.json({
      success: true,
      canceled: true,
      message,
      refundRequested: requestRefund && dentroGarantia,
      refundSuccess: refundRequested ? refundSuccess : undefined,
      withinGuarantee: dentroGarantia,
      daysSincePurchase: diasDesdeCompra,
      mercadoPagoCanceled,
      mercadoPagoError: mercadoPagoError || undefined
    })
  } catch (error: any) {
    console.error('❌ Erro ao confirmar cancelamento:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar cancelamento' },
      { status: 500 }
    )
  }
}
