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
  // IMPORTANTE: request.amount vem em reais (ex: 59.90), precisa converter para centavos
  const amountInCents = Math.round(request.amount * 100)
  
  console.log('💰 Conversão de valor:', {
    valorOriginal: request.amount,
    valorEmCentavos: amountInCents,
    esperado: `R$ ${request.amount.toFixed(2)} = ${amountInCents} centavos`
  })

  // Validar URLs de retorno (obrigatórias para auto_return)
  if (!request.successUrl || !request.failureUrl || !request.pendingUrl) {
    throw new Error(
      `URLs de retorno não definidas. ` +
      `success: ${request.successUrl ? 'OK' : 'FALTANDO'}, ` +
      `failure: ${request.failureUrl ? 'OK' : 'FALTANDO'}, ` +
      `pending: ${request.pendingUrl ? 'OK' : 'FALTANDO'}`
    )
  }

  // Configurar itens da preferência
  const preferenceData = {
    items: [
      {
        title: request.description,
        quantity: 1,
        unit_price: amountInCents, // Valor em centavos (ex: 5990 = R$ 59,90)
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
      // Não excluir nenhum tipo de pagamento para habilitar PIX, Boleto, etc.
      excluded_payment_types: [],
      excluded_payment_methods: [],
      // Habilitar PIX explicitamente (não é necessário excluir, mas vamos garantir)
      // PIX é habilitado automaticamente se não excluirmos 'account_money'
      // Parcelamento: configurar apenas para plano anual
      ...(request.planType === 'annual' ? {
        installments: {
          default_installments: 1, // Padrão: à vista
          max_installments: 12, // Máximo: 12x
        }
      } : {}),
    },
    statement_descriptor: 'YLADA', // Nome que aparece na fatura
    external_reference: `${request.area}_${request.planType}_${request.userId}`, // Referência externa
  }

  try {
    console.log('📤 Enviando preferência para Mercado Pago:', {
      valorOriginal: request.amount,
      valorEmCentavos: amountInCents,
      currency: 'BRL',
      items: preferenceData.items.length,
      itemUnitPrice: preferenceData.items[0].unit_price,
      hasPayer: !!preferenceData.payer.email,
      paymentMethods: {
        excluded_types: preferenceData.payment_methods.excluded_payment_types,
        excluded_methods: preferenceData.payment_methods.excluded_payment_methods,
        installments: preferenceData.payment_methods.installments || 'N/A',
      },
      back_urls: {
        success: preferenceData.back_urls.success,
        failure: preferenceData.back_urls.failure,
        pending: preferenceData.back_urls.pending,
      },
    })
    
    const response = await preference.create({ body: preferenceData })
    
    console.log('✅ Preferência criada com sucesso:', {
      id: response.id,
      hasInitPoint: !!response.init_point,
    })

    if (!response.init_point && !response.sandbox_init_point) {
      throw new Error('Mercado Pago não retornou URL de checkout')
    }

    return {
      id: response.id || '',
      initPoint: response.init_point || response.sandbox_init_point || '',
      sandboxInitPoint: response.sandbox_init_point,
    }
  } catch (error: any) {
    console.error('❌ Erro ao criar preferência Mercado Pago:', {
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      cause: error.cause,
      stack: error.stack,
    })
    
    // Mensagem de erro mais específica
    let errorMessage = error.message || 'Erro desconhecido'
    
    if (errorMessage.includes('UNAUTHORIZED') || errorMessage.includes('unauthorized')) {
      errorMessage = 'Access Token do Mercado Pago inválido ou sem permissões. Verifique as credenciais no painel do Mercado Pago.'
    } else if (errorMessage.includes('policy')) {
      errorMessage = 'Erro de permissão no Mercado Pago. Verifique se o Access Token tem as permissões necessárias.'
    }
    
    throw new Error(`Erro ao criar preferência Mercado Pago: ${errorMessage}`)
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

