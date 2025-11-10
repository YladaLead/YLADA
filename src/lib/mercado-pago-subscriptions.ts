/**
 * Mercado Pago - Assinaturas Recorrentes (Preapproval)
 * Para planos mensais que cobram automaticamente todo mês
 */

import { MercadoPagoConfig, PreApproval } from 'mercadopago'
import { createMercadoPagoClient } from './mercado-pago'

export interface CreateSubscriptionRequest {
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  planType: 'monthly' | 'annual'
  userId: string
  userEmail: string
  amount: number // Valor em reais (ex: 59.90)
  description: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
}

export interface CreateSubscriptionResponse {
  id: string // Preapproval ID
  initPoint: string // URL de checkout
  sandboxInitPoint?: string
}

/**
 * Cria assinatura recorrente (Preapproval) no Mercado Pago
 * 
 * IMPORTANTE: Assinaturas recorrentes funcionam APENAS com cartão de crédito
 * PIX e Boleto não funcionam com assinaturas
 */
export async function createRecurringSubscription(
  request: CreateSubscriptionRequest,
  isTest: boolean = true
): Promise<CreateSubscriptionResponse> {
  const client = createMercadoPagoClient(isTest)
  const preapproval = new PreApproval(client)

  // Valor em reais (decimal)
  const unitPrice = Number(request.amount.toFixed(2))

  // Determinar frequência baseado no tipo de plano
  const frequency = request.planType === 'annual' ? 12 : 1 // 12 meses para anual, 1 mês para mensal
  const frequencyType = 'months' as const

  console.log('🔄 Criando assinatura recorrente Mercado Pago:', {
    area: request.area,
    planType: request.planType,
    amount: unitPrice,
    frequency: frequency,
    frequencyType: frequencyType,
    userEmail: request.userEmail,
  })

  // Validar URLs de retorno
  if (!request.successUrl || !request.failureUrl || !request.pendingUrl) {
    throw new Error('URLs de retorno não definidas')
  }

  // Validar que successUrl é uma URL válida
  try {
    // Tentar criar URL object para validar formato
    // Substituir placeholder {payment_id} temporariamente para validação
    const testUrl = request.successUrl.replace('{payment_id}', 'test')
    new URL(testUrl)
  } catch (error) {
    throw new Error(`URL de retorno inválida: ${request.successUrl}. Erro: ${error}`)
  }

  // Configurar Preapproval (assinatura recorrente)
  // IMPORTANTE: Preapproval requer back_url (singular) para URL de retorno após autorização
  const preapprovalData = {
    reason: request.description,
    external_reference: `${request.area}_${request.planType}_${request.userId}`,
    payer_email: request.userEmail,
    auto_recurring: {
      frequency: frequency, // 12 para anual, 1 para mensal
      frequency_type: frequencyType,
      transaction_amount: unitPrice, // Valor em reais (ex: 59.90 ou 470.72)
      currency_id: 'BRL' as const,
      start_date: new Date().toISOString(), // Começar imediatamente
      end_date: null, // Sem data de término (cobrança infinita)
    },
    back_url: request.successUrl, // URL de retorno após autorização (obrigatório)
    metadata: {
      user_id: request.userId,
      area: request.area,
      plan_type: request.planType,
    },
    status: 'authorized' as const, // Status inicial
  }

  try {
    console.log('📤 Enviando Preapproval para Mercado Pago:', {
      reason: preapprovalData.reason,
      amount: preapprovalData.auto_recurring.transaction_amount,
      frequency: preapprovalData.auto_recurring.frequency,
      frequency_type: preapprovalData.auto_recurring.frequency_type,
      currency: preapprovalData.auto_recurring.currency_id,
      back_url: preapprovalData.back_url,
      payer_email: preapprovalData.payer_email,
    })

    const response = await preapproval.create({ body: preapprovalData })

    console.log('✅ Preapproval criado com sucesso:', {
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
    console.error('❌ Erro ao criar Preapproval Mercado Pago:', {
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      cause: error.cause,
    })

    let errorMessage = error.message || 'Erro desconhecido'

    if (errorMessage.includes('UNAUTHORIZED') || errorMessage.includes('unauthorized')) {
      errorMessage = 'Access Token do Mercado Pago inválido ou sem permissões. Verifique as credenciais no painel do Mercado Pago.'
    }

    throw new Error(`Erro ao criar assinatura recorrente Mercado Pago: ${errorMessage}`)
  }
}

/**
 * Verifica status de uma assinatura recorrente
 */
export async function verifySubscription(
  subscriptionId: string,
  isTest: boolean = true
): Promise<{
  status: string
  authorized: boolean
}> {
  const client = createMercadoPagoClient(isTest)
  const preapproval = new PreApproval(client)

  try {
    const subscriptionData = await preapproval.get({ id: subscriptionId })

    return {
      status: subscriptionData.status || 'unknown',
      authorized: subscriptionData.status === 'authorized',
    }
  } catch (error: any) {
    console.error('❌ Erro ao verificar assinatura Mercado Pago:', error)
    throw new Error(
      `Erro ao verificar assinatura Mercado Pago: ${error.message || 'Erro desconhecido'}`
    )
  }
}

