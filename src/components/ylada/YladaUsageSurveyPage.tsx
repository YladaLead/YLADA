'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const OBJECTIVES = [
  { id: 'clientes', label: 'Conseguir mais clientes' },
  { id: 'conversao', label: 'Melhorar minha conversão' },
  { id: 'organizar', label: 'Organizar meus atendimentos' },
  { id: 'testar', label: 'Testar / entender a ferramenta' },
  { id: 'outro', label: 'Outro' },
] as const

const BLOCKERS = [
  { id: 'nao_entendi', label: 'Não entendi bem como usar' },
  { id: 'tempo', label: 'Não tive tempo' },
  { id: 'nao_compartilhei', label: 'Não compartilhei' },
  { id: 'compartilhei_sem_resposta', label: 'Compartilhei mas ninguém respondeu' },
  { id: 'nao_soube_responder', label: 'Não soube como responder depois' },
  { id: 'outro', label: 'Outro' },
] as const

type StepId = 'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'result'

const PROFILE_COPY: Record<
  '1' | '2' | '3' | '4',
  { title: string; badge: string; body: string; action: string; color: string }
> = {
  '1': {
    title: 'Seu perfil: primeiro passo do método',
    badge: 'Primeiro passo',
    body:
      'Você ainda não criou seu diagnóstico, e tudo bem. É o ponto de partida: em poucos minutos você coloca o método no ar e o Noel te orienta no que vem depois, passo a passo.',
    action:
      'Crie seu primeiro diagnóstico (menos de 2 minutos). Depois volte aqui e siga o método com calma, com o Noel ao seu lado.',
    color: 'red',
  },
  '2': {
    title: 'Seu perfil: diagnóstico pronto, hora de compartilhar',
    badge: 'Diagnóstico criado',
    body:
      'Você já criou a base. O próximo passo é colocar o link no mundo: é assim que aparecem conversas de verdade. Você não precisa adivinhar sozinho: o método te guia no envio e no que fazer em seguida.',
    action:
      'Envie seu link para 5 pessoas hoje (status do WhatsApp, contatos ou Instagram). Depois volte e conte o que aconteceu; o Noel ajuda a ajustar.',
    color: 'yellow',
  },
  '3': {
    title: 'Seu perfil: na reta do resultado',
    badge: 'Quase no resultado',
    body:
      'Você já movimentou o funil: isso conta muito. Agora o foco é conduzir a conversa com leveza: uma pergunta de cada vez, sem se sobrecarregar. O Noel te orienta na hora de responder.',
    action:
      'Responda quem te chamou com uma pergunta simples. Sem textão. Se travar, chame o Noel no app: ele te dá o próximo passo concreto.',
    color: 'orange',
  },
  '4': {
    title: 'Seu perfil: método em movimento',
    badge: 'Em movimento',
    body:
      'Você já está usando o YLADA como caminho, não como arquivo esquecido. Isso é o que destrava resultado. O próximo nível é manter o ritmo, com o Noel te ajudando a não perder o fio.',
    action:
      'Busque pelo menos uma nova conversa por dia. Com consistência e orientação, isso vira previsibilidade na agenda.',
    color: 'green',
  },
}

function profileBorder(color: string): string {
  switch (color) {
    case 'red':
      return 'border-red-200 bg-red-50/80'
    case 'yellow':
      return 'border-amber-200 bg-amber-50/80'
    case 'orange':
      return 'border-orange-200 bg-orange-50/80'
    case 'green':
      return 'border-emerald-200 bg-emerald-50/80'
    default:
      return 'border-sky-200 bg-white'
  }
}

