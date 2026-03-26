import { Suspense } from 'react'
import type { Metadata } from 'next'
import PsiQuizPublicContent from './quiz/PsiQuizPublicContent'

export const metadata: Metadata = {
  title: 'Psicologia | YLADA',
  description:
    'Conversas que não evoluem? Em poucos passos: mais clareza antes do WhatsApp e quem chega com mais contexto, com o Noel.',
}

function PsiEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

/** Entrada pública matriz — paridade com Estética/Nutri/Odonto. */
export default function PsiPublicEntryPage() {
  return (
    <Suspense fallback={<PsiEntradaFallback />}>
      <PsiQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
