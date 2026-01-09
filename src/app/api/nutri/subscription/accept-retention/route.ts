import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/nutri/subscription/accept-retention
 * Processa aceitação da oferta de retenção
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

    // Processar ação baseada no tipo de retenção
    let actionTaken = ''
    let message = ''

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
        message = 'Perfeito! Vamos começar o tour guiado. A LYA vai te ajudar agora.'
        break

      case 'show_feature':
        // Marcar que aceitou ver feature (implementação fica no frontend)
        actionTaken = 'feature_shown'
        message = 'Ótimo! Vamos te mostrar como criar uma ferramenta agora.'
        break

      case 'pause_subscription':
        // Pausar assinatura por 30 dias
        const pauseUntil = new Date()
        pauseUntil.setDate(pauseUntil.getDate() + 30)

        const { error: pauseError } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'paused',
            current_period_end: pauseUntil.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.id)

        if (pauseError) {
          throw new Error('Erro ao pausar assinatura')
        }

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
        retention_accepted: true,
        retention_action_taken: actionTaken,
        final_action: 'retained',
        updated_at: new Date().toISOString()
      })
      .eq('id', cancelAttemptId)

    return NextResponse.json({
      success: true,
      action: actionTaken,
      message
    })
  } catch (error: any) {
    console.error('❌ Erro ao processar aceitação de retenção:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar aceitação de retenção' },
      { status: 500 }
    )
  }
}

