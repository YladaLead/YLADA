import { Suspense } from 'react'
import type { Metadata } from 'next'
import PsicanaliseDemoClienteContent from './PsicanaliseDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · quem busca análise | Psicanálise YLADA',
  description:
    'Demonstração: perguntas reflexivas antes do contato (início de análise, inquietação, vínculos e outros). Não substitui sessão.',
}

export default function PsicanaliseExemploClientePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <PsicanaliseDemoClienteContent />
    </Suspense>
  )
}
