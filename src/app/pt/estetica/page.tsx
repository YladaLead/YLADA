import { Suspense } from 'react'
import type { Metadata } from 'next'
import EsteticaQuizPublicContent from './quiz/EsteticaQuizPublicContent'

export const metadata: Metadata = {
  title: 'Estética | YLADA',
  description:
    'Escolha sua área, responda em poucos passos e veja na prática como sua cliente chega mais pronta para fechar — antes do cadastro.',
}

function EsteticaEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

export default function EsteticaPublicEntryPage() {
  return (
    <Suspense fallback={<EsteticaEntradaFallback />}>
      <EsteticaQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
