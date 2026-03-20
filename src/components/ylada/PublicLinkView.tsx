'use client'

import { useEffect, useRef, useState } from 'react'
import { formatDisplayTitle, getStrategicIntro } from '@/lib/ylada/strategic-intro'
import DiagnosisDisclaimer from '@/components/ylada/DiagnosisDisclaimer'
import PoweredByYlada from '@/components/ylada/PoweredByYlada'
import type { Language } from '@/lib/i18n'

const PUBLIC_LINK_UI: Record<Language, {
  start: string
  back: string
  questionOf: string
  seeResult: string
  generating: string
  calculate: string
  personalizedDiagnosis: string
  yourResult: string
  diagnosis: string
  probableCause: string
  whatItMeans: string
  concerns: string
  consequence: string
  benefit: string
  quickTip: string
  nextSteps: string
  goodNews: string
  moreFactors: string
  resultDisclaimer: string
  talkToPro: string
  talkToSpecialist: string
  understandCase: string
  contactNotAvailable: string
  speakWhatsApp: string
}> = {
  pt: {
    start: 'Começar',
    back: 'Voltar',
    questionOf: 'Pergunta',
    seeResult: 'Ver resultado',
    generating: 'Gerando resultado...',
    calculate: 'Calcular',
    personalizedDiagnosis: 'Diagnóstico personalizado',
    yourResult: 'Seu resultado inicial',
    diagnosis: 'Diagnóstico',
    probableCause: 'Causa provável',
    whatItMeans: 'O que isso significa',
    concerns: 'Preocupações',
    consequence: 'Consequência',
    benefit: 'Benefício',
    quickTip: 'Dica rápida',
    nextSteps: 'Próximos passos',
    goodNews: 'A boa notícia é que muitas pessoas conseguem melhorar essa situação quando identificam o bloqueio certo e fazem pequenos ajustes na rotina.',
    moreFactors: 'Pode existir mais de um fator no seu caso',
    resultDisclaimer: 'Este resultado é apenas um primeiro indicativo baseado nas respostas que você forneceu. Um {pessoa} pode analisar melhor sua rotina e explicar quais ajustes podem ajudar você a melhorar seus resultados.',
    talkToPro: 'Se quiser entender melhor o que esse resultado significa no seu caso, você pode conversar com um {pessoa}.',
    talkToSpecialist: 'Conversar com o especialista',
    understandCase: 'Clique para entender melhor seu caso',
    contactNotAvailable: 'O {pessoa} ainda não disponibilizou o contato por aqui.',
    speakWhatsApp: 'Falar no WhatsApp',
  },
  en: {
    start: 'Start',
    back: 'Back',
    questionOf: 'Question',
    seeResult: 'See result',
    generating: 'Generating result...',
    calculate: 'Calculate',
    personalizedDiagnosis: 'Personalized diagnosis',
    yourResult: 'Your initial result',
    diagnosis: 'Diagnosis',
    probableCause: 'Probable cause',
    whatItMeans: 'What it means',
    concerns: 'Concerns',
    consequence: 'Consequence',
    benefit: 'Benefit',
    quickTip: 'Quick tip',
    nextSteps: 'Next steps',
    goodNews: 'The good news is that many people can improve this situation when they identify the right block and make small adjustments to their routine.',
    moreFactors: 'There may be more than one factor in your case',
    resultDisclaimer: 'This result is only an initial indication based on the answers you provided. A {pessoa} can better analyze your routine and explain which adjustments can help you improve your results.',
    talkToPro: 'If you want to better understand what this result means in your case, you can talk to a {pessoa}.',
    talkToSpecialist: 'Talk to the specialist',
    understandCase: 'Click to better understand your case',
    contactNotAvailable: 'The {pessoa} has not yet made contact available here.',
    speakWhatsApp: 'Contact on WhatsApp',
  },
  es: {
    start: 'Comenzar',
    back: 'Volver',
    questionOf: 'Pregunta',
    seeResult: 'Ver resultado',
    generating: 'Generando resultado...',
    calculate: 'Calcular',
    personalizedDiagnosis: 'Diagnóstico personalizado',
    yourResult: 'Tu resultado inicial',
    diagnosis: 'Diagnóstico',
    probableCause: 'Causa probable',
    whatItMeans: 'Qué significa',
    concerns: 'Preocupaciones',
    consequence: 'Consecuencia',
    benefit: 'Beneficio',
    quickTip: 'Consejo rápido',
    nextSteps: 'Próximos pasos',
    goodNews: 'La buena noticia es que muchas personas pueden mejorar esta situación cuando identifican el bloqueo correcto y hacen pequeños ajustes en su rutina.',
    moreFactors: 'Puede haber más de un factor en tu caso',
    resultDisclaimer: 'Este resultado es solo una indicación inicial basada en las respuestas que proporcionaste. Un {pessoa} puede analizar mejor tu rutina y explicar qué ajustes pueden ayudarte a mejorar tus resultados.',
    talkToPro: 'Si quieres entender mejor qué significa este resultado en tu caso, puedes hablar con un {pessoa}.',
    talkToSpecialist: 'Hablar con el especialista',
    understandCase: 'Haz clic para entender mejor tu caso',
    contactNotAvailable: 'El {pessoa} aún no ha puesto el contacto disponible aquí.',
    speakWhatsApp: 'Contactar por WhatsApp',
  },
}

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
      keepalive: true,
    }).catch(() => {})
  } catch {
    // ignore
  }
}

