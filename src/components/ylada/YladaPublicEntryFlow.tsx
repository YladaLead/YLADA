'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import { useAuth } from '@/contexts/AuthContext'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'
import { clearPublicFlowHandoff, readPublicFlowHandoff } from '@/lib/ylada-public-flow-handoff'
import { trackEvent } from '@/lib/analytics-events'

export interface YladaPublicEntryFlowProps {
  config: PublicFlowConfig
  /** true = raiz da área: escolhe nicho → quiz → resultado */
  entradaComNicho?: boolean
}

export default function YladaPublicEntryFlow({ config, entradaComNicho = false }: YladaPublicEntryFlowProps) {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [authTimeout, setAuthTimeout] = useState(false)
  const [profNicho, setProfNicho] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [, setAnswers] = useState<Record<string, string>>({})
  const [urlNichoSynced, setUrlNichoSynced] = useState(false)

  const { pathPrefix, nichoQueryKey, sessionStorageKey, isValidNicho } = config

  const isEntradaRoot = pathname === pathPrefix || pathname.startsWith(`${pathPrefix}?`)
  const legacyQuizPath = `${pathPrefix}/quiz`
  const isLegacyQuizPath = pathname === legacyQuizPath || pathname.startsWith(`${legacyQuizPath}?`)
  const isPublicFlowPath = entradaComNicho ? isEntradaRoot : isLegacyQuizPath

  useEffect(() => {
    if (!entradaComNicho || urlNichoSynced) return
    const q = searchParams.get(nichoQueryKey)
    if (isValidNicho(q)) {
      setProfNicho(q)
      setStep(0)
      setAnswers({})
    } else {
      const handoff = readPublicFlowHandoff()
      const slug = handoff?.nichoSlug ?? null
      if (
        handoff?.areaCodigo === config.areaCodigo &&
        slug &&
        isValidNicho(slug)
      ) {
        setProfNicho(slug)
        setStep(0)
        setAnswers({})
        clearPublicFlowHandoff()
        router.replace(`${pathPrefix}?${nichoQueryKey}=${encodeURIComponent(slug)}`, { scroll: false })
      }
    }
    setUrlNichoSynced(true)
  }, [
    entradaComNicho,
    searchParams,
    urlNichoSynced,
    nichoQueryKey,
    isValidNicho,
    config.areaCodigo,
    pathPrefix,
    router,
  ])

  const quizQuestions = useMemo(
    () => config.resolveQuestions(entradaComNicho, profNicho),
    [config, entradaComNicho, profNicho]
  )

  const totalPhases = quizQuestions.length + 1
  const isResult = step >= quizQuestions.length
  const current = quizQuestions[step]

  const verPraticaHref = useMemo(() => {
    if (entradaComNicho && profNicho) {
      return `${config.verPraticaHrefBase}?${nichoQueryKey}=${encodeURIComponent(profNicho)}`
    }
    return config.verPraticaHrefBase
  }, [entradaComNicho, profNicho, config.verPraticaHrefBase, nichoQueryKey])

  useEffect(() => {
    const id = setTimeout(() => setAuthTimeout(true), 800)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (loading || !isPublicFlowPath) return
    if (user) {
      router.replace(config.homePath)
    }
  }, [loading, user, router, isPublicFlowPath, config.homePath])

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

  const pickProfNicho = useCallback(
    (value: string) => {
      if (!isValidNicho(value)) return
      setProfNicho(value)
      setStep(0)
      setAnswers({})
      try {
        sessionStorage.removeItem(sessionStorageKey)
      } catch {
        /* ignore */
      }
      trackEvent(config.analytics.entradaNicho, { area: config.areaCodigo, opcao: value })
      router.replace(`${pathPrefix}?${nichoQueryKey}=${encodeURIComponent(value)}`, { scroll: false })
    },
    [router, isValidNicho, sessionStorageKey, config, pathPrefix, nichoQueryKey]
  )

  const pickOption = useCallback(
    (value: string) => {
      if (!current) return
      const qId = current.id
      setAnswers((prev) => {
        const next = { ...prev, [qId]: value }
        try {
          sessionStorage.setItem(sessionStorageKey, JSON.stringify(next))
        } catch {
          /* ignore */
        }
        return next
      })
      trackEvent(config.analytics.quizStep, {
        area: config.areaCodigo,
        step: qId,
        value,
        nicho: profNicho,
      })
      setStep((s) => s + 1)
    },
    [current, profNicho, sessionStorageKey, config]
  )

  const goBack = useCallback(() => {
    if (step <= 0) {
      if (entradaComNicho && profNicho) {
        setProfNicho(null)
        setAnswers({})
        try {
          sessionStorage.removeItem(sessionStorageKey)
        } catch {
          /* ignore */
        }
        router.replace(pathPrefix, { scroll: false })
      }
      return
    }
    const qId = quizQuestions[step - 1].id
    setAnswers((prev) => {
      const next = { ...prev }
      delete next[qId]
      try {
        sessionStorage.setItem(sessionStorageKey, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
    setStep((s) => s - 1)
  }, [step, entradaComNicho, profNicho, quizQuestions, router, sessionStorageKey, pathPrefix])

  useEffect(() => {
    if (isResult) {
      trackEvent(config.analytics.quizConcluiu, { area: config.areaCodigo, nicho: profNicho })
    }
  }, [isResult, profNicho, config])

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
  const rc = config.resultCopy

  const rootClass =
    `h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-white text-gray-900 ${config.rootExtraClassName ?? ''}`.trim()

  const mainClass =
    `flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-4 sm:px-6 py-6 max-w-lg mx-auto w-full ${config.mainExtraClassName ?? ''}`.trim()

  return (
    <div className={rootClass}>
      <header className="sticky top-0 z-20 shrink-0 border-b border-gray-100/80 bg-white/95 backdrop-blur-sm pt-[env(safe-area-inset-top,0px)]">
        <div className="h-0.5 w-full bg-gray-100 overflow-hidden" aria-hidden>
          <div
            className="h-full bg-blue-600 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href={config.logoHref}
            className="inline-flex touch-manipulation min-h-[48px] min-w-[48px] items-center justify-center -ml-1"
            aria-label="YLADA"
          >
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <div className="flex items-center gap-2 text-sm">
            {entradaComNicho && config.apresentacaoHref ? (
              <Link
                href={config.apresentacaoHref}
                className="text-gray-500 hover:text-gray-900 font-medium min-h-[48px] inline-flex items-center px-2"
              >
                Apresentação
              </Link>
            ) : (
              <Link
                href={pathPrefix}
                className="text-gray-500 hover:text-gray-900 font-medium min-h-[48px] inline-flex items-center px-2"
              >
                Voltar
              </Link>
            )}
            <Link
              href={config.loginHref}
              className="text-gray-500 hover:text-gray-900 font-medium min-h-[48px] inline-flex items-center px-2 -mr-2"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className={mainClass}>
        {showNichoPicker && (
          <div className="animate-fade-in-up flex flex-col pb-2 space-y-6" role="region" aria-live="polite">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug tracking-tight">
              {config.nichoPickerTitle}
            </h1>
            <div className="flex flex-col gap-3">
              {config.nichos.map((opt) => (
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
                  {rc.headline}
                </h1>
                <div className="space-y-4 sm:space-y-5 text-lg sm:text-xl text-gray-800 font-medium leading-snug">
                  {rc.subLines.map((line) => (
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
                  {rc.ctaPrimary}
                </Link>
                <p className="text-center text-sm text-gray-500 leading-relaxed px-1">{rc.ctaMicro}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
