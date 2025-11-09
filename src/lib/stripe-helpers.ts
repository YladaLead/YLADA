/**
 * Mapeamento de países para contas Stripe e Price IDs específicos
 * Permite preços diferentes por país (não apenas conversão de câmbio)
 */

export type StripeAccount = 'us' // Apenas US agora (BR usa Mercado Pago)

/**
 * Mapeamento de países para códigos de preço específicos
 * Permite ter preços diferentes por país
 * 
 * Formato: AREA_PLAN_TYPE_COUNTRY
 * Exemplo: wellness_monthly_CO (Colômbia tem preço diferente)
 * 
 * Se um país não estiver aqui, usa o padrão da conta (BR ou US)
 */
const COUNTRY_SPECIFIC_PRICES: Record<string, {
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  planType: 'monthly' | 'annual'
  country: string
  stripeAccount: StripeAccount
}> = {
  // Exemplo: País específico com preço diferente
  // 'CO_WELLNESS_MONTHLY': {
  //   area: 'wellness',
  //   planType: 'monthly',
  //   country: 'CO',
  //   stripeAccount: 'us'
  // },
}

export interface StripeConfig {
  secretKey: string
  publishableKey: string
  webhookSecret: string
  connectClientId: string
}

/**
 * Detecta país baseado em headers da requisição
 * ⚠️ DEPRECATED: Use detectPaymentGateway() em payment-helpers.ts
 * Mantido apenas para compatibilidade com código antigo
 */
export function detectCountry(request: Request): StripeAccount {
  // Sempre retorna 'us' agora (BR usa Mercado Pago)
  return 'us'
}

/**
 * Obtém código de país detectado (para logs e debug)
 */
export function getDetectedCountryCode(request: Request): string {
  const countryCode = request.headers.get('x-vercel-ip-country') || 
                      request.headers.get('cf-ipcountry') || 
                      request.headers.get('x-country-code') || 
                      request.headers.get('x-geoip-country-code') || ''
  return countryCode.toUpperCase() || 'UNKNOWN'
}

/**
 * Obtém configuração Stripe (apenas US agora)
 */
export function getStripeConfig(country: StripeAccount, isTest: boolean = true): StripeConfig {
  const prefix = isTest ? 'TEST' : 'LIVE'
  
  // Sempre retorna configuração US (BR usa Mercado Pago)
  return {
    secretKey: process.env[`STRIPE_SECRET_KEY_US_${prefix}`] || process.env.STRIPE_SECRET_KEY_US || '',
    publishableKey: process.env[`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US_${prefix}`] || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US || '',
    webhookSecret: process.env[`STRIPE_WEBHOOK_SECRET_US_${prefix}`] || process.env.STRIPE_WEBHOOK_SECRET_US || '',
    connectClientId: process.env[`STRIPE_CONNECT_CLIENT_ID_US_${prefix}`] || process.env.STRIPE_CONNECT_CLIENT_ID_US || '',
  }
}

/**
 * Obtém Price ID baseado em área, plano, conta Stripe e país específico
 * 
 * Prioridade:
 * 1. Preço específico do país (se configurado)
 * 2. Preço padrão da conta (BR ou US)
 */
export function getStripePriceId(
  area: 'wellness' | 'nutri' | 'coach' | 'nutra',
  planType: 'monthly' | 'annual',
  stripeAccount: StripeAccount,
  countryCode?: string
): string {
  // ⚠️ BRASIL USA MERCADO PAGO - não usar Stripe para BR
  // Se for Brasil, não deve chegar aqui (deve usar Mercado Pago)
  if (countryCode === 'BR') {
    throw new Error(
      `Brasil usa Mercado Pago, não Stripe. ` +
      `Use payment-gateway.ts para criar checkout.`
    )
  }

  // Se tem código de país específico, tentar buscar preço específico
  if (countryCode && countryCode !== 'UNKNOWN') {
    const countryKey = `${countryCode}_${area.toUpperCase()}_${planType.toUpperCase()}`
    const specificPrice = COUNTRY_SPECIFIC_PRICES[countryKey]
    
    if (specificPrice) {
      // Preço específico encontrado
      const envKey = `STRIPE_PRICE_${area.toUpperCase()}_${planType.toUpperCase()}_${countryCode.toUpperCase()}`
      const priceId = process.env[envKey]
      
      if (priceId) {
        console.log(`💰 Usando preço específico para ${countryCode}: ${envKey}`)
        return priceId
      }
    }
  }

  // Usar preço padrão US
  const envKey = `STRIPE_PRICE_${area.toUpperCase()}_${planType.toUpperCase()}_US`
  const priceId = process.env[envKey] || ''
  
  if (!priceId) {
    throw new Error(
      `Price ID não configurado para ${area} ${planType} US. ` +
      `Configure ${envKey} no .env`
    )
  }
  
  return priceId
}

/**
 * Obtém moeda (sempre USD agora, BR usa Mercado Pago)
 */
export function getCurrency(stripeAccount: StripeAccount): string {
  return 'usd'
}

/**
 * Obtém locale (sempre en agora, BR usa Mercado Pago)
 */
export function getLocale(stripeAccount: StripeAccount, countryCode?: string): string {
  return 'en'
}

/**
 * Cria instância do Stripe baseada no país
 */
export async function getStripeInstance(country: StripeAccount, isTest: boolean = true) {
  const config = getStripeConfig(country, isTest)
  
  if (!config.secretKey) {
    const prefix = isTest ? 'TEST' : 'LIVE'
    const varName = `STRIPE_SECRET_KEY_US_${prefix}`
    const fallbackVarName = `STRIPE_SECRET_KEY_US`
    throw new Error(
      `Stripe Secret Key não configurada. ` +
      `Configure ${varName} ou ${fallbackVarName} no .env.local. ` +
      `Variáveis encontradas: ${varName}=${process.env[varName] ? 'SIM' : 'NÃO'}, ${fallbackVarName}=${process.env[fallbackVarName] ? 'SIM' : 'NÃO'}`
    )
  }
  
  // Validar formato da chave
  if (!config.secretKey.startsWith('sk_test_') && !config.secretKey.startsWith('sk_live_')) {
    throw new Error(
      `Stripe Secret Key inválida. ` +
      `A chave deve começar com "sk_test_" (teste) ou "sk_live_" (produção). ` +
      `Chave recebida começa com: "${config.secretKey.substring(0, 10)}..."`
    )
  }

  // Importar Stripe dinamicamente
  const Stripe = (await import('stripe')).default
  
  try {
    return new Stripe(config.secretKey.trim(), {
      apiVersion: '2025-04-30.basil',
    })
  } catch (error: any) {
    throw new Error(
      `Erro ao criar instância do Stripe: ${error.message}. ` +
      `Verifique se a chave está completa e válida.`
    )
  }
}
