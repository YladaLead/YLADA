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
  | 'w9'
  | 'w10'
  | 'core_open'
  | 'n1'
  | 'n2'
  | 'n3'
  | 'n4'
  | 'n5'
  | 'n6'
  | 'n7'
  | 'result'

type Opt = { id: string; label: string }

/** 10 escolhas + 1 aberta: resultado → hábitos → barreira; reflexão + dados para produto. */
const CORE_STEPS: Array<{ key: string; title: string; subtitle?: string; options: Opt[] }> = [
  {
    key: 'result_conversations',
    title: 'Hoje você sente que o YLADA te ajuda a ter mais conversas com pessoas interessadas no que você oferece?',
    options: [
      { id: 'sim', label: 'Sim' },
      { id: 'nao', label: 'Não' },
      { id: 'nao_sei', label: 'Ainda não sei' },
    ],
  },
  {
    key: 'result_organized',
    title: 'Você sente mais clareza no que fazer com leads e acompanhamentos?',
    options: [
      { id: 'sim', label: 'Sim' },
      { id: 'nao', label: 'Não' },
      { id: 'mais_ou_menos', label: 'Mais ou menos' },
    ],
  },
  {
    key: 'weekly_usage',
    title: 'Quantas vezes por semana você usa o YLADA?',
    options: [
      { id: '1_a_2', label: 'De 1 a 2 vezes' },
      { id: '3_a_4', label: 'De 3 a 4 vezes' },
      { id: 'acima_5', label: 'Acima de 5 vezes' },
    ],
  },
  {
    key: 'links_count',
    title: 'Quantos links você está usando?',
    options: [
      { id: '1_a_2', label: 'De um a dois' },
      { id: '3_a_5', label: 'De três a cinco' },
      { id: 'acima_5', label: 'Acima de cinco' },
    ],
  },
  {
    key: 'share_link_doubts',
    title: 'Tem dúvidas na hora de compartilhar o link ou sobre com quem compartilhar?',
    options: [
      { id: 'sim', label: 'Sim' },
      { id: 'nao', label: 'Não' },
    ],
  },
  {
    key: 'asked_noel_before',
    title: 'Antes de mandar mensagem ou postar, você costuma perguntar ao Noel o que fazer ou o que escrever?',
    options: [
      { id: 'sim', label: 'Sim' },
      { id: 'nao', label: 'Não' },
      { id: 'as_vezes', label: 'Às vezes' },
    ],
  },
  {
    key: 'shared_link_week',
    title: 'Na última semana, você compartilhou o link do seu diagnóstico com alguém?',
    options: [
      { id: 'sim', label: 'Sim' },
      { id: 'nao', label: 'Não' },
    ],
  },
  {
    key: 'followup_after_reply',
    title: 'Quando alguém respondeu ao diagnóstico, você deu continuidade (mensagem ou acompanhamento)?',
    options: [
      { id: 'sim', label: 'Sim' },
      { id: 'nao', label: 'Não' },
      { id: 'sem_resposta', label: 'Ainda não tive resposta' },
    ],
  },
  {
    key: 'uses_noel_weekly',
    title: 'Você usa o Noel pelo menos uma vez por semana?',
    options: [
      { id: 'sim', label: 'Sim' },
      { id: 'nao', label: 'Não' },
      { id: 'as_vezes', label: 'Às vezes' },
    ],
  },
  {
    key: 'main_barrier',
    title: 'O que mais te impede de usar o link e o Noel com mais frequência?',
    options: [
      { id: 'esqueco', label: 'Esqueço de abrir o app' },
      { id: 'tempo', label: 'Falta de tempo' },
      { id: 'nao_sei_como', label: 'Não sei exatamente como usar' },
      { id: 'pouco_resultado', label: 'Sinto pouco resultado até agora' },
      { id: 'habito', label: 'Falta de hábito / rotina' },
      { id: 'outro', label: 'Outro motivo' },
    ],
  },
]

const CORE_TOTAL_STEPS = CORE_STEPS.length + 1

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

function coreChoiceIndex(s: StepId): number {
  if (!s.startsWith('w')) return -1
  const n = parseInt(s.slice(1), 10)
  if (n < 1 || n > CORE_STEPS.length) return -1
  return n - 1
}

