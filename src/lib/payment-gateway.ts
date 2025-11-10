/**
 * Camada de abstração para gateways de pagamento
 * Unifica Mercado Pago (BR) e Stripe (Internacional)
 */

import { PaymentGateway, detectPaymentGateway, detectCountryCode } from './payment-helpers'
import { createPreference, CreatePreferenceRequest } from './mercado-pago'
import { createRecurringSubscription, CreateSubscriptionRequest } from './mercado-pago-subscriptions'
import { getStripeInstance, getStripePriceId } from './stripe-helpers'
import Stripe from 'stripe'

export interface CheckoutRequest {
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  planType: 'monthly' | 'annual'
  userId: string
  userEmail: string
  countryCode?: string
  language?: 'pt' | 'en' | 'es'
  paymentMethod?: 'auto' | 'pix' // Novo: método de pagamento para plano mensal
}

export interface CheckoutResponse {
  gateway: PaymentGateway
  checkoutUrl: string
  sessionId: string // Preference ID (MP) ou Session ID (Stripe)
  metadata: {
    area: string
    planType: string
    countryCode: string
    gateway: PaymentGateway
  }
}

/**
 * Obtém preço baseado em área e plano
 */
function getPrice(area: string, planType: 'monthly' | 'annual', countryCode: string): number {
  // Preços em BRL para Brasil
  if (countryCode === 'BR') {
    const prices: Record<string, Record<string, number>> = {
      wellness: {
        monthly: 59.90,
        annual: 574.80, // R$ 574,80 (R$ 47,90/mês × 12 meses)
      },
      nutri: {
        monthly: 97.00,
        annual: 1164.00,
      },
      coach: {
        monthly: 97.00,
        annual: 1164.00,
      },
      nutra: {
        monthly: 97.00,
        annual: 1164.00,
      },
    }
    return prices[area]?.[planType] || 0
  }

  // Preços em USD para internacional
  const prices: Record<string, Record<string, number>> = {
    wellness: {
      monthly: 15.00,
      annual: 150.00,
    },
    nutri: {
      monthly: 25.00,
      annual: 198.00,
    },
    coach: {
      monthly: 25.00,
      annual: 198.00,
    },
    nutra: {
      monthly: 25.00,
      annual: 198.00,
    },
  }
  return prices[area]?.[planType] || 0
}

/**
 * Cria checkout usando Mercado Pago
 */
async function createMercadoPagoCheckout(
  request: CheckoutRequest,
  baseUrl: string
): Promise<CheckoutResponse> {
  console.log('💳 Criando checkout Mercado Pago...')
  const amount = getPrice(request.area, request.planType, request.countryCode || 'BR')
  
  // Validação: garantir que o valor está correto
  if (amount <= 0) {
    throw new Error(`Valor inválido para ${request.area} ${request.planType}: ${amount}`)
  }
  
  // Validação: se o valor for muito alto, pode estar errado
  if (amount > 1000 && request.planType === 'monthly') {
    console.warn(`⚠️ Valor mensal muito alto: R$ ${amount}`)
  }
  
  console.log(`💰 Valor: R$ ${amount.toFixed(2)} (${Math.round(amount * 100)} centavos)`)
  
  // Validar baseUrl
  if (!baseUrl || baseUrl === 'undefined' || baseUrl.includes('undefined')) {
    throw new Error(
      `baseUrl inválido: "${baseUrl}". ` +
      `Configure NEXT_PUBLIC_APP_URL ou NEXT_PUBLIC_APP_URL_PRODUCTION no .env`
    )
  }
  
  // Construir URLs de retorno (remover trailing slash do baseUrl)
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const language = request.language || 'pt'
  const area = request.area
  
  const successUrl = `${cleanBaseUrl}/${language}/${area}/pagamento-sucesso?payment_id={payment_id}&gateway=mercadopago`
  const failureUrl = `${cleanBaseUrl}/${language}/${area}/checkout?canceled=true`
  const pendingUrl = `${cleanBaseUrl}/${language}/${area}/pagamento-sucesso?payment_id={payment_id}&gateway=mercadopago&status=pending`
  
  console.log('🔗 URLs de retorno:', {
    baseUrl: cleanBaseUrl,
    successUrl,
    failureUrl,
    pendingUrl,
  })
  
  const isTest = process.env.NODE_ENV !== 'production'
  console.log(`🧪 Modo teste: ${isTest}`)

  // Plano mensal: sempre usar assinatura recorrente (cartão automático)
  // Plano anual: sempre usar assinatura recorrente (renovação a cada 12 meses)
  if (request.planType === 'monthly') {
    // Assinatura automática (cartão) - sempre
    console.log('🔄 Criando assinatura recorrente (Preapproval) para plano mensal')
    
    const subscriptionRequest: CreateSubscriptionRequest = {
      area: request.area,
      planType: request.planType,
      userId: request.userId,
      userEmail: request.userEmail,
      amount,
      description: `YLADA ${request.area.toUpperCase()} - Plano Mensal`,
      successUrl,
      failureUrl,
      pendingUrl,
    }

    try {
      const subscription = await createRecurringSubscription(subscriptionRequest, isTest)
      console.log('✅ Assinatura recorrente Mercado Pago criada:', subscription.id)

      return {
        gateway: 'mercadopago',
        checkoutUrl: subscription.initPoint,
        sessionId: subscription.id,
        metadata: {
          area: request.area,
          planType: request.planType,
          countryCode: request.countryCode || 'BR',
          gateway: 'mercadopago',
          isRecurring: true, // Marcar como recorrente
        },
      }
    } catch (error: any) {
      console.error('❌ Erro ao criar assinatura recorrente Mercado Pago:', error)
      throw new Error(`Erro ao criar assinatura recorrente Mercado Pago: ${error.message || 'Erro desconhecido'}`)
    }
  } else {
    // Plano anual: usar assinatura recorrente (renovação automática a cada 12 meses)
    console.log('🔄 Criando assinatura recorrente anual (Preapproval) para plano anual')
    
    const subscriptionRequest: CreateSubscriptionRequest = {
      area: request.area,
      planType: request.planType,
      userId: request.userId,
      userEmail: request.userEmail,
      amount,
      description: `YLADA ${request.area.toUpperCase()} - Plano Anual`,
      successUrl,
      failureUrl,
      pendingUrl,
    }

    try {
      const subscription = await createRecurringSubscription(subscriptionRequest, isTest)
      console.log('✅ Assinatura recorrente anual Mercado Pago criada:', subscription.id)

      return {
        gateway: 'mercadopago',
        checkoutUrl: subscription.initPoint,
        sessionId: subscription.id,
        metadata: {
          area: request.area,
          planType: request.planType,
          countryCode: request.countryCode || 'BR',
          gateway: 'mercadopago',
          isRecurring: true, // Assinatura recorrente anual
        },
      }
    } catch (error: any) {
      console.error('❌ Erro ao criar assinatura recorrente anual Mercado Pago:', error)
      throw new Error(`Erro ao criar assinatura recorrente anual Mercado Pago: ${error.message || 'Erro desconhecido'}`)
    }
  }
}

