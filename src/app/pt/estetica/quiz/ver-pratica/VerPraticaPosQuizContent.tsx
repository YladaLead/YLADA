'use client'

/**
 * Pós-matriz: onde atua → (nicho, se não veio na URL) → exemplo-cliente?origem=matriz
 * Sem tela de login simulado — o usuário já está no fluxo real da experiência.
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

type Fase = 'local' | 'nicho'

export default function VerPraticaPosQuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [fase, setFase] = useState<Fase>('local')

  const nichoPredefinido = useMemo(() => {
    const n = searchParams.get('nicho')
    return n && ESTETICA_DEMO_CLIENTE_NICHOS.some((o) => o.value === n) ? n : null
  }, [searchParams])

  const voltarQuizHref = useMemo(() => {
    return nichoPredefinido
      ? `/pt/estetica?nicho=${encodeURIComponent(nichoPredefinido)}`
      : '/pt/estetica'
  }, [nichoPredefinido])

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
          `${ESTETICA_DEMO_CLIENTE_BASE_PATH}?nicho=${encodeURIComponent(nichoPredefinido)}&origem=matriz`
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
      router.push(`${ESTETICA_DEMO_CLIENTE_BASE_PATH}?nicho=${encodeURIComponent(value)}&origem=matriz`)
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
        {fase === 'local' && (
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-xl font-bold text-gray-900">Onde você trabalha com estética?</h1>
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
            <Link
              href={voltarQuizHref}
              className="block w-full min-h-[44px] text-sm font-medium text-gray-500 hover:text-gray-800 text-center pt-2"
            >
              ← Voltar
            </Link>
          </div>
        )}

        {fase === 'nicho' && (
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-xl font-bold text-gray-900">Qual foco do exemplo?</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Fluxo curto só para demonstração. Depois você vê como sua cliente responderia.
            </p>
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
