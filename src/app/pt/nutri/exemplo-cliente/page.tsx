import { Suspense } from 'react'
import type { Metadata } from 'next'
import NutriDemoClienteContent from './NutriDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · visão do paciente | Nutri YLADA',
  description:
    'Demonstração: perguntas e resultado como seu paciente veria no link, por foco (emagrecimento, esporte, gestante e outros).',
}

export default function NutriExemploClientePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <NutriDemoClienteContent />
    </Suspense>
  )
}
