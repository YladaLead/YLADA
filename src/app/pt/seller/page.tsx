import { Suspense } from 'react'
import type { Metadata } from 'next'
import SellerQuizPublicContent from './quiz/SellerQuizPublicContent'

export const metadata: Metadata = {
  title: 'Vendedores | YLADA',
  description:
    'Para quem vende de qualquer forma: quiz e exemplo de fluxo antes do WhatsApp. Imparcial entre ramos. Jornada Wellness: menu Wellness no app.',
}

function SellerEntradaFallback() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-white">
      <p className="text-gray-500 text-sm">Carregando…</p>
    </div>
  )
}

/** Entrada matriz — funil genérico de vendedor; sem acoplamento a marca/rede. Landing longa: /pt/seller/apresentacao */
export default function SellerPublicEntryPage() {
  return (
    <Suspense fallback={<SellerEntradaFallback />}>
      <SellerQuizPublicContent entradaComNicho />
    </Suspense>
  )
}
