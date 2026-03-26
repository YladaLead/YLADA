import { Suspense } from 'react'
import type { Metadata } from 'next'
import MedQuizPublicContent from './quiz/MedQuizPublicContent'

export const metadata: Metadata = {
  title: 'Medicina | YLADA',
  description:
    'Explique menos na triagem do WhatsApp. Em poucos passos: paciente com mais contexto antes da consulta, com o Noel.',
}

function MedEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

/** Entrada pública matriz — paridade com Estética/Nutri/Odonto. */
export default function MedPublicEntryPage() {
  return (
    <Suspense fallback={<MedEntradaFallback />}>
      <MedQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
