import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'

const workshopPageUrl = `${baseUrl}/pt/nutri/workshop-nutri-empresaria`
const workshopOgImage = `${baseUrl}/images/workshop-agenda-instavel/banner-aula-agenda.png`

export const metadata: Metadata = {
  title: 'Aula Nutri Empresária — YLADA Nutri',
  description:
    'Você é nutricionista, mas seu posicionamento ainda não é de empresária? Aula ao vivo com Dra. Gláucia Melo e Andre Faula (CEO YLADA). Diagnóstico, decisão rápida. Explique menos. Venda mais. Grátis; WhatsApp com acesso e lembretes.',
  alternates: {
    canonical: workshopPageUrl,
  },
  openGraph: {
    title: 'Aula Nutri Empresária — YLADA Nutri',
    description:
      'Posicionamento de empresária, diagnóstico rápido e aula ao vivo com Gláucia Melo + CEO YLADA. Grátis, online, vagas limitadas.',
    url: workshopPageUrl,
    siteName: 'YLADA Nutri',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: workshopOgImage,
        width: 1200,
        height: 630,
        alt: 'Aula Nutri Empresária — YLADA Nutri',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aula Nutri Empresária — YLADA Nutri',
    description:
      'Nutricionista: posicionamento, diagnóstico e decisão. Aula gratuita com Gláucia Melo + YLADA. Link no WhatsApp.',
    images: [workshopOgImage],
  },
}

export default function WorkshopNutriEmpresariaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
