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
 * Extrai o ID para usar na API de cancelamento do MP (Preapproval).
 * No banco podemos ter: mp_sub_<preapproval_id> ou mp_<payment_id>.
 * A API PUT /preapproval/{id} espera o preapproval_id (numérico).
 * Retorna o ID sem prefixo para tentativa de cancelamento.
 */
export function getMercadoPagoPreapprovalIdForCancel(
  stripeSubscriptionId: string | null | undefined
): string | null {
  if (!stripeSubscriptionId || typeof stripeSubscriptionId !== 'string') return null
  const s = stripeSubscriptionId.trim()
  if (s.startsWith('mp_sub_')) return s.replace(/^mp_sub_/, '')
  if (s.startsWith('mp_')) return s.replace(/^mp_/, '')
  return s
}

/**
 * Só retorna ID numérico se for assinatura recorrente (preapproval), não pagamento avulso mp_<payment_id>.
 */
export function getMercadoPagoPreapprovalIdStrict(
  stripeSubscriptionId: string | null | undefined
): string | null {
  if (!stripeSubscriptionId || typeof stripeSubscriptionId !== 'string') return null
  const s = stripeSubscriptionId.trim()
  if (s.startsWith('mp_sub_')) return s.replace(/^mp_sub_/, '')
  return null
}

function resolveMercadoPagoAccessToken(preapprovalNumericId: string): string | null {
  const isTest =
    process.env.NODE_ENV !== 'production' ||
    preapprovalNumericId.includes('test') ||
    preapprovalNumericId.includes('TEST')
  const accessToken = isTest
    ? process.env.MERCADOPAGO_ACCESS_TOKEN_TEST || process.env.MERCADOPAGO_ACCESS_TOKEN
    : process.env.MERCADOPAGO_ACCESS_TOKEN_LIVE || process.env.MERCADOPAGO_ACCESS_TOKEN
  return accessToken?.trim() || null
}

/**
 * Alinha a próxima cobrança da assinatura (preapproval) no Mercado Pago à data definida no admin.
 * GET + PUT /preapproval/{id} com auto_recurring.start_date (doc: gerenciamento de assinaturas).
 */
export async function updateMercadoPagoPreapprovalBillingDate(
  preapprovalNumericId: string,
  nextBillingDate: Date
): Promise<{ success: boolean; error?: string; next_payment_date?: string }> {
  try {
    const accessToken = resolveMercadoPagoAccessToken(preapprovalNumericId)
    if (!accessToken) {
      return { success: false, error: 'Credenciais do Mercado Pago não configuradas' }
    }

    const now = Date.now()
    const minStart = new Date(now + 120_000)
    if (nextBillingDate.getTime() <= now) {
      return {
        success: false,
        error:
          'A data de vencimento precisa ser no futuro para sincronizar a cobrança no Mercado Pago.',
      }
    }
    const startDate = nextBillingDate.getTime() < minStart.getTime() ? minStart : nextBillingDate

    const getRes = await fetch(
      `https://api.mercadopago.com/preapproval/${encodeURIComponent(preapprovalNumericId)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!getRes.ok) {
      const err = await getRes.json().catch(() => ({}))
      const msg =
        (err as any).message || (err as any).error || `Erro HTTP ${getRes.status} ao buscar preapproval`
      return { success: false, error: msg }
    }

    const existing = await getRes.json()
    const st = String(existing.status || '').toLowerCase()
    if (st === 'cancelled' || st === 'canceled') {
      return { success: false, error: 'Assinatura já está cancelada no Mercado Pago.' }
    }

    const ar = existing.auto_recurring
    if (!ar || ar.frequency == null || !ar.frequency_type) {
      return {
        success: false,
        error: 'Preapproval sem auto_recurring válido; não foi possível atualizar a data de cobrança.',
      }
    }

    const amount =
      typeof ar.transaction_amount === 'string'
        ? parseFloat(ar.transaction_amount)
        : Number(ar.transaction_amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      return { success: false, error: 'Valor da assinatura (transaction_amount) inválido no Mercado Pago.' }
    }

    const autoRecurring: Record<string, unknown> = {
      frequency: ar.frequency,
      frequency_type: ar.frequency_type,
      transaction_amount: amount,
      currency_id: ar.currency_id || 'BRL',
      start_date: startDate.toISOString(),
    }
    if (ar.end_date) {
      autoRecurring.end_date = ar.end_date
    }
    if (ar.free_trial) {
      autoRecurring.free_trial = ar.free_trial
    }

    const putRes = await fetch(
      `https://api.mercadopago.com/preapproval/${encodeURIComponent(preapprovalNumericId)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auto_recurring: autoRecurring }),
      }
    )

    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}))
      const msg =
        (err as any).message || (err as any).error || `Erro HTTP ${putRes.status} ao atualizar preapproval`
      console.error('❌ Erro PUT preapproval (billing date):', {
        preapprovalNumericId,
        status: putRes.status,
        err,
      })
      return { success: false, error: msg }
    }

    const updated = await putRes.json().catch(() => ({}))
    const nextPayment = (updated as any).next_payment_date as string | undefined

    console.log('✅ Preapproval atualizado (data de cobrança):', {
      preapprovalNumericId,
      start_date: autoRecurring.start_date,
      next_payment_date: nextPayment,
    })

    return { success: true, next_payment_date: nextPayment }
  } catch (error: any) {
    console.error('❌ updateMercadoPagoPreapprovalBillingDate:', error)
    return {
      success: false,
      error: error.message || 'Erro ao atualizar data de cobrança no Mercado Pago',
    }
  }
}

/**
 * Reembolsa um pagamento no Mercado Pago (total ou parcial).
 * POST /v1/payments/{id}/refunds
 * @param paymentId - ID do pagamento no MP (ex.: valor em payments.stripe_payment_intent_id)
 * @param amountCents - Valor em centavos para reembolso parcial; omitir = reembolso total (API MP espera valor em reais, ex.: 97.00)
 * @param idempotencyKey - Chave para evitar reembolso duplicado (recomendado)
 */
export async function refundMercadoPagoPayment(
  paymentId: string,
  amountCents?: number,
  idempotencyKey?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const isTest = process.env.NODE_ENV !== 'production'
    const accessToken = isTest
      ? process.env.MERCADOPAGO_ACCESS_TOKEN_TEST || process.env.MERCADOPAGO_ACCESS_TOKEN
      : process.env.MERCADOPAGO_ACCESS_TOKEN_LIVE || process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      console.error('❌ Mercado Pago Access Token não configurado')
      return { success: false, error: 'Credenciais do Mercado Pago não configuradas' }
    }

    const key = idempotencyKey || `refund_${paymentId}_${Date.now()}`
    // API MP espera amount em unidade da moeda (reais), não centavos
    const body = amountCents != null && amountCents > 0 ? { amount: amountCents / 100 } : {}

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${encodeURIComponent(String(paymentId))}/refunds`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.trim()}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': key
        },
        body: Object.keys(body).length ? JSON.stringify(body) : '{}'
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
      const errorMessage = errorData.message || errorData.error || `Erro HTTP ${response.status}`
      console.error('❌ Erro ao reembolsar no Mercado Pago:', {
        status: response.status,
        error: errorMessage,
        paymentId
      })
      return { success: false, error: errorMessage }
    }

    console.log('✅ Reembolso solicitado no Mercado Pago:', { paymentId, amountCents })
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erro ao reembolsar no Mercado Pago:', { error: error.message, paymentId })
    return {
      success: false,
      error: error.message || 'Erro ao processar reembolso no Mercado Pago'
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

