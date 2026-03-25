import { Suspense } from 'react'
import type { Metadata } from 'next'
import OdontoDemoClienteContent from './OdontoDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · visão do paciente | Odonto YLADA',
  description:
    'Demonstração: perguntas e resultado como seu paciente veria no link, por foco (clareamento, implantes, urgência e outros).',
}

export default function OdontoExemploClientePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <OdontoDemoClienteContent />
    </Suspense>
  )
}
