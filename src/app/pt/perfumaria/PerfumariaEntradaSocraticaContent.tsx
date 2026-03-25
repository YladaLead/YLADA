'use client'

/**
 * Entrada pública /pt/perfumaria — fluxo progressivo.
 * Landing minimal anterior: /pt/perfumariav2.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import { useAuth } from '@/contexts/AuthContext'
import { trackEvent } from '@/lib/analytics-events'
import {
  PERFUMARIA_DEMO_LOCAIS,
  PERFUMARIA_DEMO_CLIENTE_BASE_PATH,
  STORAGE_KEY_PERFUMARIA_DEMO_LOCAL,
  STORAGE_KEY_PERFUMARIA_DEMO_NICHO,
  STORAGE_KEY_PERFUMARIA_CONTINUAR_TOUR,
  PERFUMARIA_LANDING_STEP_APOS_DEMO,
} from '@/lib/perfumaria-demo-context'
import { PERFUMARIA_DEMO_CLIENTE_NICHOS } from '@/lib/perfumaria-demo-cliente-data'

const TOTAL_STEPS = 12
const CADASTRO_HREF = '/pt/cadastro?area=perfumaria'

type ChoiceItem = { label: string; analyticsValue: string }

type StepBody = {
  lines: string[]
  primary?: { label: string; action: 'next' | 'href' | 'open-exemplo' | 'demo-modal'; href?: string }
  secondary?: { label: string; action: 'next' | 'open-exemplo' | 'demo-modal' }
  choices?: ChoiceItem[]
}

const STEPS: StepBody[] = [
  {
    lines: ['Posso te fazer uma pergunta rápida?', '', 'Na prática…', '', 'seu marketing hoje atrai mais:'],
    choices: [
      { label: 'Gente pedindo preço ou comparando com o site', analyticsValue: 'preco' },
      { label: 'Conversas que não viram compra ou retorno', analyticsValue: 'conversas' },
      { label: 'Clientes com contexto claro pra primeira mensagem', analyticsValue: 'prontos' },
    ],
  },
  {
    lines: [
      'Se você vende ou indica perfumaria…',
      '',
      'provavelmente isso já aconteceu com você:',
      '',
      'Você posta…',
      'mas quase não vira venda ou visita',
      '',
      'Às vezes até chama gente…',
      'mas não vira pedido',
      '',
      'E quando pede “o mais barato” ou manda print da concorrência…',
      'a conversa esfria',
      '',
      'Isso cansa.',
    ],
    primary: { label: 'Exatamente isso', action: 'next' },
  },
  {
    lines: [
      'E não é você.',
      '',
      'O problema não é o seu olfato nem o seu estoque.',
      '',
      'É que a maioria chega sem saber o que quer:',
      'ocasião, notas, pele, concentração…',
      '',
      'E quem não sabe…',
      'compara preço.',
      '',
      'Faz sentido?',
    ],
    primary: { label: 'Continuar', action: 'next' },
  },
  {
    lines: [
      'Agora pensa comigo:',
      '',
      'E se, antes da conversa…',
      '',
      'a pessoa já chegasse diferente?',
      '',
      'Já com noção de rotina e ocasião',
      'Já alinhada com frescor ou intensidade',
      'E mais pronta pra uma indicação consultiva',
    ],
    primary: { label: 'Quero entender isso', action: 'next' },
  },
  {
    lines: [
      'Em vez de explicar tudo no direct ou no WhatsApp…',
      '',
      'você começa com perguntas simples, mas certas.',
      '',
      'Perguntas que fazem a pessoa parar',
      'e pensar em uso, preferência e orçamento',
    ],
    primary: { label: 'Continuar', action: 'next' },
  },
  {
    lines: [
      'Mas e se você travar na hora de montar isso?',
      '',
      'É aqui que entra o Noel.',
      '',
      'Ele monta isso com você:',
      '',
      'perguntas certas',
      'diagnóstico pronto',
      'mensagem alinhada',
      '',
      'Sem complicação.',
    ],
    primary: { label: 'Continuar e ver na prática', action: 'demo-modal' },
    secondary: { label: 'Continuar', action: 'next' },
  },
  {
    lines: [
      'Você pode escrever algo como:',
      '',
      '“Quero qualificar quem chega pedindo indicação sem contexto, antes do WhatsApp”',
      '',
      'E o Noel te entrega, em segundos:',
      '',
      'perguntas prontas',
      'sequência lógica',
      'estrutura fácil de usar',
      '',
      'Você só ajusta e usa.',
    ],
    primary: { label: 'Continuar', action: 'next' },
  },
  {
    lines: [
      'Enquanto a pessoa responde…',
      '',
      'ela vai clareando o que busca',
      '',
      'Antes mesmo de te chamar',
      '',
      'E o WhatsApp já começa com contexto',
    ],
    primary: { label: 'Continuar', action: 'next' },
  },
  {
    lines: [
      'Depois disso, é só compartilhar o link.',
      '',
      'No Instagram',
      'no WhatsApp',
      'ou nos seus anúncios',
    ],
    primary: { label: 'Continuar', action: 'next' },
  },
  {
    lines: [
      'Quem entra responde às perguntas.',
      '',
      'E começa a enxergar preferências que antes não nomeava.',
      '',
      'Antes mesmo de falar com você.',
    ],
    primary: { label: 'Continuar', action: 'next' },
  },
  {
    lines: [
      'O que isso muda no seu dia a dia:',
      '',
      'menos gente sumindo depois da primeira mensagem',
      'menos curioso pedindo preço no escuro',
      'mais clareza quando você abre o WhatsApp',
      'mais chance de venda consultiva e fidelização',
      '',
      'E menos esforço repetitivo pra você.',
    ],
    primary: { label: 'Quero testar isso', action: 'next' },
  },
  {
    lines: [
      'Você não precisa explicar tudo no primeiro contato.',
      '',
      'Precisa fazer o cliente chegar melhor.',
      '',
      'Mais de 3.000 profissionais já testaram o YLADA.',
      '',
      'Você pode começar com fluxo pronto',
      'ou adaptar do seu jeito.',
      '',
      'E se travar… o Noel te ajuda.',
    ],
    primary: {
      label: 'Gostei, quero começar grátis agora',
      action: 'href',
      href: CADASTRO_HREF,
    },
  },
]

export default function PerfumariaEntradaSocraticaContent() {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const { user, loading } = useAuth()
  const [step, setStep] = useState(0)
  const [authTimeout, setAuthTimeout] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const [demoPhase, setDemoPhase] = useState<'local' | 'nicho' | 'intro'>('local')
  const [demoLocalChoice, setDemoLocalChoice] = useState<string | null>(null)
  const [demoNichoChoice, setDemoNichoChoice] = useState<string | null>(null)

  const isPerfumariaRoot = pathname === '/pt/perfumaria' || pathname.startsWith('/pt/perfumaria?')

  useEffect(() => {
    const id = setTimeout(() => setAuthTimeout(true), 800)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (loading || !isPerfumariaRoot) return
    if (user) {
      router.replace('/pt/perfumaria/home')
    }
  }, [loading, user, router, isPerfumariaRoot])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    if (!demoOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDemoOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [demoOpen])

  useEffect(() => {
    if (demoOpen) {
      setDemoPhase('local')
      setDemoLocalChoice(null)
      setDemoNichoChoice(null)
    }
  }, [demoOpen])

  useEffect(() => {
    if (!isPerfumariaRoot) return
    try {
      if (sessionStorage.getItem(STORAGE_KEY_PERFUMARIA_CONTINUAR_TOUR) === '1') {
        sessionStorage.removeItem(STORAGE_KEY_PERFUMARIA_CONTINUAR_TOUR)
        setStep(PERFUMARIA_LANDING_STEP_APOS_DEMO)
      }
    } catch {
      /* storage indisponível */
    }
  }, [isPerfumariaRoot])

  const goNext = useCallback(() => {
    setStep((s) => {
      if (s === 6) return Math.min(8, STEPS.length - 1)
      return Math.min(s + 1, STEPS.length - 1)
    })
  }, [])

  const pickDemoLocal = useCallback((value: string) => {
    trackEvent('perfumaria_demo_local', { area: 'perfumaria', opcao: value })
    try {
      sessionStorage.setItem(STORAGE_KEY_PERFUMARIA_DEMO_LOCAL, value)
    } catch {
      /* storage indisponível */
    }
    setDemoLocalChoice(value)
    setDemoPhase('nicho')
  }, [])

  const pickDemoNicho = useCallback((value: string) => {
    trackEvent('perfumaria_demo_nicho', { area: 'perfumaria', opcao: value })
    try {
      sessionStorage.setItem(STORAGE_KEY_PERFUMARIA_DEMO_NICHO, value)
    } catch {
      /* storage indisponível */
    }
    setDemoNichoChoice(value)
    setDemoPhase('intro')
  }, [])

  const startDemoQuiz = useCallback(() => {
    if (!demoLocalChoice || !demoNichoChoice) return
    trackEvent('perfumaria_demo_inicio', {
      area: 'perfumaria',
      opcao: demoLocalChoice,
      segmento: demoNichoChoice,
    })
    setDemoOpen(false)
    router.push(`${PERFUMARIA_DEMO_CLIENTE_BASE_PATH}?nicho=${encodeURIComponent(demoNichoChoice)}`)
  }, [demoLocalChoice, demoNichoChoice, router])

  const onChoicePick = useCallback(
    (choice: ChoiceItem) => {
      trackEvent('perfumaria_landing_escolha_inicial', { opcao: choice.analyticsValue, area: 'perfumaria' })
      try {
        sessionStorage.setItem('ylada_perfumaria_entrada_opcao', choice.analyticsValue)
      } catch {
        /* storage indisponível */
      }
      goNext()
    },
    [goNext]
  )

  const progress = useMemo(() => ((step + 1) / TOTAL_STEPS) * 100, [step])
  const body = STEPS[step]

  const showAuthLoading = loading && isPerfumariaRoot && !authTimeout
  if (showAuthLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-white">
        <p className="text-gray-500 text-sm">Carregando…</p>
      </div>
    )
  }

  if (user && isPerfumariaRoot) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-white">
        <p className="text-gray-500 text-sm">Redirecionando…</p>
      </div>
    )
  }

  const runPrimary = () => {
    const p = body.primary
    if (!p) return
    if (p.action === 'next') goNext()
    else if (p.action === 'href' && p.href) router.push(p.href)
    else if (p.action === 'open-exemplo') setDemoOpen(true)
    else if (p.action === 'demo-modal') setDemoOpen(true)
  }

  const runSecondary = () => {
    if (!body.secondary) return
    if (body.secondary.action === 'next') goNext()
    else if (body.secondary.action === 'open-exemplo') setDemoOpen(true)
    else if (body.secondary.action === 'demo-modal') setDemoOpen(true)
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-white text-gray-900 estetica-touch supports-[height:100svh]:h-[100svh] supports-[height:100svh]:max-h-[100svh]">
      <header className="sticky top-0 z-20 shrink-0 border-b border-gray-100/80 bg-white/95 backdrop-blur-sm pt-[env(safe-area-inset-top,0px)]">
        <div className="h-0.5 w-full bg-gray-100 overflow-hidden" aria-hidden>
          <div
            className="h-full bg-blue-600 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/pt"
            className="inline-flex touch-manipulation min-h-[48px] min-w-[48px] items-center justify-center -ml-1"
            aria-label="YLADA início"
          >
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/pt/perfumaria/login"
              className="text-gray-500 hover:text-gray-900 font-medium min-h-[48px] inline-flex items-center px-2 -mr-2"
            >
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-4 sm:px-6 py-6 max-w-lg mx-auto w-full estetica-safe-main-bottom">
        <div
          key={step}
          className="animate-fade-in-up flex flex-col pb-2"
          role="region"
          aria-live="polite"
        >
          <div className="space-y-6 sm:space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Perfumaria</p>
            <div className="text-lg sm:text-xl text-gray-800 leading-relaxed font-medium tracking-tight space-y-4">
              {body.lines.map((line, i) => (
                <p key={i} className={line === '' ? 'h-2' : ''}>
                  {line}
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {body.choices ? (
                body.choices.map((c) => (
                  <button
                    key={c.analyticsValue}
                    type="button"
                    onClick={() => onChoicePick(c)}
                    className="w-full min-h-[48px] rounded-2xl border-2 border-gray-300 bg-slate-50/90 px-5 py-3.5 text-base font-semibold text-gray-900 shadow-sm shadow-gray-900/5 hover:border-gray-500 hover:bg-white hover:shadow-md active:scale-[0.99] transition-all text-left"
                  >
                    {c.label}
                  </button>
                ))
              ) : body.primary ? (
                <button
                  type="button"
                  onClick={runPrimary}
                  className="w-full min-h-[52px] rounded-2xl bg-blue-600 px-5 py-3.5 text-base font-semibold text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-600/20 transition-colors"
                >
                  {body.primary.label}
                </button>
              ) : null}

              {body.secondary && !body.choices && (
                <button
                  type="button"
                  onClick={runSecondary}
                  className="w-full min-h-[48px] rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-800 py-2 touch-manipulation"
                >
                  {body.secondary.label}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {demoOpen && (
        <div className="fixed inset-0 z-30 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="demo-title">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fechar"
            onClick={() => setDemoOpen(false)}
          />
          <div className="relative flex min-h-full max-h-[100dvh] items-center justify-center p-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none sm:py-8 supports-[height:100svh]:max-h-[100svh]">
            <div className="pointer-events-auto w-full max-w-md max-h-[min(90dvh,640px)] overflow-y-auto overscroll-y-contain bg-white rounded-2xl p-6 estetica-safe-modal-bottom shadow-2xl border border-gray-200 animate-fade-in-up estetica-touch supports-[height:100svh]:max-h-[min(90svh,640px)]">
              {demoPhase === 'local' ? (
                <>
                  <h2 id="demo-title" className="text-lg font-semibold text-gray-900">
                    Onde você atua com perfumaria?
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Escolha o contexto. Na próxima tela você define o foco do exemplo.
                  </p>
                  <div className="mt-5 flex flex-col gap-2">
                    {PERFUMARIA_DEMO_LOCAIS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => pickDemoLocal(opt.value)}
                        className="w-full min-h-[48px] rounded-xl border-2 border-gray-300 bg-slate-50/90 px-4 py-3 text-left text-sm font-semibold text-gray-900 shadow-sm shadow-gray-900/5 hover:border-gray-500 hover:bg-white hover:shadow-md"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDemoOpen(false)}
                    className="mt-4 w-full min-h-[44px] rounded-xl text-sm font-medium text-gray-500 hover:text-gray-800"
                  >
                    Fechar
                  </button>
                </>
              ) : demoPhase === 'nicho' ? (
                <>
                  <h2 id="demo-title" className="text-lg font-semibold text-gray-900">
                    Qual foco do exemplo?
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Fluxo curto só para demonstração. Não substitui prova na pele nem avaliação de alergia.
                  </p>
                  <div className="mt-5 flex flex-col gap-2">
                    {PERFUMARIA_DEMO_CLIENTE_NICHOS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => pickDemoNicho(opt.value)}
                        className="w-full min-h-[48px] rounded-xl border-2 border-gray-300 bg-slate-50/90 px-4 py-3 text-left text-sm font-semibold text-gray-900 shadow-sm shadow-gray-900/5 hover:border-gray-500 hover:bg-white hover:shadow-md"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDemoPhase('local')}
                    className="mt-4 w-full min-h-[44px] rounded-xl text-gray-600 font-medium hover:bg-gray-50 text-sm"
                  >
                    ← Voltar
                  </button>
                </>
              ) : (
                <>
                  <h2 id="demo-title" className="text-lg font-semibold text-gray-900">
                    Só falta começar
                  </h2>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    Responda como o cliente responderia. O restante você vê na sequência.
                  </p>
                  <div className="mt-6 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={startDemoQuiz}
                      disabled={!demoLocalChoice || !demoNichoChoice}
                      className="w-full min-h-[48px] rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Começar experiência
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoPhase('nicho')}
                      className="w-full min-h-[44px] rounded-xl text-gray-600 font-medium hover:bg-gray-50 text-sm"
                    >
                      ← Voltar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
