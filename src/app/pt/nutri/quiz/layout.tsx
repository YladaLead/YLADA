import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'
const quizPageUrl = `${baseUrl}/pt/nutri/quiz`

export const metadata: Metadata = {
  title: 'Em que fase está sua carreira como nutricionista? — YLADA Nutri',
  description:
    'Descubra em 2 minutos o que está travando sua agenda e qual é o próximo passo certo para você.',
  alternates: {
    canonical: quizPageUrl,
  },
  openGraph: {
    title: 'Em que fase está sua carreira como nutricionista? — YLADA Nutri',
    description:
      'Descubra em 2 minutos o que está travando sua agenda e qual é o próximo passo certo para você.',
    url: quizPageUrl,
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

export default function QuizNutriLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
