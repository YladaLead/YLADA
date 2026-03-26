'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import { useAuth } from '@/contexts/AuthContext'
import { trackEvent } from '@/lib/analytics-events'
import { ESTETICA_DEMO_CLIENTE_NICHOS } from '@/lib/estetica-demo-cliente-data'
import {
  ESTETICA_APRESENTACAO_HREF,
  ESTETICA_QUIZ_LOGIN_HREF,
  ESTETICA_QUIZ_QUESTIONS,
  ESTETICA_QUIZ_RESULT_COPY,
  ESTETICA_QUIZ_VER_PRATICA_HREF,
  getEsteticaQuizQuestionsForNicho,
} from '@/config/estetica-quiz-public'

const STORAGE_KEY = 'ylada_estetica_quiz_respostas_v1'

function isValidProfNicho(v: string | null): v is string {
  return !!v && ESTETICA_DEMO_CLIENTE_NICHOS.some((n) => n.value === v)
}

export interface EsteticaQuizPublicContentProps {
  /** true = /pt/estetica: escolhe nicho → quiz personalizado → resultado */
  entradaComNicho?: boolean
}

export default function EsteticaQuizPublicContent({ entradaComNicho = false }: EsteticaQuizPublicContentProps) {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [authTimeout, setAuthTimeout] = useState(false)
  const [profNicho, setProfNicho] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [urlNichoSynced, setUrlNichoSynced] = useState(false)

  const isEntradaRoot = pathname === '/pt/estetica' || pathname.startsWith('/pt/estetica?')
  const isLegacyQuizPath = pathname === '/pt/estetica/quiz' || pathname.startsWith('/pt/estetica/quiz?')
  const isPublicFlowPath = entradaComNicho ? isEntradaRoot : isLegacyQuizPath

  useEffect(() => {
    if (!entradaComNicho || urlNichoSynced) return
    const q = searchParams.get('nicho')
    if (isValidProfNicho(q)) {
      setProfNicho(q)
      setStep(0)
      setAnswers({})
    }
    setUrlNichoSynced(true)
  }, [entradaComNicho, searchParams, urlNichoSynced])

  const quizQuestions = useMemo(() => {
    if (entradaComNicho && profNicho) {
      return getEsteticaQuizQuestionsForNicho(profNicho)
    }
    return ESTETICA_QUIZ_QUESTIONS
  }, [entradaComNicho, profNicho])

  const totalPhases = quizQuestions.length + 1
  const isResult = step >= quizQuestions.length
  const current = quizQuestions[step]

  const verPraticaHref = useMemo(() => {
    if (entradaComNicho && profNicho) {
      return `${ESTETICA_QUIZ_VER_PRATICA_HREF}?nicho=${encodeURIComponent(profNicho)}`
    }
    return ESTETICA_QUIZ_VER_PRATICA_HREF
  }, [entradaComNicho, profNicho])

  useEffect(() => {
    const id = setTimeout(() => setAuthTimeout(true), 800)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (loading || !isPublicFlowPath) return
    if (user) {
      router.replace('/pt/estetica/home')
    }
  }, [loading, user, router, isPublicFlowPath])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const progress = useMemo(() => {
    if (entradaComNicho && !profNicho) return 8
    if (isResult) return 100
    return ((step + 1) / totalPhases) * 100
  }, [entradaComNicho, profNicho, step, isResult, totalPhases])

  const pickProfNicho = useCallback((value: string) => {
    if (!isValidProfNicho(value)) return
    setProfNicho(value)
    setStep(0)
    setAnswers({})
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    trackEvent('estetica_entrada_nicho', { area: 'estetica', opcao: value })
    router.replace(`/pt/estetica?nicho=${encodeURIComponent(value)}`, { scroll: false })
  }, [router])

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
      trackEvent('estetica_quiz_step', { area: 'estetica', step: qId, value, nicho: profNicho })
      setStep((s) => s + 1)
    },
    [current, profNicho]
  )

  const goBack = useCallback(() => {
    if (step <= 0) {
      if (entradaComNicho && profNicho) {
        setProfNicho(null)
        setAnswers({})
        try {
          sessionStorage.removeItem(STORAGE_KEY)
        } catch {
          /* ignore */
        }
        router.replace('/pt/estetica', { scroll: false })
      }
      return
    }
    const qId = quizQuestions[step - 1].id
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
  }, [step, entradaComNicho, profNicho, quizQuestions, router])

  useEffect(() => {
    if (isResult) {
      trackEvent('estetica_quiz_concluiu', { area: 'estetica', nicho: profNicho })
    }
  }, [isResult, profNicho])

  const showAuthLoading = loading && isPublicFlowPath && !authTimeout
  if (showAuthLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-white">
        <p className="text-gray-500 text-sm">Carregando…</p>
      </div>
    )
  }

  if (user && isPublicFlowPath) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-white">
        <p className="text-gray-500 text-sm">Redirecionando…</p>
      </div>
    )
  }

  const showNichoPicker = entradaComNicho && !profNicho

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
            href="/pt"
            className="inline-flex touch-manipulation min-h-[48px] min-w-[48px] items-center justify-center -ml-1"
            aria-label="YLADA"
          >
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <div className="flex items-center gap-2 text-sm">
            {entradaComNicho ? (
              <Link
                href={ESTETICA_APRESENTACAO_HREF}
                className="text-gray-500 hover:text-gray-900 font-medium min-h-[48px] inline-flex items-center px-2"
              >
                Apresentação
              </Link>
            ) : (
              <Link
                href="/pt/estetica"
                className="text-gray-500 hover:text-gray-900 font-medium min-h-[48px] inline-flex items-center px-2"
              >
                Voltar
              </Link>
            )}
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
        {showNichoPicker && (
          <div className="animate-fade-in-up flex flex-col pb-2 space-y-6" role="region" aria-live="polite">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug tracking-tight">
              Qual é o seu foco em estética?
            </h1>
            <div className="flex flex-col gap-3">
              {ESTETICA_DEMO_CLIENTE_NICHOS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => pickProfNicho(opt.value)}
                  className="w-full min-h-[48px] rounded-2xl border-2 border-gray-300 bg-slate-50/90 px-5 py-3.5 text-base font-semibold text-gray-900 shadow-sm shadow-gray-900/5 hover:border-gray-500 hover:bg-white hover:shadow-md active:scale-[0.99] transition-all text-left"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {entradaComNicho && profNicho && !isResult && current && (
          <div
            key={current.id}
            className="animate-fade-in-up flex flex-col pb-2"
            role="region"
            aria-live="polite"
          >
            <p className="text-sm text-gray-500 leading-relaxed">
              Pergunta {step + 1} de {quizQuestions.length}
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
            <div className="pt-8 flex flex-col gap-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="w-full min-h-[48px] rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-800 py-2 touch-manipulation"
                >
                  ← Pergunta anterior
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setProfNicho(null)
                  setStep(0)
                  setAnswers({})
                  try {
                    sessionStorage.removeItem(STORAGE_KEY)
                  } catch {
                    /* ignore */
                  }
                  router.replace('/pt/estetica', { scroll: false })
                }}
                className="w-full min-h-[44px] text-sm font-medium text-gray-400 hover:text-gray-700 py-2"
              >
                ← Trocar área de atuação
              </button>
            </div>
          </div>
        )}

        {!entradaComNicho && !isResult && current && (
          <div
            key={current.id}
            className="animate-fade-in-up flex flex-col pb-2"
            role="region"
            aria-live="polite"
          >
            <p className="text-sm text-gray-500 leading-relaxed">
              Pergunta {step + 1} de {quizQuestions.length}
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
                  href={verPraticaHref}
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
