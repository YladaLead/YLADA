import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getActiveSubscriptionForYladaConfig } from '@/lib/subscription-helpers'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'

type CancelReason =
  | 'no_time'
  | 'didnt_understand'
  | 'no_value'
  | 'forgot_trial'
  | 'too_expensive'
  | 'found_alternative'
  | 'other'

type RetentionOffer = {
  type: 'extend_trial' | 'guided_tour' | 'show_feature' | 'pause_subscription' | null
  message: string
  actionButton: string | null
}

/** Mensagens alinhadas à matriz YLADA (diagnósticos, links, Noel). */
const RETENTION_STRATEGY: Record<CancelReason, RetentionOffer> = {
  no_time: {
    type: 'extend_trial',
    message:
      'Isso é super comum. Quer que a gente pause sua cobrança por mais 7 dias, sem custo, para você testar com calma?',
    actionButton: 'Estender trial por 7 dias',
  },
  didnt_understand: {
    type: 'guided_tour',
    message:
      'Talvez a gente não tenha te mostrado o melhor caminho ainda. Quer que o Noel te guie em poucos minutos agora?',
    actionButton: 'Quero ajuda agora',
  },
  no_value: {
    type: 'show_feature',
    message:
      'Na maioria dos casos o valor aparece quando o diagnóstico está no ar e sendo compartilhado. Quer criar ou revisar um link agora, antes de sair?',
    actionButton: 'Ir para meus links',
  },
  forgot_trial: {
    type: 'extend_trial',
    message: 'Sem problemas. Podemos adiar a cobrança por mais 7 dias, se quiser.',
    actionButton: 'Adiar cobrança + estender trial',
  },
  too_expensive: {
    type: 'pause_subscription',
    message: 'Entendemos. Que tal pausar por 30 dias sem custo? Você pode retomar quando quiser.',
    actionButton: 'Pausar por 30 dias',
  },
  found_alternative: {
    type: null,
    message: 'Entendemos sua decisão. Tem certeza que quer cancelar?',
    actionButton: null,
  },
  other: {
    type: null,
    message: 'Obrigado pelo feedback. Tem certeza que quer cancelar?',
    actionButton: null,
  },
}

/**
 * POST /api/ylada/subscription/cancel-attempt
 * Fluxo unificado de cancelamento da matriz (Configurações em cada área).
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...YLADA_API_ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json()
    const { cancelReason, cancelReasonOther, subscriptionId } = body

    const validReasons: CancelReason[] = [
      'no_time',
      'didnt_understand',
      'no_value',
      'forgot_trial',
      'too_expensive',
      'found_alternative',
      'other',
    ]

    if (!cancelReason || !validReasons.includes(cancelReason)) {
      return NextResponse.json({ error: 'Motivo de cancelamento inválido' }, { status: 400 })
    }

    let subData: Record<string, unknown>

    if (subscriptionId) {
      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        return NextResponse.json({ error: 'Nenhuma assinatura encontrada' }, { status: 404 })
      }
      subData = data as Record<string, unknown>
    } else {
      const subscription = await getActiveSubscriptionForYladaConfig(user.id)
      if (!subscription) {
        return NextResponse.json({ error: 'Nenhuma assinatura ativa encontrada' }, { status: 404 })
      }
      subData = subscription as Record<string, unknown>
    }

    const dataInicio = new Date(
      (subData.current_period_start as string) || (subData.created_at as string)
    )
    const hoje = new Date()
    const diasDesdeCompra = Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
    const dentroGarantia = diasDesdeCompra <= 7

    const { data: existingAttempts } = await supabaseAdmin
      .from('cancel_attempts')
      .select('id, retention_offered')
      .eq('subscription_id', subData.id as string)
      .eq('user_id', user.id)
      .not('retention_offered', 'is', null)
      .limit(1)

    const alreadyOfferedRetention = existingAttempts && existingAttempts.length > 0

    const { data: cancelAttempt, error: insertError } = await supabaseAdmin
      .from('cancel_attempts')
      .insert({
        user_id: user.id,
        subscription_id: subData.id as string,
        cancel_reason: cancelReason,
        cancel_reason_other: cancelReasonOther || null,
        days_since_purchase: diasDesdeCompra,
        within_guarantee: dentroGarantia,
        final_action: 'pending',
      })
      .select()
      .single()

    if (insertError) {
      console.error('[/api/ylada/subscription/cancel-attempt]', insertError)
      return NextResponse.json({ error: 'Erro ao registrar tentativa de cancelamento' }, { status: 500 })
    }

    let retentionOffer: RetentionOffer | null = null

    if (!alreadyOfferedRetention) {
      retentionOffer = RETENTION_STRATEGY[cancelReason]

      if (retentionOffer?.type) {
        await supabaseAdmin
          .from('cancel_attempts')
          .update({ retention_offered: retentionOffer.type })
          .eq('id', cancelAttempt.id)

        await supabaseAdmin
          .from('subscriptions')
          .update({
            retention_offered_at: new Date().toISOString(),
            retention_attempts_count: ((subData.retention_attempts_count as number) || 0) + 1,
          })
          .eq('id', subData.id as string)
      }
    }

    return NextResponse.json({
      success: true,
      cancelAttemptId: cancelAttempt.id,
      retentionOffer: retentionOffer
        ? {
            type: retentionOffer.type,
            message: retentionOffer.message,
            actionButton: retentionOffer.actionButton,
          }
        : null,
      withinGuarantee: dentroGarantia,
      daysSincePurchase: diasDesdeCompra,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao processar tentativa de cancelamento'
    console.error('[/api/ylada/subscription/cancel-attempt]', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
