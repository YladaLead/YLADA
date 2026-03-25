import { Suspense } from 'react'
import type { Metadata } from 'next'
import EsteticaDemoClienteContent from './EsteticaDemoClienteContent'

export const metadata: Metadata = {
  title: 'Exemplo · visão da cliente | Estética YLADA',
  description:
    'Demonstração: perguntas e resultado como sua cliente veria no link, por nicho (pele, cabelo, unhas e outros).',
}

export default function EsteticaExemploClientePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] flex items-center justify-center bg-white">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      }
    >
      <EsteticaDemoClienteContent />
    </Suspense>
  )
}
