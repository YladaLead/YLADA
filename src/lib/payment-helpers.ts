/**
 * Helpers para detecção de país e gateway de pagamento
 * ⚠️ Todos os países usam Mercado Pago (Stripe removido)
 */

export type PaymentGateway = 'mercadopago' | 'stripe'
export type CountryCode = string

/**
 * Detecta código de país baseado em headers da requisição.
 * Quando o geo retorna US ou UNKNOWN, usa Accept-Language como fallback:
 * pt-BR ou pt (exceto pt-PT) → BR, para evitar bloquear usuários no Brasil
 * cujo IP aparece como US (VPN, proxy, operadora).
 */
export function detectCountryCode(request: Request): CountryCode {
  const fromGeo = request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code') ||
    request.headers.get('x-geoip-country-code') ||
    ''
  const countryCode = fromGeo ? fromGeo.toUpperCase() : 'UNKNOWN'

  // Fallback: quando geo diz US ou está indefinido, priorizar idioma português do Brasil
  if (countryCode === 'US' || countryCode === 'UNKNOWN') {
    const acceptLanguage = request.headers.get('accept-language') || ''
    const ptBr = /pt-BR|pt-br/i.test(acceptLanguage)
    const ptOnly = /\bpt\b/i.test(acceptLanguage) && !/pt-PT|pt-pt/i.test(acceptLanguage)
    if (ptBr || ptOnly) {
      return 'BR'
    }
  }

  return countryCode
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

