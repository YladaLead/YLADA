/**
 * Camada de abstração para gateways de pagamento
 * Unifica Mercado Pago (BR) e Stripe (Internacional)
 */

import { PaymentGateway, detectPaymentGateway, detectCountryCode } from './payment-helpers'
import { createPreference, CreatePreferenceRequest } from './mercado-pago'
import { createRecurringSubscription, CreateSubscriptionRequest } from './mercado-pago-subscriptions'
import { getStripeInstance, getStripePriceId } from './stripe-helpers'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from './resend'
import Stripe from 'stripe'

export interface CheckoutRequest {
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  planType: 'monthly' | 'annual'
  productType?: 'platform_monthly' | 'platform_monthly_12x' | 'platform_annual' | 'formation_only' // Apenas para área Nutri
  userId: string
  userEmail: string
  countryCode?: string
  language?: 'pt' | 'en' | 'es'
  paymentMethod?: 'auto' | 'pix' | 'boleto' // 'auto' = cartão automático, 'pix'/'boleto' = manual
  /** Atribuição de venda (ex: 'paula') — gravado no pagamento e na assinatura */
  refVendedor?: string
  payerFirstName?: string
  payerLastName?: string
}

export interface CheckoutResponse {
  gateway: PaymentGateway
  checkoutUrl: string
  sessionId: string // Preference ID (MP) ou Session ID (Stripe)
  metadata: {
    area: string
    planType: string
    productType?: string // Adicionar productType no metadata
    countryCode: string
    gateway: PaymentGateway
    isRecurring?: boolean // Adicionar isRecurring
    paymentMethod?: string // Adicionar paymentMethod
  }
}

/**
 * Lista de países onde o Mercado Pago opera (América Latina)
 */
const MERCADO_PAGO_COUNTRIES = [
  'BR', // Brasil
  'AR', // Argentina
  'CL', // Chile
  'CO', // Colômbia
  'MX', // México
  'PE', // Peru
  'UY', // Uruguai
  'PY', // Paraguai
  'BO', // Bolívia
  'EC', // Equador
  'VE', // Venezuela
  'CR', // Costa Rica
  'PA', // Panamá
  'GT', // Guatemala
  'HN', // Honduras
  'NI', // Nicarágua
  'SV', // El Salvador
  'DO', // República Dominicana
  'CU', // Cuba
  'JM', // Jamaica
  'TT', // Trinidad e Tobago
  'BZ', // Belize
]

/**
 * Verifica se o país tem suporte ao Mercado Pago
 */
function isMercadoPagoSupported(countryCode: string): boolean {
  return MERCADO_PAGO_COUNTRIES.includes(countryCode.toUpperCase())
}

/**
 * Obtém preço baseado em área, plano e tipo de produto
 * ⚠️ IMPORTANTE: Valores USD são enviados diretamente como BRL (sem conversão)
 * O cartão do cliente faz a conversão automaticamente na hora do pagamento
 */
