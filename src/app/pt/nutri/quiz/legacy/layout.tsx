import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'
const legacyUrl = `${baseUrl}/pt/nutri/quiz/legacy`

export const metadata: Metadata = {
  title: 'Em que fase está sua carreira como nutricionista? — YLADA Nutri',
  description:
    'Descubra em 2 minutos o que está travando sua agenda e qual é o próximo passo certo para você.',
  alternates: {
    canonical: legacyUrl,
  },
  openGraph: {
    title: 'Em que fase está sua carreira como nutricionista? — YLADA Nutri',
    description:
      'Descubra em 2 minutos o que está travando sua agenda e qual é o próximo passo certo para você.',
    url: legacyUrl,
    siteName: 'YLADA Nutri',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Em que fase está sua carreira como nutricionista? — YLADA Nutri',
    description: 'Descubra em 2 minutos o que está travando sua agenda e qual é o próximo passo certo.',
  },
}

export default function NutriQuizLegacyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
