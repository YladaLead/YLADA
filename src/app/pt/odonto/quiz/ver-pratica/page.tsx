import { Suspense } from 'react'
import type { Metadata } from 'next'
import OdontoVerPraticaPosQuizContent from './OdontoVerPraticaPosQuizContent'

export const metadata: Metadata = {
  title: 'Ver na prática | Odonto · YLADA',
  description: 'Simulação rápida: em seguida você vê o fluxo como seu paciente veria.',
}

export default function OdontoVerPraticaPosQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <OdontoVerPraticaPosQuizContent />
    </Suspense>
  )
}
