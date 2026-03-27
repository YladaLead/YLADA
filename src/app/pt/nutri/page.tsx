import { Suspense } from 'react'
import type { Metadata } from 'next'
import NutriQuizPublicContent from './quiz/NutriQuizPublicContent'

export const metadata: Metadata = {
  title: 'Nutri | YLADA',
  description:
    'Menos explicação no WhatsApp, pacientes mais preparados: em poucos passos e fluxo como seu paciente veria, com o Noel.',
}

function NutriEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

/** Entrada pública matriz — paridade com Estética (Suspense + fluxo). */
export default function NutriPublicEntryPage() {
  return (
    <Suspense fallback={<NutriEntradaFallback />}>
      <NutriQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