/**
 * Cria checkout usando Stripe
 */
async function createStripeCheckout(
  request: CheckoutRequest,
  baseUrl: string
): Promise<CheckoutResponse> {
  const isTest = process.env.NODE_ENV !== 'production'
  const stripe = await getStripeInstance('us', isTest)
  
  // Obter Price ID do Stripe
  const priceId = getStripePriceId(
    request.area,
    request.planType,
    'us',
    request.countryCode
  )

  // Determinar modo: subscription para mensal, payment para anual (permite parcelamento)
  const mode = request.planType === 'monthly' ? 'subscription' : 'payment'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode,
    customer_email: request.userEmail,
    client_reference_id: request.userId,
    metadata: {
      user_id: request.userId,
      area: request.area,
      plan_type: request.planType,
      country_code: request.countryCode || 'UNKNOWN',
      gateway: 'stripe',
    },
    success_url: `${baseUrl}/${request.language || 'en'}/${request.area}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}&gateway=stripe`,
    cancel_url: `${baseUrl}/${request.language || 'en'}/${request.area}/checkout?canceled=true`,
    locale: request.language === 'pt' ? 'pt-BR' : request.language === 'es' ? 'es' : 'en',
    currency: 'usd',
  })

  if (!session.url) {
    throw new Error('Stripe não retornou URL de checkout')
  }

  return {
    gateway: 'stripe',
    checkoutUrl: session.url,
    sessionId: session.id,
    metadata: {
      area: request.area,
      planType: request.planType,
      countryCode: request.countryCode || 'UNKNOWN',
      gateway: 'stripe',
    },
  }
}

/**
 * Cria checkout unificado (detecta gateway automaticamente)
 */
export async function createCheckout(
  request: CheckoutRequest,
  httpRequest?: Request
): Promise<CheckoutResponse> {
  // Detectar país se não fornecido
  let countryCode = request.countryCode
  if (!countryCode && httpRequest) {
    countryCode = detectCountryCode(httpRequest)
  }
  if (!countryCode) {
    countryCode = 'UNKNOWN'
  }

  // Detectar gateway baseado no país
  let gateway: PaymentGateway
  if (httpRequest) {
    gateway = detectPaymentGateway(httpRequest)
  } else {
    gateway = countryCode === 'BR' ? 'mercadopago' : 'stripe'
  }

  // Obter URL base (prioridade: env > request origin > localhost)
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                process.env.NEXT_PUBLIC_APP_URL_PRODUCTION
  
  // Se não tiver no env, tentar pegar do request
  if (!baseUrl && httpRequest) {
    try {
      // Tentar pegar origin do header
      const origin = httpRequest.headers.get('origin')
      const host = httpRequest.headers.get('host')
      
      if (origin) {
        baseUrl = origin
      } else if (host) {
        // Se tiver host mas não origin, construir URL
        baseUrl = `https://${host}`
      }
      
      // Se ainda não tiver, tentar pegar da URL do request
      if (!baseUrl && 'url' in httpRequest) {
        const url = new URL((httpRequest as any).url)
        baseUrl = `${url.protocol}//${url.host}`
      }
    } catch (err) {
      console.warn('⚠️ Erro ao detectar baseUrl do request:', err)
    }
  }
  
  // Fallback para localhost
  if (!baseUrl) {
    baseUrl = 'http://localhost:3000'
  }
  
  console.log('🌐 Base URL detectada:', baseUrl)

  // Criar checkout no gateway apropriado
  if (gateway === 'mercadopago') {
    return createMercadoPagoCheckout(
      { ...request, countryCode },
      baseUrl
    )
  } else {
    return createStripeCheckout(
      { ...request, countryCode },
      baseUrl
    )
  }
}