function getPrice(
  area: string, 
  planType: 'monthly' | 'annual', 
  countryCode: string,
  productType?: 'platform_monthly' | 'platform_monthly_12x' | 'platform_annual' | 'formation_only'
): number {
  // Preços em BRL para Brasil
  if (countryCode === 'BR') {
    // Área Nutri com productType específico
    if (area === 'nutri' && productType) {
      if (productType === 'formation_only') {
        return 1164.00 // R$ 1.164 (12× de R$ 97)
      }
      if (productType === 'platform_monthly') {
        return 197.00 // R$ 197/mês (recorrente)
      }
      if (productType === 'platform_monthly_12x') {
        return 197.00 // R$ 197 (pagamento único parcelável em até 12x)
      }
      if (productType === 'platform_annual') {
        return 1164.00 // R$ 1.164 (12× de R$ 97)
      }
    }
    
    const prices: Record<string, Record<string, number>> = {
      wellness: {
        monthly: 97.00, // R$ 97,00/mês (não recorrente)
        annual: 718.80, // R$ 718,80 (12x de R$ 59,90) - Parcelado pelo vendedor
      },
      nutri: {
        monthly: 197.00, // R$ 197/mês
        annual: 1164.00, // R$ 1.164/ano (12× de R$ 97)
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

  // Preços em USD para internacional (enviados diretamente como BRL, sem conversão)
  // O cartão do cliente converte automaticamente na hora do pagamento
  const prices: Record<string, Record<string, number>> = {
    wellness: {
      monthly: 15.00, // R$ 15,00 (cliente paga ~$15 USD, cartão converte)
      annual: 150.00, // R$ 150,00 (cliente paga ~$150 USD, cartão converte)
    },
    nutri: {
      monthly: 25.00, // R$ 25,00 (cliente paga ~$25 USD, cartão converte)
      annual: 198.00, // R$ 198,00 (cliente paga ~$198 USD, cartão converte)
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
  const amount = getPrice(request.area, request.planType, request.countryCode || 'BR', request.productType)
  
  // Log informativo (se for internacional)
  if (request.countryCode && request.countryCode !== 'BR') {
    console.log(`🌍 Pagamento internacional detectado (${request.countryCode})`)
    console.log(`💳 Valor será processado em BRL, cartão do cliente converte automaticamente`)
  }
  
  // Validação: garantir que o valor está correto
  if (amount <= 0) {
    throw new Error(`Valor inválido para ${request.area} ${request.planType}: ${amount}`)
  }
  
  // Validação: se o valor for muito alto, pode estar errado
  if (amount > 1000 && request.planType === 'monthly') {
    console.warn(`⚠️ Valor mensal muito alto: R$ ${amount}`)
  }
  
  console.log(`💰 Valor final em BRL: R$ ${amount.toFixed(2)}`)
  
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
  
  // IMPORTANTE: Para Preapproval, não usar {payment_id} no back_url
  // O Mercado Pago não substitui placeholders no back_url de Preapproval
  // Usar URL simples sem placeholders
  const successUrl = `${cleanBaseUrl}/${language}/${area}/pagamento-sucesso?gateway=mercadopago`
  const failureUrl = `${cleanBaseUrl}/${language}/${area}/checkout?canceled=true`
  const pendingUrl = `${cleanBaseUrl}/${language}/${area}/pagamento-sucesso?gateway=mercadopago&status=pending`
  
  // Validar que as URLs são válidas
  try {
    new URL(successUrl)
    new URL(failureUrl)
    new URL(pendingUrl)
  } catch (error) {
    throw new Error(`URL inválida construída: ${error}. Base URL: ${cleanBaseUrl}`)
  }
  
  console.log('🔗 URLs de retorno:', {
    baseUrl: cleanBaseUrl,
    successUrl,
    failureUrl,
    pendingUrl,
  })
  
  const isTest = process.env.NODE_ENV !== 'production'
  console.log(`🧪 Modo teste: ${isTest}`)

  // Determinar método de pagamento
  // paymentMethod: 'auto' = cartão automático (Preapproval), 'pix' ou 'boleto' = manual (Preference)
  // Se não especificado, usar Preference para mostrar todos os métodos (PIX, Boleto, Cartão)
  const paymentMethod = request.paymentMethod
  
  // Plano mensal: 
  // - Se paymentMethod === 'auto' → Preapproval (cartão automático, só cartão)
  // - Se paymentMethod === 'pix' ou 'boleto' → Preference (manual, mostra todos)
  // - Se paymentMethod não especificado → Preference (mostra todos para escolha)
  if (request.planType === 'monthly') {
    if (paymentMethod === 'auto') {
      // Assinatura automática (cartão) - Preapproval
      console.log('🔄 Criando assinatura recorrente (Preapproval) para plano mensal - Cartão')
      
      const subscriptionRequest: CreateSubscriptionRequest = {
        area: request.area,
        planType: request.planType,
        productType: request.productType,
        userId: request.userId,
        userEmail: request.userEmail,
        amount,
        description: request.productType === 'formation_only' 
          ? `YLADA ${request.area.toUpperCase()} - Formação Empresarial Nutri`
          : `YLADA ${request.area.toUpperCase()} - Plano Mensal`,
        successUrl,
        failureUrl,
        pendingUrl,
        refVendedor: request.refVendedor,
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
            productType: request.productType, // Adicionar productType no metadata
            countryCode: request.countryCode || 'BR',
            gateway: 'mercadopago',
            isRecurring: true, // Marcar como recorrente
            paymentMethod: 'auto',
          },
        }
      } catch (error: any) {
        console.error('❌ Erro ao criar assinatura recorrente Mercado Pago:', error)
        throw new Error(`Erro ao criar assinatura recorrente Mercado Pago: ${error.message || 'Erro desconhecido'}`)
      }
    } else {
      // PIX, Boleto ou não especificado - Preference (pagamento único, mostra todos os métodos)
      const methodDescription = paymentMethod ? paymentMethod.toUpperCase() : 'TODOS (PIX/Boleto/Cartão)'
      console.log(`💳 Criando pagamento manual (Preference) para plano mensal - ${methodDescription}`)
      
      // Caso especial: "mensal parcelado" (terceiro produto)
      // É pagamento único (Preference), mas com parcelas habilitadas.
      const isMonthlyInstallmentsProduct = request.area === 'nutri' && request.productType === 'platform_monthly_12x'
      const monthlyMaxInstallments = isMonthlyInstallmentsProduct ? 12 : 1
      
      const preferenceRequest: CreatePreferenceRequest = {
        area: request.area,
        planType: request.planType,
        productType: request.productType,
        userId: request.userId,
        userEmail: request.userEmail,
        amount,
        description: request.productType === 'formation_only'
          ? `YLADA ${request.area.toUpperCase()} - Formação Empresarial Nutri`
          : request.productType === 'platform_monthly_12x'
            ? `YLADA ${request.area.toUpperCase()} - Plano Mensal (Parcelado)`
          : `YLADA ${request.area.toUpperCase()} - Plano Mensal`,
        successUrl,
        failureUrl,
        pendingUrl,
        maxInstallments: monthlyMaxInstallments,
        payerFirstName: request.payerFirstName,
        payerLastName: request.payerLastName,
        refVendedor: request.refVendedor,
      }

      try {
        const preference = await createPreference(preferenceRequest, isTest)
        console.log('✅ Preference Mercado Pago criada:', preference.id)

        return {
          gateway: 'mercadopago',
          checkoutUrl: preference.initPoint,
          sessionId: preference.id,
          metadata: {
            area: request.area,
            planType: request.planType,
            productType: request.productType, // Adicionar productType no metadata
            countryCode: request.countryCode || 'BR',
            gateway: 'mercadopago',
            isRecurring: false, // Pagamento único (manual)
            paymentMethod: paymentMethod || 'any', // 'pix', 'boleto' ou 'any' (todos)
          },
        }
      } catch (error: any) {
        console.error('❌ Erro ao criar preference Mercado Pago:', error)
        throw new Error(`Erro ao criar preference Mercado Pago: ${error.message || 'Erro desconhecido'}`)
      }
    }
  } else {
    // Plano anual: sempre pagamento único (Preference) - permite PIX, Boleto e parcelamento
    console.log('💳 Criando pagamento único (Preference) para plano anual - PIX/Boleto/Cartão com parcelamento')
    
    const preferenceRequest: CreatePreferenceRequest = {
      area: request.area,
      planType: request.planType,
      productType: request.productType,
      userId: request.userId,
      userEmail: request.userEmail,
      amount,
      description: request.productType === 'formation_only'
        ? `YLADA ${request.area.toUpperCase()} - Formação Empresarial Nutri`
        : `YLADA ${request.area.toUpperCase()} - Plano Anual`,
      successUrl,
      failureUrl,
      pendingUrl,
      maxInstallments: 12,
      payerFirstName: request.payerFirstName,
      payerLastName: request.payerLastName,
      refVendedor: request.refVendedor,
    }

    try {
      const preference = await createPreference(preferenceRequest, isTest)
      console.log('✅ Preference anual Mercado Pago criada:', preference.id)

      return {
        gateway: 'mercadopago',
        checkoutUrl: preference.initPoint,
        sessionId: preference.id,
        metadata: {
          area: request.area,
          planType: request.planType,
          productType: request.productType, // Adicionar productType no metadata
          countryCode: request.countryCode || 'BR',
          gateway: 'mercadopago',
          isRecurring: false, // Pagamento único (anual)
          paymentMethod: 'any', // Permite qualquer método (PIX, Boleto, Cartão)
        },
      }
    } catch (error: any) {
      console.error('❌ Erro ao criar preference anual Mercado Pago:', error)
      throw new Error(`Erro ao criar preference anual Mercado Pago: ${error.message || 'Erro desconhecido'}`)
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
      ...(request.productType && { product_type: request.productType }), // Adicionar productType apenas se existir
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

  // ⚠️ BLOQUEAR: Apenas países onde Mercado Pago opera podem pagar
  if (!isMercadoPagoSupported(countryCode)) {
    // Enviar notificação por email quando alguém tentar pagar de país não suportado
    try {
      await notifyUnsupportedCountryPayment({
        countryCode,
        area: request.area,
        planType: request.planType,
        userEmail: request.userEmail,
        userId: request.userId,
      })
    } catch (notifyError) {
      console.error('Erro ao enviar notificação de país não suportado:', notifyError)
      // Não falhar o checkout se a notificação falhar
    }
    
    throw new Error(
      `Pagamentos disponíveis apenas para países da América Latina. ` +
      `Entre em contato conosco através do suporte para uma solução alternativa de pagamento.`
    )
  }

  // Detectar gateway baseado no país
  // ⚠️ FORÇADO: Todos os países usam Mercado Pago (Stripe removido)
  let gateway: PaymentGateway
  if (httpRequest) {
    gateway = detectPaymentGateway(httpRequest)
  } else {
    gateway = 'mercadopago' // Sempre Mercado Pago
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

/**
 * Notifica admin quando alguém tenta pagar de país não suportado
 */
interface UnsupportedCountryNotificationData {
  countryCode: string
  area: string
  planType: string
  userEmail?: string
  userId?: string
}

async function notifyUnsupportedCountryPayment(data: UnsupportedCountryNotificationData): Promise<void> {
  if (!isResendConfigured() || !resend) {
    console.warn('[Payment Gateway] Resend não configurado, notificação não será enviada')
    return
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL || FROM_EMAIL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                   process.env.NEXT_PUBLIC_APP_URL || 
                   'https://www.ylada.com'

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #dc2626; margin-bottom: 20px;">⚠️ Tentativa de Pagamento de País Não Suportado</h1>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #dc2626;">
              <h2 style="color: #991b1b; margin-top: 0;">Detalhes da Tentativa</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 150px;">País:</td>
                  <td style="padding: 8px 0; color: #111827;"><strong>${data.countryCode}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Área:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.area.toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Plano:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.planType === 'monthly' ? 'Mensal' : 'Anual'}</td>
                </tr>
                ${data.userEmail ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">E-mail:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.userEmail}</td>
                </tr>
                ` : ''}
                ${data.userId ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">User ID:</td>
                  <td style="padding: 8px 0; color: #111827; font-family: monospace;">${data.userId}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #0284c7;">
              <h3 style="color: #0c4a6e; margin-top: 0;">📞 Contato do Cliente</h3>
              <p style="color: #075985; margin: 0;">
                <strong>WhatsApp:</strong> <a href="https://wa.me/5519996049800" style="color: #0284c7;">55 1999604-9800</a><br>
                <strong>E-mail:</strong> <a href="mailto:${adminEmail}" style="color: #0284c7;">${adminEmail}</a>
              </p>
            </div>

            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                <strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: adminEmail,
      subject: `⚠️ Tentativa de Pagamento de País Não Suportado: ${data.countryCode} - ${data.area.toUpperCase()}`,
      html: emailHtml,
    })

    console.log(`[Payment Gateway] ✅ Notificação enviada para ${adminEmail}`)
  } catch (error: any) {
    console.error('[Payment Gateway] Erro ao enviar notificação:', error)
    // Não lançar erro - apenas logar
  }
}