import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'
import {
  cancelMercadoPagoSubscription,
  getMercadoPagoPreapprovalIdForCancel,
  refundMercadoPagoPayment,
} from '@/lib/mercado-pago-helpers'
import { notifyAdminRefundRequest } from '@/lib/refund-notifications'
import { isSubscriptionCancellableViaYladaMatrixFlow } from '@/lib/subscription-helpers'

/**
 * POST /api/ylada/subscription/confirm-cancel
 * Confirma cancelamento após fluxo de motivo + retenção (matriz YLADA).
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...YLADA_API_ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json()
    const { cancelAttemptId, requestRefund, reason } = body

    if (!cancelAttemptId) {
      return NextResponse.json({ error: 'cancelAttemptId é obrigatório' }, { status: 400 })
    }

    const { data: cancelAttempt, error: fetchError } = await supabaseAdmin
      .from('cancel_attempts')
      .select('*, subscriptions(*)')
      .eq('id', cancelAttemptId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !cancelAttempt) {
      return NextResponse.json({ error: 'Tentativa de cancelamento não encontrada' }, { status: 404 })
    }

    let subscription: Record<string, unknown>
    if (cancelAttempt.subscriptions && typeof cancelAttempt.subscriptions === 'object') {
      subscription = (
        Array.isArray(cancelAttempt.subscriptions)
          ? cancelAttempt.subscriptions[0]
          : cancelAttempt.subscriptions
      ) as Record<string, unknown>
    } else {
      const { data: subData, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('id', cancelAttempt.subscription_id)
        .single()

      if (subError || !subData) {
        return NextResponse.json({ error: 'Assinatura não encontrada' }, { status: 404 })
      }
      subscription = subData as Record<string, unknown>
    }

    if (!isSubscriptionCancellableViaYladaMatrixFlow(subscription.area as string)) {
      return NextResponse.json(
        { error: 'Esta assinatura não pode ser cancelada por este fluxo.' },
        { status: 403 }
      )
    }

    if (subscription.status === 'canceled') {
      return NextResponse.json({
        success: true,
        canceled: true,
        message: 'Assinatura já estava cancelada.',
      })
    }

    const dataInicio = new Date(
      (subscription.current_period_start as string) || (subscription.created_at as string)
    )
    const hoje = new Date()
    const diasDesdeCompra = Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
    const dentroGarantia = diasDesdeCompra <= 7

    if (requestRefund && !dentroGarantia) {
      return NextResponse.json(
        {
          error: 'Prazo de garantia de 7 dias expirado',
          daysSincePurchase: diasDesdeCompra,
          withinGuarantee: false,
        },
        { status: 400 }
      )
    }

    let mercadoPagoCanceled = false
    let mercadoPagoError: string | null = null

    const rawSubscriptionId =
      (subscription.gateway_subscription_id as string) || (subscription.stripe_subscription_id as string)
    const isMercadoPago =
      subscription.gateway === 'mercadopago' ||
      (typeof rawSubscriptionId === 'string' &&
        (rawSubscriptionId.startsWith('mp_') || rawSubscriptionId.startsWith('mp_sub_')))
    const preapprovalId = getMercadoPagoPreapprovalIdForCancel(rawSubscriptionId)

    if (isMercadoPago && preapprovalId) {
      const cancelResult = await cancelMercadoPagoSubscription(preapprovalId)
      if (cancelResult.success) mercadoPagoCanceled = true
      else mercadoPagoError = cancelResult.error || 'Erro desconhecido'
    }

    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', subscription.id as string)

    if (updateError) {
      console.error('[/api/ylada/subscription/confirm-cancel] DB', updateError)
      return NextResponse.json({ error: 'Erro ao cancelar assinatura' }, { status: 500 })
    }

    await supabaseAdmin
      .from('cancel_attempts')
      .update({
        final_action: 'canceled',
        canceled_at: new Date().toISOString(),
        request_refund: !!(requestRefund && dentroGarantia),
        updated_at: new Date().toISOString(),
      })
      .eq('id', cancelAttemptId)

    let refundRequested = false
    let refundSuccess = false
    let refundError: string | null = null

    if (requestRefund && dentroGarantia) {
      const { data: lastPayment } = await supabaseAdmin
        .from('payments')
        .select('id, stripe_payment_intent_id, amount, status')
        .eq('subscription_id', subscription.id as string)
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
      }

      let userEmail = user.email || ''
      let userName =
        (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || 'Usuário'

      try {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('nome_completo, email')
          .eq('user_id', user.id)
          .maybeSingle()
        if (profile) {
          userName = (profile.nome_completo as string) || userName
          userEmail = (profile.email as string) || userEmail
        }
      } catch (e) {
        console.warn('[confirm-cancel ylada] perfil', e)
      }

      try {
        await notifyAdminRefundRequest({
          subscriptionId: subscription.id as string,
          userId: user.id,
          userEmail,
          userName,
          area: 'ylada',
          amount: (subscription.amount as number) || 0,
          reason: reason || (cancelAttempt.cancel_reason as string) || 'other',
          daysSincePurchase: diasDesdeCompra,
          cancelAttemptId,
        })
      } catch (notificationError) {
        console.error('[confirm-cancel ylada] notify', notificationError)
      }
    }

    let message = 'Assinatura cancelada com sucesso.'

    if (requestRefund && dentroGarantia) {
      if (refundSuccess) {
        message =
          'Assinatura cancelada. Reembolso foi solicitado no cartão e deve aparecer em alguns dias úteis.'
      } else if (refundRequested && refundError) {
        message =
          'Assinatura cancelada. Não foi possível processar o reembolso automaticamente; nossa equipe irá processar em até 10 dias úteis.'
      } else {
        message = 'Assinatura cancelada. Reembolso será processado em até 10 dias úteis.'
      }
    }

    if (mercadoPagoError) {
      message +=
        ' (Houve um problema ao cancelar no Mercado Pago, mas a assinatura foi cancelada no sistema. Entre em contato com o suporte se necessário.)'
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
      mercadoPagoError: mercadoPagoError || undefined,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao processar cancelamento'
    console.error('[/api/ylada/subscription/confirm-cancel]', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
