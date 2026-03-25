import { Suspense } from 'react'
import type { Metadata } from 'next'
import PerfumariaDemoClienteContent from './PerfumariaDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · visão do cliente | Perfumaria YLADA',
  description:
    'Demonstração: perguntas reflexivas antes do contato (primeira compra, presente, pele sensível e outros). Não substitui prova na pele.',
}

export default function PerfumariaExemploClientePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <PerfumariaDemoClienteContent />
    </Suspense>
  )
}
