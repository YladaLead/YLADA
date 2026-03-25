import { Suspense } from 'react'
import type { Metadata } from 'next'
import CoachDemoClienteContent from './CoachDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · quem busca coaching | Coach YLADA',
  description:
    'Demonstração: perguntas reflexivas antes do contato (carreira, hábitos, empreendedorismo e outros). Não substitui psicoterapia.',
}

export default function CoachExemploClientePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <CoachDemoClienteContent />
    </Suspense>
  )
}
