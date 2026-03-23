'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import { INSTITUTIONAL_AREAS, type InstitutionalArea } from '@/config/institutional-areas'
import { useTranslations } from '@/hooks/useTranslations'

type Step = 'hero' | 'areas'

export default function PilotPage() {
  const [step, setStep] = useState<Step>('hero')
  const [showOther, setShowOther] = useState(false)
  const [otherText, setOtherText] = useState('')
  const router = useRouter()
  const { t } = useTranslations('pt')
  const list = t.institutional?.areas.list

  const goArea = (area: InstitutionalArea) => {
    router.push(area.path)
  }

  const submitOther = () => {
    const q = new URLSearchParams()
    q.set('area', 'profissional-liberal')
    const trimmed = otherText.trim()
    if (trimmed) q.set('profissao', trimmed)
    router.push(`/pt/solicitar-acesso?${q.toString()}`)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="shrink-0 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/pt" className="touch-manipulation" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link href="/pt/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Entrar
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col px-5 py-12 sm:py-16">
        {step === 'hero' && (
          <div className="max-w-md mx-auto w-full flex flex-col flex-1 justify-center text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
              Explique menos.
              <br />
              Venda mais.
            </h1>
            <p className="mt-5 text-base text-gray-600 leading-relaxed">
              Menos conversa improdutiva. Mais gente pronta para decidir com você.
            </p>
            <button
              type="button"
              onClick={() => setStep('areas')}
              className="mt-10 w-full sm:w-auto sm:mx-auto min-h-[48px] px-8 py-3 rounded-xl bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Comece agora
            </button>
          </div>
        )}

        {step === 'areas' && list && (
          <div className="max-w-lg mx-auto w-full">
            <button
              type="button"
              onClick={() => {
                setShowOther(false)
                setOtherText('')
                setStep('hero')
              }}
              className="text-sm text-gray-500 hover:text-gray-800 mb-6"
            >
              ← Voltar
            </button>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Qual é o seu segmento?</h2>
            <p className="text-sm text-gray-600 mb-8">Abriremos o ambiente certo para a sua atuação.</p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INSTITUTIONAL_AREAS.map((area) => {
                const label =
                  list[area.translationKey as keyof typeof list]?.title ?? area.id
                const isConstruction = area.status === 'construction'
                return (
                  <li key={area.id}>
                    <button
                      type="button"
                      onClick={() => goArea(area)}
                      className="w-full text-left min-h-[48px] px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:bg-sky-50/60 transition-colors text-sm font-medium text-gray-900 flex items-center justify-between gap-2"
                    >
                      <span>{label}</span>
                      {isConstruction && (
                        <span className="text-[10px] uppercase tracking-wide text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                          Em breve
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="mt-8 pt-8 border-t border-gray-100">
              {!showOther ? (
                <button
                  type="button"
                  onClick={() => setShowOther(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Outra área →
                </button>
              ) : (
                <div className="space-y-3">
                  <label htmlFor="pilot-outro" className="block text-sm font-medium text-gray-700">
                    Qual é a sua área?
                  </label>
                  <input
                    id="pilot-outro"
                    type="text"
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="Ex.: advocacia financeira, consultoria…"
                    className="w-full min-h-[48px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  />
                  <button
                    type="button"
                    onClick={submitOther}
                    className="w-full min-h-[48px] rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'areas' && !list && (
          <div className="max-w-md mx-auto flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Carregando…</p>
          </div>
        )}
      </main>
    </div>
  )
}
