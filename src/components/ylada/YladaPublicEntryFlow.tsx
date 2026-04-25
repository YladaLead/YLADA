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
  const [profLinha, setProfLinha] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [, setAnswers] = useState<Record<string, string>>({})
  const [urlNichoSynced, setUrlNichoSynced] = useState(false)

  const { pathPrefix, nichoQueryKey, sessionStorageKey, isValidNicho, produtoLinhaStep } = config

  const isEntradaRoot = pathname === pathPrefix || pathname.startsWith(`${pathPrefix}?`)
  const legacyQuizPath = `${pathPrefix}/quiz`
  const isLegacyQuizPath = pathname === legacyQuizPath || pathname.startsWith(`${legacyQuizPath}?`)
  const isPublicFlowPath = entradaComNicho ? isEntradaRoot : isLegacyQuizPath

  useEffect(() => {
    if (!entradaComNicho || urlNichoSynced) return
    const qNicho = searchParams.get(nichoQueryKey)
    const qLinha = produtoLinhaStep ? searchParams.get(produtoLinhaStep.queryKey) : null

    if (produtoLinhaStep && qLinha && produtoLinhaStep.isValidLinha(qLinha)) {
      setProfLinha(qLinha)
    }
    if (isValidNicho(qNicho)) {
      setProfNicho(qNicho)
      setStep(0)
      setAnswers({})
    } else {
      const handoff = readPublicFlowHandoff()
      const slug = handoff?.nichoSlug ?? null
      const linhaHandoff = handoff?.linhaSlug ?? null
      if (handoff?.areaCodigo === config.areaCodigo) {
        if (produtoLinhaStep && linhaHandoff && produtoLinhaStep.isValidLinha(linhaHandoff)) {
          setProfLinha(linhaHandoff)
        }
        if (slug && isValidNicho(slug)) {
          setProfNicho(slug)
          setStep(0)
          setAnswers({})
          clearPublicFlowHandoff()
          const linQ = produtoLinhaStep && linhaHandoff && produtoLinhaStep.isValidLinha(linhaHandoff)
            ? `&${produtoLinhaStep.queryKey}=${encodeURIComponent(linhaHandoff)}`
            : ''
          router.replace(`${pathPrefix}?${nichoQueryKey}=${encodeURIComponent(slug)}${linQ}`, { scroll: false })
        }
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
    produtoLinhaStep,
  ])

  const quizQuestions = useMemo(
    () => config.resolveQuestions(entradaComNicho, profNicho, produtoLinhaStep ? profLinha : null),
    [config, entradaComNicho, profNicho, profLinha, produtoLinhaStep]
  )

  const isResult = step >= quizQuestions.length
  const current = quizQuestions[step]

  const cadastroHref = useMemo(() => {
    const { areaCodigo, pathPrefix } = config
    if (areaCodigo === 'nutri' || areaCodigo === 'estetica' || areaCodigo === 'med') {
      return `${pathPrefix}/cadastro`
    }
    let href = `/pt/cadastro?area=${encodeURIComponent(areaCodigo)}`
    if (areaCodigo === 'joias' && produtoLinhaStep && profLinha && profNicho) {
      href += `&${produtoLinhaStep.queryKey}=${encodeURIComponent(profLinha)}&${nichoQueryKey}=${encodeURIComponent(profNicho)}`
    }
    return href
  }, [config, produtoLinhaStep, profLinha, profNicho, nichoQueryKey])

  const irParaCadastro = useCallback(
    (opcao: 'sim' | 'sim_certeza') => {
      trackEvent(config.analytics.cadastroPromoCta, {
        area: config.areaCodigo,
        origem: 'quiz_result',
        opcao,
        nicho: profNicho,
        linha: profLinha,
      })
    },
    [config, profNicho, profLinha]
  )

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
    if (entradaComNicho && produtoLinhaStep && !profLinha) return 6
    if (entradaComNicho && !profNicho) return 10
    if (isResult) return 100
    const n = quizQuestions.length
    if (n <= 0) return 100
    // Uma fatia por pergunta (última pergunta = barra cheia); ecrã final continua 100%
    return ((step + 1) / n) * 100
  }, [entradaComNicho, produtoLinhaStep, profLinha, profNicho, step, isResult, quizQuestions.length])

  const pickProfLinha = useCallback(
    (value: string) => {
      if (!produtoLinhaStep || !produtoLinhaStep.isValidLinha(value)) return
      setProfLinha(value)
      setProfNicho(null)
      setStep(0)
      setAnswers({})
      try {
        sessionStorage.removeItem(sessionStorageKey)
      } catch {
        /* ignore */
      }
      if (config.analytics.entradaLinha) {
        trackEvent(config.analytics.entradaLinha, { area: config.areaCodigo, opcao: value })
      }
      router.replace(`${pathPrefix}?${produtoLinhaStep.queryKey}=${encodeURIComponent(value)}`, { scroll: false })
    },
    [router, produtoLinhaStep, sessionStorageKey, config, pathPrefix, pathPrefix]
  )

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
      const linhaQ =
        produtoLinhaStep && profLinha
          ? `${produtoLinhaStep.queryKey}=${encodeURIComponent(profLinha)}&`
          : ''
      router.replace(`${pathPrefix}?${linhaQ}${nichoQueryKey}=${encodeURIComponent(value)}`, { scroll: false })
    },
    [router, isValidNicho, sessionStorageKey, config, pathPrefix, nichoQueryKey, produtoLinhaStep, profLinha]
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
        linha: profLinha,
      })
      setStep((s) => s + 1)
    },
    [current, profNicho, profLinha, sessionStorageKey, config]
  )

  useEffect(() => {
    if (isResult) {
      trackEvent(config.analytics.quizConcluiu, { area: config.areaCodigo, nicho: profNicho, linha: profLinha })
    }
  }, [isResult, profNicho, profLinha, config])

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

  const showLinhaPicker = entradaComNicho && !!produtoLinhaStep && !profLinha
  const showNichoPicker = entradaComNicho && (!produtoLinhaStep || !!profLinha) && !profNicho
  const showEntrarNoTopo =
    (!entradaComNicho && step === 0 && !isResult) || (entradaComNicho && (showLinhaPicker || showNichoPicker))
  const rc = config.resultCopy

  const rootClass =
    `flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white text-gray-900 ${config.rootExtraClassName ?? ''}`.trim()

  const mainClass =
    `flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-4 sm:px-6 py-6 max-w-lg mx-auto w-full ${config.mainExtraClassName ?? ''}`.trim()

  return (
    <div className={rootClass}>
      <header className="sticky top-0 z-20 shrink-0 border-b border-gray-200 bg-white">
        <div
          className={`max-w-lg mx-auto flex items-center gap-3 px-4 pt-3 pb-2 sm:px-6 ${showEntrarNoTopo ? 'justify-between' : ''}`}
        >
          <Link
            href={config.logoHref}
            className="inline-flex touch-manipulation min-h-[48px] min-w-[48px] items-center justify-center -ml-1"
            aria-label="YLADA"
          >
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          {showEntrarNoTopo ? (
            <Link
              href={config.loginHref}
              className="text-xs font-medium text-gray-400 hover:text-gray-600 min-h-[44px] inline-flex items-center px-2 -mr-2"
            >
              Entrar
            </Link>
          ) : null}
        </div>
        <div className="max-w-lg mx-auto w-full px-4 pb-3.5 sm:px-6">
          <div
            className="w-full rounded-full border border-slate-300/90 bg-slate-100 p-px shadow-[inset_0_1px_2px_rgba(15,23,42,0.07)]"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso do questionário"
          >
            <div
              className="h-2 sm:h-2.5 rounded-full bg-blue-600 transition-[width] duration-500 ease-out shadow-[0_1px_2px_rgba(37,99,235,0.35)]"
              style={{
                width: `${progress}%`,
                minWidth: progress > 0 ? '8px' : undefined,
              }}
            />
          </div>
        </div>
      </header>

      <main className={mainClass}>
        {showLinhaPicker && produtoLinhaStep && (
          <div className="animate-fade-in-up flex flex-col pb-2 space-y-6" role="region" aria-live="polite">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug tracking-tight">
              {produtoLinhaStep.pickerTitle}
            </h1>
            <div className="flex flex-col gap-3">
              {produtoLinhaStep.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => pickProfLinha(opt.value)}
                  className="w-full min-h-[48px] rounded-2xl border-2 border-gray-300 bg-slate-50/90 px-5 py-3.5 text-base font-semibold text-gray-900 shadow-sm shadow-gray-900/5 hover:border-gray-500 hover:bg-white hover:shadow-md active:scale-[0.99] transition-all text-left"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

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
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug tracking-tight">
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
          </div>
        )}

        {!entradaComNicho && !isResult && current && (
          <div
            key={current.id}
            className="animate-fade-in-up flex flex-col pb-2"
            role="region"
            aria-live="polite"
          >
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug tracking-tight">
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
          </div>
        )}

        {isResult && (
          <div className="animate-fade-in-up pb-8 pt-2" role="region" aria-live="polite">
            <div className="space-y-8 sm:space-y-10">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug tracking-tight">
                {rc.question}
              </h1>
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href={cadastroHref}
                  onClick={() => irParaCadastro('sim')}
                  className="w-full min-h-[52px] rounded-2xl border-2 border-gray-300 bg-slate-50/90 px-5 py-3.5 text-center text-base font-semibold text-gray-900 shadow-sm shadow-gray-900/5 hover:border-gray-500 hover:bg-white hover:shadow-md active:scale-[0.99] transition-all"
                >
                  {rc.ctaSim}
                </Link>
                <Link
                  href={cadastroHref}
                  onClick={() => irParaCadastro('sim_certeza')}
                  className="w-full min-h-[52px] rounded-2xl bg-blue-600 px-5 py-3.5 text-center text-base font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 active:scale-[0.99] transition-all"
                >
                  {rc.ctaSimCerteza}
                </Link>
                {rc.ctaMicro ? (
                  <p className="text-center text-sm text-gray-500 leading-relaxed px-1 pt-2">{rc.ctaMicro}</p>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
