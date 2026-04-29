import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Catálogo de fluxos e materiais — Pro Estética Corporal.',
}

export default function ProEsteticaCorporalCatalogoLayout({ children }: { children: ReactNode }) {
  return children
}
