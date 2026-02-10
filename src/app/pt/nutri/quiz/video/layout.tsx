import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'
const videoPageUrl = `${baseUrl}/pt/nutri/quiz/video`

export const metadata: Metadata = {
  title: 'Entenda como corrigir — YLADA Nutri',
  description:
    'Um sistema que organiza o que postar, qual link usar e como conduzir a conversa até a consulta. Conheça o Ilada Nutri.',
  alternates: {
    canonical: videoPageUrl,
  },
  openGraph: {
    title: 'Entenda como corrigir — YLADA Nutri',
    description: 'Um sistema que organiza o que postar, qual link usar e como conduzir até a consulta.',
    url: videoPageUrl,
    siteName: 'YLADA Nutri',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function QuizVideoLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
