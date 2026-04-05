'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

type StepId =
  | 'intro'
  | 'w1'
  | 'w2'
  | 'w3'
  | 'w4'
  | 'w5'
  | 'w6'
  | 'w7'
  | 'w8'
  | 'offer_noel'
  | 'n1'
  | 'n2'
  | 'n3'
  | 'n4'
  | 'n5'
  | 'n6'
  | 'n7'
  | 'result'

type Opt = { id: string; label: string }

const CORE_STEPS: Array<{ key: string; title: string; options: Opt[] }> = [
  {
    key: 'usage_description',
    title: 'Hoje, como você descreveria seu uso do YLADA?',
    options: [
      { id: 'frequencia', label: 'Uso com frequência' },
      { id: 'as_vezes', label: 'Uso às vezes' },
      { id: 'parei', label: 'Já usei, mas parei' },
      { id: 'nunca', label: 'Ainda não usei' },
    ],
  },
  {
    key: 'last_week',
    title: 'Na última semana, você chegou a usar o YLADA em algum momento?',
    options: [
      { id: 'mais_uma', label: 'Sim, mais de uma vez' },
      { id: 'uma_vez', label: 'Sim, uma vez' },
      { id: 'nao_usei', label: 'Não usei' },
    ],
  },
  {
    key: 'shared_link',
    title: 'Você já compartilhou seu link com alguém?',
    options: [
      { id: 'varias_algumas', label: 'Sim — várias ou algumas vezes' },
      { id: 'uma_vez', label: 'Uma vez só' },
      { id: 'nao', label: 'Ainda não' },
    ],
  },
  {
    key: 'diagnosis_replies',
    title: 'Alguma pessoa já respondeu seu diagnóstico?',
    options: [
      { id: 'varias_algumas', label: 'Sim — várias ou algumas' },
      { id: 'poucas', label: 'Poucas' },
      { id: 'nenhuma', label: 'Nenhuma' },
    ],
  },
  {
    key: 'works_best',
    title: 'Na sua visão, o YLADA funciona melhor quando:',
    options: [
      { id: 'consistente', label: 'É usado de forma consistente' },
      { id: 'quando_da', label: 'É usado só quando dá tempo' },
      { id: 'nao_sei', label: 'Não sei ao certo' },
    ],
  },
  {
    key: 'level_using',
    title: 'Hoje, você sente que está usando o YLADA no nível que poderia?',
    options: [
      { id: 'sim', label: 'Sim' },
      { id: 'mais_ou_menos', label: 'Mais ou menos' },
      { id: 'nao', label: 'Não' },
    ],
  },
  {
    key: 'more_frequency_effect',
    title: 'Se você usasse o YLADA com mais frequência, o que você acredita que poderia acontecer?',
    options: [
      { id: 'conversas', label: 'Gerar mais conversas' },
      { id: 'preparados', label: 'Atrair clientes mais preparados' },
      { id: 'consistencia', label: 'Ter mais consistência' },
      { id: 'nao_sei', label: 'Não sei' },
    ],
  },
  {
    key: 'help_use_more',
    title: 'O que mais te ajudaria a usar com mais frequência?',
    options: [
      { id: 'passo_diario', label: 'Ter um passo simples diário' },
      { id: 'entender', label: 'Entender melhor como usar' },
      { id: 'resultados', label: 'Ver mais resultados rápidos' },
      { id: 'habito', label: 'Criar o hábito' },
    ],
  },
]

