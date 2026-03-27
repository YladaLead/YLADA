import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'
import { isSubscriptionCancellableViaYladaMatrixFlow } from '@/lib/subscription-helpers'

/**
 * POST /api/ylada/subscription/accept-retention
 * Aceita oferta de retenção do fluxo unificado da matriz.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...YLADA_API_ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json()
    const { cancelAttemptId, retentionType } = body

    if (!cancelAttemptId || !retentionType) {
      return NextResponse.json(
        { error: 'cancelAttemptId e retentionType são obrigatórios' },
        { status: 400 }
      )
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
      return NextResponse.json({ error: 'Assinatura não elegível para este fluxo.' }, { status: 403 })
    }

    let actionTaken = ''
    let message = ''

    switch (retentionType) {
      case 'extend_trial': {
        const currentExpiry = new Date(
          (subscription.current_period_end as string) || (subscription.created_at as string)
        )
        const newExpiry = new Date(currentExpiry)
        newExpiry.setDate(newExpiry.getDate() + 7)

        const { error: updateError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            current_period_end: newExpiry.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id as string)

        if (updateError) throw new Error('Erro ao estender trial')

        await supabaseAdmin.from('trial_extensions').insert({
          user_id: user.id,
          subscription_id: subscription.id as string,
          cancel_attempt_id: cancelAttemptId,
          extension_days: 7,
          original_expiry_date: currentExpiry.toISOString(),
          new_expiry_date: newExpiry.toISOString(),
          status: 'active',
        })

        actionTaken = 'trial_extended'
        message = 'Período estendido por 7 dias. Você tem mais tempo para testar.'
        break
      }

      case 'guided_tour':
        actionTaken = 'tour_accepted'
        message = 'Perfeito! O Noel pode te guiar agora na home.'
        break

      case 'show_feature':
        actionTaken = 'feature_shown'
        message = 'Ótimo! Abra seus links para criar ou editar um diagnóstico.'
        break

      case 'pause_subscription': {
        const pauseUntil = new Date()
        pauseUntil.setDate(pauseUntil.getDate() + 30)

        const { error: pauseError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'paused',
            current_period_end: pauseUntil.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscription.id as string)

        if (pauseError) throw new Error('Erro ao pausar assinatura')

        actionTaken = 'subscription_paused'
        message = 'Assinatura pausada por 30 dias. Você pode retomar quando quiser.'
        break
      }

      default:
        return NextResponse.json({ error: 'Tipo de retenção inválido' }, { status: 400 })
    }

    await supabaseAdmin
      .from('cancel_attempts')
      .update({
        retention_accepted: true,
        retention_action_taken: actionTaken,
        final_action: 'retained',
        updated_at: new Date().toISOString(),
      })
      .eq('id', cancelAttemptId)

    return NextResponse.json({
      success: true,
      action: actionTaken,
      message,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao processar aceitação de retenção'
    console.error('[/api/ylada/subscription/accept-retention]', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
