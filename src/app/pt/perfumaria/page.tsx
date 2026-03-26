import { Suspense } from 'react'
import type { Metadata } from 'next'
import PerfumariaQuizPublicContent from './quiz/PerfumariaQuizPublicContent'

export const metadata: Metadata = {
  title: 'Perfumaria | YLADA',
  description:
    'Menos explicação no primeiro contato. Clientes mais preparados e WhatsApp com contexto sobre fragrância e ocasião.',
}

function PerfumariaEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

/** Entrada pública matriz — paridade com Estética/Nutri/Odonto. */
export default function PerfumariaPublicEntryPage() {
  return (
    <Suspense fallback={<PerfumariaEntradaFallback />}>
      <PerfumariaQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
