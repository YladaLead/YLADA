import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Retenção',
  description: 'Jornada e execuções de retenção de clientes — Pro Estética Corporal.',
}

export default function ProEsteticaCorporalRetencaoLayout({ children }: { children: ReactNode }) {
  return children
}
