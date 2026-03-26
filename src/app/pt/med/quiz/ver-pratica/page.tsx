import { Suspense } from 'react'
import type { Metadata } from 'next'
import MedVerPraticaPosQuizContent from './MedVerPraticaPosQuizContent'

export const metadata: Metadata = {
  title: 'Ver na prática | Quiz Med · YLADA',
  description: 'Simulação rápida: em seguida você vê o fluxo como seu paciente veria.',
}

export default function MedVerPraticaPosQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <MedVerPraticaPosQuizContent />
    </Suspense>
  )
}
