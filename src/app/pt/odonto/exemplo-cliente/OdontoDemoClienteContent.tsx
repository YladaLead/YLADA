'use client'

/**
 * Demo: fluxo no lugar do PACIENTE, por nicho (clareamento, implantes, etc.).
 * Rota: /pt/odonto/exemplo-cliente?nicho=clareamento
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import {
  ODONTO_DEMO_CLIENTE_NICHOS,
  getOdontoDemoClienteConfig,
  type OdontoDemoNicho,
} from '@/lib/odonto-demo-cliente-data'
import { STORAGE_KEY_ODONTO_CONTINUAR_TOUR, STORAGE_KEY_ODONTO_DEMO_NICHO } from '@/lib/odonto-demo-context'
import { trackEvent } from '@/lib/analytics-events'

export default function OdontoDemoClienteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nichoParam = searchParams.get('nicho')

  const configFromUrl = useMemo(() => getOdontoDemoClienteConfig(nichoParam), [nichoParam])

  const [nichoAtivo, setNichoAtivo] = useState<OdontoDemoNicho | null>(configFromUrl?.value ?? null)
  const [etapa, setEtapa] = useState(0)
  const [finalizado, setFinalizado] = useState(false)

  const cfg = useMemo(() => (nichoAtivo ? getOdontoDemoClienteConfig(nichoAtivo) : null), [nichoAtivo])

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
    (v: OdontoDemoNicho) => {
      try {
        sessionStorage.setItem(STORAGE_KEY_ODONTO_DEMO_NICHO, v)
      } catch {
        /* ok */
      }
      setNichoAtivo(v)
      setEtapa(0)
      setFinalizado(false)
      router.replace(`/pt/odonto/exemplo-cliente?nicho=${v}`, { scroll: false })
    },
    [router]
  )

  const avancar = useCallback(() => {
    if (!cfg || !perguntaAtual) return
    if (etapa < total - 1) {
      setEtapa((e) => e + 1)
    } else {
      setFinalizado(true)
      trackEvent('odonto_demo_cliente_concluiu', { area: 'odonto', opcao: cfg.value })
    }
  }, [cfg, perguntaAtual, etapa, total])

  const voltar = useCallback(() => {
    if (etapa <= 0) return
    setEtapa((e) => e - 1)
    setFinalizado(false)
  }, [etapa])

  const continuarTour = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_ODONTO_CONTINUAR_TOUR, '1')
    } catch {
      /* ok */
    }
    router.push('/pt/odonto')
  }, [router])

  if (!cfg && !nichoParam) {
    return (
      <div className="min-h-[100dvh] bg-white text-gray-900 flex flex-col estetica-touch supports-[height:100svh]:min-h-[100svh]">
        <header className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white/95 pt-[env(safe-area-inset-top,0px)]">
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
            <Link
              href="/pt/odonto"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center -ml-1"
              aria-label="Voltar"
            >
              <YLADALogo size="md" responsive className="bg-transparent" />
            </Link>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full estetica-safe-main-bottom">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Exemplo · visão do paciente</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Escolha o foco do atendimento</h1>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Cada opção abre um fluxo de exemplo com perguntas como as que seu paciente veria no seu link.
          </p>
          <div className="flex flex-col gap-2">
            {ODONTO_DEMO_CLIENTE_NICHOS.map((n) => (
              <button
                key={n.value}
                type="button"
                onClick={() => escolherNicho(n.value as OdontoDemoNicho)}
                className="w-full min-h-[52px] rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 active:scale-[0.99] transition-transform"
              >
                {n.label}
              </button>
            ))}
          </div>
          <Link href="/pt/odonto" className="mt-8 block text-center text-sm text-gray-500 hover:text-gray-800">
            ← Voltar
          </Link>
        </main>
      </div>
    )
  }

  if (nichoParam && !cfg) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 bg-white">
        <p className="text-gray-600 text-sm mb-4">Nicho não encontrado.</p>
        <Link href="/pt/odonto/exemplo-cliente" className="text-blue-600 font-medium text-sm">
          Ver opções de nicho
        </Link>
      </div>
    )
  }

  if (!cfg) return null

  if (finalizado) {
    return (
      <div className="min-h-[100dvh] bg-white text-gray-900 flex flex-col estetica-touch supports-[height:100svh]:min-h-[100svh]">
        <header className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white/95 pt-[env(safe-area-inset-top,0px)]">
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
            <Link
              href="/pt/odonto"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 min-h-[48px] inline-flex items-center"
            >
              ← Voltar
            </Link>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Simulação</span>
          </div>
        </header>
        <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full flex flex-col estetica-safe-main-bottom">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 mb-6">
            <p className="text-sm font-semibold text-emerald-950 mb-2">Seu paciente recebe um diagnóstico</p>
            <p className="text-sm text-emerald-900/95 leading-relaxed mb-3">
              Na sessão de verdade, no seu link, ele vê um diagnóstico <span className="font-semibold">ligado ao que
              respondeu</span>. Não é texto genérico: é a conversa das perguntas virando orientação na medida dele.
            </p>
            <p className="text-sm text-emerald-900/95 leading-relaxed">
              Com isso ele <span className="font-semibold">se sente mais ouvido</span>, ganha{' '}
              <span className="font-semibold">clareza</span> do que fazer e costuma ter mais{' '}
              <span className="font-semibold">vontade de resolver</span> o que você propôs, em vez de só pedir preço e
              parar por aí.
            </p>
          </div>

          <div
            className="rounded-xl border-2 border-dashed border-green-200 bg-green-50/80 p-4 mb-6"
            role="group"
            aria-label="Modelo do botão de WhatsApp no link do dentista"
          >
            <div
              className="flex w-full min-h-[52px] items-center justify-center rounded-xl bg-green-600/85 text-white font-semibold cursor-default select-none shadow-sm shadow-green-900/15"
              aria-hidden="true"
            >
              WhatsApp (modelo)
            </div>
            <p className="mt-4 text-sm text-gray-700 leading-relaxed text-left">
              <span className="font-semibold text-gray-900">No seu link:</span> depois do direcionamento, ele toca aqui e
              abre o <span className="font-medium">seu</span> WhatsApp (o número que você colocou). A mensagem já vem
              alinhada ao que ele viu no fluxo.
            </p>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">Como a mensagem chega pra você</h1>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Do seu lado: quando chega mensagem no <span className="font-semibold">seu WhatsApp</span>, ela já traz o{' '}
            <span className="font-semibold">resultado dele</span> na conversa. Você sabe na hora{' '}
            <span className="font-semibold">como direcionar o papo</span>, e o fechamento costuma ficar{' '}
            <span className="font-semibold">bem mais fácil</span>, além de ele já chegar querendo dar o próximo passo.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-8">
            Na prática, isso evita aquela conversa vaga só pedindo <span className="font-semibold">“preço de tudo”</span>:
            você já entra sabendo o que ele respondeu e por onde puxar o assunto.
          </p>

          <button
            type="button"
            onClick={continuarTour}
            className="w-full min-h-[48px] rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-sm shadow-blue-900/15"
          >
            Continuar para entender mais
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-white text-gray-900 flex flex-col estetica-touch supports-[height:100svh]:min-h-[100svh]">
      <header className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white/95 pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
          <Link
            href="/pt/odonto"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 min-h-[48px] inline-flex items-center pr-2"
          >
            ← Odonto
          </Link>
          <span className="text-xs text-gray-400 uppercase tracking-wider">Paciente</span>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full flex flex-col estetica-safe-main-bottom">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-100 rounded-lg px-3 py-2 mb-4 text-center leading-snug">
          Fluxo como seu paciente veria · {cfg.label}
        </p>

        <div className="text-center mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{cfg.tituloQuiz}</h1>
          <p className="text-sm text-gray-600">{cfg.subtitulo}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-200 flex-1 flex flex-col overscroll-y-contain">
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>
                Pergunta {etapa + 1} de {total}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((etapa + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          {perguntaAtual ? (
            <>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">{perguntaAtual.texto}</h2>
              <div className="space-y-2 flex-1">
                {perguntaAtual.opcoes.map((op, idx) => (
                  <button
                    key={op.label + idx}
                    type="button"
                    onClick={avancar}
                    className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50/80 transition-all font-medium text-gray-800 text-sm sm:text-base"
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {etapa > 0 && (
            <button
              type="button"
              onClick={voltar}
              className="mt-6 text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              ← Voltar
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
