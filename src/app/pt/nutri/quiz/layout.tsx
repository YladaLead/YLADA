import type { Metadata } from 'next'
import type { ReactNode } from 'react'

/** Rotas filhas (legacy, ver-prática, vídeo) exportam metadata específica quando precisar. */
export const metadata: Metadata = {
  title: {
    default: 'YLADA Nutri',
    template: '%s · YLADA Nutri',
  },
}

export default function QuizNutriLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
