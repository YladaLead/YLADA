/**
 * Camada de abstração para gateways de pagamento
 * Unifica Mercado Pago (BR) e Stripe (Internacional)
 */

import { PaymentGateway, detectPaymentGateway, detectCountryCode } from './payment-helpers'
import { createPreference, CreatePreferenceRequest } from './mercado-pago'
import { getStripeInstance, getStripePriceId } from './stripe-helpers'
import Stripe from 'stripe'

export interface CheckoutRequest {
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  planType: 'monthly' | 'annual'
  userId: string
  userEmail: string
  countryCode?: string
  language?: 'pt' | 'en' | 'es'
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
        annual: 570.00,
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
  const amount = getPrice(request.area, request.planType, request.countryCode || 'BR')
  
  const preferenceRequest: CreatePreferenceRequest = {
    area: request.area,
    planType: request.planType,
    userId: request.userId,
    userEmail: request.userEmail,
    amount,
    description: `YLADA ${request.area.toUpperCase()} - Plano ${request.planType === 'monthly' ? 'Mensal' : 'Anual'}`,
    successUrl: `${baseUrl}/${request.language || 'pt'}/${request.area}/pagamento-sucesso?payment_id={payment_id}&gateway=mercadopago`,
    failureUrl: `${baseUrl}/${request.language || 'pt'}/${request.area}/checkout?canceled=true`,
    pendingUrl: `${baseUrl}/${request.language || 'pt'}/${request.area}/pagamento-sucesso?payment_id={payment_id}&gateway=mercadopago&status=pending`,
  }

  const isTest = process.env.NODE_ENV !== 'production'
  const preference = await createPreference(preferenceRequest, isTest)

  return {
    gateway: 'mercadopago',
    checkoutUrl: preference.initPoint,
    sessionId: preference.id,
    metadata: {
      area: request.area,
      planType: request.planType,
      countryCode: request.countryCode || 'BR',
      gateway: 'mercadopago',
    },
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

  // Obter URL base
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                  'http://localhost:3000'

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