const NOEL_STEPS: Array<{ key: string; title: string; options: Opt[] }> = [
  {
    key: 'noel_frequency',
    title: 'Como você descreveria seu uso do Noel dentro do YLADA?',
    options: [
      { id: 'frequente', label: 'Uso com frequência' },
      { id: 'algumas', label: 'Já usei algumas vezes' },
      { id: 'pouco', label: 'Usei pouco ou raramente' },
      { id: 'nao_uso', label: 'Não uso ou não lembro' },
    ],
  },
  {
    key: 'noel_purpose',
    title: 'Em geral, para que você mais usa o Noel?',
    options: [
      { id: 'diagnosticos', label: 'Para criar diagnósticos' },
      { id: 'falar', label: 'Para ter ideias do que falar para clientes' },
      { id: 'duvidas', label: 'Para tirar dúvidas' },
      { id: 'organizar', label: 'Para organizar o que fazer' },
      { id: 'nao_claro', label: 'Ainda não usei com clareza' },
    ],
  },
  {
    key: 'noel_helped',
    title: 'O Noel já te ajudou de alguma forma prática?',
    options: [
      { id: 'bastante', label: 'Sim, me ajudou bastante' },
      { id: 'pouco', label: 'Ajudou um pouco' },
      { id: 'pouca_dif', label: 'Não fez muita diferença' },
      { id: 'nao_suficiente', label: 'Ainda não usei o suficiente' },
    ],
  },
  {
    key: 'noel_easier',
    title: 'Depois de usar o Noel, você sentiu que ficou mais fácil:',
    options: [
      { id: 'atrair', label: 'Criar algo para atrair clientes' },
      { id: 'falar', label: 'Saber o que falar' },
      { id: 'organizar', label: 'Organizar minhas ações' },
      { id: 'nao_senti', label: 'Ainda não senti diferença' },
    ],
  },
  {
    key: 'noel_potential',
    title: 'Hoje, você sente que está aproveitando todo o potencial do Noel?',
    options: [
      { id: 'sim', label: 'Sim' },
      { id: 'mais_ou_menos', label: 'Mais ou menos' },
      { id: 'nao', label: 'Não' },
    ],
  },
]

const NOEL_BARRIER_OPTS: Opt[] = [
  { id: 'esqueco', label: 'Esqueço que ele está ali' },
  { id: 'nao_sei', label: 'Não sei exatamente como usar' },
  { id: 'habito', label: 'Não tenho o hábito' },
  { id: 'resultado', label: 'Não vi tanto resultado ainda' },
  { id: 'tempo', label: 'Falta de tempo' },
  { id: 'outro', label: 'Outro' },
]

function coreStepIndex(s: StepId): number {
  if (s.startsWith('w')) return parseInt(s.slice(1), 10) - 1
  return -1
}

function noelStepIndex(s: StepId): number {
  if (s.startsWith('n') && s !== 'n6' && s !== 'n7' && s !== 'offer_noel') {
    const n = parseInt(s.slice(1), 10)
    if (n >= 1 && n <= 5) return n - 1
  }
  return -1
}

const btnChoice =
  'w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors border-gray-200 bg-white text-gray-950 hover:border-sky-300'

