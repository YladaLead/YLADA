import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPayment } from '@/lib/mercado-pago'

/**
 * POST /api/webhooks/mercado-pago
 * Webhook para processar eventos do Mercado Pago
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('x-signature')
    const requestId = request.headers.get('x-request-id')

    console.log('📥 Webhook Mercado Pago recebido:', {
      type: body.type,
      action: body.action,
      requestId,
    })

    // Validar webhook secret (se configurado)
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET
    if (webhookSecret && signature) {
      // TODO: Implementar validação completa do webhook
      // Por enquanto, apenas verificar se o secret está configurado
      console.log('✅ Webhook secret configurado')
    }

    // Processar evento baseado no tipo
    const eventType = body.type || body.action

    switch (eventType) {
      case 'payment':
        await handlePaymentEvent(body.data)
        break

      case 'merchant_order':
        await handleMerchantOrderEvent(body.data)
        break

      case 'subscription':
      case 'preapproval':
        await handleSubscriptionEvent(body.data)
        break

      default:
        console.log(`⚠️ Evento não processado: ${eventType}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ Erro no webhook Mercado Pago:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Processa evento de pagamento
 */
async function handlePaymentEvent(data: any) {
  const paymentId = data.id
  console.log('💳 Processando pagamento:', paymentId)

  try {
    // Verificar status do pagamento
    const isTest = process.env.NODE_ENV !== 'production'
    const paymentStatus = await verifyPayment(paymentId, isTest)

    console.log('📊 Status do pagamento:', paymentStatus)

    if (!paymentStatus.approved) {
      console.log('⚠️ Pagamento não aprovado:', paymentStatus.status)
      return
    }

    // Obter metadata do pagamento
    const metadata = data.metadata || {}
    const userId = metadata.user_id
    const area = metadata.area || 'wellness'
    const planType = metadata.plan_type || 'monthly'
    const paymentMethod = data.payment_method_id || 'unknown'

    if (!userId) {
      console.error('❌ User ID não encontrado no metadata do pagamento')
      return
    }

    // Obter informações do pagamento
    const amount = data.transaction_amount || 0
    const currency = data.currency_id || 'BRL'

    // Calcular data de expiração
    // Para assinaturas recorrentes (mensal e anual), calcular baseado na frequência
    const expiresAt = new Date()
    if (planType === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    } else if (planType === 'annual') {
      expiresAt.setMonth(expiresAt.getMonth() + 12) // 12 meses para plano anual
    } else {
      // Fallback (não deveria acontecer)
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    }

    // Verificar se é PIX (para assinaturas mensais PIX, marcar reminder_sent como false)
    const isPix = paymentMethod === 'account_money' || paymentMethod === 'pix'
    const reminderSent = planType === 'monthly' && isPix ? false : null // PIX mensal precisa de aviso

    // Criar ou atualizar assinatura no banco
    // Usar stripe_subscription_id temporariamente até atualizar o schema
    const subscriptionId = `mp_${paymentId}`
    
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId,
        area: area,
        plan_type: planType,
        stripe_account: null, // Mercado Pago não usa stripe_account
        stripe_subscription_id: subscriptionId, // Usar como ID único temporariamente
        stripe_customer_id: data.payer?.id?.toString() || 'mp_customer',
        stripe_price_id: 'mp_price', // Placeholder
        amount: Math.round(amount * 100), // Converter para centavos
        currency: currency.toLowerCase(),
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: expiresAt.toISOString(),
        cancel_at_period_end: false,
        reminder_sent: reminderSent, // false para PIX mensal (precisa aviso), null para outros
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'stripe_subscription_id',
      })
      .select()
      .single()

    if (subError) {
      console.error('❌ Erro ao salvar subscription:', subError)
      throw subError
    }

    // Criar registro de pagamento
    // Usar campos Stripe temporariamente até atualizar o schema
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        subscription_id: subscription.id,
        user_id: userId,
        stripe_account: null, // Mercado Pago não usa stripe_account
        stripe_payment_intent_id: paymentId, // Usar como ID único
        stripe_invoice_id: data.order?.id?.toString() || null,
        stripe_charge_id: null,
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        status: 'succeeded',
        receipt_url: data.external_resource_url || null,
        payment_method: data.payment_method_id || 'unknown',
      })

    if (paymentError) {
      console.error('❌ Erro ao salvar pagamento:', paymentError)
      throw paymentError
    }

    console.log('✅ Pagamento processado e acesso ativado:', paymentId)
    console.log(`📅 Acesso válido até: ${expiresAt.toISOString()}`)
  } catch (error: any) {
    console.error('❌ Erro ao processar pagamento:', error)
    throw error
  }
}

/**
 * Processa evento de ordem do comerciante
 */
async function handleMerchantOrderEvent(data: any) {
  console.log('📦 Processando merchant order:', data.id)
  // Merchant order geralmente contém informações sobre múltiplos pagamentos
  // Por enquanto, vamos processar apenas os pagamentos individuais
}

/**
 * Processa evento de assinatura recorrente (Preapproval)
 */
async function handleSubscriptionEvent(data: any) {
  const subscriptionId = data.id
  console.log('🔄 Processando assinatura recorrente (Preapproval):', subscriptionId)

  try {
    // Obter metadata da assinatura
    const metadata = data.metadata || {}
    const userId = metadata.user_id
    const area = metadata.area || 'wellness'
    const planType = metadata.plan_type || 'monthly'

    if (!userId) {
      console.error('❌ User ID não encontrado no metadata da assinatura')
      return
    }

    // Status da assinatura
    const status = data.status // 'authorized', 'paused', 'cancelled'
    
    // Mapear status do Mercado Pago para nosso status
    const statusMap: Record<string, string> = {
      authorized: 'active',
      paused: 'paused',
      cancelled: 'canceled',
      pending: 'pending',
    }
    
    const mappedStatus = statusMap[status] || 'pending'

    // Obter informações financeiras
    const amount = data.auto_recurring?.transaction_amount || 0
    const currency = data.auto_recurring?.currency_id || 'BRL'

           // Calcular datas de período baseado no tipo de plano
           const now = new Date()
           const periodEnd = new Date()
           if (planType === 'monthly') {
             periodEnd.setMonth(periodEnd.getMonth() + 1) // Próximo mês
           } else if (planType === 'annual') {
             periodEnd.setMonth(periodEnd.getMonth() + 12) // Próximo ano
           } else {
             periodEnd.setMonth(periodEnd.getMonth() + 1) // Fallback
           }

    // Criar ou atualizar assinatura no banco
    const subscriptionIdDb = `mp_sub_${subscriptionId}`
    
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId,
        area: area,
        plan_type: planType,
        stripe_account: null, // Mercado Pago não usa stripe_account
        stripe_subscription_id: subscriptionIdDb, // Usar como ID único
        stripe_customer_id: data.payer_id?.toString() || 'mp_customer',
        stripe_price_id: 'mp_recurring', // Placeholder para assinatura recorrente
        amount: Math.round(amount * 100), // Converter para centavos
        currency: currency.toLowerCase(),
        status: mappedStatus,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: status === 'cancelled',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'stripe_subscription_id',
      })
      .select()
      .single()

    if (subError) {
      console.error('❌ Erro ao salvar subscription recorrente:', subError)
      throw subError
    }

    console.log('✅ Assinatura recorrente processada:', subscriptionId)
    console.log(`📅 Status: ${mappedStatus}, Próxima cobrança: ${periodEnd.toISOString()}`)
  } catch (error: any) {
    console.error('❌ Erro ao processar assinatura recorrente:', error)
    throw error
  }
}