function coreProgress(step: StepId): { n: number; total: number } | null {
  if (step === 'core_open') return { n: CORE_TOTAL_STEPS, total: CORE_TOTAL_STEPS }
  const wi = coreChoiceIndex(step)
  if (wi >= 0) return { n: wi + 1, total: CORE_TOTAL_STEPS }
  return null
}

function noelStepIndex(s: StepId): number {
  if (s.startsWith('n') && s !== 'n6' && s !== 'n7') {
    const n = parseInt(s.slice(1), 10)
    if (n >= 1 && n <= 5) return n - 1
  }
  return -1
}

const btnChoice =
  'w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors border-gray-200 bg-white text-gray-950 hover:border-sky-300'

function isLikelyNetworkSubmitError(msg: string): boolean {
  return /fetch failed|não conseguiu conectar ao Supabase|ECONNREFUSED|ENOTFOUND|getaddrinfo|rede \(não chegou/i.test(
    msg
  )
}

function SubmitErrorHint({ submitError }: { submitError: string }) {
  const network = isLikelyNetworkSubmitError(submitError)
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div className="text-left space-y-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-3">
      <p className="text-xs text-amber-900 whitespace-pre-wrap break-words">{submitError}</p>
      {network ? (
        <p className="text-[11px] text-amber-800/90 leading-relaxed">
          {isDev ? (
            <>
              Isso não é pergunta em branco: o processo do Next não completou o HTTP até o host do Supabase. Confira
              se a URL no <code className="rounded bg-amber-100/80 px-1">.env.local</code> está certa, teste sem VPN,
              e veja o mesmo erro no <strong>terminal do next dev</strong>. Opcional:{' '}
              <code className="rounded bg-amber-100/80 px-1 text-[10px]">curl -I &quot;$NEXT_PUBLIC_SUPABASE_URL&quot;</code>{' '}
              no terminal (com a variável exportada).
            </>
          ) : (
            <>Pode ser instabilidade de rede ou manutenção. Tente de novo em alguns minutos ou outra conexão.</>
          )}
        </p>
      ) : (
        <p className="text-[11px] text-amber-800/90 leading-relaxed">
          Se a mensagem acima citar tabela, RLS ou chave <span className="font-mono">service_role</span>, é
          configuração do Supabase — não falta de resposta no formulário. Caso contrário, confira se respondeu todas as
          opções e, se marcou “Outro” na barreira do Noel, preencheu a linha de texto (campos longos opcionais podem
          ficar vazios).
        </p>
      )}
    </div>
  )
}

