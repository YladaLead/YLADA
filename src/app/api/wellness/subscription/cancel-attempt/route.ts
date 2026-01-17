import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getActiveSubscription } from '@/lib/subscription-helpers'
import { supabaseAdmin } from '@/lib/supabase'

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

const RETENTION_STRATEGY: Record<CancelReason, RetentionOffer> = {
  'no_time': {
    type: 'extend_trial',
    message: 'Isso é super comum 😊 Quer que a gente pause sua cobrança por mais 7 dias, sem custo, pra você testar com calma?',
    actionButton: 'Estender trial por 7 dias'
  },
  'didnt_understand': {
    type: 'guided_tour',
    message: 'Talvez a gente não tenha te mostrado o melhor caminho ainda. Quer que o NOEL te guie em 5 minutos agora?',
    actionButton: 'Quero ajuda agora'
  },
  'no_value': {
    type: 'show_feature',
    message: 'Entendo. Em 90% dos casos, o valor aparece quando a pessoa usa as ferramentas. Quer testar criar um link agora antes de sair?',
    actionButton: 'Me mostra agora'
  },
  'forgot_trial': {
    type: 'extend_trial',
    message: 'Sem problemas 😊 Podemos te avisar e adiar a cobrança por mais 7 dias, se quiser.',
    actionButton: 'Adiar cobrança + estender trial'
  },
  'too_expensive': {
    type: 'pause_subscription',
    message: 'Entendemos. Que tal pausar por 30 dias sem custo? Você pode retomar quando quiser.',
    actionButton: 'Pausar por 30 dias'
  },
  'found_alternative': {
    type: null,
    message: 'Entendemos sua decisão. Tem certeza que quer cancelar?',
    actionButton: null
  },
  'other': {
    type: null,
    message: 'Obrigado pelo feedback. Tem certeza que quer cancelar?',
    actionButton: null
  }
}

/**
 * POST /api/wellness/subscription/cancel-attempt
 * Registra tentativa de cancelamento e retorna oferta de retenção
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { cancelReason, cancelReasonOther, subscriptionId } = body

    // Validar motivo
    const validReasons: CancelReason[] = [
      'no_time',
      'didnt_understand',
      'no_value',
      'forgot_trial',
      'too_expensive',
      'found_alternative',
      'other'
    ]

    if (!cancelReason || !validReasons.includes(cancelReason)) {
      return NextResponse.json(
        { error: 'Motivo de cancelamento inválido' },
        { status: 400 }
      )
    }

    // Buscar assinatura
    let subData: any
    
    if (subscriptionId) {
      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .eq('user_id', user.id)
        .single()
      
      if (error || !data) {
        return NextResponse.json(
          { error: 'Nenhuma assinatura encontrada' },
          { status: 404 }
        )
      }
      subData = data
    } else {
      const subscription = await getActiveSubscription(user.id, 'wellness')
      if (!subscription) {
        return NextResponse.json(
          { error: 'Nenhuma assinatura ativa encontrada' },
          { status: 404 }
        )
      }
      subData = subscription
    }

    // Calcular dias desde a compra
    const dataInicio = new Date(subData.current_period_start || subData.created_at)
    const hoje = new Date()
    const diasDesdeCompra = Math.floor((hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24))
    const dentroGarantia = diasDesdeCompra <= 7

    // Verificar se já teve retenção oferecida E se já usou extensão de trial
    const { data: existingAttempts } = await supabaseAdmin
      .from('cancel_attempts')
      .select('id, retention_offered')
      .eq('subscription_id', subData.id)
      .eq('user_id', user.id)
      .not('retention_offered', 'is', null)
      .limit(1)

    const alreadyOfferedRetention = existingAttempts && existingAttempts.length > 0

    // Verificar se já usou extensão de trial (para evitar abuso)
    const { data: existingExtensions } = await supabaseAdmin
      .from('trial_extensions')
      .select('id, status')
      .eq('subscription_id', subData.id)
      .eq('user_id', user.id)
      .in('status', ['active', 'used'])
      .limit(1)

    const alreadyUsedTrialExtension = existingExtensions && existingExtensions.length > 0

    // Criar registro de tentativa de cancelamento
    const { data: cancelAttempt, error: insertError } = await supabaseAdmin
      .from('cancel_attempts')
      .insert({
        user_id: user.id,
        subscription_id: subData.id,
        cancel_reason: cancelReason,
        cancel_reason_other: cancelReasonOther || null,
        days_since_purchase: diasDesdeCompra,
        within_guarantee: dentroGarantia,
        final_action: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Erro ao criar cancel_attempt:', insertError)
      return NextResponse.json(
        { error: 'Erro ao registrar tentativa de cancelamento' },
        { status: 500 }
      )
    }

    // Determinar oferta de retenção
    let retentionOffer: RetentionOffer | null = null

    // Se já teve retenção oferecida OU já usou extensão de trial, não oferecer novamente
    if (!alreadyOfferedRetention && !alreadyUsedTrialExtension) {
      retentionOffer = RETENTION_STRATEGY[cancelReason]
      
      // Se a oferta for extend_trial e já usou antes, não oferecer
      if (retentionOffer?.type === 'extend_trial' && alreadyUsedTrialExtension) {
        retentionOffer = null
      } else if (retentionOffer && retentionOffer.type) {
        // Atualizar registro com oferta
        await supabaseAdmin
          .from('cancel_attempts')
          .update({
            retention_offered: retentionOffer.type
          })
          .eq('id', cancelAttempt.id)

        // Atualizar contador na subscription
        await supabaseAdmin
          .from('subscriptions')
          .update({
            retention_offered_at: new Date().toISOString(),
            retention_attempts_count: (subData.retention_attempts_count || 0) + 1
          })
          .eq('id', subData.id)
      }
    } else if (alreadyUsedTrialExtension) {
      // Se já usou extensão, não oferecer extend_trial, mas pode oferecer outras opções
      const strategy = RETENTION_STRATEGY[cancelReason]
      if (strategy.type !== 'extend_trial') {
        retentionOffer = strategy
        if (retentionOffer && retentionOffer.type) {
          await supabaseAdmin
            .from('cancel_attempts')
            .update({
              retention_offered: retentionOffer.type
            })
            .eq('id', cancelAttempt.id)
        }
      }
    }

    return NextResponse.json({
      success: true,
      cancelAttemptId: cancelAttempt.id,
      retentionOffer: retentionOffer ? {
        type: retentionOffer.type,
        message: retentionOffer.message,
        actionButton: retentionOffer.actionButton
      } : null,
      withinGuarantee: dentroGarantia,
      daysSincePurchase: diasDesdeCompra
    })
  } catch (error: any) {
    console.error('❌ Erro ao processar tentativa de cancelamento:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar tentativa de cancelamento' },
      { status: 500 }
    )
  }
}
