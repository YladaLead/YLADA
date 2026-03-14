import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'

export const metadata: Metadata = {
  title: 'Sobre o YLADA — Boas conversas começam com boas perguntas',
  description: 'Por que o YLADA existe. Uma plataforma onde profissionais transformam conhecimento em perguntas que iniciam conversas melhores com clientes.',
  openGraph: {
    title: 'Sobre o YLADA — Boas conversas começam com boas perguntas',
    description: 'Manifesto YLADA. Por que criamos uma plataforma de diagnósticos que preparam conversas com clientes.',
    url: `${baseUrl}/pt/sobre`,
    type: 'website',
  },
}

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
