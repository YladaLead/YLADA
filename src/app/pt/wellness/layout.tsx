import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getFullOGImageUrl } from '@/lib/og-image-map'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://ylada.com'

// URL absoluta da imagem COM logo para WhatsApp
const ogImageUrl = `${baseUrl}/images/wellness-hero-com-logo.png`

export const metadata: Metadata = {
  manifest: '/manifest-wellness.json',
  icons: {
    icon: '/images/logo/wellness-quadrado.png',
    apple: '/images/logo/wellness-quadrado.png',
  },
  title: 'WELLNESS - Transforme seu trabalho de bem-estar em conexões reais',
  description: 'O YLADA Wellness é o assistente digital que te ajuda a gerar novos contatos, despertar interesse em pessoas certas e fortalecer suas conexões — de forma leve, simples e inspiradora.',
  openGraph: {
    title: 'WELLNESS - Transforme seu trabalho de bem-estar em conexões reais',
    description: 'O YLADA Wellness é o assistente digital que te ajuda a gerar novos contatos, despertar interesse em pessoas certas e fortalecer suas conexões — de forma leve, simples e inspiradora.',
    url: `${baseUrl}/pt/wellness`,
    siteName: 'WELLNESS - Your Leading Data System',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'WELLNESS - Transforme seu trabalho de bem-estar em conexões reais',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WELLNESS - Transforme seu trabalho de bem-estar em conexões reais',
    description: 'O YLADA Wellness é o assistente digital que te ajuda a gerar novos contatos e fortalecer suas conexões.',
    images: [ogImageUrl],
  },
}

export default function WellnessLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

