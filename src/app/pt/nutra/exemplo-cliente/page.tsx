import { Suspense } from 'react'
import type { Metadata } from 'next'
import NutraDemoClienteContent from './NutraDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · visão do cliente | Nutra YLADA',
  description:
    'Demonstração: perguntas e resultado como seu cliente veria no link, por foco (emagrecimento, proteína, energia e outros).',
}

export default function NutraExemploClientePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <NutraDemoClienteContent />
    </Suspense>
  )
}
