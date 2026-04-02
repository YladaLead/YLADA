'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

type StepId =
  | 'intro'
  | 'q_used'
  | 'q_want_try'
  | 'q_know_someone'
  | 'result_share'
  | 'q1'
  | 'q2'
  | 'q3'
  | 'q4'
  | 'q5'
  | 'q6'
  | 'q7'
  | 'result'

const MIN_OPEN = 3

/** q_used = primeiro passo (sem contador). Trilha curta: 2–3/3. Trilha quem já usou: 2–8/8. */
function progressLabel(step: StepId): { n: number; total: number } | null {
  if (step === 'q_used') return null
  if (step === 'q_want_try') return { n: 2, total: 3 }
  if (step === 'q_know_someone') return { n: 3, total: 3 }
  if (step === 'q1') return { n: 2, total: 8 }
  if (step === 'q2') return { n: 3, total: 8 }
  if (step === 'q3') return { n: 4, total: 8 }
  if (step === 'q4') return { n: 5, total: 8 }
  if (step === 'q5') return { n: 6, total: 8 }
  if (step === 'q6') return { n: 7, total: 8 }
  if (step === 'q7') return { n: 8, total: 8 }
  return null
}

function progressPct(step: StepId): number | null {
  const p = progressLabel(step)
  if (!p) return null
  return (p.n / p.total) * 100
}

