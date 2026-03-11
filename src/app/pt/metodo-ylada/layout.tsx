import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'
const pageUrl = `${baseUrl}/pt/metodo-ylada`

export const metadata: Metadata = {
  title: 'Método YLADA — A forma leve e inteligente de atrair clientes interessados',
  description: 'Pare de tentar convencer curiosos. O Método YLADA ensina como gerar valor, construir autoridade e filtrar curiosos automaticamente. Uma nova forma de fazer marketing profissional.',
  openGraph: {
    title: 'Método YLADA — A forma leve e inteligente de atrair clientes interessados',
    description: 'Pare de tentar convencer curiosos. Comece a atrair interessados. O Método YLADA é uma nova forma de fazer marketing profissional.',
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
