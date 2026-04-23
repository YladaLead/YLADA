import type { Metadata } from 'next'

/** Imagem estática para pré-visualização ao partilhar qualquer `/estetica-consultoria/responder/[token]`. */
export const ESTETICA_CONSULTORIA_RESPONDER_OG_PATH = '/marketing/estetica-consultoria-responder-og.png'

const OG_WIDTH = 768
const OG_HEIGHT = 1024

function publicSiteOrigin(): string {
  const u =
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION?.trim().replace(/\/$/, '') ||
    ''
  if (u) return u
  const v = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
  if (v) return `https://${v}`
  return 'https://www.ylada.com'
}

/** Metadados OG/Twitter comuns a todos os tokens desta rota (imagem única). */
export function buildEsteticaConsultoriaResponderShareMetadata(): Metadata {
  const base = publicSiteOrigin()
  const title = 'YLADA · Questionário (Estética Consultoria)'
  const description =
    'Questionário confidencial para o seu plano de acompanhamento. Responda com calma — as informações são confidenciais.'

  return {
    metadataBase: new URL(base),
    title,
    description,
    openGraph: {
      title,
      description,
      locale: 'pt_BR',
      type: 'website',
      images: [
        {
          url: ESTETICA_CONSULTORIA_RESPONDER_OG_PATH,
          width: OG_WIDTH,
          height: OG_HEIGHT,
          alt: 'YLADA Estética Consultoria — questionário confidencial',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ESTETICA_CONSULTORIA_RESPONDER_OG_PATH],
    },
  }
}
