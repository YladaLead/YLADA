import { Suspense } from 'react'
import type { Metadata } from 'next'
import VerPraticaPosQuizContent from './VerPraticaPosQuizContent'

export const metadata: Metadata = {
  title: 'Ver na prática | Estética · YLADA',
  description: 'Simulação rápida: em seguida você vê o fluxo como sua cliente veria.',
}

export default function VerPraticaPosQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <VerPraticaPosQuizContent />
    </Suspense>
  )
}
