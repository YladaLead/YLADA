import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Links | Terapia capilar',
  description:
    'Biblioteca de modelos capilares e gestão dos seus links públicos YLADA neste painel.',
}

export default function ProEsteticaCapilarBibliotecaLinksLayout({ children }: { children: ReactNode }) {
  return children
}
