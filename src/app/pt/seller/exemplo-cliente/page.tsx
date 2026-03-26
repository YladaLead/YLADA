import { Suspense } from 'react'
import type { Metadata } from 'next'
import SellerDemoClienteContent from './SellerDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · visão do cliente | Vendedores YLADA',
  description:
    'Demonstração imparcial: perguntas como as que o cliente veria antes do WhatsApp. Vendedores em geral. Segmentos com jornada própria usam a área dedicada no app (ex.: Wellness).',
}

export default function SellerExemploClientePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <SellerDemoClienteContent />
    </Suspense>
  )
}
