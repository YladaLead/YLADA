import { Suspense } from 'react'
import type { Metadata } from 'next'
import SellerVerPraticaPosQuizContent from './SellerVerPraticaPosQuizContent'

export const metadata: Metadata = {
  title: 'Ver na prática | Quiz Vendedores · YLADA',
  description:
    'Simulação imparcial: canal e fluxo como o cliente veria. Para vendedores em geral. Segmentos com área própria seguem pelo menu correspondente.',
}

export default function SellerVerPraticaPosQuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <SellerVerPraticaPosQuizContent />
    </Suspense>
  )
}
