import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Equipe',
  description: 'Convites e acesso da equipa — Pro Estética Corporal.',
}

export default function ProEsteticaCorporalEquipeLayout({ children }: { children: ReactNode }) {
  return children
}
