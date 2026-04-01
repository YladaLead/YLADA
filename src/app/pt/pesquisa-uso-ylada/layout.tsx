import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pesquisa de uso — YLADA',
  description:
    'Respostas anônimas em menos de 1 minuto. Veja o que ajustar no seu uso do YLADA — sem login.',
}

export default function PesquisaUsoYladaLayout({ children }: { children: React.ReactNode }) {
  return children
}
