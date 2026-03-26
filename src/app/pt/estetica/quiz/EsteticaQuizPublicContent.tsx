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
  ESTETICA_QUIZ_RESULT_COPY,
} from '@/config/estetica-quiz-public'

const STORAGE_KEY = 'ylada_estetica_quiz_respostas_v1'

export default function EsteticaQuizPublicContent() {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const { user, loading } = useAuth()
  const [authTimeout, setAuthTimeout] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

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

  const progress = useMemo(() => {
    if (isResult) return 100
    return ((step + 1) / totalPhases) * 100
  }, [step, isResult, totalPhases])

  const pickOption = useCallback(
    (value: string) => {
      if (!current) return
      const qId = current.id
      setAnswers((prev) => {
        const next = { ...prev, [qId]: value }
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          /* ignore */
        }
        return next
      })
      trackEvent('estetica_quiz_step', { area: 'estetica', step: qId, value })
      setStep((s) => s + 1)
    },
    [current]
  )

  const goBack = useCallback(() => {
    if (step <= 0) return
    const qId = ESTETICA_QUIZ_QUESTIONS[step - 1].id
    setAnswers((prev) => {
      const next = { ...prev }
      delete next[qId]
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
    setStep((s) => s - 1)
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
            <p className="text-sm text-gray-500 leading-relaxed">
              Pergunta {step + 1} de {ESTETICA_QUIZ_QUESTIONS.length}
            </p>
            <h1 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900 leading-snug tracking-tight">
              {current.title}
            </h1>
            <div className="flex flex-col gap-3 pt-6">
              {current.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => pickOption(opt.value)}
                  className="w-full min-h-[48px] rounded-2xl border-2 border-gray-300 bg-slate-50/90 px-5 py-3.5 text-base font-semibold text-gray-900 shadow-sm shadow-gray-900/5 hover:border-gray-500 hover:bg-white hover:shadow-md active:scale-[0.99] transition-all text-left"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {step > 0 && (
              <div className="pt-8">
                <button
                  type="button"
                  onClick={goBack}
                  className="w-full min-h-[48px] rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-800 py-2 touch-manipulation"
                >
                  ← Pergunta anterior
                </button>
              </div>
            )}
          </div>
        )}

        {isResult && (
          <div className="animate-fade-in-up pb-8 pt-2" role="region" aria-live="polite">
            <div className="space-y-10 sm:space-y-12">
              <div className="space-y-6 sm:space-y-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                  {ESTETICA_QUIZ_RESULT_COPY.headline}
                </h1>
                <div className="space-y-4 sm:space-y-5 text-lg sm:text-xl text-gray-800 font-medium leading-snug">
                  {ESTETICA_QUIZ_RESULT_COPY.subLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
              <div className="pt-4 sm:pt-6 flex flex-col items-stretch gap-3">
                <Link
                  href={ESTETICA_QUIZ_CADASTRO_HREF}
                  className="w-full min-h-[58px] sm:min-h-[60px] rounded-2xl bg-blue-600 px-6 py-4 text-center text-lg sm:text-xl font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/35 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2.5"
                >
                  <span aria-hidden>👉</span>
                  {ESTETICA_QUIZ_RESULT_COPY.ctaPrimary}
                </Link>
                <p className="text-center text-sm text-gray-500 leading-relaxed px-1">
                  {ESTETICA_QUIZ_RESULT_COPY.ctaMicro}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
