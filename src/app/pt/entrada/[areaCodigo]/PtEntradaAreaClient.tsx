'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import YLADALogo from '@/components/YLADALogo'
import { getYladaAreaConfig, getYladaAreaPathPrefix } from '@/config/ylada-areas'
import { getPublicFlowConfig, areaUsesStandardPublicFlowMotor } from '@/config/ylada-public-flow-registry'
import { useAuth } from '@/contexts/AuthContext'
import { savePublicFlowHandoff } from '@/lib/ylada-public-flow-handoff'
import { trackEvent } from '@/lib/analytics-events'

export default function PtEntradaAreaClient({ areaCodigo }: { areaCodigo: string }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [ready, setReady] = useState(false)

  const standard =
    areaUsesStandardPublicFlowMotor(areaCodigo) ? getPublicFlowConfig(areaCodigo) : null
  const areaMeta = getYladaAreaConfig(areaCodigo)
  const pathPrefix = getYladaAreaPathPrefix(areaCodigo)

  const hasStandard = !!(standard && standard.nichos.length > 0)

  useEffect(() => {
    if (loading) return
    if (user) {
      router.replace('/pt/painel')
      return
    }
    if (!hasStandard) {
      router.replace(pathPrefix)
      return
    }
    setReady(true)
  }, [loading, user, router, hasStandard, pathPrefix])

  const onPickNicho = useCallback(
    (nichoSlug: string) => {
      if (!standard) return
      if (!standard.isValidNicho(nichoSlug)) return
      savePublicFlowHandoff({
        areaCodigo,
        nichoSlug,
        source: 'matrix_entrada',
      })
      trackEvent('ylada_matrix_entrada_nicho', { area: areaCodigo, opcao: nichoSlug })
      router.push(standard.pathPrefix)
    },
    [areaCodigo, standard, router]
  )

  const nichos = standard?.nichos ?? []

  const rootExtraClass = standard?.rootExtraClassName?.trim() ?? ''
  const loginHref = standard?.loginHref ?? '/pt/login'

  if (loading || !ready || nichos.length === 0) {
    return (
      <div
        className={`h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-white text-gray-900 ${rootExtraClass}`.trim()}
      >
        <header className="sticky top-0 z-20 shrink-0 border-b border-gray-100/80 bg-white/95 backdrop-blur-sm pt-[env(safe-area-inset-top,0px)]">
          <div className="h-0.5 w-full bg-gray-100 overflow-hidden" aria-hidden>
            <div className="h-full w-[8%] bg-blue-600" />
          </div>
          <div className="max-w-lg mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <Link href="/pt" className="inline-flex touch-manipulation items-center" aria-label="YLADA início">
              <YLADALogo size="md" responsive className="bg-transparent" />
            </Link>
          </div>
        </header>
        <div className="flex-1 min-h-0 flex items-center justify-center px-4">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-white text-gray-900 ${rootExtraClass}`.trim()}
    >
      <header className="sticky top-0 z-20 shrink-0 border-b border-gray-100/80 bg-white/95 backdrop-blur-sm pt-[env(safe-area-inset-top,0px)]">
        <div className="h-0.5 w-full bg-gray-100 overflow-hidden" aria-hidden>
          <div
            className="h-full bg-blue-600 transition-[width] duration-500 ease-out"
            style={{ width: '8%' }}
          />
        </div>
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/pt"
            className="inline-flex touch-manipulation min-h-[48px] min-w-[48px] shrink-0 items-center justify-center -ml-1"
            aria-label="YLADA início"
          >
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link
            href={loginHref}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 min-h-[48px] inline-flex items-center px-2 -mr-2 shrink-0"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main
        className={`flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-4 sm:px-6 py-6 max-w-lg mx-auto w-full ${standard?.mainExtraClassName ?? ''}`.trim()}
      >
        <div className="animate-fade-in-up flex flex-col pb-2 space-y-6" role="region" aria-live="polite">
          <Link
            href="/pt/segmentos"
            className="inline-block text-sm font-medium text-gray-500 hover:text-gray-800 min-h-[44px] py-2"
          >
            ← Voltar
          </Link>

          <section className="space-y-4">
            {areaMeta ? (
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{areaMeta.label}</p>
            ) : null}
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-snug tracking-tight">
              {standard.nichoPickerTitle}
            </h1>

            <ul className="flex flex-col gap-3">
              {nichos.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => onPickNicho(opt.value)}
                    className="w-full min-h-[48px] rounded-2xl border-2 border-gray-300 bg-slate-50/90 px-5 py-3.5 text-left text-base font-semibold text-gray-900 shadow-sm shadow-gray-900/5 hover:border-gray-500 hover:bg-white hover:shadow-md active:scale-[0.99] transition-all"
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
