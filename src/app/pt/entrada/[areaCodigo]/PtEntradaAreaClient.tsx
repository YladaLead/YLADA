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
        className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white text-gray-900 ${rootExtraClass}`.trim()}
      >
        <header className="sticky top-0 z-20 shrink-0 border-b border-gray-200 bg-white">
          <div className="max-w-lg mx-auto flex items-center justify-between gap-3 px-4 pt-3 pb-2 sm:px-6">
            <Link href="/pt" className="inline-flex touch-manipulation items-center" aria-label="YLADA início">
              <YLADALogo size="md" responsive className="bg-transparent" />
            </Link>
            <Link
              href={loginHref}
              className="text-xs font-medium text-gray-400 hover:text-gray-600 min-h-[44px] inline-flex items-center px-2 -mr-2 shrink-0"
            >
              Entrar
            </Link>
          </div>
          <div className="max-w-lg mx-auto w-full px-4 pb-3.5 sm:px-6">
            <div
              className="w-full rounded-full border border-slate-300/90 bg-slate-100 p-px shadow-[inset_0_1px_2px_rgba(15,23,42,0.07)]"
              role="progressbar"
              aria-valuenow={8}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso"
            >
              <div
                className="h-2 sm:h-2.5 rounded-full bg-blue-600 transition-[width] duration-500 ease-out shadow-[0_1px_2px_rgba(37,99,235,0.35)]"
                style={{ width: '8%', minWidth: '8px' }}
              />
            </div>
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
      className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white text-gray-900 ${rootExtraClass}`.trim()}
    >
      <header className="sticky top-0 z-20 shrink-0 border-b border-gray-200 bg-white">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3 px-4 pt-3 pb-2 sm:px-6">
          <Link
            href="/pt"
            className="inline-flex touch-manipulation min-h-[48px] min-w-[48px] shrink-0 items-center justify-center -ml-1"
            aria-label="YLADA início"
          >
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link
            href={loginHref}
            className="text-xs font-medium text-gray-400 hover:text-gray-600 min-h-[44px] inline-flex items-center px-2 -mr-2 shrink-0"
          >
            Entrar
          </Link>
        </div>
        <div className="max-w-lg mx-auto w-full px-4 pb-3.5 sm:px-6">
          <div
            className="w-full rounded-full border border-slate-300/90 bg-slate-100 p-px shadow-[inset_0_1px_2px_rgba(15,23,42,0.07)]"
            role="progressbar"
            aria-valuenow={8}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso"
          >
            <div
              className="h-2 sm:h-2.5 rounded-full bg-blue-600 transition-[width] duration-500 ease-out shadow-[0_1px_2px_rgba(37,99,235,0.35)]"
              style={{ width: '8%', minWidth: '8px' }}
            />
          </div>
        </div>
      </header>

      <main
        className={`flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-4 sm:px-6 py-6 max-w-lg mx-auto w-full ${standard?.mainExtraClassName ?? ''}`.trim()}
      >
        <div className="animate-fade-in-up flex flex-col pb-2 space-y-6" role="region" aria-live="polite">
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
