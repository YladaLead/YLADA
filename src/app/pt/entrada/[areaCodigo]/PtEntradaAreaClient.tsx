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

  const config = getPublicFlowConfig(areaCodigo)
  const areaMeta = getYladaAreaConfig(areaCodigo)
  const pathPrefix = getYladaAreaPathPrefix(areaCodigo)

  useEffect(() => {
    if (loading) return
    if (user) {
      router.replace('/pt/painel')
      return
    }
    if (!areaUsesStandardPublicFlowMotor(areaCodigo) || !config) {
      router.replace(pathPrefix)
      return
    }
    if (config.nichos.length === 0) {
      router.replace(pathPrefix)
      return
    }
    setReady(true)
  }, [loading, user, router, areaCodigo, config, pathPrefix])

  const onPickNicho = useCallback(
    (nichoSlug: string) => {
      if (!config?.isValidNicho(nichoSlug)) return
      savePublicFlowHandoff({
        areaCodigo,
        nichoSlug,
        source: 'matrix_entrada',
      })
      trackEvent('ylada_matrix_entrada_nicho', { area: areaCodigo, opcao: nichoSlug })
      router.push(pathPrefix)
    },
    [areaCodigo, config, pathPrefix, router]
  )

  if (loading || !ready || !config) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="shrink-0 border-b border-gray-100">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3">
            <Link href="/pt" className="inline-flex touch-manipulation items-center" aria-label="YLADA início">
              <YLADALogo size="md" responsive className="bg-transparent" />
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-gray-500 text-sm">Carregando…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="shrink-0 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3">
          <Link href="/pt" className="inline-flex touch-manipulation shrink-0 items-center" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link href="/pt/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2 shrink-0">
            Entrar
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-10 sm:pb-12">
        <div className="space-y-6 max-w-2xl mx-auto">
          <Link href="/pt/segmentos" className="inline-block text-sm text-gray-500 hover:text-gray-800">
            ← Voltar
          </Link>

          <section className="space-y-3">
            {areaMeta ? (
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{areaMeta.label}</p>
            ) : null}
            <h1 className="text-lg font-semibold text-gray-900">{config.nichoPickerTitle}</h1>
            <p className="text-xs text-gray-600 sm:text-sm">
              Em seguida você responde algumas perguntas rápidas para ver como o YLADA se aplica ao seu dia a dia.
            </p>

            <ul className="flex flex-col gap-2 pt-2">
              {config.nichos.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => onPickNicho(opt.value)}
                    className="flex w-full min-h-[44px] items-center rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-left text-sm font-medium text-gray-900 transition-colors hover:border-blue-300 hover:bg-sky-50/60 active:bg-sky-50 sm:min-h-[48px] sm:px-4 sm:py-3"
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
