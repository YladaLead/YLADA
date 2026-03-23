'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import { INSTITUTIONAL_AREAS } from '@/config/institutional-areas'
import { useTranslations } from '@/hooks/useTranslations'

/** Itens só por solicitação — no piloto entram apenas pelo campo livre. */
const PILOT_EXCLUDED_IDS = new Set(['profissional-liberal', 'vendedores-geral'])

export default function PilotPage() {
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
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/pt" className="touch-manipulation" aria-label="YLADA início">
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
        <div className="max-w-lg mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/pt" className="touch-manipulation" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link href="/pt/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2 -mr-1">
            Entrar
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-6 pb-10 sm:pb-12 space-y-6">
        <section className="text-center sm:text-left space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-snug">
            Explique menos.
            <br />
            Venda mais.
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Menos conversa improdutiva. Mais gente pronta para decidir com você.
          </p>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Qual é o seu segmento?</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              Toque na sua área ou digite abaixo se não estiver na lista.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pilotAreas.map((area) => {
              const label =
                list[area.translationKey as keyof typeof list]?.title ?? area.id
              return (
                <li key={area.id}>
                  <Link
                    href={area.path}
                    className="flex min-h-[44px] items-center px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-900 hover:border-blue-300 hover:bg-sky-50/60 active:bg-sky-50 transition-colors sm:min-h-[48px] sm:px-4 sm:py-3"
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="pt-2 space-y-3 border-t border-gray-100">
          <label htmlFor="pilot-outro" className="block text-sm font-medium text-gray-900">
            Qual é a sua área?
          </label>
          <input
            id="pilot-outro"
            type="text"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="Ex.: profissional liberal, vendedor, suplementos (outra linha)…"
            className="w-full min-h-[44px] px-3.5 py-2 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:min-h-[48px] sm:px-4"
            autoComplete="organization-title"
          />
          <button
            type="button"
            onClick={submitOther}
            className="w-full min-h-[44px] rounded-xl border border-gray-900 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:bg-gray-950 sm:min-h-[48px]"
          >
            Continuar
          </button>
        </section>
      </main>
    </div>
  )
}
