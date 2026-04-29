import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Captar',
  description: 'Atrair e qualificar interesse — Pro Estética Corporal.',
}

export default function ProEsteticaCorporalCaptarLayout({ children }: { children: ReactNode }) {
  return children
}
