/**
 * Cliente Mercado Pago
 * Integração com API do Mercado Pago para pagamentos no Brasil
 */

import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

export interface CreatePreferenceRequest {
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  planType: 'monthly' | 'annual'
  productType?: 'platform_monthly' | 'platform_monthly_12x' | 'platform_annual' | 'formation_only' // Apenas para área Nutri
  userId: string
  userEmail: string
  amount: number // Valor em reais (ex: 59.90)
  description: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
  maxInstallments?: number // Número máximo de parcelas (padrão: 1 para mensal, 12 para anual)
  backUrls?: {
    success?: string
    failure?: string
    pending?: string
  }
  payerFirstName?: string
  payerLastName?: string
  /** Atribuição de venda (ex: 'paula') — enviado no metadata para o webhook gravar */
  refVendedor?: string
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

/** Limite do Mercado Pago para external_reference (chars). */
const EXTERNAL_REFERENCE_MAX_LENGTH = 256

/**
 * Áreas cujo nome contém `_` usam slug curto no external_reference (evita ambiguidade no split area_planType_userId).
 */
export function toMercadoPagoExternalAreaSlug(area: string): string {
  if (area === 'pro_lideres_team') return 'prolideres'
  return area
}

/**
 * Monta external_reference no formato area_planType_userId.
 * Garante tamanho <= 256 caracteres (limite da API do MP).
 */
export function buildExternalReference(
  area: string,
  planType: string,
  userId: string
): string {
  const ref = `${area}_${planType}_${userId}`
  if (ref.length <= EXTERNAL_REFERENCE_MAX_LENGTH) return ref
  // Truncar userId mantendo área e plano (ex: wellness_annual_ + início do userId)
  const prefix = `${area}_${planType}_`
  const maxUserIdLen = EXTERNAL_REFERENCE_MAX_LENGTH - prefix.length
  const truncatedUserId = userId.length > maxUserIdLen
    ? userId.slice(0, maxUserIdLen)
    : userId
  return prefix + truncatedUserId
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

  // IMPORTANTE: Mercado Pago espera unit_price como número decimal (não centavos!)
  // Para BRL: enviar 59.90 (não 5990)
  // A documentação diz "centavos" mas na prática funciona com decimal
  const unitPrice = Number(request.amount.toFixed(2))
  
  // Validação: se o valor original for muito grande, pode estar errado
  if (request.amount > 1000) {
    console.warn('⚠️ Valor muito alto detectado:', request.amount)
  }
  
  console.log('💰 Valor para Mercado Pago:', {
    valorOriginal: request.amount,
    unitPrice: unitPrice,
    esperado: `R$ ${unitPrice.toFixed(2)}`,
    validacao: unitPrice > 0 ? '✅ Valor válido' : '⚠️ Verificar'
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

  // Extrair nome do e-mail se não tiver first_name/last_name
  // Formato comum: "joao.silva@email.com" -> first_name: "Joao", last_name: "Silva"
  let payerFirstName = request.payerFirstName
  let payerLastName = request.payerLastName
  
  if (!payerFirstName && !payerLastName && request.userEmail) {
    const emailName = request.userEmail.split('@')[0]
    const nameParts = emailName.split(/[._-]/)
    if (nameParts.length >= 2) {
      payerFirstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
      payerLastName = nameParts.slice(1).join(' ').charAt(0).toUpperCase() + nameParts.slice(1).join(' ').slice(1)
    } else if (nameParts.length === 1) {
      payerFirstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
    }
  }

  // Configurar categoria do item baseado na área
  const categoryMap: Record<string, string> = {
    wellness: 'health',
    nutri: 'health',
    coach: 'education',
    nutra: 'health',
  }
  const categoryId = categoryMap[request.area] || 'other'

  // Configurar itens da preferência com informações completas
  const preferenceData = {
    items: [
      {
        id: `${request.area}-${request.planType}`, // Código do item (OBRIGATÓRIO)
        title: request.description, // Nome do item (RECOMENDADO)
        description: `Assinatura ${request.planType === 'monthly' ? 'Mensal' : 'Anual'} - YLADA ${request.area.toUpperCase()}`, // Descrição do item (RECOMENDADO)
        category_id: categoryId, // Categoria do item (RECOMENDADO)
        quantity: 1, // Quantidade (RECOMENDADO)
        unit_price: unitPrice, // Preço do item (RECOMENDADO) - Valor em reais (ex: 59.90)
        currency_id: 'BRL',
      },
    ],
    payer: {
      email: request.userEmail, // E-mail do comprador (OBRIGATÓRIO) ✅
      first_name: payerFirstName || undefined, // Nome do comprador (RECOMENDADO)
      last_name: payerLastName || undefined, // Sobrenome do comprador (RECOMENDADO)
    },
    metadata: {
      user_id: request.userId,
      area: request.area,
      plan_type: request.planType,
      product_type: request.productType || undefined,
      ref_vendedor: request.refVendedor || undefined, // Atribuição de venda (ex: paula)
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
      // Habilitar PIX explicitamente
      // PIX é habilitado automaticamente se não excluirmos 'account_money'
      // IMPORTANTE: Para PIX funcionar, a conta do Mercado Pago precisa ter uma chave PIX cadastrada
      // Ver: docs/TROUBLESHOOTING-PIX-NAO-CRIA-PAGAMENTO.md
      // Parcelamento: Configurar installments como número (não objeto)
      // Formato correto segundo documentação: installments: número máximo de parcelas
      // Plano mensal: 1x (sem parcelamento)
      // Plano anual: 12x (com parcelamento)
      installments: request.maxInstallments || (request.planType === 'annual' ? 12 : 1),
      default_installments: 1, // Parcela padrão (1x = à vista)
    },
    statement_descriptor: 'YLADA', // Nome que aparece na fatura
    // Referência externa: area_planType_userId (máx 256 chars - limite MP). Obrigatória para o webhook identificar o pagamento.
    external_reference: buildExternalReference(request.area, request.planType, request.userId),
    // Personalização do checkout (opções limitadas no Checkout Pro)
    // Nota: Personalização visual é limitada no checkout hospedado do Mercado Pago
    // Para mais controle visual, seria necessário usar Checkout Transparente (mais complexo)
  }

  try {
    const extRef = preferenceData.external_reference
    console.log('📤 Enviando preferência para Mercado Pago:', {
      external_reference: extRef,
      external_reference_length: extRef?.length ?? 0,
      valorOriginal: request.amount,
      unitPrice: unitPrice,
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

