/**
 * Helpers para detecção de país e gateway de pagamento
 * ⚠️ Todos os países usam Mercado Pago (Stripe removido)
 */

export type PaymentGateway = 'mercadopago' | 'stripe'
export type CountryCode = string

/**
 * Detecta código de país baseado em headers da requisição
 */
export function detectCountryCode(request: Request): CountryCode {
  const countryCode = request.headers.get('x-vercel-ip-country') || 
                      request.headers.get('cf-ipcountry') || 
                      request.headers.get('x-country-code') || 
                      request.headers.get('x-geoip-country-code') || 
                      'UNKNOWN'
  
  return countryCode.toUpperCase()
}

/**
 * Detecta qual gateway de pagamento usar baseado no país
 * ⚠️ FORÇADO: Todos os países usam Mercado Pago (Stripe removido)
 */
export function detectPaymentGateway(request: Request): PaymentGateway {
  // Sempre retorna Mercado Pago (Stripe foi removido)
  return 'mercadopago'
}

/**
 * Verifica se o país é Brasil
 */
export function isBrazil(countryCode: CountryCode): boolean {
  return countryCode === 'BR'
}

/**
 * Obtém moeda baseada no país
 */
export function getCurrencyByCountry(countryCode: CountryCode): string {
  if (countryCode === 'BR') {
    return 'BRL'
  }
  return 'USD'
}

/**
 * Obtém locale baseado no país
 */
export function getLocaleByCountry(countryCode: CountryCode): string {
  if (countryCode === 'BR') {
    return 'pt-BR'
  }
  // Outros países da América Latina
  if (['AR', 'CL', 'CO', 'MX', 'PE', 'UY', 'PY', 'BO', 'EC', 'VE'].includes(countryCode)) {
    return 'es'
  }
  // Padrão: inglês
  return 'en'
}

