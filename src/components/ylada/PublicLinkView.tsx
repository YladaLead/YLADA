'use client'

import { useEffect, useRef, useState } from 'react'
import { getStrategicIntro } from '@/lib/ylada/strategic-intro'

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

function trackEvent(slug: string, eventType: string, options?: { metrics_id?: string }) {
  try {
    const body: Record<string, unknown> = {
      slug,
      event_type: eventType,
      device: typeof navigator !== 'undefined' ? navigator.userAgent?.slice(0, 200) : null,
    }
    if (options?.metrics_id) body.metrics_id = options.metrics_id
    fetch('/api/ylada/links/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {})
  } catch {
    // ignore
  }
}

/** Config no formato Pacote 3 (flow_id): meta, page, form, result. */
function isFlowConfig(config: Record<string, unknown>): boolean {
  const meta = config.meta as Record<string, unknown> | undefined
  const form = config.form as Record<string, unknown> | undefined
  return !!(meta?.flow_id || meta?.architecture) && Array.isArray(form?.fields) && (form.fields as unknown[]).length > 0
}

export default function PublicLinkView({ payload }: { payload: Payload }) {
  const { slug, type, title, config, ctaWhatsapp } = payload
  const viewSent = useRef(false)

  useEffect(() => {
    if (viewSent.current) return
    viewSent.current = true
    trackEvent(slug, 'view')
  }, [slug])

  const resultCta = (config.result as Record<string, unknown>)?.cta as Record<string, unknown> | undefined
  const ctaText = (resultCta?.text as string) || (config.ctaText as string) || (config.ctaDefault as string) || 'Falar no WhatsApp'
  const whatsappUrl = buildWhatsAppUrl(ctaWhatsapp)

  const handleCtaClick = (metricsId?: string, whatsappPrefill?: string) => {
    trackEvent(slug, 'cta_click', metricsId ? { metrics_id: metricsId } : undefined)
    if (whatsappUrl) {
      const url = whatsappPrefill
        ? `${whatsappUrl}${whatsappUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(whatsappPrefill)}`
        : whatsappUrl
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  if (isFlowConfig(config)) {
    return (
      <ConfigDrivenLinkView
        slug={slug}
        config={config}
        ctaText={ctaText}
        whatsappUrl={whatsappUrl}
        onCtaClick={handleCtaClick}
      />
    )
  }

  if (type === 'diagnostico') {
    return (
      <DiagnosticoQuiz
        slug={slug}
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
        slug={slug}
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

// --- Config-driven (flow_id) form + result (Etapa 8) ---
type FormField = { id: string; label: string; type?: string }
type ResultConfig = { headline?: string; summary_bullets?: string[]; cta?: { text?: string } }

const DIAGNOSIS_ARCHITECTURES = [
  'RISK_DIAGNOSIS',
  'BLOCKER_DIAGNOSIS',
  'PROJECTION_CALCULATOR',
  'PROFILE_TYPE',
  'READINESS_CHECKLIST',
] as const

type DiagnosisResultState = {
  profile_title: string
  profile_summary: string
  main_blocker: string
  consequence: string
  growth_potential: string
  cta_text: string
  whatsapp_prefill: string
}

function ConfigDrivenLinkView({
  slug,
  config,
  ctaText,
  whatsappUrl,
  onCtaClick,
}: {
  slug: string
  config: Record<string, unknown>
  ctaText: string
  whatsappUrl: string
  onCtaClick: (metricsId?: string, whatsappPrefill?: string) => void
}) {
  const page = (config.page as Record<string, unknown>) || {}
  const formConfig = (config.form as Record<string, unknown>) || {}
  const resultConfig = (config.result as ResultConfig) || {}
  const meta = (config.meta as Record<string, unknown>) || {}
  const fields = (formConfig.fields as FormField[]) || []
  const submitLabel = (formConfig.submit_label as string) || 'Ver resultado'

  const pageTitle = (page.title as string) ?? (config.title as string) ?? 'Link'
  const subtitle = (page.subtitle as string) || ''

  const [values, setValues] = useState<Record<string, string>>({})
  const [step, setStep] = useState<'intro' | 'form' | 'result'>('intro')
  const [diagnosis, setDiagnosis] = useState<DiagnosisResultState | null>(null)
  const [metricsId, setMetricsId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const startSent = useRef(false)
  const completeSent = useRef(false)
  const resultViewSent = useRef(false)

  useEffect(() => {
    if (step === 'result' && diagnosis && metricsId && !resultViewSent.current) {
      resultViewSent.current = true
      trackEvent(slug, 'result_view', { metrics_id: metricsId })
    }
  }, [step, diagnosis, metricsId, slug])

  const useDiagnosisApi =
    typeof meta.architecture === 'string' &&
    DIAGNOSIS_ARCHITECTURES.includes(meta.architecture as (typeof DIAGNOSIS_ARCHITECTURES)[number])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startSent.current) {
      startSent.current = true
      trackEvent(slug, 'start')
    }
    if (!completeSent.current) {
      completeSent.current = true
      trackEvent(slug, 'complete')
    }

    if (useDiagnosisApi) {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/ylada/links/${encodeURIComponent(slug)}/diagnosis`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitor_answers: values }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data.error || 'Erro ao gerar resultado.')
          setLoading(false)
          return
        }
        if (data.diagnosis && data.metrics_id) {
          setDiagnosis(data.diagnosis)
          setMetricsId(data.metrics_id)
        } else {
          setError('Resposta inválida.')
        }
      } catch {
        setError('Erro de conexão.')
      } finally {
        setLoading(false)
      }
    }
    setStep('result')
  }

  const headline = resultConfig.headline || 'Seu resultado'
  const summaryBullets = Array.isArray(resultConfig.summary_bullets) ? resultConfig.summary_bullets : []
  const resultCtaText = resultConfig.cta?.text || ctaText

  // StrategicIntro: bloco antes da primeira pergunta (continuidade narrativa); usa perfil estratégico se existir
  const introContent = getStrategicIntro({
    safety_mode: meta.safety_mode === true,
    objective: typeof meta.objective === 'string' ? meta.objective : undefined,
    area_profissional: typeof meta.area_profissional === 'string' ? meta.area_profissional : undefined,
    strategic_profile: meta.strategic_profile && typeof meta.strategic_profile === 'object' ? (meta.strategic_profile as { maturityStage?: string; dominantPain?: string; urgencyLevel?: string; mindset?: string }) : undefined,
  })

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{introContent.title}</h1>
          <p className="text-sm text-gray-600 mb-2">{introContent.subtitle}</p>
          <p className="text-xs text-gray-500 mb-6">{introContent.micro}</p>
          <button
            type="button"
            onClick={() => setStep('form')}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            Começar
          </button>
        </div>
      </div>
    )
  }

  if (step === 'result') {
    if (diagnosis && metricsId) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{diagnosis.profile_title}</h2>
              <p className="text-gray-600 mt-2 whitespace-pre-line">{diagnosis.profile_summary}</p>
              <p className="text-sm font-medium text-gray-700 mt-3">{diagnosis.main_blocker}</p>
              <p className="text-gray-600 text-sm mt-1">{diagnosis.consequence}</p>
              <p className="text-gray-600 text-sm mt-2">{diagnosis.growth_potential}</p>
            </div>
            {whatsappUrl ? (
              <button
                type="button"
                onClick={() => onCtaClick(metricsId, diagnosis.whatsapp_prefill)}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                {diagnosis.cta_text}
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
          <h1 className="text-xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{headline}</h2>
            {summaryBullets.length > 0 && (
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                {summaryBullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
          {whatsappUrl ? (
            <button
              type="button"
              onClick={() => onCtaClick()}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              {resultCtaText}
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
        <h1 className="text-xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
        {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}
        {error && (
          <p className="text-sm text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              {f.type === 'number' ? (
                <input
                  type="number"
                  value={values[f.id] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.id]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              ) : (
                <input
                  type="text"
                  value={values[f.id] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.id]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={f.label}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Gerando resultado...' : submitLabel}
          </button>
        </form>
      </div>
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
  slug,
  config,
  ctaText,
  whatsappUrl,
  onCtaClick,
  title,
}: {
  slug: string
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

  const startSent = useRef(false)
  const completeSent = useRef(false)

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuestion) return
    if (!startSent.current) {
      startSent.current = true
      trackEvent(slug, 'start')
    }
    const next = { ...answers, [currentQuestion.id]: optionIndex }
    setAnswers(next)
    if (currentIndex + 1 >= questions.length) {
      setStep('result')
      if (!completeSent.current) {
        completeSent.current = true
        trackEvent(slug, 'complete')
      }
    }
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
  slug,
  config,
  ctaText,
  whatsappUrl,
  onCtaClick,
  title,
}: {
  slug: string
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
  const calculatorStartSent = useRef(false)
  const calculatorCompleteSent = useRef(false)

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
    if (!calculatorStartSent.current) {
      calculatorStartSent.current = true
      trackEvent(slug, 'start')
    }
    if (!calculatorCompleteSent.current) {
      calculatorCompleteSent.current = true
      trackEvent(slug, 'complete')
    }
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
