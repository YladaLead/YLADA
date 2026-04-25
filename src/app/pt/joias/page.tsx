import { Suspense } from 'react'
import type { Metadata } from 'next'
import JoiasQuizPublicContent from './quiz/JoiasQuizPublicContent'

export const metadata: Metadata = {
  title: 'Joias e bijuterias | YLADA',
  description:
    'Menos conversa só em preço. Clientes mais preparadas e WhatsApp com contexto antes do catálogo.',
}

function JoiasEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

/** Entrada pública matriz — paridade com Fitness/Perfumaria. */
export default function JoiasPublicEntryPage() {
  return (
    <Suspense fallback={<JoiasEntradaFallback />}>
      <JoiasQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
