import { Suspense } from 'react'
import type { Metadata } from 'next'
import MedDemoClienteContent from './MedDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · visão do paciente | Medicina YLADA',
  description:
    'Demonstração: perguntas reflexivas antes do contato (rotina, sintomas leves, crônico e outros). Não é triagem de urgência.',
}

export default function MedExemploClientePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <MedDemoClienteContent />
    </Suspense>
  )
}
