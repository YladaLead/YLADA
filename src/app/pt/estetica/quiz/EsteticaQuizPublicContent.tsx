'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import { useAuth } from '@/contexts/AuthContext'
import { trackEvent } from '@/lib/analytics-events'
import {
  ESTETICA_QUIZ_CADASTRO_HREF,
  ESTETICA_QUIZ_LOGIN_HREF,
  ESTETICA_QUIZ_QUESTIONS,
  buildEsteticaQuizDiagnosis,
} from '@/config/estetica-quiz-public'

const STORAGE_KEY = 'ylada_estetica_quiz_respostas_v1'

export default function EsteticaQuizPublicContent() {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const { user, loading } = useAuth()
  const [authTimeout, setAuthTimeout] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isQuizPath = pathname === '/pt/estetica/quiz' || pathname.startsWith('/pt/estetica/quiz?')
  const totalPhases = ESTETICA_QUIZ_QUESTIONS.length + 1
  const isResult = step >= ESTETICA_QUIZ_QUESTIONS.length
  const current = ESTETICA_QUIZ_QUESTIONS[step]

  useEffect(() => {
    const id = setTimeout(() => setAuthTimeout(true), 800)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (loading || !isQuizPath) return
    if (user) {
      router.replace('/pt/estetica/home')
    }
  }, [loading, user, router, isQuizPath])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    if (isResult || !current) {
      setSelected(null)
      return
    }
    setSelected(answers[current.id] ?? null)
    setError(null)
  }, [step, current, answers, isResult])

  const progress = useMemo(() => {
    if (isResult) return 100
    return ((step + 1) / totalPhases) * 100
  }, [step, isResult, totalPhases])

  const diagnosis = useMemo(() => {
    if (!isResult) return null
    return buildEsteticaQuizDiagnosis(answers)
  }, [isResult, answers])

  const goNext = useCallback(() => {
    if (!current || !selected) {
      setError('Escolha uma opção para continuar.')
      return
    }
    const next = { ...answers, [current.id]: selected }
    setAnswers(next)
    trackEvent('estetica_quiz_step', { area: 'estetica', step: current.id, value: selected })
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
    setStep((s) => s + 1)
    setError(null)
  }, [current, selected, answers])

  const goBack = useCallback(() => {
    if (step <= 0) return
    setStep((s) => s - 1)
    setError(null)
  }, [step])

  useEffect(() => {
    if (isResult) {
      trackEvent('estetica_quiz_concluiu', { area: 'estetica' })
    }
  }, [isResult])

  const showAuthLoading = loading && isQuizPath && !authTimeout
  if (showAuthLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-white">
        <p className="text-gray-500 text-sm">Carregando…</p>
      </div>
    )
  }

  if (user && isQuizPath) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-white">
        <p className="text-gray-500 text-sm">Redirecionando…</p>
      </div>
    )
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-white text-gray-900 estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]">
      <header className="sticky top-0 z-20 shrink-0 border-b border-gray-100/80 bg-white/95 backdrop-blur-sm pt-[env(safe-area-inset-top,0px)]">
        <div className="h-0.5 w-full bg-gray-100 overflow-hidden" aria-hidden>
          <div
            className="h-full bg-blue-600 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/pt/estetica"
            className="inline-flex touch-manipulation min-h-[48px] min-w-[48px] items-center justify-center -ml-1"
            aria-label="YLADA Estética"
          >
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/pt/estetica"
              className="text-gray-500 hover:text-gray-900 font-medium min-h-[48px] inline-flex items-center px-2"
            >
              Voltar
            </Link>
            <Link
              href={ESTETICA_QUIZ_LOGIN_HREF}
              className="text-gray-500 hover:text-gray-900 font-medium min-h-[48px] inline-flex items-center px-2 -mr-2"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-4 sm:px-6 py-6 max-w-lg mx-auto w-full estetica-safe-main-bottom">
        {!isResult && current && (
          <div
            key={current.id}
            className="animate-fade-in-up flex flex-col pb-2"
            role="region"
            aria-live="polite"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Quiz · Estética</p>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Pergunta {step + 1} de {ESTETICA_QUIZ_QUESTIONS.length}
            </p>
            <h1 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900 leading-snug tracking-tight">
              {current.title}
            </h1>
            {selected && (
              <p className="mt-4 text-sm text-blue-800/90 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 leading-relaxed">
                {current.microHint}
              </p>
            )}
            <div className="flex flex-col gap-3 pt-6">
              {current.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSelected(opt.value)
                    setError(null)
                  }}
                  className={`w-full min-h-[48px] rounded-2xl border-2 px-5 py-3.5 text-base font-semibold shadow-sm shadow-gray-900/5 hover:shadow-md active:scale-[0.99] transition-all text-left ${
                    selected === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-950'
                      : 'border-gray-300 bg-slate-50/90 text-gray-900 hover:border-gray-500 hover:bg-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="flex flex-col gap-3 pt-8">
              <button
                type="button"
                onClick={goNext}
                className="w-full min-h-[52px] rounded-2xl bg-blue-600 px-5 py-3.5 text-base font-semibold text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-600/20 transition-colors"
              >
                Continuar
              </button>
              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="w-full min-h-[48px] rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-800 py-2 touch-manipulation"
                >
                  ← Pergunta anterior
                </button>
              )}
            </div>
          </div>
        )}

        {isResult && diagnosis && (
          <div className="animate-fade-in-up space-y-6 pb-4" role="region" aria-live="polite">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Resultado</p>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug">{diagnosis.headline}</h1>
            <ul className="space-y-3 text-base text-gray-800 leading-relaxed">
              {diagnosis.bullets.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="text-blue-600 font-bold shrink-0" aria-hidden>
                    ·
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="text-base text-gray-700 leading-relaxed border-t border-gray-100 pt-6">{diagnosis.bridge}</p>
            <div className="flex flex-col gap-3 pt-4">
              <Link
                href={ESTETICA_QUIZ_CADASTRO_HREF}
                className="w-full min-h-[52px] rounded-2xl bg-blue-600 px-5 py-3.5 text-center text-base font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 transition-colors inline-flex items-center justify-center"
              >
                Começar grátis agora
              </Link>
              <p className="text-center text-sm text-gray-500">Leva menos de 1 minuto</p>
              <Link
                href={ESTETICA_QUIZ_LOGIN_HREF}
                className="w-full min-h-[48px] rounded-2xl border-2 border-gray-200 text-center text-base font-semibold text-gray-800 hover:bg-gray-50 inline-flex items-center justify-center"
              >
                Já tenho conta — entrar
              </Link>
              <button
                type="button"
                onClick={() => {
                  setStep(0)
                  setAnswers({})
                  setSelected(null)
                  setError(null)
                  try {
                    sessionStorage.removeItem(STORAGE_KEY)
                  } catch {
                    /* ignore */
                  }
                }}
                className="w-full min-h-[44px] text-sm font-medium text-gray-500 hover:text-gray-800 py-2"
              >
                Refazer o quiz
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
