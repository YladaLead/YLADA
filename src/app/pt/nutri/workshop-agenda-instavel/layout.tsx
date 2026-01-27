import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'

// URL da página do workshop (prévia WhatsApp/Facebook usa og:url e canonical)
const workshopPageUrl = `${baseUrl}/pt/nutri/workshop-agenda-instavel`
// Imagem OG = banner da aula (não o logo Nutri). URL absoluta obrigatória para WhatsApp/Facebook.
const workshopOgImage = `${baseUrl}/images/workshop-agenda-instavel/banner-aula-agenda.png`

export const metadata: Metadata = {
  title: 'Aula prática: Sua agenda cheia — YLADA Nutri',
  description:
    'Sua agenda fica cheia num mês e vazia no outro? Descubra o que está travando e saia com um plano simples para gerar procura com mais constância. 100% gratuito.',
  alternates: {
    canonical: workshopPageUrl,
  },
  openGraph: {
    title: 'Aula prática: Sua agenda cheia — YLADA Nutri',
    description:
      'Sua agenda fica cheia num mês e vazia no outro? Descubra o que está travando e saia com um plano simples para gerar procura com mais constância. 100% gratuito.',
    url: workshopPageUrl,
    siteName: 'YLADA Nutri',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: workshopOgImage,
        width: 1200,
        height: 630,
        alt: 'Aula prática ao vivo: sua agenda cheia — YLADA Nutri',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aula prática: Sua agenda cheia — YLADA Nutri',
    description:
      'Sua agenda fica cheia num mês e vazia no outro? Descubra o que está travando e saia com um plano simples. 100% gratuito.',
    images: [workshopOgImage],
  },
}

export default function WorkshopAgendaInstavelLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
