import type { Metadata } from 'next'
import BookFunnelPage from '@/components/book-funnel/BookFunnelPage'
import { conviccaoConfig } from '@/lib/book-funnels/conviccao.config'

export const metadata: Metadata = {
  title: 'Inteligência de Convicção — Diagnóstico do Leitor',
  description:
    'Você leu o livro. Agora descubra onde a convicção está travando na sua realidade e qual é o próximo passo.',
  robots: { index: false, follow: false }, // página privada de leitor
  openGraph: {
    title: 'Inteligência de Convicção',
    description: 'Diagnóstico exclusivo para leitores do livro.',
    type: 'website',
  },
}

export default function ConviccaoPage() {
  return <BookFunnelPage config={conviccaoConfig} />
}
