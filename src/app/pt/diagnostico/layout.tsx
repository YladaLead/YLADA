import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://ylada.com'
const pageUrl = `${baseUrl.replace(/\/$/, '')}/pt/diagnostico`

/**
 * Imagem OG para o diagnóstico de comunicação.
 * Mostra: "Descubra seu perfil de comunicação profissional" + distribuição 60/30/10.
 */
const ogImagePath = '/images/og/ylada/diagnostico-comunicacao.jpg'
const ogImageUrl = `${baseUrl}${ogImagePath}`

export const metadata: Metadata = {
  title: 'Descubra o que está travando o crescimento do seu negócio profissional | YLADA',
  description:
    'Responda algumas perguntas rápidas e descubra qual é o principal bloqueio que pode estar limitando seus resultados. Leva menos de 1 minuto.',
  openGraph: {
    title: 'Descubra o que está travando o crescimento do seu negócio profissional',
    description:
      '60% atraem curiosos. 30% estão evoluindo. 10% atraem clientes preparados. Descubra o seu em menos de 1 minuto.',
    url: pageUrl,
    siteName: 'YLADA',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Diagnóstico de comunicação profissional - Descubra seu perfil | YLADA',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Descubra seu perfil de comunicação profissional',
    description: '60% atraem curiosos. 30% estão evoluindo. 10% atraem clientes preparados. Descubra o seu.',
    images: [ogImageUrl],
  },
}

export default function DiagnosticoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
