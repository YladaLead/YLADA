import { Suspense } from 'react'
import type { Metadata } from 'next'
import PerfumariaVerPraticaPosQuizContent from './PerfumariaVerPraticaPosQuizContent'

export const metadata: Metadata = {
  title: 'Ver na prática | Quiz Perfumaria · YLADA',
  description: 'Simulação rápida: em seguida você vê o fluxo como seu cliente veria.',
}

export default function PerfumariaVerPraticaPosQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <PerfumariaVerPraticaPosQuizContent />
    </Suspense>
  )
}
