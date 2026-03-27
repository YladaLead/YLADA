'use client'

/**
 * Pós-matriz: local → (nicho se não veio na URL) → exemplo-cliente?origem=matriz
 * Parâmetros por área (demo context + copy).
 */

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import type { AnalyticsEventName } from '@/lib/analytics-events'
import { trackEvent } from '@/lib/analytics-events'

export interface MatrixVerPraticaNichoOption {
  value: string
  label: string
}

export interface MatrixVerPraticaStrings {
  headerAriaBack: string
  tituloLocal: string
  textoLocalComNicho: string
  textoLocalSemNicho: string
  tituloNicho: string
  textoNicho: string
  voltarQuiz: string
}

export interface MatrixVerPraticaAfterQuizContentProps {
  pathPrefix: string
  loginHref: string
  nichos: MatrixVerPraticaNichoOption[]
  locais: MatrixVerPraticaNichoOption[]
  storageLocalKey: string
  storageNichoKey: string
  exemploClienteBasePath: string
  analyticsVerPratica: AnalyticsEventName
  areaForPayload: string
  strings: MatrixVerPraticaStrings
}

type Fase = 'local' | 'nicho'

export default function MatrixVerPraticaAfterQuizContent({
  pathPrefix,
  loginHref,
  nichos,
  locais,
  storageLocalKey,
  storageNichoKey,
  exemploClienteBasePath,
  analyticsVerPratica,
  areaForPayload,
  strings,
}: MatrixVerPraticaAfterQuizContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [fase, setFase] = useState<Fase>('local')

  const nichoPredefinido = useMemo(() => {
    const n = searchParams.get('nicho')
    return n && nichos.some((o) => o.value === n) ? n : null
  }, [searchParams, nichos])

  const voltarQuizHref = useMemo(() => {
    return nichoPredefinido
      ? `${pathPrefix}?nicho=${encodeURIComponent(nichoPredefinido)}`
      : pathPrefix
  }, [nichoPredefinido, pathPrefix])

  const escolherLocal = useCallback(
    (value: string) => {
      try {
        sessionStorage.setItem(storageLocalKey, value)
      } catch {
        /* ok */
      }
      trackEvent(analyticsVerPratica, { area: areaForPayload, step: 'local', opcao: value })
      if (nichoPredefinido) {
        try {
          sessionStorage.setItem(storageNichoKey, nichoPredefinido)
        } catch {
          /* ok */
        }
        router.push(
          `${exemploClienteBasePath}?nicho=${encodeURIComponent(nichoPredefinido)}&origem=matriz`
        )
      } else {
        setFase('nicho')
      }
    },
    [
      router,
      nichoPredefinido,
      storageLocalKey,
      storageNichoKey,
      exemploClienteBasePath,
      analyticsVerPratica,
      areaForPayload,
    ]
  )

  const escolherNicho = useCallback(
    (value: string) => {
      try {
        sessionStorage.setItem(storageNichoKey, value)
      } catch {
        /* ok */
      }
      trackEvent(analyticsVerPratica, { area: areaForPayload, step: 'nicho', opcao: value })
      router.push(`${exemploClienteBasePath}?nicho=${encodeURIComponent(value)}&origem=matriz`)
    },
    [router, storageNichoKey, exemploClienteBasePath, analyticsVerPratica, areaForPayload]
  )

  const textoLocalIntro = (
    nichoPredefinido ? strings.textoLocalComNicho : strings.textoLocalSemNicho
  ).trim()

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900 flex flex-col estetica-touch supports-[height:100svh]:min-h-[100svh]">
      <header className="sticky top-0 z-20 shrink-0 border-b border-gray-100/80 bg-white/95 backdrop-blur-sm pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href={pathPrefix}
            className="inline-flex touch-manipulation min-h-[48px] min-w-[48px] items-center justify-center -ml-1"
            aria-label={strings.headerAriaBack}
          >
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link
            href={loginHref}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 min-h-[48px] inline-flex items-center px-2"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-8 max-w-lg mx-auto w-full estetica-safe-main-bottom">
        {fase === 'local' && (
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-xl font-bold text-gray-900">{strings.tituloLocal}</h1>
            {textoLocalIntro ? (
              <p className="text-sm text-gray-600 leading-relaxed">{textoLocalIntro}</p>
            ) : null}
            <div className="flex flex-col gap-2">
              {locais.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => escolherLocal(opt.value)}
                  className="w-full min-h-[52px] rounded-xl border-2 border-gray-300 bg-slate-50/90 px-4 py-3 text-left text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-500 hover:bg-white hover:shadow-md active:scale-[0.99] transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <Link
              href={voltarQuizHref}
              className="block w-full min-h-[44px] text-sm font-medium text-gray-500 hover:text-gray-800 text-center pt-2"
            >
              {strings.voltarQuiz}
            </Link>
          </div>
        )}

        {fase === 'nicho' && (
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-xl font-bold text-gray-900">{strings.tituloNicho}</h1>
            <p className="text-sm text-gray-600 leading-relaxed">{strings.textoNicho}</p>
            <div className="flex flex-col gap-2">
              {nichos.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => escolherNicho(opt.value)}
                  className="w-full min-h-[52px] rounded-xl border-2 border-gray-300 bg-slate-50/90 px-4 py-3 text-left text-sm font-semibold text-gray-900 shadow-sm hover:border-gray-500 hover:bg-white hover:shadow-md active:scale-[0.99] transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFase('local')}
              className="w-full min-h-[44px] text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              ← Voltar
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
