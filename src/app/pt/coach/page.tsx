import { Suspense } from 'react'
import type { Metadata } from 'next'
import CoachQuizPublicContent from './quiz/CoachQuizPublicContent'

export const metadata: Metadata = {
  title: 'Coach | YLADA',
  description:
    'Conversas que não viram sessão? Clientes mais preparados e WhatsApp com contexto antes da primeira conversa.',
}

function CoachEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

/** Entrada pública matriz — paridade com Estética/Nutri/Odonto. */
export default function CoachPublicEntryPage() {
  return (
    <Suspense fallback={<CoachEntradaFallback />}>
      <CoachQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
