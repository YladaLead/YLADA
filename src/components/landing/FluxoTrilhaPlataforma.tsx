'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const STEPS = [
  {
    id: 'entra',
    label: 'Entra na plataforma',
    short: 'Entra',
    icon: '🚀',
  },
  {
    id: 'board',
    label: 'Monta seu board',
    short: 'Board',
    icon: '📋',
  },
  {
    id: 'noel',
    label: 'Noel manda o link',
    short: 'Link',
    icon: '🔗',
  },
] as const

function MockupDashboard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden text-left">
      <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-gray-500 flex-1 text-center">ylada.com/pt</span>
      </div>
      <div className="flex">
        <div className="w-16 bg-slate-50 border-r border-gray-100 py-2 flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">Y</div>
          <div className="w-8 h-6 rounded bg-indigo-200" />
          <div className="w-8 h-6 rounded bg-gray-200" />
          <div className="w-8 h-6 rounded bg-gray-200" />
        </div>
        <div className="flex-1 p-3">
          <div className="h-2 w-3/4 bg-gray-200 rounded mb-3" />
          <div className="space-y-2">
            <div className="h-8 bg-gray-100 rounded" />
            <div className="h-8 bg-gray-100 rounded w-5/6" />
            <div className="h-8 bg-gray-100 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  )
}

function MockupBoard() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden text-left">
      <div className="bg-indigo-600 px-3 py-2">
        <p className="text-white text-sm font-semibold">Seu perfil · Board</p>
      </div>
      <div className="p-3 space-y-2">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Objetivo principal</p>
          <div className="h-6 bg-indigo-50 rounded border border-indigo-100 text-xs text-gray-700 flex items-center px-2">
            Aumentar captação de clientes
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Desafios / metas</p>
          <div className="h-6 bg-gray-50 rounded border border-gray-100 text-xs text-gray-600 flex items-center px-2">
            Quero um diagnóstico para quem quer emagrecer
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Salvo</span>
        </div>
      </div>
    </div>
  )
}

function MockupChatNoel() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden text-left">
      <div className="bg-[#075E54] px-3 py-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">N</div>
        <div>
          <p className="text-white font-semibold text-sm">Noel</p>
          <p className="text-white/80 text-xs">mentor · online</p>
        </div>
      </div>
      <div className="bg-[#E5DDD5] p-3 min-h-[180px] space-y-2">
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-lg px-3 py-2 bg-[#DCF8C6] shadow-sm">
            <p className="text-xs text-gray-800">
              Preciso de um diagnóstico para clientes que querem emagrecer. Pode me mandar um link?
            </p>
            <p className="text-[10px] text-gray-500 text-right mt-0.5">10:32</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[90%] rounded-lg px-3 py-2 bg-white shadow-sm">
            <p className="text-xs text-gray-800">
              Pronto. Preparei um diagnóstico com 4 perguntas para identificar quem está buscando emagrecer. Use o link abaixo para compartilhar.
            </p>
            <a
              href="#"
              className="inline-block mt-1.5 text-xs font-medium text-indigo-600 underline"
            >
              Acesse seu quiz →
            </a>
            <p className="text-[10px] text-gray-500 text-right mt-0.5">10:33</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FluxoTrilhaPlataforma() {
  const [stepIndex, setStepIndex] = useState(0)
  const total = STEPS.length

  const goNext = useCallback(() => {
    setStepIndex((i) => (i + 1) % total)
  }, [total])

  useEffect(() => {
    const t = setInterval(goNext, 4000)
    return () => clearInterval(t)
  }, [goNext])

  return (
    <section
      id="trilha-na-plataforma"
      className="relative overflow-hidden bg-white py-16 sm:py-20 border-t border-gray-100"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Sua trilha na plataforma
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Entra, monta seu board, fala com o Noel e recebe o link na hora.
          </p>
        </div>

        {/* Timeline: 3 steps */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setStepIndex(i)}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 border-2 transition-all ${
                i === stepIndex
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{step.icon}</span>
              <span className="font-medium text-sm sm:text-base">{step.label}</span>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === stepIndex ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {i + 1}
              </span>
            </button>
          ))}
        </div>

        {/* Preview mockup - animado com transição */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative aspect-[4/3] min-h-[240px]">
            {stepIndex === 0 && (
              <div key="dashboard" className="absolute inset-0 animate-fade-in">
                <MockupDashboard />
              </div>
            )}
            {stepIndex === 1 && (
              <div key="board" className="absolute inset-0 animate-fade-in">
                <MockupBoard />
              </div>
            )}
            {stepIndex === 2 && (
              <div key="noel" className="absolute inset-0 animate-fade-in">
                <MockupChatNoel />
              </div>
            )}
          </div>
        </div>

        {/* Contador e setas */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setStepIndex((i) => (i === 0 ? total - 1 : i - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            aria-label="Passo anterior"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-500">
            {stepIndex + 1} / {total}
          </span>
          <button
            type="button"
            onClick={goNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            aria-label="Próximo passo"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            href="/pt/diagnostico"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Começar minha trilha
          </Link>
        </div>
      </div>
    </section>
  )
}
