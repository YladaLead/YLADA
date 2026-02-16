'use client'

import { useEffect, useRef, useState } from 'react'

type Payload = {
  slug: string
  type: 'diagnostico' | 'calculator'
  title: string
  config: Record<string, unknown>
  ctaWhatsapp: string | null
}

function buildWhatsAppUrl(ctaWhatsapp: string | null): string {
  if (!ctaWhatsapp || !ctaWhatsapp.trim()) return ''
  const v = ctaWhatsapp.trim()
  if (/^https?:\/\//i.test(v)) return v
  const num = v.replace(/\D/g, '')
  if (!num.length) return ''
  return `https://wa.me/${num}`
}

function trackEvent(slug: string, eventType: string) {
  try {
    fetch('/api/ylada/links/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        event_type: eventType,
        device: typeof navigator !== 'undefined' ? navigator.userAgent?.slice(0, 200) : null,
      }),
    }).catch(() => {})
  } catch {
    // ignore
  }
}

export default function PublicLinkView({ payload }: { payload: Payload }) {
  const { slug, type, title, config, ctaWhatsapp } = payload
  const viewSent = useRef(false)

  useEffect(() => {
    if (viewSent.current) return
    viewSent.current = true
    trackEvent(slug, 'view')
  }, [slug])

  const ctaText = (config.ctaText as string) || (config.ctaDefault as string) || 'Falar no WhatsApp'
  const whatsappUrl = buildWhatsAppUrl(ctaWhatsapp)

  const handleCtaClick = () => {
    trackEvent(slug, 'cta_click')
    const url = whatsappUrl
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (type === 'diagnostico') {
    return (
      <DiagnosticoQuiz
        config={config}
        ctaText={ctaText}
        whatsappUrl={whatsappUrl}
        onCtaClick={handleCtaClick}
        title={title}
      />
    )
  }

  if (type === 'calculator') {
    return (
      <CalculatorBlock
        config={config}
        ctaText={ctaText}
        whatsappUrl={whatsappUrl}
        onCtaClick={handleCtaClick}
        title={title}
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <p className="text-gray-600">Tipo de link não suportado.</p>
    </div>
  )
}

// --- Diagnostico (quiz) ---
type DiagnosticoConfig = {
  questions?: Array<{ id: string; text: string; type: string; options?: string[] }>
  results?: Array<{ id: string; minScore: number; headline: string; description: string }>
  resultIntro?: string
}

function DiagnosticoQuiz({
  config,
  ctaText,
  whatsappUrl,
  onCtaClick,
  title,
}: {
  config: Record<string, unknown>
  ctaText: string
  whatsappUrl: string
  onCtaClick: () => void
  title: string
}) {
  const cfg = config as DiagnosticoConfig
  const questions = Array.isArray(cfg.questions) ? cfg.questions : []
  const results = Array.isArray(cfg.results) ? cfg.results : []
  const resultIntro = (cfg.resultIntro as string) || 'Seu resultado:'

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [step, setStep] = useState<'quiz' | 'result'>('quiz')

  const currentIndex = Object.keys(answers).length
  const currentQuestion = questions[currentIndex]
  const isComplete = currentIndex >= questions.length && questions.length > 0

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuestion) return
    const next = { ...answers, [currentQuestion.id]: optionIndex }
    setAnswers(next)
    if (currentIndex + 1 >= questions.length) setStep('result')
  }

  // Score: soma dos índices (0,1,2,3...) das respostas. Results têm minScore (0, 3, 6).
  const score = Object.values(answers).reduce((a, b) => a + b, 0)
  const sortedResults = [...results].sort((a, b) => (b.minScore ?? 0) - (a.minScore ?? 0))
  const result = sortedResults.find((r) => score >= (r.minScore ?? 0)) ?? sortedResults[sortedResults[0] ? 0 : 0]

  if (step === 'result' && isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-sm text-gray-600 mb-4">{resultIntro}</p>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{result?.headline}</h2>
            <p className="text-gray-600 mt-2">{result?.description}</p>
          </div>
          {whatsappUrl ? (
            <button
              type="button"
              onClick={onCtaClick}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              {ctaText}
            </button>
          ) : (
            <span className="text-gray-500 text-sm">Botão WhatsApp não configurado.</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          Pergunta {currentIndex + 1} de {questions.length}
        </p>
        {currentQuestion && (
          <>
            <p className="text-gray-800 font-medium mb-4">{currentQuestion.text}</p>
            <div className="space-y-2">
              {(currentQuestion.options ?? []).map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnswer(i)}
                  className="w-full text-left py-3 px-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-800 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// --- Calculator ---
type CalculatorConfig = {
  fields?: Array<{ id: string; label: string; type: string; min?: number; max?: number; default?: number }>
  formula?: string
  resultLabel?: string
  resultPrefix?: string
  resultSuffix?: string
  resultIntro?: string
}

function CalculatorBlock({
  config,
  ctaText,
  whatsappUrl,
  onCtaClick,
  title,
}: {
  config: Record<string, unknown>
  ctaText: string
  whatsappUrl: string
  onCtaClick: () => void
  title: string
}) {
  const cfg = config as CalculatorConfig
  const fields = Array.isArray(cfg.fields) ? cfg.fields : []
  const formula = (cfg.formula as string) || ''
  const resultLabel = (cfg.resultLabel as string) || 'Resultado:'
  const resultPrefix = (cfg.resultPrefix as string) ?? ''
  const resultSuffix = (cfg.resultSuffix as string) ?? ''
  const resultIntro = (cfg.resultIntro as string) || 'Com base no que você informou:'

  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    fields.forEach((f) => {
      init[f.id] = typeof f.default === 'number' ? f.default : 0
    })
    return init
  })
  const [showResult, setShowResult] = useState(false)

  // Avaliar fórmula simples: (f1 - f2) * f3 * 4
  let resultNum = 0
  try {
    let expr = formula
    fields.forEach((f) => {
      const val = values[f.id] ?? 0
      expr = expr.replace(new RegExp(f.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(val))
    })
    resultNum = Number(new Function(`return (${expr})`)())
    if (Number.isNaN(resultNum)) resultNum = 0
  } catch {
    resultNum = 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResult(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
        {!showResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <input
                  type="number"
                  min={f.min}
                  max={f.max}
                  value={values[f.id] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.id]: Number(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Calcular
            </button>
          </form>
        ) : (
          <>
            <p className="text-gray-600 mb-2">{resultIntro}</p>
            <p className="text-sm font-medium text-gray-700 mb-1">{resultLabel}</p>
            <p className="text-2xl font-bold text-gray-900 mb-6">
              {resultPrefix}
              {resultNum.toLocaleString('pt-BR')}
              {resultSuffix}
            </p>
            {whatsappUrl ? (
              <button
                type="button"
                onClick={onCtaClick}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                {ctaText}
              </button>
            ) : (
              <span className="text-gray-500 text-sm">Botão WhatsApp não configurado.</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}
