import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getActiveSubscription } from '@/lib/subscription-helpers'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/wellness/subscription/accept-retention
 * Aceita oferta de retenção (extend_trial, pause_subscription, etc)
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
    const { cancelAttemptId, retentionType } = body

    if (!cancelAttemptId || !retentionType) {
      return NextResponse.json(
        { error: 'cancelAttemptId e retentionType são obrigatórios' },
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

    // Buscar subscription
    let subscription: any
    if (cancelAttempt.subscriptions && typeof cancelAttempt.subscriptions === 'object') {
      subscription = Array.isArray(cancelAttempt.subscriptions) 
        ? cancelAttempt.subscriptions[0] 
        : cancelAttempt.subscriptions
    } else {
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

    // Verificar se já usou extensão de trial (para evitar abuso)
    if (retentionType === 'extend_trial') {
      const { data: existingExtensions } = await supabaseAdmin
        .from('trial_extensions')
        .select('id')
        .eq('subscription_id', subscription.id)
        .eq('user_id', user.id)
        .in('status', ['active', 'used'])
        .limit(1)

      if (existingExtensions && existingExtensions.length > 0) {
        return NextResponse.json(
          { error: 'Você já usou a extensão de trial de 7 dias. Esta oferta só pode ser usada uma vez por assinatura.' },
          { status: 400 }
        )
      }
    }

    let actionTaken = ''
    let message = ''

    // Processar ação baseada no tipo de retenção
    switch (retentionType) {
      case 'extend_trial':
        // Estender trial por 7 dias
        const currentExpiry = new Date(subscription.current_period_end || subscription.created_at)
        const newExpiry = new Date(currentExpiry)
        newExpiry.setDate(newExpiry.getDate() + 7)

        // Atualizar subscription
        const { error: updateError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            current_period_end: newExpiry.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.id)

        if (updateError) {
          throw new Error('Erro ao estender trial')
        }

        // Criar registro de extensão
        await supabaseAdmin
          .from('trial_extensions')
          .insert({
            user_id: user.id,
            subscription_id: subscription.id,
            cancel_attempt_id: cancelAttemptId,
            extension_days: 7,
            original_expiry_date: currentExpiry.toISOString(),
            new_expiry_date: newExpiry.toISOString(),
            status: 'active'
          })

        actionTaken = 'trial_extended'
        message = 'Trial estendido por 7 dias! Você tem mais tempo para testar. 😊'
        break

      case 'guided_tour':
        // Marcar que aceitou tour (implementação do tour fica no frontend)
        actionTaken = 'tour_accepted'
        message = 'Perfeito! Vamos começar o tour guiado. O NOEL vai te ajudar agora.'
        break

      case 'show_feature':
        // Marcar que aceitou ver feature (implementação fica no frontend)
        actionTaken = 'feature_shown'
        message = 'Ótimo! Vamos te mostrar como criar um link agora.'
        break

      case 'pause_subscription':
        // Pausar assinatura por 30 dias
        const pauseUntil = new Date()
        pauseUntil.setDate(pauseUntil.getDate() + 30)

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'paused',
            paused_until: pauseUntil.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.id)

        actionTaken = 'subscription_paused'
        message = 'Assinatura pausada por 30 dias. Você pode retomar quando quiser!'
        break

      default:
        return NextResponse.json(
          { error: 'Tipo de retenção inválido' },
          { status: 400 }
        )
    }

    // Atualizar cancel_attempt
    await supabaseAdmin
      .from('cancel_attempts')
      .update({
        final_action: 'retention_accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', cancelAttemptId)

    return NextResponse.json({
      success: true,
      actionTaken,
      message
    })
  } catch (error: any) {
    console.error('❌ Erro ao aceitar retenção:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar retenção' },
      { status: 500 }
    )
  }
}
