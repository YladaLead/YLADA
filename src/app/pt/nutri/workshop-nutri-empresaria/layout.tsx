import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'

const workshopPageUrl = `${baseUrl}/pt/nutri/workshop-nutri-empresaria`
const workshopOgImage = `${baseUrl}/images/workshop-agenda-instavel/banner-aula-agenda.png`

export const metadata: Metadata = {
  title: 'Aula Nutri Empresária — YLADA Nutri',
  description:
    'Aula ao vivo para nutricionistas: agenda, oferta e Método YLADA com Dra. Gláucia Melo e Andre Faula. Inscrição gratuita; WhatsApp com link e lembretes.',
  alternates: {
    canonical: workshopPageUrl,
  },
  openGraph: {
    title: 'Aula Nutri Empresária — YLADA Nutri',
    description:
      'Agenda, oferta e método YLADA em aula ao vivo com Dra. Gláucia Melo. Grátis: inscrição e automação no WhatsApp.',
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
      'Aula ao vivo: agenda, oferta e YLADA com Dra. Gláucia Melo. Inscrição grátis e link no WhatsApp.',
    images: [workshopOgImage],
  },
}

export default function WorkshopNutriEmpresariaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
