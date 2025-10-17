import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../../lib/stripe-subscriptions'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Obter dados da assinatura do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    // Buscar dados do profissional pelo userId
    const { data: professional, error: profError } = await supabase
      .from('professionals')
      .select('id, email, username, subscription_status, subscription_plan, stripe_customer_id, grace_period_end')
      .eq('id', userId)
      .single()

    if (profError) {
      console.error('Erro ao buscar profissional:', profError)
      return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 })
    }


    // Buscar dados da assinatura se existir
    let subscription = null
    let payments = []

    if (professional.stripe_customer_id) {
      try {
        // Buscar assinatura ativa no Stripe
        const stripeSubscriptions = await stripe.subscriptions.list({
          customer: professional.stripe_customer_id,
          status: 'all',
          limit: 1
        })

        if (stripeSubscriptions.data.length > 0) {
          subscription = stripeSubscriptions.data[0]
        }

        // Buscar histórico de pagamentos
        const { data: paymentData, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('professional_id', professional.id)
          .order('created_at', { ascending: false })
          .limit(10)

        if (!paymentsError) {
          payments = paymentData || []
        }
      } catch (stripeError) {
        console.error('Erro ao buscar dados do Stripe:', stripeError)
      }
    }

    // Verificar se tem assinatura ativa (incluindo período de graça)
    const hasActiveSubscription = professional.subscription_status === 'active'
    
    // Se tem período de graça, verificar se ainda é válido
    let isGracePeriodValid = true
    if (professional.grace_period_end) {
      const graceEndDate = new Date(professional.grace_period_end)
      const now = new Date()
      isGracePeriodValid = graceEndDate > now
    }

    return NextResponse.json({
      id: professional.id,
      email: professional.email,
      username: professional.username,
      subscription_status: professional.subscription_status,
      subscription_plan: professional.subscription_plan,
      grace_period_end: professional.grace_period_end,
      subscription: subscription,
      payments: payments,
      hasActiveSubscription: hasActiveSubscription && isGracePeriodValid
    })

  } catch (error) {
    console.error('Erro na API de assinatura:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// POST - Cancelar assinatura
export async function POST(request: NextRequest) {
  try {
    const { action, subscriptionId, cancelAtPeriodEnd = true } = await request.json()
    
    if (!action || !subscriptionId) {
      return NextResponse.json({ error: 'Ação e ID da assinatura são obrigatórios' }, { status: 400 })
    }

    if (action === 'cancel') {
      // Cancelar assinatura no Stripe
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd
      })

      // Atualizar no banco de dados
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: cancelAtPeriodEnd,
          canceled_at: cancelAtPeriodEnd ? null : new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId)

      if (updateError) {
        console.error('Erro ao atualizar assinatura no banco:', updateError)
      }

      return NextResponse.json({
        success: true,
        message: cancelAtPeriodEnd 
          ? 'Assinatura será cancelada no final do período atual'
          : 'Assinatura cancelada imediatamente',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_end: subscription.current_period_end
        }
      })

    } else if (action === 'reactivate') {
      // Reativar assinatura cancelada
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      })

      // Atualizar no banco de dados
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: false,
          canceled_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId)

      if (updateError) {
        console.error('Erro ao atualizar assinatura no banco:', updateError)
      }

      return NextResponse.json({
        success: true,
        message: 'Assinatura reativada com sucesso',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end
        }
      })

    } else if (action === 'change_plan') {
      const { newPlanType } = await request.json()
      
      if (!newPlanType) {
        return NextResponse.json({ error: 'Tipo do novo plano é obrigatório' }, { status: 400 })
      }

      // Buscar o price ID do novo plano
      const priceIds = {
        monthly: 'price_1SI7BEEVE42ibKnXR2Y5XAuW',
        yearly: 'price_1SI7CSEVE42ibKnXA0pA9OYX'
      }

      const newPriceId = priceIds[newPlanType as keyof typeof priceIds]
      if (!newPriceId) {
        return NextResponse.json({ error: 'Tipo de plano inválido' }, { status: 400 })
      }

      // Alterar plano no Stripe
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: (await stripe.subscriptions.retrieve(subscriptionId)).items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'create_prorations'
      })

      // Atualizar no banco de dados
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          plan_type: newPlanType,
          stripe_price_id: newPriceId,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId)

      if (updateError) {
        console.error('Erro ao atualizar plano no banco:', updateError)
      }

      return NextResponse.json({
        success: true,
        message: 'Plano alterado com sucesso',
        subscription: {
          id: subscription.id,
          status: subscription.status,
          plan_type: newPlanType
        }
      })

    } else {
      return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 })
    }

  } catch (error) {
    console.error('Erro na API de assinatura:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
