import { COUNTRIES, getCountryByCode } from '@/components/CountrySelector'

/**
 * Formata número de telefone com bandeira do país
 * Retorna objeto com bandeira, código e número formatado
 */
export function formatPhoneWithCountry(phone: string | null): {
  flag: string
  code: string
  number: string
  full: string
} | null {
  if (!phone) return null

  // Tentar identificar o país pelo código
  for (const country of COUNTRIES) {
    if (country.phoneCode && phone.startsWith(country.phoneCode)) {
      const number = phone.substring(country.phoneCode.length)
      return {
        flag: country.flag,
        code: `+${country.phoneCode}`,
        number: number,
        full: phone
      }
    }
  }

  // Se não encontrou, retornar genérico
  return {
    flag: '🌍',
    code: '',
    number: phone,
    full: phone
  }
}

/**
 * Exibe telefone formatado com bandeira
 */
export function displayPhoneWithFlag(phone: string | null): string {
  const formatted = formatPhoneWithCountry(phone)
  if (!formatted) return ''

  if (formatted.code) {
    return `${formatted.flag} ${formatted.code} ${formatted.number}`
  }
  return `${formatted.flag} ${formatted.number}`
}


