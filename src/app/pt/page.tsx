import type { Metadata } from 'next'
import PtHomeClient from './PtHomeClient'

export const metadata: Metadata = {
  title: 'Explique menos. Venda mais. | YLADA',
  description: 'Explique menos. Venda mais.',
  openGraph: {
    title: 'Explique menos. Venda mais. | YLADA',
    description: 'Explique menos. Venda mais.',
    url: 'https://www.ylada.com/pt',
  },
}

export default function PtHomePage() {
  return <PtHomeClient />
}
