import { Suspense } from 'react'
import type { Metadata } from 'next'
import NutraQuizPublicContent from './quiz/NutraQuizPublicContent'

export const metadata: Metadata = {
  title: 'Nutra · suplementos | YLADA',
  description:
    'Muita conversa e pouca venda? Em poucos passos: mais clareza antes do WhatsApp e indicação com segurança, com o Noel.',
}

function NutraEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

/** Entrada pública matriz — paridade com Estética/Nutri/Odonto. */
export default function NutraPublicEntryPage() {
  return (
    <Suspense fallback={<NutraEntradaFallback />}>
      <NutraQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
