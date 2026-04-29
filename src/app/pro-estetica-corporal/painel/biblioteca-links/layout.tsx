import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Links',
  description:
    'Biblioteca de modelos para corpo e hábitos e gestão dos teus links públicos YLADA neste painel.',
}

export default function ProEsteticaCorporalBibliotecaLinksLayout({ children }: { children: ReactNode }) {
  return children
}
