import { NextRequest, NextResponse } from 'next/server'
import { getStripeConfig, getStripeInstance } from '@/lib/stripe-helpers'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

/**
 * POST /api/webhooks/stripe-us
 * Webhook para processar eventos do Stripe US
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Obter configuração Stripe US
    const config = getStripeConfig('us', process.env.NODE_ENV !== 'production')
    
    if (!config.webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET_US não configurado')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Criar instância do Stripe US
    const stripe = await getStripeInstance('us', process.env.NODE_ENV !== 'production')

    // Verificar assinatura do webhook
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        config.webhookSecret
      )
    } catch (err: any) {
      console.error('❌ Erro ao verificar webhook US:', err.message)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      )
    }

    console.log(`📥 Webhook US recebido: ${event.type}`)

    // Processar evento
    await handleStripeEvent(event, 'us')

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ Erro no webhook US:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Processa eventos do Stripe
 */
async function handleStripeEvent(event: Stripe.Event, stripeAccount: 'br' | 'us') {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, stripeAccount)
      break

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, stripeAccount)
      break

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, stripeAccount)
      break

    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, stripeAccount)
      break

    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, stripeAccount)
      break

    default:
      console.log(`⚠️ Evento não processado: ${event.type}`)
  }
}

/**
 * Processa checkout.session.completed
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  stripeAccount: 'br' | 'us'
) {
  console.log('✅ Checkout session completed:', session.id)

  const userId = session.client_reference_id || session.metadata?.user_id
  if (!userId) {
    console.error('❌ User ID não encontrado na sessão')
    return
  }

  // Verificar se é pagamento único ou assinatura
  const paymentMode = session.metadata?.payment_mode || (session.mode === 'payment' ? 'one_time' : 'subscription')
  
  if (paymentMode === 'one_time' || session.mode === 'payment') {
    // Pagamento único (plano anual parcelado)
    await handleOneTimePayment(session, stripeAccount)
  } else if (session.subscription && typeof session.subscription === 'string') {
    // Assinatura (plano mensal)
    const stripe = await getStripeInstance(stripeAccount, process.env.NODE_ENV !== 'production')
    const subscription = await stripe.subscriptions.retrieve(session.subscription)
    await handleSubscriptionUpdated(subscription, stripeAccount)
  }
}

/**
 * Processa pagamento único (plano anual parcelado)
 */
async function handleOneTimePayment(
  session: Stripe.Checkout.Session,
  stripeAccount: 'br' | 'us'
) {
  console.log('💳 Processando pagamento único:', session.id)

  const userId = session.client_reference_id || session.metadata?.user_id
  if (!userId) {
    console.error('❌ User ID não encontrado na sessão')
    return
  }

  const area = session.metadata?.area || 'wellness'
  const planType = session.metadata?.plan_type || 'annual'

  // Obter informações do pagamento
  const stripe = await getStripeInstance(stripeAccount, process.env.NODE_ENV !== 'production')
  const paymentIntentId = session.payment_intent as string

  if (!paymentIntentId) {
    console.error('❌ Payment Intent não encontrado na sessão')
    return
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  const amount = paymentIntent.amount
  const currency = paymentIntent.currency

  // Calcular data de expiração (12 meses a partir de agora)
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 12)

  // Criar "assinatura" no banco (mas é pagamento único)
  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      user_id: userId,
      area: area,
      plan_type: planType,
      stripe_account: stripeAccount,
      stripe_subscription_id: `one_time_${session.id}`, // ID único para pagamento único
      stripe_customer_id: session.customer as string || null,
      stripe_price_id: session.metadata?.price_id || session.line_items?.data[0]?.price?.id || null,
      amount: amount,
      currency: currency,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: expiresAt.toISOString(),
      cancel_at_period_end: false,
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Erro ao criar subscription para pagamento único:', error)
    throw error
  }

  // Criar registro de pagamento
  const { error: paymentError } = await supabaseAdmin
    .from('payments')
    .insert({
      subscription_id: subscription.id,
      user_id: userId,
      stripe_account: stripeAccount,
      stripe_payment_intent_id: paymentIntentId,
      stripe_invoice_id: session.invoice as string || null,
      stripe_charge_id: paymentIntent.latest_charge as string || null,
      amount: amount,
      currency: currency,
      status: 'succeeded',
      receipt_url: session.customer_details?.email ? null : null, // Receipt será gerado pelo Stripe
      payment_method: paymentIntent.payment_method_types?.[0] || 'card',
    })

  if (paymentError) {
    console.error('❌ Erro ao salvar pagamento único:', paymentError)
    throw paymentError
  }

  console.log('✅ Pagamento único processado e acesso ativado:', session.id)
  console.log(`📅 Acesso válido até: ${expiresAt.toISOString()}`)
}

