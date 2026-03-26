import { Suspense } from 'react'
import type { Metadata } from 'next'
import PsicanaliseQuizPublicContent from './quiz/PsicanaliseQuizPublicContent'

export const metadata: Metadata = {
  title: 'Psicanálise | YLADA',
  description:
    'Menos explicação no primeiro contato. Em poucos passos: analisandos mais preparados e Zap com contexto, com o Noel.',
}

function PsicanaliseEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

/** Entrada pública matriz — paridade com Estética/Nutri/Odonto. */
export default function PsicanalisePublicEntryPage() {
  return (
    <Suspense fallback={<PsicanaliseEntradaFallback />}>
      <PsicanaliseQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
