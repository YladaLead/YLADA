import { Suspense } from 'react'
import type { Metadata } from 'next'
import FitnessDemoClienteContent from './FitnessDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · quem busca treino | Fitness YLADA',
  description:
    'Demonstração: perguntas reflexivas antes do contato (emagrecimento, força, condicionamento e outros). Não substitui avaliação médica.',
}

export default function FitnessExemploClientePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <FitnessDemoClienteContent />
    </Suspense>
  )
}
