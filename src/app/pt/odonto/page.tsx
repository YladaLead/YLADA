import { Suspense } from 'react'
import type { Metadata } from 'next'
import OdontoQuizPublicContent from './quiz/OdontoQuizPublicContent'

export const metadata: Metadata = {
  title: 'Odontologia | YLADA',
  description:
    'Menos ida e volta no WhatsApp, pacientes mais preparados: quiz rápido e fluxo como seu paciente veria, com o Noel.',
}

function OdontoEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

/** Entrada pública matriz — paridade com Estética/Nutri. */
export default function OdontoPublicEntryPage() {
  return (
    <Suspense fallback={<OdontoEntradaFallback />}>
      <OdontoQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