export default function YladaUsageSurveyPageV1() {
  const [step, setStep] = useState<StepId>('intro')
  const [wantToTry, setWantToTry] = useState<boolean | null>(null)
  const [knowSomeone, setKnowSomeone] = useState<boolean | null>(null)
  const [experienceRating, setExperienceRating] = useState<number | null>(null)
  const [liked, setLiked] = useState('')
  const [improve, setImprove] = useState('')
  const [recommend, setRecommend] = useState<boolean | null>(null)
  const [futureFeature, setFutureFeature] = useState('')
  const [helpedSituation, setHelpedSituation] = useState('')
  const [additional, setAdditional] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [copyDone, setCopyDone] = useState(false)
  const submittedRef = useRef(false)

  const buildFullPayload = useCallback(() => {
    if (experienceRating === null || recommend === null) return null
    return {
      has_used: true as const,
      experience_rating: experienceRating,
      liked: liked.trim(),
      improve: improve.trim(),
      recommend,
      future_feature: futureFeature.trim(),
      helped_situation: helpedSituation.trim(),
      additional: additional.trim(),
    }
  }, [experienceRating, liked, improve, recommend, futureFeature, helpedSituation, additional])

  useEffect(() => {
    if (step !== 'result' && step !== 'result_share') return
    if (submittedRef.current) return

    if (step === 'result_share') {
      if (wantToTry === null || knowSomeone === null) return
      submittedRef.current = true
      fetch('/api/ylada/usage-survey-v1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          has_used: false,
          want_to_try: wantToTry,
          know_someone: knowSomeone,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setSavedId(data.id ?? null)
          else setSubmitError(data.error || 'Não foi possível salvar.')
        })
        .catch(() => setSubmitError('Erro de rede. Suas respostas ainda aparecem abaixo.'))
      return
    }

    const payload = buildFullPayload()
    if (!payload) return
    submittedRef.current = true
    fetch('/api/ylada/usage-survey-v1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setSavedId(data.id ?? null)
        else setSubmitError(data.error || 'Não foi possível salvar.')
      })
      .catch(() => setSubmitError('Erro de rede. Seu feedback ainda aparece abaixo.'))
  }, [step, buildFullPayload, wantToTry, knowSomeone])

  const canContinueQ2 = liked.trim().length >= MIN_OPEN
  const canContinueQ3 = improve.trim().length >= MIN_OPEN
  const canContinueQ5 = futureFeature.trim().length >= MIN_OPEN
  const canContinueQ6 = helpedSituation.trim().length >= MIN_OPEN

  const pct = progressPct(step)
  const prog = progressLabel(step)

  const copyShareLink = () => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/pt/cadastro?utm_source=usage_survey_v1_share`
        : 'https://www.ylada.com/pt/cadastro?utm_source=usage_survey_v1_share'
    void navigator.clipboard.writeText(url).then(() => {
      setCopyDone(true)
      setTimeout(() => setCopyDone(false), 2500)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 text-gray-950 [color-scheme:light]">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12 pb-24">
        {step !== 'intro' && step !== 'result' && step !== 'result_share' && prog !== null && pct !== null && (
          <div className="mb-6">
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-600 transition-all duration-300"
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Passo {prog.n} de {prog.total}
            </p>
          </div>
        )}

        {step === 'intro' && (
          <div className="space-y-6 animate-in fade-in duration-300 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Pesquisa de uso · YLADA</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">Ajude-nos a melhorar</h1>
            <p className="text-base sm:text-lg text-gray-600 leading-snug">Leva menos de 1 minuto</p>
            <button
              type="button"
              onClick={() => setStep('q_used')}
              className="w-full min-h-[52px] rounded-2xl bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700 transition-colors"
            >
              Começar
            </button>
            <p className="text-xs text-gray-500">
              Não pedimos nome nem e-mail. Usamos as respostas só para melhorar o produto.
            </p>
          </div>
        )}

        {step === 'q_used' && (
          <QuestionCard title="Você já usou o YLADA?" onBack={() => setStep('intro')}>
            <BinaryRow
              onPick={(yes) => {
                if (yes) {
                  setWantToTry(null)
                  setKnowSomeone(null)
                  setStep('q1')
                } else {
                  setWantToTry(null)
                  setKnowSomeone(null)
                  setStep('q_want_try')
                }
              }}
            />
          </QuestionCard>
        )}

        {step === 'q_want_try' && (
          <QuestionCard title="Gostaria de testar?" onBack={() => setStep('q_used')}>
            <BinaryRow
              onPick={(yes) => {
                setWantToTry(yes)
                setStep('q_know_someone')
              }}
            />
          </QuestionCard>
        )}

        {step === 'q_know_someone' && (
          <QuestionCard
            title="Você conhece alguém que gostaria de testar o YLADA?"
            onBack={() => setStep('q_want_try')}
          >
            <BinaryRow
              onPick={(yes) => {
                setKnowSomeone(yes)
                setStep('result_share')
              }}
            />
          </QuestionCard>
        )}

        {step === 'result_share' && (
          <div className="space-y-6 animate-in fade-in duration-500 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Pesquisa de uso · YLADA</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              Agradecemos pelo seu tempo! Seu feedback é muito importante para nós.
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Compartilhe o link abaixo com quem quiser conhecer o YLADA. É rápido e sem cadastro para responder esta
              pesquisa.
            </p>
            <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-4 break-all">
              <p className="text-xs font-medium text-gray-500 mb-1">Link para compartilhar</p>
              <p className="text-sm font-mono text-sky-950">
                {typeof window !== 'undefined'
                  ? `${window.location.origin}/pt/cadastro?utm_source=usage_survey_v1_share`
                  : 'https://www.ylada.com/pt/cadastro?utm_source=usage_survey_v1_share'}
              </p>
            </div>
            <button
              type="button"
              onClick={copyShareLink}
              className="w-full min-h-[52px] rounded-2xl bg-sky-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700 transition-colors"
            >
              {copyDone ? 'Link copiado!' : 'Copiar link'}
            </button>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              {submitError && <p className="text-xs text-amber-700">{submitError}</p>}
              {savedId && !submitError && (
                <p className="text-xs text-emerald-700">Resposta registrada. Obrigado por ajudar o YLADA.</p>
              )}
            </div>
          </div>
        )}

        {step === 'q1' && (
          <QuestionCard
            title="Como você avaliaria sua experiência geral com o YLADA?"
            subtitle="(1 = Nada satisfeito, 5 = Muito satisfeito)"
            onBack={() => setStep('q_used')}
          >
            <div className="flex justify-center gap-1.5 sm:gap-2 py-2" role="group" aria-label="Nota de 1 a 5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setExperienceRating(n)}
                  className="rounded-xl p-2 text-3xl leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  aria-label={`Nota ${n} de 5`}
                  aria-pressed={experienceRating === n}
                >
                  <span
                    className={
                      experienceRating !== null && n <= experienceRating ? 'text-amber-400' : 'text-gray-300'
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 mt-1">Toque nas estrelas para avaliar</p>
            <button
              type="button"
              disabled={experienceRating === null}
              onClick={() => setStep('q2')}
              className="mt-6 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Continuar
            </button>
          </QuestionCard>
        )}

        {step === 'q2' && (
          <QuestionCard title="O que você mais gostou no YLADA?" onBack={() => setStep('q1')}>
            <textarea
              value={liked}
              onChange={(e) => setLiked(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-950"
              placeholder="Sua resposta..."
            />
            <button
              type="button"
              disabled={!canContinueQ2}
              onClick={() => setStep('q3')}
              className="mt-4 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Continuar
            </button>
          </QuestionCard>
        )}

        {step === 'q3' && (
          <QuestionCard title="O que você acha que poderia ser melhorado?" onBack={() => setStep('q2')}>
            <textarea
              value={improve}
              onChange={(e) => setImprove(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-950"
              placeholder="Sua resposta..."
            />
            <button
              type="button"
              disabled={!canContinueQ3}
              onClick={() => setStep('q4')}
              className="mt-4 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Continuar
            </button>
          </QuestionCard>
        )}

        {step === 'q4' && (
          <QuestionCard title="Você recomendaria o YLADA a um amigo?" onBack={() => setStep('q3')}>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRecommend(true)
                  setStep('q5')
                }}
                className="min-h-[52px] rounded-2xl border-2 border-gray-200 bg-white py-3 text-base font-semibold text-gray-950 hover:border-sky-500 hover:bg-sky-50"
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecommend(false)
                  setStep('q5')
                }}
                className="min-h-[52px] rounded-2xl border-2 border-gray-200 bg-white py-3 text-base font-semibold text-gray-950 hover:border-sky-500 hover:bg-sky-50"
              >
                Não
              </button>
            </div>
          </QuestionCard>
        )}

        {step === 'q5' && (
          <QuestionCard
            title="Alguma funcionalidade que você gostaria de ver no futuro?"
            onBack={() => setStep('q4')}
          >
            <textarea
              value={futureFeature}
              onChange={(e) => setFutureFeature(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-950"
              placeholder="Sua resposta..."
            />
            <button
              type="button"
              disabled={!canContinueQ5}
              onClick={() => setStep('q6')}
              className="mt-4 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Continuar
            </button>
          </QuestionCard>
        )}

        {step === 'q6' && (
          <QuestionCard
            title="Descreva uma situação em que o YLADA te ajudou."
            onBack={() => setStep('q5')}
          >
            <textarea
              value={helpedSituation}
              onChange={(e) => setHelpedSituation(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-950"
              placeholder="Sua resposta..."
            />
            <button
              type="button"
              disabled={!canContinueQ6}
              onClick={() => setStep('q7')}
              className="mt-4 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Continuar
            </button>
          </QuestionCard>
        )}

        {step === 'q7' && (
          <QuestionCard title="Algum comentário adicional que gostaria de compartilhar?" onBack={() => setStep('q6')}>
            <textarea
              value={additional}
              onChange={(e) => setAdditional(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-950"
              placeholder="Opcional"
            />
            <button
              type="button"
              onClick={() => setStep('result')}
              className="mt-4 w-full rounded-xl bg-sky-600 py-3 text-sm font-semibold text-white"
            >
              Enviar
            </button>
          </QuestionCard>
        )}

        {step === 'result' && (
          <div className="space-y-6 animate-in fade-in duration-500 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Pesquisa de uso · YLADA</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              Agradecemos pelo seu tempo! Seu feedback é muito importante para nós.
            </h2>
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Suas respostas nos ajudam a priorizar melhorias. Você pode fechar esta página ou voltar ao app quando
                quiser.
              </p>
              {submitError && <p className="mt-3 text-xs text-amber-700">{submitError}</p>}
              {savedId && !submitError && (
                <p className="mt-3 text-xs text-emerald-700">Feedback registrado. Obrigado por ajudar o YLADA.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BinaryRow({ onPick }: { onPick: (yes: boolean) => void }) {
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
