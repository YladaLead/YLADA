/**
 * Mapeamento de países para contas Stripe e Price IDs específicos
 * Permite preços diferentes por país (não apenas conversão de câmbio)
 */

export type StripeAccount = 'br' | 'us'

// Países que usam conta Stripe BR
const BR_ACCOUNT_COUNTRIES = [
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
  // Exemplo: Colômbia com preço específico
  // 'CO_WELLNESS_MONTHLY': {
  //   area: 'wellness',
  //   planType: 'monthly',
  //   country: 'CO',
  //   stripeAccount: 'br'
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
 * Prioridade: IP Country Code > Accept-Language > Timezone
 */
export function detectCountry(request: Request): StripeAccount {
  // 1. Verificar IP Country Code (mais confiável - Vercel/Cloudflare)
  const countryCode = request.headers.get('x-vercel-ip-country') || 
                      request.headers.get('cf-ipcountry') || 
                      request.headers.get('x-country-code') || 
                      request.headers.get('x-geoip-country-code') || ''
  
  if (countryCode) {
    const upperCode = countryCode.toUpperCase()
    // Se for país da América Latina, usar conta BR
    if (BR_ACCOUNT_COUNTRIES.includes(upperCode)) {
      return 'br'
    }
    // Para outros países, usar conta US
    return 'us'
  }

  // 2. Verificar header Accept-Language
  const acceptLanguage = request.headers.get('accept-language') || ''
  if (acceptLanguage.includes('pt-BR') || acceptLanguage.includes('es-')) {
    return 'br'
  }
  if (acceptLanguage.includes('pt-PT')) {
    return 'us'
  }

  // 3. Verificar timezone (menos confiável, mas útil)
  const timezone = request.headers.get('x-timezone') || ''
  const americaLatinaTimezones = [
    'America/Sao_Paulo',
    'America/Fortaleza',
    'America/Recife',
    'America/Manaus',
    'America/Cuiaba',
    'America/Campo_Grande',
    'America/Belem',
    'America/Araguaina',
    'America/Maceio',
    'America/Bahia',
    'America/Santarem',
    'America/Boa_Vista',
    'America/Rio_Branco',
    'America/Porto_Velho',
    'America/Eirunepe',
    'America/Noronha',
    'America/Montevideo',
    'America/Argentina',
    'America/Santiago',
    'America/Bogota',
    'America/Lima',
    'America/Caracas',
    'America/La_Paz',
    'America/Guayaquil',
    'America/Asuncion',
    'America/Mexico_City',
    'America/Cancun',
    'America/Merida',
    'America/Monterrey',
    'America/Mazatlan',
    'America/Chihuahua',
    'America/Hermosillo',
    'America/Tijuana',
    'America/Bahia_Banderas',
  ]
  
  if (timezone && americaLatinaTimezones.some(tz => timezone.includes(tz))) {
    return 'br'
  }

  // 4. Padrão: se não conseguir detectar, usar US (mais internacional)
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
 * Obtém configuração Stripe baseada no país
 */
export function getStripeConfig(country: StripeAccount, isTest: boolean = true): StripeConfig {
  const prefix = isTest ? 'TEST' : 'LIVE'
  
  if (country === 'br') {
    return {
      secretKey: process.env[`STRIPE_SECRET_KEY_BR_${prefix}`] || process.env.STRIPE_SECRET_KEY_BR || '',
      publishableKey: process.env[`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR_${prefix}`] || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_BR || '',
      webhookSecret: process.env[`STRIPE_WEBHOOK_SECRET_BR_${prefix}`] || process.env.STRIPE_WEBHOOK_SECRET_BR || '',
      connectClientId: process.env[`STRIPE_CONNECT_CLIENT_ID_BR_${prefix}`] || process.env.STRIPE_CONNECT_CLIENT_ID_BR || '',
    }
  } else {
    return {
      secretKey: process.env[`STRIPE_SECRET_KEY_US_${prefix}`] || process.env.STRIPE_SECRET_KEY_US || '',
      publishableKey: process.env[`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US_${prefix}`] || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_US || '',
      webhookSecret: process.env[`STRIPE_WEBHOOK_SECRET_US_${prefix}`] || process.env.STRIPE_WEBHOOK_SECRET_US || '',
      connectClientId: process.env[`STRIPE_CONNECT_CLIENT_ID_US_${prefix}`] || process.env.STRIPE_CONNECT_CLIENT_ID_US || '',
    }
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
  // Para plano anual no Brasil, usar produto one-time (permite parcelamento)
  const isAnnualPlan = planType === 'annual'
  const isBrazil = stripeAccount === 'br' || countryCode === 'BR'
  
  if (isAnnualPlan && isBrazil) {
    // Tentar usar Price ID do produto one-time (parcelado)
    const oneTimeEnvKey = `STRIPE_PRICE_${area.toUpperCase()}_ANNUAL_ONETIME_${stripeAccount.toUpperCase()}`
    const oneTimePriceId = process.env[oneTimeEnvKey]
    
    if (oneTimePriceId) {
      console.log(`💰 Usando preço one-time (parcelado) para ${area} anual BR: ${oneTimeEnvKey}`)
      return oneTimePriceId
    }
    
    // Fallback: usar preço normal (se não tiver one-time configurado)
    console.log(`⚠️ Price ID one-time não encontrado (${oneTimeEnvKey}), usando preço padrão`)
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

  // Usar preço padrão da conta (BR ou US)
  const envKey = `STRIPE_PRICE_${area.toUpperCase()}_${planType.toUpperCase()}_${stripeAccount.toUpperCase()}`
  const priceId = process.env[envKey] || ''
  
  if (!priceId) {
    throw new Error(
      `Price ID não configurado para ${area} ${planType} ${stripeAccount}. ` +
      `Configure ${envKey} no .env`
    )
  }
  
  return priceId
}

/**
 * Obtém moeda baseada na conta Stripe
 */
export function getCurrency(stripeAccount: StripeAccount): string {
  return stripeAccount === 'br' ? 'brl' : 'usd'
}

/**
 * Obtém locale baseado na conta Stripe
 */
export function getLocale(stripeAccount: StripeAccount, countryCode?: string): string {
  if (stripeAccount === 'br') {
    // Para conta BR, usar português ou espanhol baseado no país
    if (countryCode === 'BR') {
      return 'pt-BR'
    }
    // Outros países da América Latina geralmente falam espanhol
    return 'es'
  }
  // Conta US: usar inglês por padrão
  return 'en'
}

/**
 * Cria instância do Stripe baseada no país
 */
export async function getStripeInstance(country: StripeAccount, isTest: boolean = true) {
  const config = getStripeConfig(country, isTest)
  
  if (!config.secretKey) {
    const prefix = isTest ? 'TEST' : 'LIVE'
    const varName = `STRIPE_SECRET_KEY_${country.toUpperCase()}_${prefix}`
    const fallbackVarName = `STRIPE_SECRET_KEY_${country.toUpperCase()}`
    throw new Error(
      `Stripe Secret Key não configurada para ${country}. ` +
      `Configure ${varName} ou ${fallbackVarName} no .env.local. ` +
      `Variáveis encontradas: ${varName}=${process.env[varName] ? 'SIM' : 'NÃO'}, ${fallbackVarName}=${process.env[fallbackVarName] ? 'SIM' : 'NÃO'}`
    )
  }
  
  // Validar formato da chave
  if (!config.secretKey.startsWith('sk_test_') && !config.secretKey.startsWith('sk_live_')) {
    throw new Error(
      `Stripe Secret Key inválida para ${country}. ` +
      `A chave deve começar com "sk_test_" (teste) ou "sk_live_" (produção). ` +
      `Chave recebida começa com: "${config.secretKey.substring(0, 10)}..."`
    )
  }

  // Importar Stripe dinamicamente
  const Stripe = (await import('stripe')).default
  
  try {
    return new Stripe(config.secretKey.trim(), {
      apiVersion: '2025-04-30.basil', // ✅ Versão que suporta Pix nas configurações de métodos de pagamento
    })
  } catch (error: any) {
    throw new Error(
      `Erro ao criar instância do Stripe para ${country}: ${error.message}. ` +
      `Verifique se a chave está completa e válida.`
    )
  }
}
