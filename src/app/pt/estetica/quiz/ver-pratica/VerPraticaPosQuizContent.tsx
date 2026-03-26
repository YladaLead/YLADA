'use client'

/**
 * Pós-quiz: simulação de login → onde atua → (nicho, se não veio na URL) → exemplo-cliente?origem=quiz
 */

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import { ESTETICA_DEMO_CLIENTE_NICHOS } from '@/lib/estetica-demo-cliente-data'
import {
  ESTETICA_DEMO_CLIENTE_BASE_PATH,
  ESTETICA_DEMO_LOCAIS,
  STORAGE_KEY_ESTETICA_DEMO_LOCAL,
  STORAGE_KEY_ESTETICA_DEMO_NICHO,
} from '@/lib/estetica-demo-context'
import { trackEvent } from '@/lib/analytics-events'

type Fase = 'login' | 'local' | 'nicho'

export default function VerPraticaPosQuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [fase, setFase] = useState<Fase>('login')

  const nichoPredefinido = useMemo(() => {
    const n = searchParams.get('nicho')
    return n && ESTETICA_DEMO_CLIENTE_NICHOS.some((o) => o.value === n) ? n : null
  }, [searchParams])

  const avancarLogin = useCallback(() => {
    trackEvent('estetica_quiz_ver_pratica', { area: 'estetica', step: 'pos_login_simulado' })
    setFase('local')
  }, [])

  const escolherLocal = useCallback(
    (value: string) => {
      try {
        sessionStorage.setItem(STORAGE_KEY_ESTETICA_DEMO_LOCAL, value)
      } catch {
        /* ok */
      }
      trackEvent('estetica_quiz_ver_pratica', { area: 'estetica', step: 'local', opcao: value })
      if (nichoPredefinido) {
        try {
          sessionStorage.setItem(STORAGE_KEY_ESTETICA_DEMO_NICHO, nichoPredefinido)
        } catch {
          /* ok */
        }
        router.push(
          `${ESTETICA_DEMO_CLIENTE_BASE_PATH}?nicho=${encodeURIComponent(nichoPredefinido)}&origem=quiz`
        )
      } else {
        setFase('nicho')
      }
    },
    [router, nichoPredefinido]
  )

  const escolherNicho = useCallback(
    (value: string) => {
      try {
        sessionStorage.setItem(STORAGE_KEY_ESTETICA_DEMO_NICHO, value)
      } catch {
        /* ok */
      }
      trackEvent('estetica_quiz_ver_pratica', { area: 'estetica', step: 'nicho', opcao: value })
      router.push(`${ESTETICA_DEMO_CLIENTE_BASE_PATH}?nicho=${encodeURIComponent(value)}&origem=quiz`)
    },
    [router]
  )

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900 flex flex-col estetica-touch supports-[height:100svh]:min-h-[100svh]">
      <header className="sticky top-0 z-20 shrink-0 border-b border-gray-100/80 bg-white/95 backdrop-blur-sm pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/pt/estetica"
            className="inline-flex touch-manipulation min-h-[48px] min-w-[48px] items-center justify-center -ml-1"
            aria-label="Voltar à estética"
          >
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link
            href="/pt/estetica/login"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 min-h-[48px] inline-flex items-center px-2"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 py-8 max-w-lg mx-auto w-full estetica-safe-main-bottom">
        {fase === 'login' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 leading-snug">
                Simulação · sem senha de verdade
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Entrar no YLADA</h1>
              <p className="text-base text-gray-600 leading-relaxed">
                É só para você enxergar o próximo passo: como fica o fluxo na prática, do jeito que sua cliente veria.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">E-mail (exemplo)</label>
                <input
                  type="email"
                  disabled
                  placeholder="voce@exemplo.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600 text-sm cursor-not-allowed placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Senha (exemplo)</label>
                <input
                  type="password"
                  disabled
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600 text-sm cursor-not-allowed placeholder:text-gray-400"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={avancarLogin}
              className="w-full min-h-[52px] rounded-2xl bg-blue-600 px-5 py-3.5 text-base font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-colors"
            >
              Continuar e ver na prática
            </button>
          </div>
        )}

        {fase === 'local' && (
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-xl font-bold text-gray-900">Onde você trabalha com estética?</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              {nichoPredefinido
                ? 'Escolha onde você atua. Em seguida você vê o fluxo como sua cliente, já no nicho que você escolheu antes.'
                : 'Escolha onde você atua. Na próxima tela você define o nicho do exemplo.'}
            </p>
            <div className="flex flex-col gap-2">
              {ESTETICA_DEMO_LOCAIS.map((opt) => (
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
            <button
              type="button"
              onClick={() => setFase('login')}
              className="w-full min-h-[44px] text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              ← Voltar
            </button>
          </div>
        )}

        {fase === 'nicho' && (
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-xl font-bold text-gray-900">Em que área você mais atua?</h1>
            <p className="text-sm text-gray-600 leading-relaxed">Cada opção abre um fluxo curto como sua cliente veria.</p>
            <div className="flex flex-col gap-2">
              {ESTETICA_DEMO_CLIENTE_NICHOS.map((opt) => (
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