export default function UsoWellnessSurveyPage() {
  const [step, setStep] = useState<StepId>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [noelRating, setNoelRating] = useState<number | null>(null)
  const [noelImprove, setNoelImprove] = useState('')
  const [noelOneLine, setNoelOneLine] = useState('')
  const [noelBarrierOther, setNoelBarrierOther] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const submittedRef = useRef(false)
  const [tookNoel, setTookNoel] = useState(false)

  const buildPayload = useCallback(() => {
    const core: Record<string, string> = {}
    for (const row of CORE_STEPS) {
      const v = answers[row.key]
      if (!v) return null
      core[row.key] = v
    }
    if (!tookNoel) {
      return { optional_noel: false, answers: core }
    }
    for (const row of NOEL_STEPS) {
      const v = answers[row.key]
      if (!v) return null
      core[row.key] = v
    }
    const b = answers.noel_barrier
    if (!b) return null
    if (noelRating === null || noelRating < 1 || noelRating > 5) return null
    const payload: Record<string, unknown> = {
      ...core,
      noel_barrier: b,
      noel_rating: noelRating,
      noel_improve: noelImprove.trim(),
      noel_one_line: noelOneLine.trim(),
    }
    if (b === 'outro') {
      payload.noel_barrier_other = noelBarrierOther.trim()
    }
    return { optional_noel: true, answers: payload }
  }, [answers, tookNoel, noelRating, noelImprove, noelOneLine, noelBarrierOther])

  useEffect(() => {
    if (step !== 'result' || submittedRef.current) return
    const payload = buildPayload()
    if (!payload) return
    submittedRef.current = true
    fetch('/api/ylada/uso-wellness-v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setSavedId(data.id ?? null)
        else setSubmitError(data.error || 'Não foi possível salvar.')
      })
      .catch(() => setSubmitError('Erro de rede.'))
  }, [step, buildPayload])

  const wi = coreStepIndex(step)
  const ni = noelStepIndex(step)
  const coreProg =
    wi >= 0 ? { n: wi + 1, total: CORE_STEPS.length } : null
  const noelProg =
    step === 'n6'
      ? { n: 6, total: 7 }
      : step === 'n7'
        ? { n: 7, total: 7 }
        : ni >= 0
          ? { n: ni + 1, total: 7 }
          : null

  const showCoreBar = coreProg !== null
  const showNoelBar = noelProg !== null && tookNoel

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 text-gray-950 [color-scheme:light]">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12 pb-24">
        {showCoreBar && coreProg && (
          <div className="mb-6">
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-600 transition-all duration-300"
                style={{ width: `${(coreProg.n / coreProg.total) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Passo {coreProg.n} de {coreProg.total}
            </p>
          </div>
        )}

        {showNoelBar && noelProg && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-sky-800 text-center mb-1">Sobre o Noel (opcional)</p>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-300"
                style={{ width: `${(noelProg.n / noelProg.total) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Complemento {noelProg.n} de {noelProg.total}
            </p>
          </div>
        )}

        {step === 'intro' && (
          <div className="space-y-6 animate-in fade-in duration-300 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Pesquisa de uso · YLADA · Wellness</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Ajude-nos a melhorar o produto</h1>
            <p className="text-base sm:text-lg text-gray-600 leading-snug">
              Pesquisa para quem usa o YLADA no contexto wellness. Poucos minutos, anônima.
            </p>
            <button
              type="button"
              onClick={() => setStep('w1')}
              className="w-full min-h-[52px] rounded-2xl bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700 transition-colors"
            >
              Começar
            </button>
            <p className="text-xs text-gray-500">
              Não pedimos nome nem e-mail. Usamos as respostas só para melhorar a experiência no YLADA.
            </p>
          </div>
        )}

        {wi >= 0 && wi < CORE_STEPS.length && (
          <ChoiceBlock
            title={CORE_STEPS[wi].title}
            options={CORE_STEPS[wi].options}
            onBack={() => (wi === 0 ? setStep('intro') : setStep(`w${wi}` as StepId))}
            onPick={(id) => {
              const key = CORE_STEPS[wi].key
              setAnswers((a) => ({ ...a, [key]: id }))
              if (wi === CORE_STEPS.length - 1) setStep('offer_noel')
              else setStep(`w${wi + 2}` as StepId)
            }}
          />
        )}

        {step === 'offer_noel' && (
          <QuestionCard
            title="Quer responder algumas perguntas rápidas sobre o Noel?"
            subtitle="É opcional e leva poucos minutos a mais."
            onBack={() => setStep('w8')}
          >
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTookNoel(true)
                  setStep('n1')
                }}
                className="min-h-[52px] rounded-2xl border-2 border-sky-600 bg-sky-50 py-3 text-base font-semibold text-sky-950 hover:bg-sky-100"
              >
                Sim, quero continuar
              </button>
              <button
                type="button"
                onClick={() => {
                  setTookNoel(false)
                  setStep('result')
                }}
                className="min-h-[52px] rounded-2xl border-2 border-gray-200 bg-white py-3 text-base font-semibold text-gray-950 hover:border-sky-300"
              >
                Não, finalizar agora
              </button>
            </div>
          </QuestionCard>
        )}

        {ni >= 0 && ni < NOEL_STEPS.length && (
          <ChoiceBlock
            title={NOEL_STEPS[ni].title}
            options={NOEL_STEPS[ni].options}
            onBack={() => (ni === 0 ? setStep('offer_noel') : setStep(`n${ni}` as StepId))}
            onPick={(id) => {
              const key = NOEL_STEPS[ni].key
              setAnswers((a) => ({ ...a, [key]: id }))
              setStep(`n${ni + 2}` as StepId)
            }}
          />
        )}

        {step === 'n6' && (
          <QuestionCard title="O que mais te impede de usar mais o Noel?" onBack={() => setStep('n5')}>
            <div className="space-y-2">
              {NOEL_BARRIER_OPTS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={btnChoice}
                  onClick={() => {
                    setAnswers((a) => ({ ...a, noel_barrier: o.id }))
                    if (o.id !== 'outro') {
                      setNoelBarrierOther('')
                      setStep('n7')
                    }
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {answers.noel_barrier === 'outro' && (
              <div className="mt-4 space-y-2">
                <label className="block text-xs font-medium text-gray-600">Descreva em uma linha</label>
                <input
                  type="text"
                  value={noelBarrierOther}
                  onChange={(e) => setNoelBarrierOther(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-950"
                  placeholder="Ex.: integração com outro app"
                />
                <button
                  type="button"
                  disabled={noelBarrierOther.trim().length < 2}
                  onClick={() => setStep('n7')}
                  className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            )}
          </QuestionCard>
        )}

        {step === 'n7' && (
          <QuestionCard title="Para fechar: avaliação e sugestões sobre o Noel" onBack={() => setStep('n6')}>
            <p className="text-sm text-gray-600">De forma geral, como você avalia o Noel?</p>
            <p className="text-xs text-gray-500 mt-1">(1 = Nada satisfeito, 5 = Muito satisfeito)</p>
            <div className="flex justify-center gap-1.5 py-3" role="group" aria-label="Nota de 1 a 5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNoelRating(n)}
                  className="rounded-xl p-2 text-3xl leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  aria-label={`Nota ${n}`}
                >
                  <span className={noelRating !== null && n <= noelRating ? 'text-amber-400' : 'text-gray-300'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <label className="block text-xs font-medium text-gray-600 mt-4">
              Se o Noel pudesse melhorar em algo, o que você gostaria? (opcional)
            </label>
            <textarea
              value={noelImprove}
              onChange={(e) => setNoelImprove(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-950"
              placeholder="Sua sugestão..."
            />
            <label className="block text-xs font-medium text-gray-600 mt-3">
              Se você pudesse resumir o Noel em uma frase hoje, qual seria? (opcional)
            </label>
            <textarea
              value={noelOneLine}
              onChange={(e) => setNoelOneLine(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-950"
              placeholder="Uma frase..."
            />
            <button
              type="button"
              disabled={noelRating === null}
              onClick={() => setStep('result')}
              className="mt-6 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Enviar
            </button>
          </QuestionCard>
        )}

        {step === 'result' && (
          <div className="space-y-6 animate-in fade-in duration-500 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Pesquisa · Wellness</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              Obrigado por dedicar esse tempo.
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Suas respostas ajudam a melhorar ainda mais a experiência dentro do YLADA. A gente valoriza muito isso.
            </p>
            {submitError && <p className="text-xs text-amber-700">{submitError}</p>}
            {savedId && !submitError && (
              <p className="text-xs text-emerald-700">Resposta registrada. Obrigado por ajudar.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ChoiceBlock({
  title,
  options,
  onPick,
  onBack,
}: {
  title: string
  options: Opt[]
  onPick: (id: string) => void
  onBack: () => void
}) {
  return (
    <QuestionCard title={title} onBack={onBack}>
      <div className="space-y-2">
        {options.map((o) => (
          <button key={o.id} type="button" className={btnChoice} onClick={() => onPick(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
    </QuestionCard>
  )
}

function QuestionCard({
  title,
  subtitle,
  children,
  onBack,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  onBack: () => void
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <button type="button" onClick={onBack} className="text-sm font-medium text-sky-700 hover:underline">
        ← Voltar
      </button>
      <h2 className="text-lg sm:text-xl font-bold text-gray-950 leading-snug">{title}</h2>
      {subtitle ? <p className="text-sm text-gray-600 -mt-2">{subtitle}</p> : null}
      {children}
    </div>
  )
}
