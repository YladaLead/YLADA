'use client'

import { useState, useEffect } from 'react'

/**
 * Cena 5: Sistema analisando respostas (as 3 linhas visíveis; destaque animado).
 * fixedStep: quando definido (0, 1 ou 2), trava nesse passo para exportar PNG por etapa.
 */

const STEPS = [
  'Analisando respostas...',
  'Detectando padrões...',
  'Gerando diagnóstico...',
]

type Props = { fixedStep?: number }

export default function AIAnalysisScene({ fixedStep }: Props) {
  const [current, setCurrent] = useState(fixedStep ?? 0)

  useEffect(() => {
    if (fixedStep !== undefined && fixedStep !== null) return
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % STEPS.length)
    }, 1800)
    return () => clearInterval(t)
  }, [fixedStep])

  useEffect(() => {
    if (fixedStep !== undefined && fixedStep !== null) setCurrent(fixedStep)
  }, [fixedStep])

  const active = fixedStep ?? current

  return (
    <div className="mx-auto w-full max-w-[720px] min-h-[80vh] flex flex-col justify-center p-8">
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-12">
        <div className="flex flex-col items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex flex-col gap-3">
            {STEPS.map((text, i) => (
              <p
                key={text}
                className={`text-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
                  i === active ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                <span className="w-2 h-2 flex-shrink-0 flex justify-center">
                  {i === active && (
                    <span className={`w-2 h-2 rounded-full bg-gray-900 ${fixedStep == null ? 'animate-pulse' : ''}`} />
                  )}
                </span>
                {text}
              </p>
            ))}
          </div>
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  i === active ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
