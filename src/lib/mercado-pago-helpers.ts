/**
 * Helper functions for Mercado Pago integration
 * Specifically for subscription cancellation
 */

/**
 * Cancela uma assinatura no Mercado Pago
 * @param mercadoPagoSubscriptionId - ID da assinatura no Mercado Pago (preapproval_id)
 * @returns Success status and optional error message
 */
export async function cancelMercadoPagoSubscription(
  mercadoPagoSubscriptionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Determinar se é teste ou produção baseado no ID
    // IDs de teste geralmente começam com números, produção com outros padrões
    // Mas vamos usar a variável de ambiente para determinar
    const isTest = process.env.NODE_ENV !== 'production' || 
                   mercadoPagoSubscriptionId.includes('test') ||
                   mercadoPagoSubscriptionId.includes('TEST')

    // Buscar credenciais do Mercado Pago
    const accessToken = isTest
      ? process.env.MERCADOPAGO_ACCESS_TOKEN_TEST || process.env.MERCADOPAGO_ACCESS_TOKEN
      : process.env.MERCADOPAGO_ACCESS_TOKEN_LIVE || process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      console.error('❌ Mercado Pago Access Token não configurado')
      return {
        success: false,
        error: 'Credenciais do Mercado Pago não configuradas'
      }
    }

    console.log(`🔄 Cancelando assinatura no Mercado Pago: ${mercadoPagoSubscriptionId}`)

    // Chamar API do Mercado Pago para cancelar preapproval
    // Documentação: https://www.mercadopago.com.br/developers/pt/docs/subscriptions/integration-configuration/subscriptions
    const response = await fetch(
      `https://api.mercadopago.com/preapproval/${mercadoPagoSubscriptionId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'cancelled'
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      const errorMessage = errorData.message || errorData.error || `Erro HTTP ${response.status}`
      
      console.error('❌ Erro ao cancelar no Mercado Pago:', {
        status: response.status,
        error: errorMessage,
        subscriptionId: mercadoPagoSubscriptionId
      })

      return {
        success: false,
        error: errorMessage
      }
    }

    const data = await response.json().catch(() => ({}))
    
    console.log('✅ Assinatura cancelada no Mercado Pago:', {
      subscriptionId: mercadoPagoSubscriptionId,
      status: data.status
    })

    return { success: true }
  } catch (error: any) {
    console.error('❌ Erro ao cancelar no Mercado Pago:', {
      error: error.message,
      stack: error.stack,
      subscriptionId: mercadoPagoSubscriptionId
    })

    return {
      success: false,
      error: error.message || 'Erro ao cancelar assinatura no Mercado Pago'
    }
  }
}

/**
 * Verifica se uma assinatura existe e está ativa no Mercado Pago
 * @param mercadoPagoSubscriptionId - ID da assinatura no Mercado Pago
 * @returns Status da assinatura ou null se não encontrada
 */
export async function getMercadoPagoSubscriptionStatus(
  mercadoPagoSubscriptionId: string
): Promise<{ status: string; exists: boolean } | null> {
  try {
    const isTest = process.env.NODE_ENV !== 'production' || 
                   mercadoPagoSubscriptionId.includes('test') ||
                   mercadoPagoSubscriptionId.includes('TEST')

    const accessToken = isTest
      ? process.env.MERCADOPAGO_ACCESS_TOKEN_TEST || process.env.MERCADOPAGO_ACCESS_TOKEN
      : process.env.MERCADOPAGO_ACCESS_TOKEN_LIVE || process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      return null
    }

    const response = await fetch(
      `https://api.mercadopago.com/preapproval/${mercadoPagoSubscriptionId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken.trim()}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      return { status: 'not_found', exists: false }
    }

    const data = await response.json()
    return {
      status: data.status || 'unknown',
      exists: true
    }
  } catch (error: any) {
    console.error('❌ Erro ao verificar status no Mercado Pago:', error)
    return null
  }
}

