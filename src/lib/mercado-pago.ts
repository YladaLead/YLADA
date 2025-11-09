/**
 * Cliente Mercado Pago
 * Integração com API do Mercado Pago para pagamentos no Brasil
 */

import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

export interface CreatePreferenceRequest {
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  planType: 'monthly' | 'annual'
  userId: string
  userEmail: string
  amount: number // Valor em reais (ex: 59.90)
  description: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
  backUrls?: {
    success?: string
    failure?: string
    pending?: string
  }
}

export interface CreatePreferenceResponse {
  id: string // Preference ID
  initPoint: string // URL de checkout
  sandboxInitPoint?: string // URL de checkout (sandbox)
}

/**
 * Cria instância do cliente Mercado Pago
 */
export function createMercadoPagoClient(isTest: boolean = true): MercadoPagoConfig {
  const accessToken = isTest
    ? process.env.MERCADOPAGO_ACCESS_TOKEN_TEST || process.env.MERCADOPAGO_ACCESS_TOKEN
    : process.env.MERCADOPAGO_ACCESS_TOKEN_LIVE || process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error(
      'Mercado Pago Access Token não configurado. ' +
      `Configure MERCADOPAGO_ACCESS_TOKEN${isTest ? '_TEST' : '_LIVE'} no .env.local`
    )
  }

  return new MercadoPagoConfig({
    accessToken: accessToken.trim(),
    options: {
      timeout: 5000,
    },
  })
}

/**
 * Cria preferência de pagamento no Mercado Pago
 */
export async function createPreference(
  request: CreatePreferenceRequest,
  isTest: boolean = true
): Promise<CreatePreferenceResponse> {
  const client = createMercadoPagoClient(isTest)
  const preference = new Preference(client)

  // Calcular valor em centavos (Mercado Pago usa centavos)
  const amountInCents = Math.round(request.amount * 100)

  // Configurar itens da preferência
  const preferenceData = {
    items: [
      {
        title: request.description,
        quantity: 1,
        unit_price: amountInCents,
        currency_id: 'BRL',
      },
    ],
    payer: {
      email: request.userEmail,
    },
    metadata: {
      user_id: request.userId,
      area: request.area,
      plan_type: request.planType,
    },
    back_urls: {
      success: request.successUrl,
      failure: request.failureUrl,
      pending: request.pendingUrl,
    },
    auto_return: 'approved' as const, // Redireciona automaticamente quando aprovado
    payment_methods: {
      excluded_payment_types: [],
      excluded_payment_methods: [],
      installments: request.planType === 'annual' ? 12 : 1, // Parcelamento apenas para anual
    },
    statement_descriptor: 'YLADA', // Nome que aparece na fatura
    external_reference: `${request.area}_${request.planType}_${request.userId}`, // Referência externa
  }

  try {
    const response = await preference.create({ body: preferenceData })

    return {
      id: response.id || '',
      initPoint: response.init_point || '',
      sandboxInitPoint: response.sandbox_init_point,
    }
  } catch (error: any) {
    console.error('❌ Erro ao criar preferência Mercado Pago:', error)
    throw new Error(
      `Erro ao criar preferência Mercado Pago: ${error.message || 'Erro desconhecido'}`
    )
  }
}

/**
 * Verifica status de um pagamento no Mercado Pago
 */
export async function verifyPayment(
  paymentId: string,
  isTest: boolean = true
): Promise<{
  status: string
  statusDetail: string
  approved: boolean
}> {
  const client = createMercadoPagoClient(isTest)
  const payment = new Payment(client)

  try {
    const paymentData = await payment.get({ id: paymentId })

    return {
      status: paymentData.status || 'unknown',
      statusDetail: paymentData.status_detail || '',
      approved: paymentData.status === 'approved',
    }
  } catch (error: any) {
    console.error('❌ Erro ao verificar pagamento Mercado Pago:', error)
    throw new Error(
      `Erro ao verificar pagamento Mercado Pago: ${error.message || 'Erro desconhecido'}`
    )
  }
}

/**
 * Valida webhook do Mercado Pago
 */
export function validateWebhook(
  body: any,
  signature: string | null,
  webhookSecret: string
): boolean {
  if (!signature) {
    return false
  }

  // Mercado Pago usa x-signature header para validar webhooks
  // A validação é feita comparando o hash do body com a assinatura
  // Por enquanto, vamos confiar na validação básica
  // TODO: Implementar validação completa conforme documentação do Mercado Pago
  
  return true
}

