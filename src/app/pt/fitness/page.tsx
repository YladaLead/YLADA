import { Suspense } from 'react'
import type { Metadata } from 'next'
import FitnessQuizPublicContent from './quiz/FitnessQuizPublicContent'

export const metadata: Metadata = {
  title: 'Fitness | YLADA',
  description:
    'Menos “só uma dúvida”. Alunos mais preparados e WhatsApp com contexto antes da primeira aula ou plano.',
}

function FitnessEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

/** Entrada pública matriz — paridade com Estética/Nutri/Odonto. */
export default function FitnessPublicEntryPage() {
  return (
    <Suspense fallback={<FitnessEntradaFallback />}>
      <FitnessQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
