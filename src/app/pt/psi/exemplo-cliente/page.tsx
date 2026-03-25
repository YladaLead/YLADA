import { Suspense } from 'react'
import type { Metadata } from 'next'
import PsiDemoClienteContent from './PsiDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · quem busca psicologia | YLADA',
  description:
    'Demonstração: perguntas reflexivas como alguém veria no seu link (ansiedade, humor, relacionamentos e outros). Não é avaliação clínica.',
}

export default function PsiExemploClientePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <PsiDemoClienteContent />
    </Suspense>
  )
}