export default function UsoWellnessSurveyPage() {
  const [step, setStep] = useState<StepId>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [openSuggestion, setOpenSuggestion] = useState('')
  const [noelImprove, setNoelImprove] = useState('')
  const [noelOneLine, setNoelOneLine] = useState('')
  const [noelBarrierOther, setNoelBarrierOther] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const submittedRef = useRef(false)

  const buildPayload = useCallback(() => {
    const core: Record<string, unknown> = {}
    for (const row of CORE_STEPS) {
      const v = answers[row.key]
      if (!v) return null
      core[row.key] = v
    }
    core.open_suggestion = openSuggestion.trim()

    for (const row of NOEL_STEPS) {
      const v = answers[row.key]
      if (!v) return null
      core[row.key] = v
    }
    const b = answers.noel_barrier
    if (!b) return null
    const payload: Record<string, unknown> = {
      ...core,
      noel_barrier: b,
      noel_improve: noelImprove.trim(),
      noel_one_line: noelOneLine.trim(),
    }
    if (b === 'outro') {
      payload.noel_barrier_other = noelBarrierOther.trim()
    }
    return { optional_noel: true, answers: payload }
  }, [answers, noelImprove, noelOneLine, noelBarrierOther, openSuggestion])

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
      .then(async (r) => {
        let data: { success?: boolean; error?: string; id?: string } = {}
        try {
          data = await r.json()
        } catch {
          if (process.env.NODE_ENV === 'development') {
            console.error('[uso-wellness-v1] Corpo da resposta não é JSON', r.status, r.statusText)
          }
          setSubmitError('Erro de rede.')
          return
        }
        if (process.env.NODE_ENV === 'development' && !data.success) {
          console.warn('[uso-wellness-v1] POST não salvou', {
            httpStatus: r.status,
            error: data.error,
            debug: (data as { debug?: unknown }).debug,
          })
        }
        if (data.success) setSavedId(data.id ?? null)
        else setSubmitError(data.error || 'Não foi possível salvar.')
      })
      .catch((e) => {
        if (process.env.NODE_ENV === 'development') console.error('[uso-wellness-v1]', e)
        setSubmitError('Erro de rede.')
      })
  }, [step, buildPayload])

  const wi = coreChoiceIndex(step)
  const ni = noelStepIndex(step)
  const coreProg = coreProgress(step)
  const noelProg =
    step === 'n6'
      ? { n: 6, total: 7 }
      : step === 'n7'
        ? { n: 7, total: 7 }
        : ni >= 0
          ? { n: ni + 1, total: 7 }
          : null

  const showCoreBar = coreProg !== null
  const showNoelBar = noelProg !== null

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
            <p className="text-xs font-semibold text-sky-800 text-center mb-1">Sobre o Noel</p>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-300"
                style={{ width: `${(noelProg.n / noelProg.total) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Passo {noelProg.n} de {noelProg.total}
            </p>
          </div>
        )}

        {step === 'intro' && (
          <div className="flex flex-col items-stretch gap-6 animate-in fade-in duration-300 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Ajude-nos a melhorar</h1>
            <button
              type="button"
              onClick={() => setStep('w1')}
              className="w-full min-h-[52px] rounded-2xl bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700 transition-colors"
            >
              Começar
            </button>
            <p className="w-full max-w-full text-xs text-gray-500 text-left leading-relaxed">
              É anônimo. Usamos as respostas apenas para melhorar.
            </p>
          </div>
        )}

        {wi >= 0 && wi < CORE_STEPS.length && (
          <ChoiceBlock
            title={CORE_STEPS[wi].title}
            subtitle={CORE_STEPS[wi].subtitle}
            options={CORE_STEPS[wi].options}
            onBack={() => (wi === 0 ? setStep('intro') : setStep(`w${wi}` as StepId))}
            onPick={(id) => {
              const key = CORE_STEPS[wi].key
              setAnswers((a) => ({ ...a, [key]: id }))
              if (wi === CORE_STEPS.length - 1) setStep('core_open')
              else setStep(`w${wi + 2}` as StepId)
            }}
          />
        )}

        {step === 'core_open' && (
          <QuestionCard
            title="Pensando na sua rotina: o que faria a maior diferença para você usar o método (link, conversas e Noel) toda semana?"
            subtitle="Opcional — mas sua opinião ajuda muito a gente a ajustar o produto."
            onBack={() => setStep('w10')}
          >
            <textarea
              value={openSuggestion}
              onChange={(e) => setOpenSuggestion(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-950"
              placeholder="Ex.: um lembrete diário, um vídeo curto, exemplo de mensagem..."
            />
            <button
              type="button"
              onClick={() => setStep('n1')}
              className="mt-4 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white"
            >
              Continuar
            </button>
          </QuestionCard>
        )}

        {ni >= 0 && ni < NOEL_STEPS.length && (
          <ChoiceBlock
            title={NOEL_STEPS[ni].title}
            options={NOEL_STEPS[ni].options}
            onBack={() => (ni === 0 ? setStep('core_open') : setStep(`n${ni}` as StepId))}
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
          <QuestionCard title="Para fechar: sugestões sobre o Noel" onBack={() => setStep('n6')}>
            <label className="block text-xs font-medium text-gray-600">
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
              onClick={() => setStep('result')}
              className="mt-6 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white"
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
            {submitError && (
              <SubmitErrorHint submitError={submitError} />
            )}
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
  subtitle,
  options,
  onPick,
  onBack,
}: {
  title: string
  subtitle?: string
  options: Opt[]
  onPick: (id: string) => void
  onBack: () => void
}) {
  return (
    <QuestionCard title={title} subtitle={subtitle} onBack={onBack}>
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
