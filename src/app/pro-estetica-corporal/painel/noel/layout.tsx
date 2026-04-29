import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Noel',
  description:
    'Mentor estratégico para mensagens, Instagram e links YLADA — foco estética corporal.',
}

export default function ProEsteticaCorporalNoelLayout({ children }: { children: ReactNode }) {
  return children
}