/**
 * Processa customer.subscription.created ou updated
 */
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  stripeAccount: 'br' | 'us'
) {
  console.log('📝 Subscription updated:', subscription.id)

  const userId = subscription.metadata?.user_id || subscription.metadata?.client_reference_id
  if (!userId) {
    console.error('❌ User ID não encontrado na subscription')
    return
  }

  const area = subscription.metadata?.area || 'wellness'
  const planType = subscription.metadata?.plan_type || 
                   (subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'annual' : 'monthly')

  // Obter informações do preço
  const price = subscription.items.data[0]?.price
  const amount = price?.unit_amount || 0
  const currency = price?.currency || 'usd'

  // Mapear status do Stripe para nosso status
  const statusMap: Record<string, string> = {
    active: 'active',
    canceled: 'canceled',
    past_due: 'past_due',
    unpaid: 'unpaid',
    trialing: 'trialing',
    incomplete: 'incomplete',
    incomplete_expired: 'canceled',
  }

  const status = statusMap[subscription.status] || 'incomplete'

  // Upsert subscription no banco
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert({
      user_id: userId,
      area,
      plan_type: planType,
      stripe_account: stripeAccount,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      stripe_price_id: price?.id || '',
      amount,
      currency,
      status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'stripe_subscription_id',
    })

  if (error) {
    console.error('❌ Erro ao salvar subscription:', error)
    throw error
  }

  console.log('✅ Subscription salva no banco:', subscription.id)
}

/**
 * Processa customer.subscription.deleted
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  stripeAccount: 'br' | 'us'
) {
  console.log('🗑️ Subscription deleted:', subscription.id)

  // Atualizar status para canceled
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    console.error('❌ Erro ao atualizar subscription cancelada:', error)
    throw error
  }

  console.log('✅ Subscription cancelada no banco:', subscription.id)
}

/**
 * Processa invoice.payment_succeeded
 */
async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  stripeAccount: 'br' | 'us'
) {
  console.log('💰 Invoice payment succeeded:', invoice.id)

  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) {
    return
  }

  // Buscar subscription no banco
  const { data: subscription } = await supabaseAdmin
    .from('subscriptions')
    .select('id, user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (!subscription) {
    console.error('❌ Subscription não encontrada no banco')
    return
  }

  // Criar registro de pagamento
  const { error } = await supabaseAdmin
    .from('payments')
    .insert({
      subscription_id: subscription.id,
      user_id: subscription.user_id,
      stripe_account: stripeAccount,
      stripe_payment_intent_id: invoice.payment_intent as string || null,
      stripe_invoice_id: invoice.id,
      stripe_charge_id: invoice.charge as string || null,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      receipt_url: invoice.hosted_invoice_url || null,
      payment_method: invoice.payment_method_types?.[0] || 'card',
    })

  if (error) {
    console.error('❌ Erro ao salvar pagamento:', error)
    throw error
  }

  console.log('✅ Pagamento salvo no banco:', invoice.id)
}

/**
 * Processa invoice.payment_failed
 */
async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  stripeAccount: 'br' | 'us'
) {
  console.log('❌ Invoice payment failed:', invoice.id)

  const subscriptionId = invoice.subscription as string
  if (!subscriptionId) {
    return
  }

  // Atualizar status da subscription para past_due ou unpaid
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId)

  if (error) {
    console.error('❌ Erro ao atualizar subscription com pagamento falho:', error)
    throw error
  }

  console.log('⚠️ Subscription atualizada para past_due:', subscriptionId)
}