export default function YladaUsageSurveyPage() {
  const [step, setStep] = useState<StepId>('intro')
  const [objective, setObjective] = useState<string>('')
  const [objectiveOther, setObjectiveOther] = useState('')
  const [created, setCreated] = useState<boolean | null>(null)
  const [shared, setShared] = useState<boolean | null>(null)
  const [messaged, setMessaged] = useState<boolean | null>(null)
  const [blocker, setBlocker] = useState('')
  const [blockerOther, setBlockerOther] = useState('')
  const [expectation, setExpectation] = useState('')
  const [pain, setPain] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const submittedRef = useRef(false)

  const profile = useMemo(() => {
    if (created !== true) return '1' as const
    if (shared !== true) return '2' as const
    if (messaged !== true) return '3' as const
    return '4' as const
  }, [created, shared, messaged])

  const STEP_ORDER: Record<StepId, number> = {
    intro: 0,
    q1: 1,
    q2: 2,
    q3: 3,
    q4: 4,
    q5: 5,
    q6: 6,
    q7: 7,
    result: 8,
  }
  const progressPct = (STEP_ORDER[step] / 8) * 100

  const buildPayload = useCallback(() => {
    const blockerLabel =
      blocker === 'outro' ? blockerOther.trim() : BLOCKERS.find((b) => b.id === blocker)?.label || blocker
    const createdOk = created === true
    const sharedOk = createdOk && shared === true
    const messagedOk = sharedOk && messaged === true
    return {
      objective,
      objective_other: objective === 'outro' ? objectiveOther.trim() : '',
      created_diagnosis: createdOk,
      shared_link: sharedOk,
      got_message: messagedOk,
      blocker: messagedOk ? '' : blockerLabel,
      expectation: expectation.trim(),
      pain: pain.trim(),
    }
  }, [objective, objectiveOther, created, shared, messaged, blocker, blockerOther, expectation, pain])

  useEffect(() => {
    if (step !== 'result' || submittedRef.current) return
    submittedRef.current = true
    const payload = buildPayload()
    fetch('/api/ylada/usage-survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setSavedId(data.id ?? null)
        else setSubmitError(data.error || 'Não foi possível salvar.')
      })
      .catch(() => setSubmitError('Erro de rede. Suas respostas ainda aparecem abaixo.'))
  }, [step, buildPayload])

  const pc = PROFILE_COPY[profile]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 text-gray-950 [color-scheme:light]">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12 pb-24">
        {step !== 'intro' && step !== 'result' && (
          <div className="mb-6">
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-600 transition-all duration-300"
                style={{ width: `${Math.min(100, progressPct)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">Passo {STEP_ORDER[step]} de 7</p>
          </div>
        )}

        {step === 'intro' && (
          <div className="space-y-6 animate-in fade-in duration-300 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Pesquisa de uso · YLADA</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              Ajude-nos a melhorar
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-snug">
              Leva menos de 1 minuto
            </p>
            <button
              type="button"
              onClick={() => setStep('q1')}
              className="w-full min-h-[52px] rounded-2xl bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700 transition-colors"
            >
              Começar
            </button>
            <p className="text-xs text-gray-500">
              Não pedimos nome nem e-mail. Usamos as respostas só para melhorar o produto.
            </p>
          </div>
        )}

        {step === 'q1' && (
          <QuestionCard title="Hoje você usa o YLADA para qual objetivo principal?" onBack={() => setStep('intro')}>
            <div className="space-y-2">
              {OBJECTIVES.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setObjective(o.id)
                    if (o.id !== 'outro') {
                      setObjectiveOther('')
                      setStep('q2')
                    }
                  }}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                    objective === o.id
                      ? 'border-sky-600 bg-sky-50 text-sky-950'
                      : 'border-gray-200 bg-white text-gray-950 hover:border-sky-300'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {objective === 'outro' && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Descreva em uma linha</label>
                <input
                  type="text"
                  value={objectiveOther}
                  onChange={(e) => setObjectiveOther(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Ex.: treinar minha equipe"
                />
                <button
                  type="button"
                  disabled={objectiveOther.trim().length < 2}
                  onClick={() => setStep('q2')}
                  className="mt-3 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            )}
          </QuestionCard>
        )}

        {step === 'q2' && (
          <QuestionCard title="Você já criou um diagnóstico no YLADA?" onBack={() => setStep('q1')}>
            <BinaryChoice
              onPick={(v) => {
                setCreated(v)
                setShared(null)
                setMessaged(null)
                if (v) setStep('q3')
                else {
                  setShared(false)
                  setMessaged(false)
                  setStep('q5')
                }
              }}
            />
          </QuestionCard>
        )}

        {step === 'q3' && created === true && (
          <QuestionCard title="Você já compartilhou seu link com alguém?" onBack={() => setStep('q2')}>
            <BinaryChoice
              onPick={(v) => {
                setShared(v)
                setMessaged(null)
                if (v) setStep('q4')
                else {
                  setMessaged(false)
                  setStep('q5')
                }
              }}
            />
          </QuestionCard>
        )}

        {step === 'q4' && shared === true && (
          <QuestionCard
            title="Alguma pessoa já te chamou após responder o diagnóstico?"
            onBack={() => setStep('q3')}
          >
            <BinaryChoice
              onPick={(v) => {
                setMessaged(v)
                if (v) setStep('q6')
                else setStep('q5')
              }}
            />
          </QuestionCard>
        )}

        {step === 'q5' && (
          <QuestionCard
            title="Se você ainda não teve o resultado que queria, o que mais aconteceu?"
            onBack={() => {
              if (created === false) setStep('q2')
              else if (shared === false) setStep('q3')
              else setStep('q4')
            }}
          >
            <div className="space-y-2">
              {BLOCKERS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBlocker(b.id)
                    if (b.id !== 'outro') setBlockerOther('')
                    setStep('q6')
                  }}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                    blocker === b.id
                      ? 'border-sky-600 bg-sky-50 text-sky-950'
                      : 'border-gray-200 bg-white text-gray-950 hover:border-sky-300'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            {blocker === 'outro' && (
              <div className="mt-4 space-y-2">
                <input
                  type="text"
                  value={blockerOther}
                  onChange={(e) => setBlockerOther(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Conte em uma linha"
                />
                <button
                  type="button"
                  disabled={blockerOther.trim().length < 2}
                  onClick={() => setStep('q6')}
                  className="w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Continuar
                </button>
              </div>
            )}
          </QuestionCard>
        )}

        {step === 'q6' && (
          <QuestionCard
            title="Em uma frase: o que você esperava que o YLADA fizesse por você?"
            onBack={() => (messaged === true ? setStep('q4') : setStep('q5'))}
          >
            <textarea
              value={expectation}
              onChange={(e) => setExpectation(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              placeholder="Sua resposta..."
            />
            <button
              type="button"
              disabled={expectation.trim().length < 3}
              onClick={() => setStep('q7')}
              className="mt-4 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Continuar
            </button>
          </QuestionCard>
        )}

        {step === 'q7' && (
          <QuestionCard
            title="Hoje, o que mais te incomoda na forma como você tenta conseguir clientes?"
            onBack={() => setStep('q6')}
          >
            <textarea
              value={pain}
              onChange={(e) => setPain(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm"
              placeholder="Pode ser frustração com Instagram, tempo, preço, inconsistência..."
            />
            <button
              type="button"
              disabled={pain.trim().length < 3}
              onClick={() => setStep('result')}
              className="mt-4 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Ver meu diagnóstico
            </button>
          </QuestionCard>
        )}

        {step === 'result' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Seu diagnóstico de uso do YLADA</p>
              <h2 className="mt-2 text-xl font-bold text-gray-900">
                Pelo que você respondeu, dá para ir além com o YLADA como método guiado.
              </h2>
              <p className="mt-2 text-gray-700 leading-relaxed">
                O segredo não é “força bruta”: é seguir os passos com orientação (criar, compartilhar e conversar), com o
                Noel te ajudando em cada etapa, no seu ritmo.
              </p>
            </div>

            <div className={`rounded-2xl border-2 p-5 ${profileBorder(pc.color)}`}>
              <span className="inline-block rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-800 border border-black/5">
                {pc.badge}
              </span>
              <h3 className="mt-3 text-lg font-bold text-gray-900">{pc.title}</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed">{pc.body}</p>
              <p className="mt-4 text-sm font-medium text-gray-900">Seu próximo passo (com apoio)</p>
              <p className="text-sm text-gray-700 leading-relaxed">{pc.action}</p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
              <p className="text-sm font-semibold text-sky-900">Use o YLADA com orientação: o Noel te conduz</p>
              <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                <li>✓ Ele pergunta antes de te entregar tudo pronto, para você não ficar perdido</li>
                <li>✓ Próximo passo concreto, não só teoria</li>
                <li>✓ Ajuda com leads e conversa no WhatsApp</li>
                <li>✓ Uma ação simples por dia e retorno no dia seguinte</li>
              </ul>
            </div>

            <p className="text-center text-sm font-medium text-gray-900">
              Você já tem clareza do que fazer e apoio para fazer acontecer.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/pt/cadastro?utm_source=usage_survey"
                className="flex min-h-[52px] items-center justify-center rounded-2xl bg-sky-600 px-6 text-base font-semibold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-700"
              >
                Criar conta e começar
              </Link>
              <Link
                href="/pt/login?redirect=%2Fpt%2Fhome"
                className="flex min-h-[48px] items-center justify-center rounded-2xl border-2 border-sky-600 bg-white px-6 text-base font-semibold text-sky-800 hover:bg-sky-50"
              >
                Já tenho conta: entrar
              </Link>
              <Link
                href="/pt/login?redirect=%2Fpt%2Fhome%23noel-home-chat-anchor"
                className="text-center text-sm font-semibold text-sky-700 underline-offset-2 hover:underline"
              >
                Falar com o Noel
              </Link>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Obrigado por dedicar esse tempo. Suas respostas nos ajudam a melhorar o produto, e você pode contar com o
                Noel para usar o método com orientação, no seu ritmo.
              </p>
              <p className="mt-3 text-xs text-gray-500">
                Guarde este link para refazer a pesquisa quando quiser. Suas respostas são anônimas.
              </p>
              {submitError && <p className="mt-2 text-xs text-amber-700">{submitError}</p>}
              {savedId && !submitError && (
                <p className="mt-2 text-xs text-emerald-700">Resposta registrada. Obrigado por ajudar a melhorar o YLADA.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function QuestionCard({
  title,
  children,
  onBack,
}: {
  title: string
  children: React.ReactNode
  onBack: () => void
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <button type="button" onClick={onBack} className="text-sm font-medium text-sky-700 hover:underline">
        ← Voltar
      </button>
      <h2 className="text-lg sm:text-xl font-bold text-gray-950 leading-snug">{title}</h2>
      {children}
    </div>
  )
}

function BinaryChoice({ onPick }: { onPick: (v: boolean) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onPick(true)}
        className="min-h-[52px] rounded-2xl border-2 border-gray-200 bg-white py-3 text-base font-semibold text-gray-950 hover:border-sky-500 hover:bg-sky-50"
      >
        Sim
      </button>
      <button
        type="button"
        onClick={() => onPick(false)}
        className="min-h-[52px] rounded-2xl border-2 border-gray-200 bg-white py-3 text-base font-semibold text-gray-950 hover:border-sky-500 hover:bg-sky-50"
      >
        Não
      </button>
    </div>
  )
}
