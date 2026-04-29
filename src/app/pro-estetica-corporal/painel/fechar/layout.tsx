import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Fechar',
  description: 'Conduzir decisão e primeira sessão — Pro Estética Corporal.',
}

export default function ProEsteticaCorporalFecharLayout({ children }: { children: ReactNode }) {
  return children
}
