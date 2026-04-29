import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Acompanhar',
  description: 'Acompanhamento entre sessões — Pro Estética Corporal.',
}

export default function ProEsteticaCorporalAcompanharLayout({ children }: { children: ReactNode }) {
  return children
}
