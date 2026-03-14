import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'
const pageUrl = `${baseUrl}/pt/metodo-ylada`

export const metadata: Metadata = {
  title: 'Filosofia YLADA — Transforme curiosidade em conversas com clientes',
  description: 'A nova lógica de comunicação que transforma marketing em conversas com pessoas realmente interessadas. Diagnósticos inteligentes aplicados pelo Método YLADA.',
  openGraph: {
    title: 'Filosofia YLADA — Transforme curiosidade em conversas com clientes',
    description: 'Transforme curiosidade em conversas com clientes através de diagnósticos inteligentes. A filosofia aplicada pelo Método YLADA.',
    url: pageUrl,
    type: 'website',
  },
}

export default function MetodoYLADALayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