const DIAGNOSIS_PLACEHOLDER = 'O diagnóstico será gerado com base no seu perfil.'

/**
 * Personaliza main_blocker para linguagem mais "feita para mim" (aumenta curiosidade e clique).
 * Transforma frases genéricas em linguagem que parece específica para o usuário.
 */
function personalizeMainBlocker(text: string): string {
  if (!text?.trim()) return text
  const t = text.trim()
  const m1 = t.match(/^Bloqueio prático em (.+)$/i)
  if (m1) return `Seu principal bloqueio pode estar na organização da rotina em relação a ${m1[1].toLowerCase()}`
  const m2 = t.match(/^Bloqueio emocional em (.+)$/i)
  if (m2) return `Seu resultado indica um possível bloqueio emocional em ${m2[1].toLowerCase()}`
  const m3 = t.match(/^Indícios em (.+) que merecem atenção$/i)
  if (m3) return `Seu resultado indica indícios em ${m3[1].toLowerCase()} que merecem atenção`
  const m4 = t.match(/^Sinais em (.+) que se repetem$/i)
  if (m4) return `Seu resultado indica sinais em ${m4[1].toLowerCase()} que se repetem`
  const m5 = t.match(/^Desequilíbrio em (.+) que pede ação$/i)
  if (m5) return `Seu resultado indica um desequilíbrio em ${m5[1].toLowerCase()} que pede ação`
  return t
}

/** Tem resultados estáticos utilizáveis (não placeholder). */
function hasStaticResults(config: Record<string, unknown>): boolean {
  const results = config.results as Array<{ description?: string }> | undefined
  if (!Array.isArray(results) || results.length === 0) return false
  return results.some((r) => r.description && r.description.trim() !== '' && r.description !== DIAGNOSIS_PLACEHOLDER)
}

/** Normaliza config da biblioteca (questions/results) para formato flow (meta/form). */
function normalizeBibliotecaConfig(config: Record<string, unknown>, locale: Language = 'pt'): Record<string, unknown> {
  if (config.meta && config.form) return config
  const questions = config.questions as Array<{ id?: string; text?: string; type?: string; options?: string[] }> | undefined
  if (!Array.isArray(questions) || questions.length === 0) return config
  const title = (config.title as string) || 'Link'
  const submitLabel = PUBLIC_LINK_UI[locale].seeResult
  const formFields = questions.map((q, i) => ({
    id: q.id ?? `q${i + 1}`,
    label: q.text ?? q.id ?? (locale === 'en' ? `Question ${i + 1}` : locale === 'es' ? `Pregunta ${i + 1}` : `Pergunta ${i + 1}`),
    type: (q.type as string) || 'single',
    options: q.options,
  }))
  return {
    ...config,
    meta: config.meta ?? {
      architecture: 'RISK_DIAGNOSIS',
      theme_raw: title,
      theme_display: title,
      objective: 'captar',
      area_profissional: 'wellness',
    },
    form: config.form ?? { fields: formFields, submit_label: submitLabel },
    result: config.result ?? { headline: 'Seu resultado', summary_bullets: [], cta: { text: (config.ctaText as string) ?? 'Falar no WhatsApp' } },
  }
}

