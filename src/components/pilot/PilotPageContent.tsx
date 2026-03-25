'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import { INSTITUTIONAL_AREAS } from '@/config/institutional-areas'
import { useTranslations } from '@/hooks/useTranslations'

/** Itens só por solicitação — no piloto entram apenas pelo campo livre. */
const PILOT_EXCLUDED_IDS = new Set(['profissional-liberal', 'vendedores-geral'])

/** Entrada minimal por segmento: /pt/{id} (landing longa em /pt/{id}/como-funciona). */
function pilotHrefForArea(areaId: string): string {
  return `/pt/${areaId}`
}

type PilotStep = 'intro' | 'areas'

export default function PilotPageContent() {
  const [step, setStep] = useState<PilotStep>('intro')
  const [otherText, setOtherText] = useState('')
  const router = useRouter()
  const { t } = useTranslations('pt')
  const list = t.institutional?.areas.list

  const pilotAreas = INSTITUTIONAL_AREAS.filter((a) => !PILOT_EXCLUDED_IDS.has(a.id))

  const submitOther = () => {
    const q = new URLSearchParams()
    q.set('area', 'profissional-liberal')
    const trimmed = otherText.trim()
    if (trimmed) q.set('profissao', trimmed)
    router.push(`/pt/solicitar-acesso?${q.toString()}`)
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="shrink-0 border-b border-gray-100">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3">
            <Link href="/pt/segmentos" className="inline-flex touch-manipulation items-center" aria-label="YLADA início">
              <YLADALogo size="md" responsive className="bg-transparent" />
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-gray-500">Carregando…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="shrink-0 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3">
          <Link
            href="/pt/segmentos"
            className="inline-flex touch-manipulation shrink-0 items-center"
            aria-label="YLADA início"
          >
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link href="/pt/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2 shrink-0">
            Entrar
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-10 sm:pb-12">
        {step === 'intro' && (
          <div className="flex flex-col flex-1 min-h-[55vh] sm:min-h-[62vh] justify-center items-center text-center max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-snug">
              Explique menos.
              <br />
              Venda mais.
            </h1>
            <button
              type="button"
              onClick={() => setStep('areas')}
              className="mt-10 w-full max-w-sm min-h-[44px] rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700 sm:min-h-[48px]"
            >
              Comece agora
            </button>
          </div>
        )}

        {step === 'areas' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => {
                setOtherText('')
                setStep('intro')
              }}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              ← Voltar
            </button>

            <section className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Qual é o seu segmento?</h2>
                <p className="mt-0.5 text-xs text-gray-600 sm:text-sm">
                  Toque na sua área ou digite abaixo se não estiver na lista.
                </p>
              </div>

              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {pilotAreas.map((area) => {
                  const label =
                    list[area.translationKey as keyof typeof list]?.title ?? area.id
                  const href = pilotHrefForArea(area.id)
                  return (
                    <li key={area.id}>
                      <Link
                        href={href}
                        className="flex min-h-[44px] items-center rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-blue-300 hover:bg-sky-50/60 active:bg-sky-50 sm:min-h-[48px] sm:px-4 sm:py-3"
                      >
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>

            <section className="space-y-3 border-t border-gray-100 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Outro</p>
              <label htmlFor="pilot-outro" className="block text-sm font-medium text-gray-900">
                Qual é a sua área?
              </label>
              <input
                id="pilot-outro"
                type="text"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Ex.: vendedor, fono, fisioterapeuta…"
                className="w-full min-h-[44px] rounded-xl border border-gray-300 px-3.5 py-2 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:min-h-[48px] sm:px-4"
                autoComplete="organization-title"
              />
              <button
                type="button"
                onClick={submitOther}
                className="w-full min-h-[44px] rounded-xl border border-gray-900 bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 active:bg-gray-950 sm:min-h-[48px]"
              >
                Continuar
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
