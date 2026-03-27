import { getYladaAreaPathPrefix } from '@/config/ylada-areas'

function appOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION ||
    'https://www.ylada.com'
  ).replace(/\/$/, '')
}

export function getYladaReferralLandingUrl(areaCodigo: string): string {
  return `${appOrigin()}${getYladaAreaPathPrefix(areaCodigo)}`
}

/**
 * Texto único de indicação: vale para qualquer área (nutri → médico, etc.).
 * Link na home; “Tem na sua área também” leva a pessoa à linha dela no site.
 */
export function buildYladaReferralWhatsappHref(_areaCodigo?: string, _areaLabel?: string): string {
  const home = appOrigin()

  const text = [
    'Oi! Lembrei de você vendo isso aqui…',
    '',
    'É uma forma gratuita de captar quem está mais pronto pra agendar, evitando curiosos que só perguntam preço.',
    '',
    'Dá uma olhada:',
    `👉 ${home}`,
    '',
    'Tem na sua área também.',
  ].join('\n')

  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