export default function PublicLinkView({ payload, locale = 'pt' }: { payload: Payload; locale?: Language }) {
  const { slug, type, title, config, ctaWhatsapp } = payload
  const t = PUBLIC_LINK_UI[locale]
  const viewSent = useRef(false)

  useEffect(() => {
    if (viewSent.current) return
    viewSent.current = true
    trackEvent(slug, 'view')
  }, [slug])

  const resultCta = (config.result as Record<string, unknown>)?.cta as Record<string, unknown> | undefined
  const ctaText = (resultCta?.text as string) || (config.ctaText as string) || (config.ctaDefault as string) || t.speakWhatsApp
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

  if (type === 'diagnostico') {
    if (hasStaticResults(config)) {
      return (
        <DiagnosticoQuiz
          slug={slug}
          config={config}
          ctaText={ctaText}
          whatsappUrl={whatsappUrl}
          onCtaClick={handleCtaClick}
          title={formatDisplayTitle(title)}
          locale={locale}
        />
      )
    }
    const normalizedConfig = normalizeBibliotecaConfig(config, locale)
    return (
      <ConfigDrivenLinkView
        slug={slug}
        config={normalizedConfig}
        ctaText={ctaText}
        whatsappUrl={whatsappUrl}
        onCtaClick={handleCtaClick}
        locale={locale}
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
        title={formatDisplayTitle(title)}
        locale={locale}
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-sky-50/50">
      <p className="text-sky-800">Tipo de link não suportado.</p>
    </div>
  )
}

// --- Config-driven (flow_id) form + result (Etapa 8) ---
type FormField = { id: string; label: string; type?: string; options?: string[] }
type ResultConfig = { headline?: string; summary_bullets?: string[]; cta?: { text?: string } }

const DIAGNOSIS_ARCHITECTURES = [
  'RISK_DIAGNOSIS',
  'BLOCKER_DIAGNOSIS',
  'PROJECTION_CALCULATOR',
  'PROFILE_TYPE',
  'READINESS_CHECKLIST',
  'PERFUME_PROFILE',
] as const

type DiagnosisResultState = {
  profile_title: string
  profile_summary: string
  main_blocker: string
  causa_provavel?: string
  preocupacoes?: string
  espelho_comportamental?: string
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
  locale = 'pt',
}: {
  slug: string
  config: Record<string, unknown>
  ctaText: string
  whatsappUrl: string
  onCtaClick: (metricsId?: string, whatsappPrefill?: string) => void
  locale?: Language
}) {
  const t = PUBLIC_LINK_UI[locale]
  const page = (config.page as Record<string, unknown>) || {}
  const formConfig = (config.form as Record<string, unknown>) || {}
  const resultConfig = (config.result as ResultConfig) || {}
  const meta = (config.meta as Record<string, unknown>) || {}
  const fields = (formConfig.fields as FormField[]) || []
  const submitLabel = (formConfig.submit_label as string) || t.seeResult
  
  // GARANTIR: Nenhum campo pode ser dissertativo (text/textarea) - sempre deve ter opções
  // Se um campo não tem opções, converter para select com opções padrão
  const fieldsValidados = fields.map((f) => {
    // Se não tem type ou é text/textarea, e não tem opções, converter para select
    if ((!f.type || f.type === 'text' || f.type === 'textarea') && (!f.options || f.options.length === 0)) {
      return {
        ...f,
        type: 'select',
        options: ['Sim', 'Não', 'Às vezes', 'Não tenho certeza'],
      }
    }
    return f
  })

  const pageTitleRaw = (page.title as string) ?? (config.title as string) ?? 'Link'
  const hasTechnicalName = /diagnóstico de bloqueios|diagnóstico de saúde|raio-x/i.test(pageTitleRaw)
  const pageTitle =
    hasTechnicalName && pageTitleRaw.includes(' — ')
      ? pageTitleRaw.split(' — ').slice(1).join(' — ').trim() || pageTitleRaw
      : pageTitleRaw
  const displayTitle = formatDisplayTitle(pageTitle)
  const subtitle = (page.subtitle as string) || ''

  const [values, setValues] = useState<Record<string, string>>({})
  const [step, setStep] = useState<'intro' | 'form' | 'result' | 'limit_reached'>('intro')
  const [formStep, setFormStep] = useState(0)
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
    
    // VALIDAÇÃO: Verificar se todas as perguntas obrigatórias foram respondidas
    // IMPORTANTE: No modo quiz, validar APENAS os campos que estão sendo exibidos (quizFields)
    // Não validar campos que não estão visíveis na tela
    const camposParaValidar = isQuizMode ? quizFields : fieldsValidados
    const camposObrigatorios = camposParaValidar.filter((f) => f.id && (!f.hasOwnProperty('obrigatoria') || f.obrigatoria !== false))
    const camposNaoRespondidos = camposObrigatorios.filter((f) => {
      const valor = values[f.id]
      // Verificar se o valor existe e não está vazio
      // IMPORTANTE: "0" é um valor válido (índice da primeira opção no quiz)
      if (valor === undefined || valor === null) {
        console.log('[PublicLinkView] Campo não respondido:', f.id, f.label, 'valor:', valor)
        return true
      }
      const valorStr = String(valor)
      // Se for string vazia (após trim), está vazio
      if (valorStr.trim() === '') {
        console.log('[PublicLinkView] Campo vazio:', f.id, f.label, 'valorStr:', valorStr)
        return true
      }
      // Qualquer outro valor (incluindo "0") é válido
      return false
    })

    if (camposNaoRespondidos.length > 0) {
      const camposNomes = camposNaoRespondidos.map((f) => f.label || f.id).join(', ')
      console.log('[PublicLinkView] Campos não respondidos:', camposNaoRespondidos.map(f => ({ id: f.id, label: f.label, valor: values[f.id] })))
      setError(
        locale === 'en'
          ? `Please answer all required questions: ${camposNomes}`
          : locale === 'es'
          ? `Por favor responda todas las preguntas requeridas: ${camposNomes}`
          : `Por favor, responda todas as perguntas obrigatórias: ${camposNomes}`
      )
      return
    }

    console.log('[PublicLinkView] Todas as validações passaram, enviando formulário...', { values, camposObrigatorios: camposObrigatorios.length })

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
          body: JSON.stringify({
            visitor_answers: values,
            ...(locale !== 'pt' && { locale }),
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          if (data.limit_reached) {
            setStep('limit_reached')
            setLoading(false)
            return
          }
          setError(data.error || data.message || 'Erro ao gerar resultado.')
          setLoading(false)
          return
        }
        if (data.diagnosis && data.metrics_id) {
          setDiagnosis(data.diagnosis)
          setMetricsId(data.metrics_id)
        } else {
          setError('Resposta inválida.')
        }
      } catch (err) {
        console.error('❌ [PublicLinkView] Erro no fetch:', err)
        setError('Erro de conexão.')
        setLoading(false)
        return
      } finally {
        setLoading(false)
      }
    } else {
      // Se não usar API de diagnóstico, apenas mudar para resultado
      console.log('[PublicLinkView] Não usando API de diagnóstico, mudando para step result')
      setStep('result')
    }
  }

  const headline = resultConfig.headline || t.yourResult
  const summaryBullets = Array.isArray(resultConfig.summary_bullets) ? resultConfig.summary_bullets : []
  const resultCtaText = resultConfig.cta?.text || ctaText

  // StrategicIntro: bloco antes da primeira pergunta; para quiz paciente (emagrecimento etc.) usa intro voltada ao visitante
  const themeFromMeta = typeof meta.theme_raw === 'string' ? meta.theme_raw : (meta.theme as { raw?: string })?.raw
  const themeFromTitle = pageTitleRaw.includes(' — ') ? pageTitleRaw.split(' — ').slice(1).join(' — ').trim() : ''
  const introContent = getStrategicIntro({
    safety_mode: meta.safety_mode === true,
    objective: typeof meta.objective === 'string' ? meta.objective : undefined,
    area_profissional: typeof meta.area_profissional === 'string' ? meta.area_profissional : undefined,
    strategic_profile: meta.strategic_profile && typeof meta.strategic_profile === 'object' ? (meta.strategic_profile as { maturityStage?: string; dominantPain?: string; urgencyLevel?: string; mindset?: string }) : undefined,
    theme_raw: themeFromMeta || themeFromTitle || undefined,
    page_title: pageTitleRaw || undefined,
    questions_count: fieldsValidados.length > 0 ? fieldsValidados.length : undefined,
  })

  // Tela de limite atingido (freemium) — tom de crescimento + promoção do Pro
  if (step === 'limit_reached') {
    const limitTitle = locale === 'en'
      ? 'This diagnosis already generated 10 WhatsApp conversations this month'
      : locale === 'es'
      ? 'Este diagnóstico ya generó 10 conversaciones por WhatsApp este mes'
      : 'Este diagnóstico já gerou 10 conversas no WhatsApp este mês'
    const limitBody = locale === 'en'
      ? 'This diagnosis already generated 10 WhatsApp conversations this month. Want to create diagnostics like this to generate conversations with your clients?'
      : locale === 'es'
      ? 'Este diagnóstico ya generó 10 conversaciones por WhatsApp este mes. ¿Quieres crear diagnósticos así para generar conversaciones con tus clientes?'
      : 'Este diagnóstico já gerou 10 conversas no WhatsApp este mês. Quer criar diagnósticos como esse para gerar conversas com seus clientes?'
    const proBenefit = locale === 'en'
      ? 'With the Pro plan: unlimited WhatsApp contacts per month, multiple diagnostics, and full Noel analyses.'
      : locale === 'es'
      ? 'Con el plan Pro: contactos ilimitados por WhatsApp al mes, múltiples diagnósticos y análisis completos del Noel.'
      : 'Com o plano Pro: contatos ilimitados no WhatsApp por mês, vários diagnósticos e análises completas do Noel.'
    const verPlanos = locale === 'en' ? 'View plans' : locale === 'es' ? 'Ver planes' : 'Ver planos'
    const criarMeu = locale === 'en' ? 'Create my free diagnosis' : locale === 'es' ? 'Crear mi diagnóstico gratis' : 'Criar meu diagnóstico grátis'
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-sky-100/50 border border-sky-100/60 p-6 sm:p-8">
          <div className="mb-4">
            <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
              {locale === 'en' ? 'Result' : locale === 'es' ? 'Resultado' : 'Resultado'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">{limitTitle}</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{limitBody}</p>
          <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-100">
            <p className="text-sm font-medium text-sky-900 mb-1">
              {locale === 'en' ? 'What you get with Pro' : locale === 'es' ? 'Qué obtienes con Pro' : 'O que você ganha com o Pro'}
            </p>
            <p className="text-sm text-sky-800 leading-relaxed">{proBenefit}</p>
          </div>
          <div className="space-y-3 mb-6">
            <a
              href="/pt/precos"
              className="block w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-center transition-colors"
            >
              {verPlanos}
            </a>
            <a
              href="/pt/precos"
              className="block w-full py-2 px-4 text-sky-600 hover:text-sky-700 text-sm font-medium text-center"
            >
              {criarMeu}
            </a>
          </div>
          <p className="text-center text-xs text-gray-500">Criado com YLADA</p>
        </div>
      </div>
    )
  }

  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-sky-100/50 border border-sky-100/60 p-6 sm:p-8">
          <div className="mb-4">
            <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
              {t.personalizedDiagnosis}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight">{introContent.title}</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{introContent.subtitle}</p>
          <p className="text-xs font-medium text-sky-600 mb-6 flex items-center gap-1.5">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {introContent.micro}
          </p>
          <button
            type="button"
            onClick={() => setStep('form')}
            className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors hover:shadow-sky-500/30"
          >
            {t.start}
          </button>
        </div>
      </div>
    )
  }

  if (step === 'result') {
    if (diagnosis && metricsId) {
      const isPerfumery = meta.architecture === 'PERFUME_PROFILE' || meta.segment_code === 'perfumaria'
      const areaProf = typeof meta.area_profissional === 'string' ? meta.area_profissional : ''
      const segmentCode = typeof meta.segment_code === 'string' ? meta.segment_code : ''
      const useEspecialista =
        areaProf === 'vendas' || ['seller', 'perfumaria', 'nutra'].includes(segmentCode)
      const pessoaLabel = useEspecialista ? 'especialista' : 'profissional'
      const formattedProfileTitle = formatDisplayTitle(diagnosis.profile_title)
      return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-sky-100/50 border border-sky-100/60 p-6 sm:p-8">
            <div className="mb-4">
              <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
                {t.yourResult}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
              {formattedProfileTitle}
            </h1>

            {/* 1. Leitura personalizada */}
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{diagnosis.profile_summary}</p>

            {/* 2. Diagnóstico — ponto chave */}
            <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100/80 shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-sky-400 to-sky-600 rounded-l-2xl" />
              <div className="pl-5 pr-5 py-5 sm:pl-6 sm:pr-6 sm:py-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">
                  {t.diagnosis}
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-2">
                  {personalizeMainBlocker(diagnosis.main_blocker)}
                </p>
                {diagnosis.espelho_comportamental && (
                  <p className="text-sm text-sky-700 font-medium italic">
                    {diagnosis.espelho_comportamental}
                  </p>
                )}
              </div>
            </div>

            {/* 2b. Frase de identificação emocional */}
            {diagnosis.frase_identificacao && (
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                {diagnosis.frase_identificacao}
              </p>
            )}

            {/* 3. Causa provável / O que isso significa (perfumaria) */}
            {diagnosis.causa_provavel && (
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
                  {isPerfumery ? t.whatItMeans : t.probableCause}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {diagnosis.causa_provavel}
                </p>
              </div>
            )}

            {/* 4. Preocupações */}
            {diagnosis.preocupacoes && (
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
                  {t.concerns}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {diagnosis.preocupacoes}
                </p>
              </div>
            )}

            {/* 5. Consequência / Benefício (perfumaria) */}
            <div className="mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
                {isPerfumery ? t.benefit : t.consequence}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {diagnosis.consequence}
              </p>
            </div>

            {/* 5a. Gatilho de esperança — cria ponte para conversa */}
            <div className="mb-4 p-4 rounded-xl bg-green-50/80 border border-green-100">
              <p className="text-gray-700 text-sm leading-relaxed">
                {t.goodNews}
              </p>
            </div>

            {/* 5b. Dica rápida (micro-conteúdo educativo) */}
            {diagnosis.dica_rapida && (
              <div className="mb-4 p-4 rounded-xl bg-sky-50/60 border border-sky-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
                  {t.quickTip}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {diagnosis.dica_rapida}
                </p>
              </div>
            )}

            {/* 6. Providências — 2–3 ações específicas ou texto único */}
            <div className="mb-6">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">
                {t.nextSteps}
              </p>
              {diagnosis.specific_actions && diagnosis.specific_actions.length > 0 ? (
                <ul className="space-y-2">
                  {diagnosis.specific_actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sky-700 text-sm font-medium leading-relaxed">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-semibold">
                        {idx + 1}
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sky-700 text-sm font-medium leading-relaxed">
                  {diagnosis.growth_potential}
                </p>
              )}
            </div>

            {/* 7. Ponte para conversa — gatilho de continuação (não conclusão) */}
            <div className="mb-6 p-4 rounded-xl bg-sky-50/80 border border-sky-100">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">
                {t.moreFactors}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">
                {t.resultDisclaimer.replace('{pessoa}', pessoaLabel)}
              </p>
              <p className="text-gray-700 text-sm font-medium">
                {t.talkToPro.replace('{pessoa}', pessoaLabel)}
              </p>
            </div>

            {/* 8. CTA — botão de ação */}
            {whatsappUrl ? (
              <button
                type="button"
                onClick={() =>
                  onCtaClick(
                    metricsId,
                    diagnosis.whatsapp_prefill?.trim() ||
                      (locale === 'en' ? 'Hi, I did the assessment and would like to talk about the result.' : locale === 'es' ? 'Hola, hice la evaluación y me gustaría hablar sobre el resultado.' : 'Oi, fiz a análise e gostaria de conversar sobre o resultado.')
                  )
                }
                className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors"
              >
                {diagnosis.cta_text?.replace(/profissional/gi, pessoaLabel) ?? (useEspecialista ? t.talkToSpecialist : t.understandCase)}
              </button>
            ) : (
              <span className="text-gray-500 text-sm">{t.contactNotAvailable.replace('{pessoa}', pessoaLabel)}</span>
            )}

            {/* Disclaimer — orientação e responsabilidade */}
            <DiagnosisDisclaimer
              variant={isPerfumery ? 'wellness' : 'informative'}
              className="mt-5 pt-4 border-t border-gray-100"
            />
            <PoweredByYlada variant="compact" />
          </div>
        </div>
      )
    }

    const areaProfStatic = typeof meta.area_profissional === 'string' ? meta.area_profissional : ''
    const segmentCodeStatic = typeof meta.segment_code === 'string' ? meta.segment_code : ''
    const useEspecialistaStatic =
      areaProfStatic === 'vendas' || ['seller', 'perfumaria', 'nutra'].includes(segmentCodeStatic)
    const pessoaLabelStatic = useEspecialistaStatic ? 'especialista' : 'profissional'
    const ctaDisplay =
      (resultCtaText && resultCtaText.trim()
        ? resultCtaText.replace(/profissional/gi, pessoaLabelStatic)
        : null) ?? (useEspecialistaStatic ? t.talkToSpecialist : t.understandCase)

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{displayTitle}</h1>
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
          <div className="mb-6 p-4 rounded-xl bg-sky-50/80 border border-sky-100">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">
              {t.moreFactors}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              {t.resultDisclaimer.replace('{pessoa}', pessoaLabelStatic)}
            </p>
            <p className="text-gray-700 text-sm font-medium">
              {t.talkToPro.replace('{pessoa}', pessoaLabelStatic)}
            </p>
          </div>
          {whatsappUrl ? (
            <button
              type="button"
              onClick={() => onCtaClick()}
              className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors"
            >
              {ctaDisplay}
            </button>
          ) : (
            <span className="text-gray-500 text-sm">{t.contactNotAvailable.replace('{pessoa}', pessoaLabelStatic)}</span>
          )}

          <DiagnosisDisclaimer variant="informative" className="mt-5 pt-4" />
          <PoweredByYlada variant="compact" />
        </div>
      </div>
    )
  }

  const hasQuizFields = fieldsValidados.some((f) => Array.isArray(f.options) && f.options.length > 0)
  const quizFields = hasQuizFields ? fieldsValidados.filter((f) => Array.isArray(f.options) && f.options.length > 0) : []
  const textFields = hasQuizFields ? fieldsValidados.filter((f) => !Array.isArray(f.options) || f.options.length === 0) : fieldsValidados
  const isQuizMode = quizFields.length > 0
  const currentField = isQuizMode ? quizFields[formStep] : null
  const isLastQuizStep = isQuizMode && formStep >= quizFields.length - 1
  // Verificar se todas as perguntas foram respondidas
  // IMPORTANTE: Aceitar qualquer valor não-undefined/non-null, incluindo "0"
  const allQuizAnswered = isQuizMode && quizFields.every((f) => {
    const valor = values[f.id]
    const temValor = valor !== undefined && valor !== null && String(valor).trim() !== ''
    if (!temValor) {
      console.log('[PublicLinkView] Pergunta não respondida:', f.id, f.label, 'valor:', valor)
    }
    return temValor
  })
  
  // Debug: logar estado de todas as perguntas
  if (isQuizMode && isLastQuizStep) {
    console.log('[PublicLinkView] Estado das perguntas:', {
      allQuizAnswered,
      totalPerguntas: quizFields.length,
      perguntas: quizFields.map(f => ({ 
        id: f.id, 
        label: f.label, 
        valor: values[f.id], 
        temValor: values[f.id] !== undefined && values[f.id] !== null && String(values[f.id]).trim() !== ''
      }))
    })
  }

  const handleOptionSelect = (fieldId: string, value: string) => {
    if (!startSent.current) {
      startSent.current = true
      trackEvent(slug, 'start')
    }
    setValues((prev) => ({ ...prev, [fieldId]: value }))
    if (isLastQuizStep) return
    setTimeout(() => setFormStep((s) => s + 1), 150)
  }

  if (isQuizMode && currentField) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8 animate-in fade-in duration-300">
          <p className="text-xs font-medium text-gray-500 mb-4">{displayTitle}</p>
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
              <div className="w-14 text-left">
                {formStep > 0 ? (
                  <button
                    type="button"
                    onClick={() => setFormStep((s) => s - 1)}
                    className="text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    ← {t.back}
                  </button>
                ) : null}
              </div>
              <span className="flex-1 text-center">{t.questionOf} {formStep + 1} {locale === 'en' ? 'of' : 'de'} {quizFields.length}</span>
              <div className="w-14" />
            </div>
            <div className="h-1.5 bg-sky-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${((formStep + 1) / quizFields.length) * 100}%` }}
              />
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 leading-snug">
            {currentField.label}
          </h2>
          <div className="space-y-3">
            {currentField.options?.map((opt, i) => {
              const isSelected = (values[currentField.id] ?? '') === String(i)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleOptionSelect(currentField.id, String(i))}
                  className={`w-full text-left py-4 px-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 text-sky-900'
                      : 'border-gray-100 hover:border-sky-200 hover:bg-gray-50/80 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                        isSelected ? 'border-sky-500 bg-sky-500 text-white' : 'border-gray-300'
                      }`}
                    >
                      {isSelected ? '✓' : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </span>
                </button>
              )
            })}
          </div>
          {isLastQuizStep && (
            <div className="mt-8">
              <button
                type="button"
                disabled={loading || !allQuizAnswered}
                onClick={(e) => {
                  try {
                    console.log('🔵 [PublicLinkView] BOTÃO CLICADO!', { 
                      loading, 
                      allQuizAnswered, 
                      disabled: loading || !allQuizAnswered,
                      values,
                      quizFieldsCount: quizFields.length,
                      quizFields: quizFields.map(f => ({ id: f.id, label: f.label, valor: values[f.id] }))
                    })
                    
                    e.preventDefault()
                    e.stopPropagation()
                    
                    if (!allQuizAnswered) {
                      console.warn('⚠️ [PublicLinkView] Bloqueado: nem todas as perguntas foram respondidas', { 
                        allQuizAnswered, 
                        quizFields: quizFields.map(f => ({ 
                          id: f.id, 
                          label: f.label, 
                          valor: values[f.id], 
                          temValor: values[f.id] !== undefined && values[f.id] !== null && String(values[f.id]).trim() !== ''
                        }))
                      })
                      setError('Por favor, responda todas as perguntas antes de ver o resultado.')
                      return
                    }
                    
                    if (loading) {
                      console.warn('⚠️ [PublicLinkView] Bloqueado: já está carregando')
                      return
                    }
                    
                    console.log('✅ [PublicLinkView] Chamando handleSubmit via onClick...')
                    // Criar um evento sintético para o handleSubmit
                    const syntheticEvent = {
                      preventDefault: () => {},
                      stopPropagation: () => {},
                    } as React.FormEvent
                    handleSubmit(syntheticEvent).catch((err) => {
                      console.error('❌ [PublicLinkView] Erro no handleSubmit:', err)
                      setError('Erro ao processar. Tente novamente.')
                    })
                  } catch (err) {
                    console.error('❌ [PublicLinkView] Erro no onClick do botão:', err)
                    setError('Erro ao processar. Tente novamente.')
                  }
                }}
                style={{
                  cursor: (loading || !allQuizAnswered) ? 'not-allowed' : 'pointer',
                  pointerEvents: (loading || !allQuizAnswered) ? 'none' : 'auto'
                }}
                className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-all duration-200"
              >
                {loading ? t.generating : submitLabel}
              </button>
              {!allQuizAnswered && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Responda todas as perguntas para ver o resultado
                </p>
              )}
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-2 text-xs text-gray-400 text-center">
                  Debug: allQuizAnswered={String(allQuizAnswered)}, loading={String(loading)}, 
                  valores={JSON.stringify(Object.keys(values).map(k => ({ [k]: values[k] })))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{displayTitle}</h1>
        {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}
        {error && (
          <p className="text-sm text-red-600 mb-4" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {textFields.map((f) => (
            <div key={f.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              {f.type === 'number' ? (
                <input
                  type="number"
                  value={values[f.id] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.id]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              ) : (
                <input
                  type="text"
                  value={values[f.id] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [f.id]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder={f.label}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? t.generating : submitLabel}
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
  locale = 'pt',
}: {
  slug: string
  config: Record<string, unknown>
  ctaText: string
  whatsappUrl: string
  onCtaClick: () => void
  title: string
  locale?: Language
}) {
  const t = PUBLIC_LINK_UI[locale]
  const cfg = config as DiagnosticoConfig
  const questions = Array.isArray(cfg.questions) ? cfg.questions : []
  const results = Array.isArray(cfg.results) ? cfg.results : []
  const resultIntro = (cfg.resultIntro as string) || (locale === 'en' ? 'Your result:' : locale === 'es' ? 'Tu resultado:' : 'Seu resultado:')

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
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4">
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
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
            >
              {ctaText}
            </button>
          ) : (
            <span className="text-gray-500 text-sm">{t.contactNotAvailable.replace('{pessoa}', locale === 'en' ? 'professional' : locale === 'es' ? 'profesional' : 'profissional')}</span>
          )}

          <DiagnosisDisclaimer variant="informative" className="mt-5 pt-4" />
          <PoweredByYlada variant="compact" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          {t.questionOf} {currentIndex + 1} {locale === 'en' ? 'of' : 'de'} {questions.length}
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
                  className="w-full text-left py-3 px-4 rounded-lg border border-gray-200 hover:border-sky-500 hover:bg-sky-50 text-gray-800 transition-colors"
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
type CalculatorFieldOption = { value: number; label: string }
type CalculatorField = {
  id: string
  label: string
  type: string
  min?: number
  max?: number
  default?: number
  options?: CalculatorFieldOption[]
}
type CalculatorConfig = {
  fields?: CalculatorField[]
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
  locale = 'pt',
}: {
  slug: string
  config: Record<string, unknown>
  ctaText: string
  whatsappUrl: string
  onCtaClick: () => void
  title: string
  locale?: Language
}) {
  const t = PUBLIC_LINK_UI[locale]
  const cfg = config as CalculatorConfig
  // Campos podem estar em config.fields (calculadora) ou config.form.fields (diagnóstico)
  const fields = (Array.isArray(cfg.fields) ? cfg.fields : (config.form as { fields?: CalculatorField[] })?.fields) ?? []
  const formula = (cfg.formula as string) || ''
  const resultLabel = (cfg.resultLabel as string) || (locale === 'en' ? 'Result:' : locale === 'es' ? 'Resultado:' : 'Resultado:')
  const resultPrefix = (cfg.resultPrefix as string) ?? ''
  const resultSuffix = (cfg.resultSuffix as string) ?? ''
  const resultIntro = (cfg.resultIntro as string) || (locale === 'en' ? 'Based on what you provided:' : locale === 'es' ? 'Según lo que proporcionaste:' : 'Com base no que você informou:')

  const [values, setValues] = useState<Record<string, number | undefined>>(() => {
    const init: Record<string, number | undefined> = {}
    fields.forEach((f) => {
      if ((f.type as string)?.toLowerCase() === 'select' && Array.isArray(f.options) && f.options.length > 0) {
        init[f.id] = (f.options[0] as CalculatorFieldOption).value
      } else {
        init[f.id] = typeof f.default === 'number' ? f.default : undefined
      }
    })
    return init
  })
  const [showResult, setShowResult] = useState(false)
  const calculatorStartSent = useRef(false)
  const calculatorCompleteSent = useRef(false)

  // Usar fieldsValidados para garantir que não há campos dissertativos
  const fieldsParaCalculadora = fieldsValidados
  const numberFields = fieldsParaCalculadora.filter((f) => (f.type as string)?.toLowerCase() !== 'select')
  const allNumberFieldsFilled = numberFields.every((f) => {
    const v = values[f.id]
    return v !== undefined && v !== null && !Number.isNaN(v)
  })

  let resultNum = 0
  try {
    let expr = formula
    fieldsParaCalculadora.forEach((f) => {
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
        {!showResult ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {fieldsParaCalculadora.map((f) => (
              <div key={f.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                {(f.type as string)?.toLowerCase() === 'select' && Array.isArray(f.options) && f.options.length > 0 ? (
                  <select
                    value={String(values[f.id] ?? (f.options[0] as CalculatorFieldOption).value ?? '')}
                    onChange={(e) => setValues((prev) => ({ ...prev, [f.id]: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    {f.options.map((opt) => (
                      <option key={String(opt.value)} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    min={f.min}
                    max={f.max}
                    value={values[f.id] ?? ''}
                    onChange={(e) => {
                      const v = e.target.value
                      setValues((prev) => ({ ...prev, [f.id]: v === '' ? undefined : Number(v) }))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={!allNumberFieldsFilled}
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {t.calculate}
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
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors"
              >
                {ctaText}
              </button>
            ) : (
              <span className="text-gray-500 text-sm">{t.contactNotAvailable.replace('{pessoa}', locale === 'en' ? 'professional' : locale === 'es' ? 'profesional' : 'profissional')}</span>
            )}

            <DiagnosisDisclaimer variant="informative" className="mt-5 pt-4" />
            <PoweredByYlada variant="compact" />
          </>
        )}
      </div>
    </div>
  )
}
