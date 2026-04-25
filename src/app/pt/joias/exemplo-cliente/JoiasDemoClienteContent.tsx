'use client'

/**
 * Demo: fluxo no lugar da cliente final (joias / semijoias / bijuterias).
 * Rota: /pt/joias/exemplo-cliente?nicho=semijoia
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import {
  JOIAS_DEMO_CLIENTE_NICHOS,
  getJoiasDemoClienteConfig,
  type JoiasDemoNicho,
} from '@/lib/joias-demo-cliente-data'
import {
  STORAGE_KEY_JOIAS_CONTINUAR_TOUR,
  STORAGE_KEY_JOIAS_DEMO_NICHO,
} from '@/lib/joias-demo-context'
import { trackEvent } from '@/lib/analytics-events'

const CADASTRO_POS_DEMO_HREF = '/pt/cadastro?area=joias'

export default function JoiasDemoClienteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nichoParam = searchParams.get('nicho')

  const configFromUrl = useMemo(() => getJoiasDemoClienteConfig(nichoParam), [nichoParam])

  const [nichoAtivo, setNichoAtivo] = useState<JoiasDemoNicho | null>(configFromUrl?.value ?? null)
  const [etapa, setEtapa] = useState(0)
  const [finalizado, setFinalizado] = useState(false)

  const cfg = useMemo(() => (nichoAtivo ? getJoiasDemoClienteConfig(nichoAtivo) : null), [nichoAtivo])

  useEffect(() => {
    if (configFromUrl && configFromUrl.value !== nichoAtivo) {
      setNichoAtivo(configFromUrl.value)
      setEtapa(0)
      setFinalizado(false)
    }
  }, [configFromUrl, nichoAtivo])

  const total = cfg?.perguntas.length ?? 0
  const perguntaAtual = cfg?.perguntas[etapa]

  const escolherNicho = useCallback(
    (v: JoiasDemoNicho) => {
      try {
        sessionStorage.setItem(STORAGE_KEY_JOIAS_DEMO_NICHO, v)
      } catch {
        /* ok */
      }
      setNichoAtivo(v)
      setEtapa(0)
      setFinalizado(false)
      router.replace(`/pt/joias/exemplo-cliente?nicho=${v}`, { scroll: false })
    },
    [router]
  )

  const avancar = useCallback(() => {
    if (!cfg || !perguntaAtual) return
    if (etapa < total - 1) {
      setEtapa((e) => e + 1)
    } else {
      setFinalizado(true)
      trackEvent('joias_demo_cliente_concluiu', { area: 'joias', opcao: cfg.value })
    }
  }, [cfg, perguntaAtual, etapa, total])

  const voltar = useCallback(() => {
    if (etapa <= 0) return
    setEtapa((e) => e - 1)
    setFinalizado(false)
  }, [etapa])

  const continuarTour = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_JOIAS_CONTINUAR_TOUR, '1')
    } catch {
      /* ok */
    }
    router.push('/pt/joias')
  }, [router])

  if (!cfg && !nichoParam) {
    return (
      <div className="min-h-[100dvh] bg-white text-gray-900 flex flex-col estetica-touch supports-[height:100svh]:min-h-[100svh]">
        <header className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white/95 pt-[env(safe-area-inset-top,0px)]">
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
            <Link
              href="/pt/joias"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center -ml-1"
              aria-label="Voltar"
            >
              <YLADALogo size="md" responsive className="bg-transparent" />
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
          <p className="text-sm text-gray-600 mb-6">Escolha um foco para ver o exemplo no lugar da sua cliente.</p>
          <ul className="space-y-2">
            {JOIAS_DEMO_CLIENTE_NICHOS.map((n) => (
              <li key={n.value}>
                <button
                  type="button"
                  onClick={() => escolherNicho(n.value as JoiasDemoNicho)}
                  className="w-full text-left rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 hover:border-blue-300 hover:bg-blue-50/40 transition"
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
          <Link href="/pt/joias" className="mt-8 block text-center text-sm text-gray-500 hover:text-gray-800">
            ← Voltar
          </Link>
        </main>
      </div>
    )
  }

  if (!cfg) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-white px-4">
        <p className="text-gray-600 text-sm text-center">Nicho não encontrado.</p>
        <Link href="/pt/joias/exemplo-cliente" className="text-blue-600 font-medium text-sm ml-2">
          Ver opções
        </Link>
      </div>
    )
  }

  if (finalizado) {
    return (
      <div className="min-h-[100dvh] bg-white text-gray-900 flex flex-col estetica-touch supports-[height:100svh]:min-h-[100svh]">
        <header className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white/95 pt-[env(safe-area-inset-top,0px)]">
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
            <Link href="/pt/joias" className="text-sm text-gray-600 hover:text-gray-900">
              ← Joias & bijuterias
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-lg mx-auto w-full px-4 py-10 text-center">
          <p className="text-lg font-semibold text-gray-900 mb-2">Exemplo concluído</p>
          <p className="text-sm text-gray-600 mb-8">
            Assim a cliente chega mais organizada antes do WhatsApp — e você vende valor, não só preço.
          </p>
          <div className="space-y-3">
            <Link
              href={CADASTRO_POS_DEMO_HREF}
              onClick={() =>
                trackEvent('joias_cadastro_promo_cta', { area: 'joias', origem: 'matriz_exemplo_cliente' })
              }
              className="block w-full rounded-xl bg-blue-600 text-white font-semibold py-3.5 text-center text-sm hover:bg-blue-700"
            >
              Criar minha conta YLADA
            </Link>
            <button
              type="button"
              onClick={continuarTour}
              className="block w-full rounded-xl border border-gray-200 text-gray-800 font-medium py-3.5 text-sm hover:bg-gray-50"
            >
              Continuar explorando
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900 flex flex-col estetica-touch supports-[height:100svh]:min-h-[100svh]">
      <header className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white/95 pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={voltar}
            disabled={etapa <= 0}
            className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40"
          >
            Voltar
          </button>
          <span className="text-xs text-gray-400">
            {etapa + 1}/{total}
          </span>
        </div>
      </header>
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">{cfg.label}</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{perguntaAtual?.texto}</h1>
        <ul className="mt-6 space-y-2">
          {perguntaAtual?.opcoes.map((op) => (
            <li key={op.label}>
              <button
                type="button"
                onClick={() => {
                  avancar()
                }}
                className="w-full text-left rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 hover:border-blue-300 hover:bg-blue-50/40 transition"
              >
                {op.label}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
