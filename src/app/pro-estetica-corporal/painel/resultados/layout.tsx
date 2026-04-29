import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Resultados',
  description: 'Resumo de desempenho e métricas — Pro Estética Corporal.',
}

export default function ProEsteticaCorporalResultadosLayout({ children }: { children: ReactNode }) {
  return children
}
