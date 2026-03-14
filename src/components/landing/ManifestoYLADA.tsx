'use client'

import React from 'react'
import { MANIFESTO_YLADA } from '@/content/manifesto-ylada'

interface ManifestoYLADAProps {
  /** Mostrar diagrama Perguntas → Diagnóstico → … → Cliente */
  showDiagram?: boolean
  /** Título da seção (omitir para não mostrar) */
  showTitle?: boolean
  /** Classes do container da seção */
  className?: string
  /** Variante visual: 'card' (fundo cinza, bordas) ou 'plain' (sem fundo) */
  variant?: 'card' | 'plain'
}

export default function ManifestoYLADA({
  showDiagram = true,
  showTitle = true,
  className = '',
  variant = 'card',
}: ManifestoYLADAProps) {
  const { titulo, paragrafos, pilares } = MANIFESTO_YLADA
  const isHighlight = (i: number) => i === 2 || i === 7 // "Boas conversas começam com boas perguntas."
  const isClosing = (i: number) => i === paragrafos.length - 1 // "YLADA."

  return (
    <section className={className}>
      <div className={variant === 'card' ? 'py-16 sm:py-24 bg-gray-50 border-y border-gray-200' : ''}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {showTitle && (
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">
                {titulo}
              </h2>
            )}
            <div className="space-y-6 text-gray-700 leading-relaxed">
              {paragrafos.map((texto, i) => (
                <p
                  key={i}
                  className={
                    isHighlight(i)
                      ? 'text-xl font-bold text-gray-900 text-center py-2'
                      : isClosing(i)
                        ? 'text-center text-gray-500 text-lg font-medium pt-4'
                        : ''
                  }
                >
                  {texto}
                </p>
              ))}
            </div>
            {showDiagram && (
              <div className="flex flex-col items-center gap-2 mt-12 py-6 px-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                {pilares.map((pilar, i) => (
                  <span
                    key={i}
                    className={`text-sm font-semibold ${i === pilares.length - 1 ? 'text-gray-900 font-bold' : 'text-gray-800'}`}
                  >
                    {pilar}
                  </span>
                )).reduce<React.ReactNode[]>((acc, el, i) => {
                  if (i > 0) acc.push(<span key={`arrow-${i}`} className="text-gray-400">↓</span>)
                  acc.push(el)
                  return acc
                }, [])}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
