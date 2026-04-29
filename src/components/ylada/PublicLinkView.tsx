'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { formatDisplayTitle, getStrategicIntro, patientFacingTitleFromStoredPageTitle } from '@/lib/ylada/strategic-intro'
import {
  FREEMIUM_LIMIT_TYPE_EXTRA_ACTIVE_LINK,
  YLADA_FREEMIUM_WHATSAPP_MONTHLY_LIMIT_MESSAGE_VISITOR,
  YLADA_PRO_UPGRADE_PITCH_VISITOR,
} from '@/config/freemium-limits'
import DiagnosisDisclaimer from '@/components/ylada/DiagnosisDisclaimer'
import {
  buildMatrixCommerceNarrativeFromSelectedLabels,
  enrichCommerceResultDescriptionIfGeneric,
  getMatrixCommercePublicLinkCopy,
  isGenericCommerceLibraryDescription,
  isMatrixCommercePublicLinkSegment,
} from '@/config/ylada-public-link-commerce-ui'
import PoweredByYlada from '@/components/ylada/PoweredByYlada'
import type { Language } from '@/lib/i18n'
import { createClient } from '@/lib/supabase-client'

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
  talkNow: string
  seeFullAnalysis: string
  hideFullAnalysis: string
  shareResult: string
  shareLoveCta: string
  profileLabel: string
  /** Pro Líderes: quiz recrutamento (negócio Herbalife — sem tom clínico) */
  recruitmentBadge: string
  recruitmentIntroTitle: string
  recruitmentIntroSubtitle: string
  recruitmentIntroMicro: string
  recruitmentBoxTitle: string
  recruitmentBoxDisclaimer: string
  recruitmentBoxHint: string
  recruitmentTalkNow: string
  recruitmentYourResult: string
  /** Intro antes do quiz por template (`DiagnosticoQuiz`) */
  quizIntroBadge: string
  quizIntroLead: string
  quizIntroMicro: string
  quizResultHelperLine: string
  /** Entrada da calculadora pública (antes do formulário). */
  calculatorIntroBadge: string
  calculatorIntroLead: string
  calculatorIntroMicro: string
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
    talkNow: '💬 Falar com profissional',
    seeFullAnalysis: 'Ver análise completa',
    hideFullAnalysis: 'Ocultar análise completa',
    shareResult: '📲 Compartilhe: Isso pode ajudar alguém que você conhece',
    shareLoveCta: 'Você pode ajudar alguém',
    profileLabel: 'Seu perfil',
    recruitmentBadge: 'Avaliação de perfil',
    recruitmentIntroTitle: 'Algumas perguntas rápidas',
    recruitmentIntroSubtitle:
      'Vamos alinhar o teu perfil e o teu interesse em conversar sobre oportunidade de negócio — sem compromisso.',
    recruitmentIntroMicro: 'Tempo estimado: 2 a 3 minutos',
    recruitmentBoxTitle: 'Próximo passo',
    recruitmentBoxDisclaimer:
      'Este resumo reflete as tuas respostas. Para o modelo de negócio, próximos passos e dúvidas sobre a oportunidade com a equipe, fala com quem te enviou este link.',
    recruitmentBoxHint: 'Usa o WhatsApp abaixo para continuar a conversa com a pessoa que partilhou o quiz.',
    recruitmentTalkNow: '💬 Falar no WhatsApp',
    recruitmentYourResult: 'O teu resultado',
    quizIntroBadge: 'Análise guiada',
    quizIntroLead:
      'Em poucos cliques você vê um primeiro recorte sobre o que o seu corpo e a sua rotina pedem neste tema: o que pesa no dia a dia e por onde costuma fazer sentido começar. Rápido, direto e pensado para quem quer se entender melhor.',
    quizIntroMicro: 'Tempo estimado: cerca de 1 a 2 minutos',
    quizResultHelperLine:
      'Cada corpo responde de um jeito. Este resumo ajuda a abrir a conversa com um profissional.',
    calculatorIntroBadge: 'Antes de começar',
    calculatorIntroLead:
      'Em poucos passos você recebe um primeiro resultado com base no que informar aqui — rápido, direto e pensado para quem quer um número de partida antes de falar com um profissional. Não substitui avaliação presencial.',
    calculatorIntroMicro: 'Tempo estimado: cerca de 1 minuto · sem cadastro: preencher e ver o resultado.',
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
    talkNow: '💬 Talk to a professional',
    seeFullAnalysis: 'See full analysis',
    hideFullAnalysis: 'Hide full analysis',
    shareResult: '📲 Send this so someone can try it',
    shareLoveCta: 'Liked it? Share with someone you love.',
    profileLabel: 'Your profile',
    recruitmentBadge: 'Profile assessment',
    recruitmentIntroTitle: 'A few quick questions',
    recruitmentIntroSubtitle:
      "We'll align your profile and interest in discussing a business opportunity — no commitment.",
    recruitmentIntroMicro: 'Estimated time: 2–3 minutes',
    recruitmentBoxTitle: 'Next step',
    recruitmentBoxDisclaimer:
      'This summary reflects your answers. For the business model, next steps and questions about the opportunity with the team, talk to whoever sent you this link.',
    recruitmentBoxHint: 'Use WhatsApp below to continue the conversation with the person who shared the quiz.',
    recruitmentTalkNow: '💬 Continue on WhatsApp',
    recruitmentYourResult: 'Your result',
    quizIntroBadge: 'Guided check-in',
    quizIntroLead:
      'In just a few taps, get a first read on what your body and routine are asking for here: what shows up in daily life and where it usually makes sense to start. Quick, clear, and built for anyone curious to understand themselves better.',
    quizIntroMicro: 'Estimated time: about 1 to 2 minutes',
    quizResultHelperLine:
      'Every body responds differently. This summary helps you start the conversation with a professional.',
    calculatorIntroBadge: 'Before you start',
    calculatorIntroLead:
      'In a few steps you get a first result based on what you enter here — quick, clear, and meant as a starting number before talking to a professional. It does not replace an in-person assessment.',
    calculatorIntroMicro: 'Estimated time: about 1 minute · no sign-up: fill in and see your result.',
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
    talkNow: '💬 Hablar con profesional',
    seeFullAnalysis: 'Ver análisis completo',
    hideFullAnalysis: 'Ocultar análisis completo',
    shareResult: '📲 Enviar para que alguien lo haga',
    shareLoveCta: 'Te gustó? Compártelo con alguien que amas.',
    profileLabel: 'Tu perfil',
    recruitmentBadge: 'Evaluación de perfil',
    recruitmentIntroTitle: 'Algunas preguntas rápidas',
    recruitmentIntroSubtitle:
      'Alineamos tu perfil y tu interés en conversar sobre oportunidad de negocio — sin compromiso.',
    recruitmentIntroMicro: 'Tiempo estimado: 2 a 3 minutos',
    recruitmentBoxTitle: 'Próximo paso',
    recruitmentBoxDisclaimer:
      'Este resumen refleja tus respuestas. Para el modelo de negocio, próximos pasos y dudas sobre la oportunidad con el equipo, habla con quien te envió este enlace.',
    recruitmentBoxHint: 'Usa el WhatsApp abajo para seguir la conversación con quien compartió el quiz.',
    recruitmentTalkNow: '💬 Hablar por WhatsApp',
    recruitmentYourResult: 'Tu resultado',
    quizIntroBadge: 'Análisis guiado',
    quizIntroLead:
      'En pocos toques ves un primer recorte de lo que tu cuerpo y tu rutina piden en este tema: qué pesa en el día a día y por dónde suele tener sentido empezar. Rápido, directo y pensado para quien quiere entenderse mejor.',
    quizIntroMicro: 'Tiempo estimado: unos 1 a 2 minutos',
    quizResultHelperLine:
      'Cada cuerpo responde distinto. Este resumen ayuda a abrir la conversación con un profesional.',
    calculatorIntroBadge: 'Antes de empezar',
    calculatorIntroLead:
      'En pocos pasos recibes un primer resultado según lo que indiques aquí: rápido, claro y pensado como punto de partida antes de hablar con un profesional. No sustituye una valoración presencial.',
    calculatorIntroMicro: 'Tiempo estimado: cerca de 1 minuto · sin registro: rellenar y ver el resultado.',
  },
}

/** Exibe textos de template sem travessão longa (substituição suave para leitura em tela). */
function softenTemplateEmDashes(text: string): string {
  return text.replace(/\s*—\s*/g, ': ').replace(/\s*–\s*/g, ', ')
}

/** Remove marcadores no texto quando a lista HTML já usa `list-disc` (evita bolinhas duplicadas em `summary_bullets`). */
function stripLeadingListMarkers(raw: string): string {
  let s = raw.trim()
  while (/^[•·∙\-\*–—]\s*/u.test(s)) {
    s = s.replace(/^[•·∙\-\*–—]\s*/u, '')
  }
  return s.trim()
}

/** Visitante: link “extra” quando a dona não é Pro e tem mais de um diagnóstico ativo. */
function FreemiumExtraLinkBlockedScreen({
  locale,
  pageTitle,
}: {
  locale: Language
  pageTitle: string
}) {
  const title =
    locale === 'en'
      ? 'This link is not available right now'
      : locale === 'es'
        ? 'Este enlace no está disponible por ahora'
        : 'Este link não está disponível no momento'
  const body =
    locale === 'en'
      ? 'The professional is on the free YLADA plan: only one active diagnosis is open to the public at a time. This link is paused for now.'
      : locale === 'es'
        ? 'La profesional está en el plan gratuito de YLADA: solo un diagnóstico activo está abierto al público a la vez. Este enlace está pausado por ahora.'
        : 'No plano gratuito da YLADA, só um diagnóstico fica aberto para novas visitas por vez. Por isso este link está pausado no momento.'
  const proLine =
    locale === 'en'
      ? 'With Pro she unlocks unlimited Noel for strategy and attracting clients, unlimited links and flows for lead generation, and unlimited WhatsApp conversations.'
      : locale === 'es'
        ? 'Con Pro libera Noel ilimitado para estrategia y atraer clientes, enlaces y flujos ilimitados para generar contactos y conversaciones ilimitadas por WhatsApp.'
        : YLADA_PRO_UPGRADE_PITCH_VISITOR
  const cta = locale === 'en' ? 'View YLADA plans' : locale === 'es' ? 'Ver planes YLADA' : 'Ver planos YLADA'
  const souPro =
    locale === 'en' ? 'I am the professional — log in' : locale === 'es' ? 'Soy la profesional — entrar' : 'Sou a profissional — entrar'
  const footer = locale === 'en' ? 'Created with YLADA' : locale === 'es' ? 'Creado con YLADA' : 'Criado com YLADA'

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-amber-100/80 p-6 sm:p-8">
        <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
          {locale === 'en' ? 'Unavailable' : locale === 'es' ? 'No disponible' : 'Indisponível'}
        </p>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">{title}</h1>
        {pageTitle ? (
          <p className="text-sm text-gray-500 mb-3 truncate" title={pageTitle}>
            {pageTitle}
          </p>
        ) : null}
        <p className="text-gray-700 text-sm leading-relaxed mb-4">{body}</p>
        <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-100">
          <p className="text-sm text-sky-800 leading-relaxed">{proLine}</p>
        </div>
        <div className="space-y-3 mb-6">
          <Link
            href="/pt/precos"
            className="block w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-center transition-colors"
          >
            {cta}
          </Link>
          <Link
            href="/pt/login"
            className="block w-full py-2 px-4 text-sky-700 hover:text-sky-900 text-sm font-medium text-center"
          >
            {souPro}
          </Link>
        </div>
        <p className="text-center text-xs text-gray-500">{footer}</p>
      </div>
    </div>
  )
}

type Payload = {
  slug: string
  type: 'diagnostico' | 'calculator'
  title: string
  config: Record<string, unknown>
  ctaWhatsapp: string | null
  accessBlockedDueToPlan?: boolean
  link_owner_user_id?: string | null
}

type LinkTelemetryCtx = {
  viewerReady: boolean
  viewerUserId: string | null
  ownerId: string | null
  slug: string
  /** Pro Líderes: ?pl_m= token — atribui cliques/WhatsApp ao membro da equipe. */
  plShareToken: string | null
}

const linkTelemetryRef: { current: LinkTelemetryCtx } = {
  current: { viewerReady: false, viewerUserId: null, ownerId: null, slug: '', plShareToken: null },
}

/** Telemetria do link público: aguarda sessão; não registra quando o visitante é o dono do link. */
function trackLinkEvent(slug: string, eventType: string, options?: { metrics_id?: string }) {
  const ctx = linkTelemetryRef.current
  if (ctx.slug !== slug) return
  if (!ctx.viewerReady) return
  if (ctx.ownerId && ctx.viewerUserId && ctx.ownerId === ctx.viewerUserId) return
  try {
    const body: Record<string, unknown> = {
      slug,
      event_type: eventType,
      device: typeof navigator !== 'undefined' ? navigator.userAgent?.slice(0, 200) : null,
    }
    if (ctx.plShareToken) {
      body.utm_json = { pl_m: ctx.plShareToken }
    }
    if (options?.metrics_id) body.metrics_id = options.metrics_id
    if (ctx.viewerUserId) body.viewer_user_id = ctx.viewerUserId
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

function buildWhatsAppUrl(ctaWhatsapp: string | null): string {
  if (!ctaWhatsapp || !ctaWhatsapp.trim()) return ''
  const v = ctaWhatsapp.trim()
  if (/^https?:\/\//i.test(v)) return v
  const num = v.replace(/\D/g, '')
  if (!num.length) return ''
  return `https://wa.me/${num}`
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

function sanitizeResultTitle(text: string): string {
  if (!text?.trim()) return ''
  let cleaned = text.trim()
  cleaned = cleaned.replace(/^seu resultado inicial em\s+/i, '')
  cleaned = cleaned.replace(/^seu resultado em\s+/i, '')
  cleaned = cleaned.replace(/^resultado em\s+/i, '')
  return cleaned.trim()
}

function normalizeForCompare(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isRedundantWithTitle(title: string, text: string): boolean {
  const t = normalizeForCompare(title)
  const x = normalizeForCompare(text)
  if (!t || !x) return false
  return x.includes(t) || t.includes(x) || x.includes('seu resultado indica sinais em')
}

function isVerySimilarText(a?: string, b?: string): boolean {
  const x = normalizeForCompare(a || '')
  const y = normalizeForCompare(b || '')
  if (!x || !y) return false
  if (x === y) return true
  const xWords = x.split(' ').filter(Boolean)
  const yWords = y.split(' ').filter(Boolean)
  if (xWords.length === 0 || yWords.length === 0) return false
  const xSet = new Set(xWords)
  const overlap = yWords.filter((w) => xSet.has(w)).length
  const ratio = overlap / Math.max(xWords.length, yWords.length)
  return ratio >= 0.8
}

function buildPrimaryInsight(diagnosis: DiagnosisResultState, diagnosisCardText: string): string {
  const cause = diagnosis.causa_provavel?.trim() || ''
  const concern = diagnosis.preocupacoes?.trim() || ''
  const consequence = diagnosis.consequence?.trim() || ''
  const growth = diagnosis.growth_potential?.trim() || ''

  if (cause && !isVerySimilarText(cause, diagnosisCardText) && !isVerySimilarText(cause, consequence)) {
    return cause
  }
  if (consequence && !isVerySimilarText(consequence, diagnosisCardText)) {
    return consequence
  }
  if (concern && !isVerySimilarText(concern, diagnosisCardText)) {
    return concern
  }
  if (growth) {
    return growth
  }
  return diagnosisCardText
}

function shouldAvoidAsProfileName(text: string): boolean {
  const v = normalizeForCompare(text)
  if (!v) return true
  return v.startsWith('qual ') || v.includes('?')
}

function isGenericProfileToken(text: string): boolean {
  const v = normalizeForCompare(text)
  if (!v) return true
  if (v === 'seu resultado' || v === 'your result' || v === 'tu resultado') return true
  const generic = new Set([
    'unha',
    'unhas',
    'pele',
    'cabelo',
    'saude',
    'resultado',
    'perfil',
  ])
  return generic.has(v)
}

/** Frase cortada no meio (ex.: 8 palavras parando em "pode resultar"). */
function isIncompleteFragment(text: string): boolean {
  const t = (text || '').trim()
  if (!t) return true
  if (/[.!?]$/.test(t)) return false
  return /\b(pode|poderia|resultar|será|deve|ter|dar|ficar|estar)\s*$/i.test(t)
}

function toShortProfileName(text: string): string {
  const trimmed = (text || '').trim()
  if (!trimmed) return ''
  const firstSentence = trimmed.split(/[.!?]/)[0]?.trim() || trimmed
  let base = firstSentence
    .replace(/^a causa provavel:\s*/i, '')
    .replace(/^causa provavel:\s*/i, '')
    .replace(/^a causa provável:\s*/i, '')
    .replace(/^causa provável:\s*/i, '')
    .replace(/^seu resultado indica\s*/i, '')
    .replace(/^sinais em\s*/i, '')
    .trim()

  if (/rotina de cuidados .* irregular/i.test(base)) {
    return 'Rotina de cuidados inconsistente'
  }
  if (
    /hidratacao|hidratação|sol|protecao|proteção|pele/i.test(base) &&
    !/unha|unhas|manicure|esmalte/i.test(base)
  ) {
    return 'Descuido com hidratação e proteção da pele'
  }
  const words = base.split(/\s+/).filter(Boolean)
  const maxWords = 14
  if (words.length > maxWords) {
    base = words.slice(0, maxWords).join(' ')
  }
  if (isIncompleteFragment(base)) {
    const fullWords = trimmed.split(/\s+/).filter(Boolean)
    const extended = fullWords.slice(0, 22).join(' ')
    if (!isIncompleteFragment(extended) || extended.length > base.length + 8) {
      base = extended
    }
  }
  if (isIncompleteFragment(base)) {
    const withEnding = trimmed.match(/^[^.!?]+[.!?]/)
    if (withEnding && withEnding[0].trim().length >= 12) {
      base = withEnding[0].trim()
    }
  }
  return base
}

function themeHintImpliesSkin(themeHint: string): boolean {
  const t = themeHint.toLowerCase()
  if (/unha|unhas|manicure|esmalte/.test(t)) return false
  return /pele|skincare|dermat|manchas|celulite|flacidez|idrata|sol|prote[cç][aã]o|est[eé]tica facial/.test(t)
}

function themeHintImpliesNails(themeHint: string): boolean {
  return /unha|unhas|manicure|esmalte/.test(themeHint.toLowerCase())
}

function toImpactDiagnosisText(text: string, themeHint = ''): string {
  const trimmed = (text || '').trim()
  if (!trimmed) return trimmed
  const skinRewriteOk = themeHintImpliesSkin(themeHint) && !themeHintImpliesNails(themeHint)
  if (
    skinRewriteOk &&
    /rotina de cuidados|hidratacao|hidratação|sol|protecao|proteção/i.test(trimmed) &&
    /pele/i.test(trimmed)
  ) {
    return 'Sua pele já está dando sinais claros — e esse quadro tende a se intensificar sem ajuste.'
  }
  const cleaned = trimmed
    .replace(/em relacao a sua pele com frequencia/gi, 'com frequência')
    .replace(/em relação à sua pele com frequência/gi, 'com frequência')
    .replace(/em relacao a sua pele/gi, '')
    .replace(/em relação à sua pele/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  if (skinRewriteOk && /^pelos seus relatos/i.test(trimmed)) {
    return cleaned
      .replace(/^pelos seus relatos,\s*/i, '')
      .replace(/^alguns sinais/i, 'Sua pele já está dando sinais')
      .replace(/aparecem com frequência/i, 'com frequência')
      .replace(/com frequência\./i, 'frequentes.')
  }
  return cleaned
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

export default function PublicLinkView({
  payload,
  locale = 'pt',
  shareAttributionToken = null,
}: {
  payload: Payload
  locale?: Language
  /** Query `pl_m` na URL pública — Pro Líderes (rastreio por membro). */
  shareAttributionToken?: string | null
}) {
  const { slug, type, title, config, ctaWhatsapp, accessBlockedDueToPlan, link_owner_user_id: linkOwnerUserId } = payload
  const t = PUBLIC_LINK_UI[locale]
  const viewSent = useRef(false)
  const [viewerReady, setViewerReady] = useState(false)
  const [viewerUserId, setViewerUserId] = useState<string | null>(null)
  const [plShareTokenState, setPlShareTokenState] = useState<string | null>(() => {
    const u = shareAttributionToken?.trim()
    return u || null
  })
  const [plAttributionReady, setPlAttributionReady] = useState(() => Boolean(shareAttributionToken?.trim()))

  useEffect(() => {
    const fromUrl = shareAttributionToken?.trim()
    if (fromUrl) {
      try {
        sessionStorage.setItem(`ylada_plm_${slug}`, fromUrl)
      } catch {
        /* ignore */
      }
      setPlShareTokenState(fromUrl)
      setPlAttributionReady(true)
      return
    }
    try {
      const s = sessionStorage.getItem(`ylada_plm_${slug}`)?.trim()
      if (s) setPlShareTokenState(s)
    } catch {
      /* ignore */
    }
    setPlAttributionReady(true)
  }, [slug, shareAttributionToken])

  linkTelemetryRef.current = {
    viewerReady,
    viewerUserId,
    ownerId: linkOwnerUserId ?? null,
    slug,
    plShareToken: plShareTokenState,
  }

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      setViewerUserId(null)
      setViewerReady(true)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setViewerUserId(data.session?.user?.id ?? null)
      setViewerReady(true)
    })
  }, [])

  useEffect(() => {
    if (!viewerReady) return
    if (!plAttributionReady) return
    if (accessBlockedDueToPlan) return
    if (viewSent.current) return
    viewSent.current = true
    trackLinkEvent(slug, 'view')
  }, [slug, accessBlockedDueToPlan, viewerReady, plAttributionReady])

  const resultCta = (config.result as Record<string, unknown>)?.cta as Record<string, unknown> | undefined
  const ctaText = (resultCta?.text as string) || (config.ctaText as string) || (config.ctaDefault as string) || t.speakWhatsApp
  const whatsappUrl = buildWhatsAppUrl(ctaWhatsapp)

  const handleCtaClick = (metricsId?: string, whatsappPrefill?: string) => {
    trackLinkEvent(slug, 'cta_click', metricsId ? { metrics_id: metricsId } : undefined)
    if (whatsappUrl) {
      const url = whatsappPrefill
        ? `${whatsappUrl}${whatsappUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(whatsappPrefill)}`
        : whatsappUrl
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  if (accessBlockedDueToPlan) {
    return <FreemiumExtraLinkBlockedScreen locale={locale} pageTitle={formatDisplayTitle(title)} />
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
type ResultConfig = {
  headline?: string
  description?: string
  summary_bullets?: string[]
  cta?: { text?: string }
}

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
  frase_identificacao?: string
  dica_rapida?: string
  specific_actions?: string[]
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
  const page = (config.page as Record<string, unknown>) || {}
  const formConfig = (config.form as Record<string, unknown>) || {}
  const resultConfig = (config.result as ResultConfig) || {}
  const meta = (config.meta as Record<string, unknown>) || {}
  const archMeta = typeof meta.architecture === 'string' ? meta.architecture : ''
  const segmentCodeForUi =
    typeof meta.segment_code === 'string' ? String(meta.segment_code).toLowerCase().trim() : ''
  const useCommercePublicCopy =
    isMatrixCommercePublicLinkSegment(segmentCodeForUi) && archMeta !== 'PERFUME_PROFILE'
  const commercePublicCopy = useCommercePublicCopy ? getMatrixCommercePublicLinkCopy(locale) : null
  const t = commercePublicCopy ? { ...PUBLIC_LINK_UI[locale], ...commercePublicCopy } : PUBLIC_LINK_UI[locale]
  const isProLideresRecruitmentLink =
    meta.pro_lideres_preset === true && meta.pro_lideres_kind === 'recruitment'
  const fieldsRaw = (formConfig.fields as FormField[]) || []
  const submitLabel = (formConfig.submit_label as string) || t.seeResult
  /** Calculadora de projeção: nunca injetar opções Sim/Não — sempre entrada numérica (corrige links antigos mal gerados). */
  const fields =
    archMeta === 'PROJECTION_CALCULATOR'
      ? fieldsRaw.map((f) => ({ ...f, type: 'number', options: undefined }))
      : fieldsRaw

  // GARANTIR: todo campo de pergunta sem opções vira múltipla escolha (evita intro "6 perguntas" com só 3 no fluxo).
  // Templates da biblioteca usam type 'single' com options às vezes ausentes — antes só text/textarea recebiam defaults.
  const fieldsValidados = fields.map((f) => {
    const tipo = (f.type || '').toLowerCase()
    if (tipo === 'number') {
      return { ...f, options: undefined }
    }
    const noOptions = !f.options || f.options.length === 0
    const isQuestionLike =
      !f.type ||
      tipo === 'text' ||
      tipo === 'textarea' ||
      tipo === 'select' ||
      tipo === 'single' ||
      tipo === 'radio' ||
      tipo === 'multiselect'
    if (noOptions && isQuestionLike) {
      return {
        ...f,
        type: 'select',
        options: ['Sim', 'Não', 'Às vezes', 'Não tenho certeza'],
      }
    }
    return f
  })

  /** Perguntas que de fato aparecem no modo quiz (com opções) — deve bater com o texto da intro */
  const visibleQuizQuestionCount =
    fieldsValidados.filter((f) => Array.isArray(f.options) && f.options.length > 0).length || fieldsValidados.length

  const pageTitleRaw = (page.title as string) ?? (config.title as string) ?? 'Link'
  const pageTitle = patientFacingTitleFromStoredPageTitle(pageTitleRaw)
  const displayTitle = formatDisplayTitle(pageTitle)
  const subtitle = (page.subtitle as string) || ''

  const [values, setValues] = useState<Record<string, string>>({})
  const [step, setStep] = useState<'intro' | 'form' | 'result' | 'limit_reached' | 'access_paused'>('intro')
  const [formStep, setFormStep] = useState(0)
  const [diagnosis, setDiagnosis] = useState<DiagnosisResultState | null>(null)
  const [metricsId, setMetricsId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [freemiumLimitMessage, setFreemiumLimitMessage] = useState<string | null>(null)
  const [showFullAnalysis, setShowFullAnalysis] = useState(false)
  const startSent = useRef(false)
  const completeSent = useRef(false)
  const resultViewSent = useRef(false)

  useEffect(() => {
    setFreemiumLimitMessage(null)
  }, [slug])

  useEffect(() => {
    if (step === 'result' && diagnosis && metricsId && !resultViewSent.current) {
      resultViewSent.current = true
      trackLinkEvent(slug, 'result_view', { metrics_id: metricsId })
    }
  }, [step, diagnosis, metricsId, slug])

  // Garantir que quando diagnosis e metricsId estiverem prontos, o step seja 'result'
  useEffect(() => {
    if (diagnosis && metricsId) {
      console.log('✅ [PublicLinkView] useEffect: Diagnosis e metricsId prontos', {
        step,
        hasDiagnosis: !!diagnosis,
        hasMetricsId: !!metricsId,
        loading
      })
      if (step !== 'result') {
        console.log('✅ [PublicLinkView] useEffect: Mudando step de', step, 'para result')
        setStep('result')
      }
    } else {
      console.log('⏳ [PublicLinkView] useEffect: Aguardando diagnosis/metricsId', {
        step,
        hasDiagnosis: !!diagnosis,
        hasMetricsId: !!metricsId,
        loading
      })
    }
  }, [diagnosis, metricsId, step, loading])

  const useDiagnosisApi =
    !isProLideresRecruitmentLink &&
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
      trackLinkEvent(slug, 'start')
    }
    if (!completeSent.current) {
      completeSent.current = true
      trackLinkEvent(slug, 'complete')
    }

    if (useDiagnosisApi) {
      console.log('🔵 [PublicLinkView] useDiagnosisApi = true, fazendo fetch para API...', { slug, values })
      setLoading(true)
      setError(null)
      try {
        const url = `/api/ylada/links/${encodeURIComponent(slug)}/diagnosis`
        // IMPORTANTE: Enviar apenas os valores dos campos que foram exibidos no quiz
        // No modo quiz, enviar apenas os valores de quizFields
        const answersToSend = isQuizMode 
          ? Object.fromEntries(
              quizFields.map(f => [f.id, values[f.id]]).filter(([, v]) => v !== undefined && v !== null)
            )
          : values
        const body = {
          visitor_answers: answersToSend,
          ...(locale !== 'pt' && { locale }),
        }
        console.log('🔵 [PublicLinkView] Fazendo POST para:', url, { 
          body,
          isQuizMode,
          quizFieldsCount: quizFields.length,
          answersToSend,
          allValues: values
        })
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        console.log('🔵 [PublicLinkView] Resposta recebida:', { status: res.status, ok: res.ok })
        const data = await res.json().catch((err) => {
          console.error('❌ [PublicLinkView] Erro ao fazer parse do JSON:', err)
          return {}
        })
        console.log('🔵 [PublicLinkView] Dados recebidos da API:', { 
          hasDiagnosis: !!data.diagnosis, 
          hasMetricsId: !!data.metrics_id,
          limitReached: data.limit_reached,
          error: data.error,
          message: data.message,
          fullData: data // Log completo para debug
        })
        if (!res.ok) {
          if (data.limit_reached && data.limit_type === FREEMIUM_LIMIT_TYPE_EXTRA_ACTIVE_LINK) {
            setStep('access_paused')
            setLoading(false)
            return
          }
          if (data.limit_reached) {
            console.log('⚠️ [PublicLinkView] Limite atingido')
            setFreemiumLimitMessage(
              typeof data.message === 'string' && data.message.trim() ? data.message.trim() : null
            )
            setStep('limit_reached')
            setLoading(false)
            return
          }
          console.error('❌ [PublicLinkView] Erro na resposta da API:', data)
          setError(data.error || data.message || 'Erro ao gerar resultado.')
          setLoading(false)
          return
        }
        if (data.diagnosis && data.metrics_id) {
          console.log('✅ [PublicLinkView] Diagnóstico recebido:', { 
            hasDiagnosis: !!data.diagnosis, 
            metricsId: data.metrics_id,
            diagnosisKeys: Object.keys(data.diagnosis || {}),
            diagnosisPreview: JSON.stringify(data.diagnosis).substring(0, 200)
          })
          // Atualizar estados primeiro
          setDiagnosis(data.diagnosis)
          setMetricsId(data.metrics_id)
          // Mudar step imediatamente - React vai reagir quando diagnosis/metricsId mudarem
          console.log('✅ [PublicLinkView] Estados atualizados, mudando step para result AGORA')
          setStep('result')
          setLoading(false) // Importante: desabilitar loading para mostrar resultado
        } else {
          console.error('❌ [PublicLinkView] Resposta inválida da API - faltando diagnosis ou metrics_id:', {
            hasDiagnosis: !!data.diagnosis,
            hasMetricsId: !!data.metrics_id,
            dataKeys: Object.keys(data)
          })
          setError('Resposta inválida da API. Tente novamente.')
          setLoading(false)
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

  const headline = resultConfig.headline || (isProLideresRecruitmentLink ? t.recruitmentYourResult : t.yourResult)
  const resultDescriptionRaw =
    typeof resultConfig.description === 'string' && resultConfig.description.trim()
      ? resultConfig.description.trim()
      : ''
  const resultDescription = enrichCommerceResultDescriptionIfGeneric(locale, segmentCodeForUi, resultDescriptionRaw)
  const summaryBullets = Array.isArray(resultConfig.summary_bullets) ? resultConfig.summary_bullets : []

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
    architecture: typeof meta.architecture === 'string' ? meta.architecture : undefined,
    questions_count: visibleQuizQuestionCount > 0 ? visibleQuizQuestionCount : undefined,
  })
  const introForDisplay = isProLideresRecruitmentLink
    ? {
        title: t.recruitmentIntroTitle,
        subtitle: t.recruitmentIntroSubtitle,
        micro: t.recruitmentIntroMicro,
      }
    : introContent

  if (step === 'access_paused') {
    return <FreemiumExtraLinkBlockedScreen locale={locale} pageTitle={displayTitle} />
  }

  // Tela de limite atingido (freemium) — tom de crescimento + promoção do Pro
  if (step === 'limit_reached') {
    if (locale === 'pt') {
      const bodyText = freemiumLimitMessage?.trim() || YLADA_FREEMIUM_WHATSAPP_MONTHLY_LIMIT_MESSAGE_VISITOR
      const criarMeu = 'Criar meu diagnóstico grátis'
      const segments = bodyText
        .split(/\n\n+/)
        .map((s) => s.trim())
        .filter(Boolean)
      const situationText = segments[0] ?? bodyText
      const proPitchText = segments.length > 1 ? segments.slice(1).join('\n\n') : ''
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/80 to-sky-100/90 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-sky-200/40 border border-sky-100/80 p-6 sm:p-8 ring-1 ring-sky-100/60">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-block text-xs font-semibold text-sky-700 bg-sky-100/90 px-3 py-1.5 rounded-full border border-sky-200/80">
                Resultado
              </span>
              <span className="inline-block text-xs font-medium text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/80">
                Limite do mês
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
              Pausa neste diagnóstico
            </h1>
            <div className="rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-amber-50/30 p-4 mb-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-900/80 mb-2">
                O que aconteceu
              </p>
              <p className="text-sm text-amber-950 leading-relaxed">{situationText}</p>
            </div>
            {proPitchText ? (
              <div className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-sky-50/50 p-4 mb-6 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-800 mb-2">
                  Plano Pro
                </p>
                <p className="text-sm text-slate-800 leading-relaxed">{proPitchText}</p>
              </div>
            ) : null}
            <div className="space-y-3 mb-6">
              <a
                href="/pt/precos"
                className="block w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold rounded-xl text-center text-base shadow-lg shadow-sky-600/25 transition-all hover:shadow-sky-600/35 active:scale-[0.99]"
              >
                Quero o plano Pro
              </a>
              <p className="text-center text-xs text-slate-500">Sem compromisso — veja valores e benefícios na próxima tela.</p>
              <a
                href="/pt/precos"
                className="block w-full py-2.5 px-4 text-sky-700 hover:text-sky-900 text-sm font-medium text-center rounded-lg hover:bg-sky-50 transition-colors"
              >
                {criarMeu}
              </a>
            </div>
            <p className="text-center text-xs text-gray-500">Criado com YLADA</p>
          </div>
        </div>
      )
    }

    const limitTitle =
      locale === 'en'
        ? 'A pause on this diagnosis'
        : 'Una pausa en este diagnóstico'
    const limitBody =
      locale === 'en'
        ? 'WhatsApp conversations from this link have reached what the free plan allows this month. They resume next month. For unlimited reception, the professional can activate Pro.'
        : 'Las conversaciones por WhatsApp de este enlace alcanzaron lo que permite el plan gratuito este mes. Vuelven el próximo mes. Para recepción sin límite, la profesional puede activar Pro.'
    const proBenefit =
      locale === 'en'
        ? 'With Pro she unlocks unlimited Noel for strategy and attracting clients, unlimited links and flows for lead generation, and unlimited WhatsApp conversations.'
        : 'Con Pro libera Noel ilimitado para estrategia y atraer clientes, enlaces y flujos ilimitados para generar contactos y conversaciones ilimitadas por WhatsApp.'
    const verPlanos = locale === 'en' ? 'View plans' : 'Ver planes'
    const criarMeu =
      locale === 'en' ? 'Create my free diagnosis' : 'Crear mi diagnóstico gratis'
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-sky-100/50 border border-sky-100/60 p-6 sm:p-8">
          <div className="mb-4">
            <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
              {locale === 'en' ? 'Result' : 'Resultado'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">{limitTitle}</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{limitBody}</p>
          <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-100">
            <p className="text-sm font-medium text-sky-900 mb-1">
              {locale === 'en' ? 'What Pro unlocks' : 'Qué desbloquea Pro'}
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
              {isProLideresRecruitmentLink ? t.recruitmentBadge : t.personalizedDiagnosis}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight">{introForDisplay.title}</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{introForDisplay.subtitle}</p>
          <p className="text-xs font-medium text-sky-600 mb-6 flex items-center gap-1.5">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {introForDisplay.micro}
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
    if (diagnosis && metricsId && !isProLideresRecruitmentLink) {
      const isPerfumery = meta.architecture === 'PERFUME_PROFILE' || meta.segment_code === 'perfumaria'
      const areaProf = typeof meta.area_profissional === 'string' ? meta.area_profissional : ''
      const useEspecialista =
        areaProf === 'vendas' || ['seller', 'perfumaria', 'nutra', 'joias'].includes(segmentCodeForUi)
      const pessoaLabel = useEspecialista ? 'especialista' : 'profissional'
      const rawProfileName = sanitizeResultTitle(diagnosis.profile_title || '')
      const fallbackProfileFromInsight = sanitizeResultTitle(diagnosis.main_blocker || diagnosis.causa_provavel || '')
      const contextTitle = sanitizeResultTitle(displayTitle)
      const rawProfileTooWeak =
        shouldAvoidAsProfileName(rawProfileName) ||
        isGenericProfileToken(rawProfileName) ||
        rawProfileName.trim().length < 5
      const fallbackTooWeak =
        shouldAvoidAsProfileName(fallbackProfileFromInsight) ||
        isGenericProfileToken(fallbackProfileFromInsight) ||
        fallbackProfileFromInsight.trim().length < 5
      const chosenProfileBase = !rawProfileTooWeak
        ? rawProfileName
        : !fallbackTooWeak
          ? fallbackProfileFromInsight
          : contextTitle || 'Padrão de atenção identificado'
      const themeHintForUi = `${themeFromMeta || ''} ${pageTitleRaw} ${displayTitle || ''}`
      let profileName = toShortProfileName(chosenProfileBase)
      if (isIncompleteFragment(profileName) && contextTitle.trim().length >= 6) {
        profileName = contextTitle
      }
      const formattedProfileTitle = profileName || contextTitle || 'Padrão de atenção identificado'
      const compactSummary = diagnosis.profile_summary?.trim()
      const mainBlockerText = personalizeMainBlocker(diagnosis.main_blocker || '').trim()
      const shouldUseSummaryInDiagnosisCard =
        !!compactSummary && (isRedundantWithTitle(formattedProfileTitle, mainBlockerText) || mainBlockerText.length < 18)
      const diagnosisCardText = shouldUseSummaryInDiagnosisCard
        ? compactSummary
        : mainBlockerText
      const impactDiagnosisText = toImpactDiagnosisText(diagnosisCardText, themeHintForUi)
      const primaryInsightText = buildPrimaryInsight(diagnosis, diagnosisCardText)
      const showDetailedCause = !!diagnosis.causa_provavel && !isVerySimilarText(diagnosis.causa_provavel, primaryInsightText)

      const commerceQuizLabels =
        commercePublicCopy && isQuizMode && quizFields.length > 0
          ? quizFields.map((f) => String(values[f.id] || '').trim()).filter(Boolean)
          : []
      const commerceNarrative =
        commercePublicCopy && commerceQuizLabels.length >= 2
          ? buildMatrixCommerceNarrativeFromSelectedLabels(locale, commerceQuizLabels, segmentCodeForUi)
          : null
      const profileTitleForUi = commerceNarrative?.profileTitle ?? formattedProfileTitle
      const impactDiagnosisTextForUi = commerceNarrative?.impactLine ?? impactDiagnosisText
      const primaryInsightTextForUi = commerceNarrative?.supportingLine ?? primaryInsightText

      const handleShareResult = async () => {
        trackLinkEvent(slug, 'share_click', { metrics_id: metricsId })
        const shareText =
          locale === 'en'
            ? `I just took this assessment on Ylada. Try it too:`
            : locale === 'es'
              ? `Acabo de hacer este diagnóstico en Ylada. Hazlo tú también:`
              : `Acabei de fazer este diagnóstico no Ylada. Faça também:`
        const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
        try {
          if (typeof navigator !== 'undefined' && navigator.share) {
            await navigator.share({
              title: 'Ylada',
              text: shareText,
              url: shareUrl,
            })
            return
          }
        } catch {
          // ignore and fallback to WhatsApp share
        }
        if (typeof window !== 'undefined') {
          const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
          window.open(waUrl, '_blank', 'noopener,noreferrer')
        }
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-sky-100/50 border border-sky-100/60 p-6 sm:p-8">
            <div className="mb-4">
              <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
                {t.yourResult}
              </span>
            </div>
            {contextTitle && (
              <p className="text-xs text-gray-500 mb-2">{contextTitle}</p>
            )}
            <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
              {t.profileLabel}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
              {profileTitleForUi}
            </h1>

            <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100/80 shadow-sm">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-sky-400 to-sky-600 rounded-l-2xl" />
              <div className="pl-5 pr-5 py-5 sm:pl-6 sm:pr-6 sm:py-6">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">
                  {t.diagnosis}
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-2">
                  {impactDiagnosisTextForUi}
                </p>
                {diagnosis.espelho_comportamental && (
                  <p className="text-sm text-sky-700 font-medium italic">
                    {diagnosis.espelho_comportamental}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-5 p-4 rounded-xl border border-gray-100 bg-gray-50/70">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                {commercePublicCopy ? t.whatItMeans : locale === 'en' ? 'Main point' : locale === 'es' ? 'Punto principal' : 'Ponto principal'}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {primaryInsightTextForUi}
              </p>
            </div>

            {showFullAnalysis && (
              <>
                {diagnosis.frase_identificacao && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    {diagnosis.frase_identificacao}
                  </p>
                )}

                {showDetailedCause && diagnosis.causa_provavel && !commerceNarrative && (
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
                      {isPerfumery ? t.whatItMeans : t.probableCause}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {diagnosis.causa_provavel}
                    </p>
                  </div>
                )}

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

                <div className="mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-1">
                    {isPerfumery ? t.benefit : t.consequence}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {diagnosis.consequence}
                  </p>
                </div>

                <div className="mb-4 p-4 rounded-xl bg-green-50/80 border border-green-100">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {t.goodNews}
                  </p>
                </div>

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
              </>
            )}

            {whatsappUrl ? (
              <div className="space-y-3">
                <p className="text-center text-sm text-gray-600">{t.quizResultHelperLine}</p>
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
                  {ctaText || t.talkNow}
                </button>
                <button
                  type="button"
                  onClick={handleShareResult}
                  className="w-full py-3 px-4 border border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold rounded-xl transition-colors"
                >
                  {t.shareResult}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFullAnalysis((prev) => {
                      if (!prev) {
                        trackLinkEvent(slug, 'full_analysis_expand', { metrics_id: metricsId })
                      }
                      return !prev
                    })
                  }}
                  className="w-full py-3 px-4 border border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold rounded-xl transition-colors"
                >
                  {showFullAnalysis ? t.hideFullAnalysis : t.seeFullAnalysis}
                </button>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">{t.contactNotAvailable.replace('{pessoa}', pessoaLabel)}</span>
            )}

            <div className="mt-5 pt-4 border-t border-gray-100">
              <PoweredByYlada variant="compact" />
            </div>
            <DiagnosisDisclaimer
              variant={
                isProLideresRecruitmentLink
                  ? 'recrutamento_pro_lideres'
                  : commercePublicCopy
                    ? 'commerce'
                    : isPerfumery
                      ? 'wellness'
                      : 'informative'
              }
              locale={locale}
              className="mt-4"
            />
          </div>
        </div>
      )
    }

    const areaProfStatic = typeof meta.area_profissional === 'string' ? meta.area_profissional : ''
    const isPerfumeryStatic = meta.architecture === 'PERFUME_PROFILE' || meta.segment_code === 'perfumaria'
    const useEspecialistaStatic =
      areaProfStatic === 'vendas' || ['seller', 'perfumaria', 'nutra', 'joias'].includes(segmentCodeForUi)
    const pessoaLabelStatic = useEspecialistaStatic ? 'especialista' : 'profissional'
    const handleShareStaticResult = () => {
      trackLinkEvent(slug, 'share_click')
      if (typeof window === 'undefined') return
      const shareText = isProLideresRecruitmentLink
        ? locale === 'en'
          ? 'I just did this quiz on Ylada. Try it too:'
          : locale === 'es'
            ? 'Acabo de hacer este cuestionario en Ylada. Pruébalo tú también:'
            : 'Acabei de fazer este quiz no Ylada. Experimenta também:'
        : locale === 'en'
          ? 'I just took this assessment on Ylada. Try it too:'
          : locale === 'es'
            ? 'Acabo de hacer este diagnóstico en Ylada. Hazlo tú también:'
            : 'Acabei de fazer este diagnóstico no Ylada. Faça também:'
      const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${window.location.href}`)}`
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{displayTitle}</h1>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{headline}</h2>
            {resultDescription ? (
              <p className="text-gray-600 text-sm leading-relaxed mt-2">{resultDescription}</p>
            ) : null}
            {summaryBullets.length > 0 && (
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                {summaryBullets.map((b, i) => (
                  <li key={i}>{stripLeadingListMarkers(String(b))}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-6 p-4 rounded-xl bg-sky-50/80 border border-sky-100">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">
              {isProLideresRecruitmentLink ? t.recruitmentBoxTitle : t.moreFactors}
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              {isProLideresRecruitmentLink
                ? t.recruitmentBoxDisclaimer
                : t.resultDisclaimer.replace('{pessoa}', pessoaLabelStatic)}
            </p>
            {isProLideresRecruitmentLink ? (
              <p className="text-gray-700 text-sm font-medium">{t.recruitmentBoxHint}</p>
            ) : (
              <p className="text-gray-700 text-sm font-medium">
                {t.talkToPro.replace('{pessoa}', pessoaLabelStatic)}
              </p>
            )}
          </div>
          {whatsappUrl ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onCtaClick()}
                className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors"
              >
                {isProLideresRecruitmentLink ? t.recruitmentTalkNow : t.talkNow}
              </button>
              <button
                type="button"
                onClick={handleShareStaticResult}
                className="w-full py-3 px-4 border border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold rounded-xl transition-colors"
              >
                {t.shareResult}
              </button>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">{t.contactNotAvailable.replace('{pessoa}', pessoaLabelStatic)}</span>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100">
            <PoweredByYlada variant="compact" />
          </div>
          <DiagnosisDisclaimer
            variant={
              isProLideresRecruitmentLink
                ? 'recrutamento_pro_lideres'
                : commercePublicCopy
                  ? 'commerce'
                  : isPerfumeryStatic
                    ? 'wellness'
                    : 'informative'
            }
            locale={locale}
            className="mt-4"
          />
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
      trackLinkEvent(slug, 'start')
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
  /** Sobrescrevem textos padrão da tela inicial (opcional no schema_json) */
  introTitle?: string
  introSubtitle?: string
  introMicro?: string
  introBullets?: string[]
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
  const segmentCode =
    typeof (config as { meta?: { segment_code?: string } }).meta?.segment_code === 'string'
      ? String((config as { meta: { segment_code: string } }).meta.segment_code)
          .toLowerCase()
          .trim()
      : ''
  const commerceUi = isMatrixCommercePublicLinkSegment(segmentCode) ? getMatrixCommercePublicLinkCopy(locale) : null
  const t = commerceUi ? { ...PUBLIC_LINK_UI[locale], ...commerceUi } : PUBLIC_LINK_UI[locale]
  const cfg = config as DiagnosticoConfig
  const questions = Array.isArray(cfg.questions) ? cfg.questions : []
  const results = Array.isArray(cfg.results) ? cfg.results : []
  const resultIntro = (cfg.resultIntro as string) || (locale === 'en' ? 'Your result:' : locale === 'es' ? 'Tu resultado:' : 'Seu resultado:')
  /** Título do schema (biblioteca) quando o título do link ainda é genérico. */
  const quizTitle = ((cfg.title as string)?.trim() || title).trim()
  const pessoaLabel =
    commerceUi != null
      ? locale === 'en'
        ? 'seller'
        : locale === 'es'
          ? 'vendedora'
          : 'especialista'
      : locale === 'en'
        ? 'professional'
        : locale === 'es'
          ? 'profesional'
          : 'profissional'

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro')

  const currentIndex = Object.keys(answers).length
  const currentQuestion = questions[currentIndex]
  const isComplete = currentIndex >= questions.length && questions.length > 0

  const completeSent = useRef(false)
  const [showFullAnalysis, setShowFullAnalysis] = useState(false)

  const handleShareQuizResult = async () => {
    trackLinkEvent(slug, 'share_click')
    const shareText =
      locale === 'en'
        ? 'I just took this quiz on Ylada. Try it too:'
        : locale === 'es'
          ? 'Acabo de hacer este quiz en Ylada. Pruébalo tú también:'
          : 'Acabei de fazer este quiz no Ylada. Experimenta também:'
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'Ylada',
          text: shareText,
          url: shareUrl,
        })
        return
      }
    } catch {
      /* fallback below */
    }
    if (typeof window !== 'undefined') {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const beginQuiz = () => {
    trackLinkEvent(slug, 'start')
    setStep('quiz')
  }

  const handleAnswer = (optionIndex: number) => {
    if (!currentQuestion) return
    const next = { ...answers, [currentQuestion.id]: optionIndex }
    setAnswers(next)
    if (currentIndex + 1 >= questions.length) {
      setStep('result')
      if (!completeSent.current) {
        completeSent.current = true
        trackLinkEvent(slug, 'complete')
      }
    }
  }

  // Score: soma dos índices (0,1,2,3...) das respostas. Results têm minScore (0, 3, 6).
  const score = Object.values(answers).reduce((a, b) => a + b, 0)
  const sortedResults = [...results].sort((a, b) => (b.minScore ?? 0) - (a.minScore ?? 0))
  const result = sortedResults.find((r) => score >= (r.minScore ?? 0)) ?? sortedResults[sortedResults[0] ? 0 : 0]
  const resultHeadline = (result?.headline ?? '').trim()
  const resultDescriptionRaw = softenTemplateEmDashes((result?.description ?? '').trim())
  const resultDescription = enrichCommerceResultDescriptionIfGeneric(locale, segmentCode, resultDescriptionRaw)
  const selectedOptionLabels = questions
    .map((q) => {
      const idx = answers[q.id]
      if (typeof idx !== 'number' || !Array.isArray(q.options)) return ''
      return String(q.options[idx] ?? '').trim()
    })
    .filter(Boolean)
  const commerceQuizNarrative =
    commerceUi != null && selectedOptionLabels.length >= 2
      ? buildMatrixCommerceNarrativeFromSelectedLabels(locale, selectedOptionLabels, segmentCode)
      : null
  const displayQuizResultHeadline = commerceQuizNarrative?.profileTitle ?? resultHeadline
  const descIsLibraryPlaceholder = isGenericCommerceLibraryDescription(resultDescriptionRaw, locale)
  const displayQuizResultDescription = commerceQuizNarrative
    ? descIsLibraryPlaceholder
      ? `${commerceQuizNarrative.impactLine}\n\n${commerceQuizNarrative.supportingLine}`
      : `${resultDescription}\n\n${commerceQuizNarrative.supportingLine}`
    : resultDescription

  if (step === 'intro') {
    const introTitle = (cfg.introTitle as string)?.trim() || quizTitle
    const introSubtitle = (cfg.introSubtitle as string)?.trim() || t.quizIntroLead
    const introMicro = (cfg.introMicro as string)?.trim() || t.quizIntroMicro
    const bullets =
      Array.isArray(cfg.introBullets) && cfg.introBullets.length > 0
        ? cfg.introBullets.map((b) => String(b).trim()).filter(Boolean)
        : []

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
          <div className="mb-4">
            <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
              {t.quizIntroBadge}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">{introTitle}</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">{introSubtitle}</p>
          <p className={`text-xs text-gray-500 ${bullets.length > 0 ? 'mb-3' : 'mb-8'}`}>{introMicro}</p>
          {bullets.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mb-8">
              {bullets.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            onClick={beginQuiz}
            className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors"
          >
            {t.start}
          </button>
        </div>
      </div>
    )
  }

  if (step === 'result' && isComplete) {
    const toggleFullAnalysis = () => {
      setShowFullAnalysis((prev) => {
        if (!prev) {
          trackLinkEvent(slug, 'full_analysis_expand')
        }
        return !prev
      })
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-sky-100/50 border border-sky-100/60 p-6 sm:p-8">
          <div className="mb-4">
            <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
              {t.yourResult}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-2">{quizTitle}</p>
          <p className="text-sm text-gray-500 mb-4">{resultIntro}</p>

          <div className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-white border border-sky-100/80 shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-sky-400 to-sky-600 rounded-l-2xl" />
            <div className="pl-5 pr-5 py-5 sm:pl-6 sm:pr-6 sm:py-6">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">{t.diagnosis}</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">{displayQuizResultHeadline}</p>
            </div>
          </div>

          <div className="mb-5 p-4 rounded-xl border border-gray-100 bg-gray-50/70">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">{t.whatItMeans}</p>
            <p
              className={`text-sm text-gray-700 leading-relaxed ${showFullAnalysis ? '' : 'line-clamp-5'}`}
            >
              {displayQuizResultDescription}
            </p>
          </div>

          {showFullAnalysis && (
            <>
              <div className="mb-4 p-4 rounded-xl bg-green-50/80 border border-green-100">
                <p className="text-gray-700 text-sm leading-relaxed">{t.goodNews}</p>
              </div>
              <div className="mb-6 p-4 rounded-xl bg-sky-50/80 border border-sky-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 mb-2">{t.moreFactors}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-2">
                  {t.resultDisclaimer.replace('{pessoa}', pessoaLabel)}
                </p>
                <p className="text-gray-700 text-sm font-medium">{t.talkToPro.replace('{pessoa}', pessoaLabel)}</p>
              </div>
            </>
          )}

          {whatsappUrl ? (
            <div className="space-y-3">
              <p className="text-center text-sm text-gray-600">{t.quizResultHelperLine}</p>
              <button
                type="button"
                onClick={() => onCtaClick()}
                className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors"
              >
                {ctaText}
              </button>
              <button
                type="button"
                onClick={() => void handleShareQuizResult()}
                className="w-full py-3 px-4 border border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold rounded-xl transition-colors"
              >
                {t.shareResult}
              </button>
              <button
                type="button"
                onClick={toggleFullAnalysis}
                className="w-full py-3 px-4 border border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold rounded-xl transition-colors"
              >
                {showFullAnalysis ? t.hideFullAnalysis : t.seeFullAnalysis}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-gray-500 text-sm block">{t.contactNotAvailable.replace('{pessoa}', pessoaLabel)}</span>
              <button
                type="button"
                onClick={toggleFullAnalysis}
                className="w-full py-3 px-4 border border-sky-200 text-sky-700 hover:bg-sky-50 font-semibold rounded-xl transition-colors"
              >
                {showFullAnalysis ? t.hideFullAnalysis : t.seeFullAnalysis}
              </button>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100">
            <PoweredByYlada variant="compact" />
          </div>
          <DiagnosisDisclaimer
            variant={commerceUi ? 'commerce' : 'informative'}
            locale={locale}
            className="mt-4"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-2">{quizTitle}</h1>
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
                  className="w-full text-left py-3 px-4 rounded-xl border border-gray-200 hover:border-sky-500 hover:bg-sky-50 text-gray-800 transition-colors"
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

/** Substitui tokens que ainda ficaram na expressão (fórmula `genero`, campo só `sexo`, etc.). */
function applyCalculatorFormulaTokenAliases(
  expr: string,
  values: Record<string, number | undefined>
): string {
  let out = expr
  const rep = (token: string, n: number) => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(`\\b${escaped}\\b`, 'g'), String(n))
  }
  const num = (k: string): number | undefined => {
    const v = values[k]
    if (v === undefined || v === null) return undefined
    const x = Number(v)
    return Number.isFinite(x) ? x : undefined
  }
  if (/\bgenero\b/.test(out) && num('genero') === undefined && num('sexo') !== undefined) rep('genero', num('sexo')!)
  if (/\bsexo\b/.test(out) && num('sexo') === undefined && num('genero') !== undefined) rep('sexo', num('genero')!)
  if (/\batividade\b/.test(out) && num('atividade') === undefined && num('nivel_atividade') !== undefined)
    rep('atividade', num('nivel_atividade')!)
  if (/\bnivel_atividade\b/.test(out) && num('nivel_atividade') === undefined && num('atividade') !== undefined)
    rep('nivel_atividade', num('atividade')!)
  if (/\bobjetivo\b/.test(out) && num('objetivo') === undefined && num('objetivo_peso') !== undefined)
    rep('objetivo', num('objetivo_peso')!)
  if (/\bobjetivo_peso\b/.test(out) && num('objetivo_peso') === undefined && num('objetivo') !== undefined)
    rep('objetivo_peso', num('objetivo')!)
  return out
}

/** Substitui identificadores na fórmula com limites de palavra e ids mais longos primeiro (evita `peso` dentro de `peso_atual`). */
function evaluateCalculatorFormula(
  formula: string,
  fields: CalculatorField[],
  values: Record<string, number | undefined>
): number {
  const trimmed = (formula || '').trim()
  if (!trimmed) return 0
  const merged: Record<string, number | undefined> = { ...values }
  const sorted = [...fields].sort((a, b) => b.id.length - a.id.length)
  let expr = trimmed
  for (const f of sorted) {
    const id = (f.id || '').trim()
    if (!id) continue
    const raw = merged[f.id]
    const num = raw === undefined || raw === null ? NaN : Number(raw)
    const val = Number.isFinite(num) ? num : 0
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    expr = expr.replace(new RegExp(`\\b${escaped}\\b`, 'g'), String(val))
  }
  expr = applyCalculatorFormulaTokenAliases(expr, merged)
  try {
    const n = Number(new Function(`return (${expr})`)())
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}

function getCalculatorResultCopy(title: string, value: number, locale: Language): { insight: string; tip: string } | null {
  const normalized = title.toLowerCase()

  if (normalized.includes('prote')) {
    if (value < 90) {
      return {
        insight:
          locale === 'en'
            ? 'This target is lower than what many active people need, which can worsen hunger and recovery.'
            : locale === 'es'
              ? 'Esta meta está por debajo de lo que muchas personas activas necesitan y puede empeorar hambre y recuperación.'
              : 'Esse alvo está abaixo do que muita gente ativa precisa e pode piorar fome e recuperação.',
        tip:
          locale === 'en'
            ? 'Practical tip: split your protein into 3-5 meals and include one high-protein source in each.'
            : locale === 'es'
              ? 'Consejo práctico: distribuye la proteína en 3-5 comidas e incluye una fuente proteica en cada una.'
              : 'Dica prática: distribua a proteína em 3-5 refeições e inclua uma fonte proteica em cada uma.',
      }
    }
    return {
      insight:
        locale === 'en'
          ? 'This target can improve satiety and consistency, especially when your routine is busy.'
          : locale === 'es'
            ? 'Esta meta puede mejorar saciedad y constancia, especialmente con una rutina intensa.'
            : 'Esse alvo pode melhorar saciedade e constância, principalmente em rotina corrida.',
      tip:
        locale === 'en'
          ? 'Practical tip: keep one easy protein option ready (yogurt, eggs, tuna, whey) for your hardest times.'
          : locale === 'es'
            ? 'Consejo práctico: deja una opción proteica fácil lista para los momentos de más prisa.'
            : 'Dica prática: deixe uma opção proteica fácil pronta para os horários mais difíceis.',
    }
  }

  if (normalized.includes('água') || normalized.includes('agua') || normalized.includes('hidrata')) {
    return {
      insight:
        locale === 'en'
          ? 'When hydration is below ideal, fatigue, headache and appetite confusion are common.'
          : locale === 'es'
            ? 'Cuando la hidratación queda por debajo de lo ideal, son comunes cansancio, dolor de cabeza y hambre confusa.'
            : 'Quando a hidratação fica abaixo do ideal, é comum sentir cansaço, dor de cabeça e fome confusa.',
      tip:
        locale === 'en'
          ? 'Practical tip: split the total in 4 blocks during the day and start with one glass right after waking.'
          : locale === 'es'
            ? 'Consejo práctico: divide el total en 4 bloques al día y empieza con un vaso al despertar.'
            : 'Dica prática: divida o total em 4 blocos no dia e comece com um copo logo ao acordar.',
    }
  }

  if (normalized.includes('imc')) {
    return {
      insight:
        locale === 'en'
          ? 'BMI is a screening signal, not a full diagnosis, but it helps show if your strategy needs adjustment.'
          : locale === 'es'
            ? 'El IMC es una señal de cribado, no un diagnóstico completo, pero ayuda a indicar si la estrategia necesita ajuste.'
            : 'IMC é um sinal de triagem, não diagnóstico completo, mas ajuda a mostrar se a estratégia precisa ajuste.',
      tip:
        locale === 'en'
          ? 'Practical tip: combine this with waist measurement and routine habits for a more realistic plan.'
          : locale === 'es'
            ? 'Consejo práctico: combina esto con medida de cintura y hábitos para un plan más realista.'
            : 'Dica prática: combine esse número com medida de cintura e hábitos para um plano mais realista.',
    }
  }

  if (normalized.includes('caloria')) {
    return {
      insight:
        locale === 'en'
          ? 'This estimate gives a starting point to avoid both excess and an unsustainable low intake.'
          : locale === 'es'
            ? 'Esta estimación da un punto de partida para evitar tanto exceso como ingesta insuficiente difícil de sostener.'
            : 'Essa estimativa dá um ponto de partida para evitar tanto excesso quanto restrição difícil de sustentar.',
      tip:
        locale === 'en'
          ? 'Practical tip: adjust every 2 weeks based on body response and adherence, not only on the number.'
          : locale === 'es'
            ? 'Consejo práctico: ajusta cada 2 semanas según respuesta del cuerpo y adherencia, no solo por el número.'
            : 'Dica prática: ajuste a cada 2 semanas com base na resposta do corpo e adesão, não só no número.',
    }
  }

  return null
}

/** Texto expandido “análise completa” só para calculadora de IMC no link público. */
function getCalculatorImcFullAnalysisParagraphs(imc: number, locale: Language): string[] {
  let faixa = ''
  if (locale === 'en') {
    if (imc < 18.5) faixa = 'underweight'
    else if (imc < 25) faixa = 'normal weight'
    else if (imc < 30) faixa = 'overweight'
    else faixa = 'obesity'
    return [
      `WHO-style screening puts this BMI in the “${faixa}” range. It is a population-level signal, not a medical label for you personally.`,
      'Age and sex do not change the BMI math, but they change how a professional reads your context (growth in younger people, muscle mass, menopause, etc.).',
      'If your goal is change in body composition, combine BMI with waist circumference, strength, sleep, and nutrition patterns — not the number alone.',
    ]
  }
  if (locale === 'es') {
    if (imc < 18.5) faixa = 'bajo peso'
    else if (imc < 25) faixa = 'peso normal'
    else if (imc < 30) faixa = 'sobrepeso'
    else faixa = 'obesidad'
    return [
      `Como referencia tipo OMS, este IMC suele clasificarse en la zona de “${faixa}”. Es una señal de cribado, no un diagnóstico personal.`,
      'La edad y el sexo no cambian el cálculo del IMC, pero sí cómo un profesional interpreta tu contexto (músculo, etapa vital, etc.).',
      'Si buscas composición corporal, combina el IMC con cintura, fuerza, sueño y hábitos — no solo con el número.',
    ]
  }
  if (imc < 18.5) faixa = 'baixo peso'
  else if (imc < 25) faixa = 'peso normal'
  else if (imc < 30) faixa = 'sobrepeso'
  else faixa = 'obesidade'
  return [
    `Como referência amplamente usada (incluindo critérios da OMS), esse IMC costuma cair na faixa de “${faixa}”. É um sinal de triagem em população, não um rótulo clínico só seu.`,
    'Idade e sexo não entram na fórmula do IMC, mas mudam como um profissional interpreta o seu contexto (massa magra, fase da vida, menopausa, crescimento em adolescentes, etc.).',
    'Se o objetivo é composição corporal ou saúde metabólica, o ideal é cruzar o IMC com circunferência de cintura, força, sono e padrão alimentar — não olhar só para o número.',
  ]
}

function buildCalculatorWhatsAppPrefill(
  title: string,
  fields: CalculatorField[],
  values: Record<string, number | undefined>,
  resultNum: number,
  resultLabel: string,
  locale: Language
): string {
  const loc = locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR'
  const n = resultNum.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const head =
    locale === 'en'
      ? `Hi! I used your calculator "${title}".`
      : locale === 'es'
        ? `¡Hola! Usé tu calculadora "${title}".`
        : `Oi! Usei sua calculadora "${title}".`
  const lines = [head, `${resultLabel.trim()} ${n}`.trim()]
  for (const f of fields) {
    const v = values[f.id]
    if (v === undefined || v === null || Number.isNaN(v)) continue
    const tipo = (f.type as string)?.toLowerCase()
    if (tipo === 'select' && Array.isArray(f.options)) {
      const opt = f.options.find((o) => Number(o.value) === Number(v))
      lines.push(`${f.label}: ${opt?.label ?? String(v)}`)
    } else {
      lines.push(`${f.label}: ${v}`)
    }
  }
  return lines.join('\n')
}

/** Meta em copos de 250 ml: mostra litros no destaque e a contagem entre parênteses. */
function formatCopos250HydrationDisplay(
  resultNum: number,
  resultPrefix: string,
  resultSuffix: string,
  locale: Language
): string | null {
  if (resultPrefix?.trim()) return null
  const suf = (resultSuffix || '').trim().toLowerCase()
  if (!suf.includes('250') || !/copo|glass|vaso/.test(suf)) return null
  const liters = resultNum * 0.25
  const loc = locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR'
  const litersFmt = liters.toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const n = resultNum.toLocaleString(loc)
  if (locale === 'en') {
    return `${litersFmt} L (${n} glasses of 250ml)`
  }
  if (locale === 'es') {
    return `${litersFmt} L (${n} vasos de 250ml)`
  }
  return `${litersFmt} L (${n} copos de 250ml)`
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
  onCtaClick: (metricsId?: string, whatsappPrefill?: string) => void
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
  const extraCfg = config as Record<string, unknown>
  const introTitleFromCfg =
    typeof extraCfg.introTitle === 'string' && extraCfg.introTitle.trim() ? extraCfg.introTitle.trim() : ''
  const introTitle = introTitleFromCfg || title
  const introLeadFromCfg =
    typeof extraCfg.introSubtitle === 'string' && extraCfg.introSubtitle.trim() ? extraCfg.introSubtitle.trim() : ''
  const introLead = introLeadFromCfg || t.calculatorIntroLead
  const introMicroFromCfg =
    typeof extraCfg.introMicro === 'string' && extraCfg.introMicro.trim() ? extraCfg.introMicro.trim() : ''
  const introMicro = introMicroFromCfg || t.calculatorIntroMicro
  const introBadgeFromCfg =
    typeof extraCfg.introBadge === 'string' && extraCfg.introBadge.trim()
      ? extraCfg.introBadge.trim()
      : typeof extraCfg.calculatorIntroBadge === 'string' && extraCfg.calculatorIntroBadge.trim()
        ? extraCfg.calculatorIntroBadge.trim()
        : ''
  const introBadge = introBadgeFromCfg || t.calculatorIntroBadge
  const ctaLabel =
    /quero falar no whatsapp/i.test(ctaText)
      ? locale === 'en'
        ? 'I want to talk to a professional'
        : locale === 'es'
          ? 'Quiero hablar con un profesional'
          : 'Quero falar com um profissional'
      : ctaText

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
  const [showCalculatorIntro, setShowCalculatorIntro] = useState(true)
  const [showFullAnalysis, setShowFullAnalysis] = useState(false)
  const calculatorStartSent = useRef(false)
  const calculatorCompleteSent = useRef(false)
  const calculatorResultViewSent = useRef(false)

  const fieldsParaCalculadora = fields
  const numberFields = fieldsParaCalculadora.filter((f) => (f.type as string)?.toLowerCase() !== 'select')
  const allNumberFieldsFilled = numberFields.every((f) => {
    const v = values[f.id]
    return v !== undefined && v !== null && !Number.isNaN(v)
  })

  const resultNum = evaluateCalculatorFormula(formula, fieldsParaCalculadora, values)
  const resultCopy = getCalculatorResultCopy(title, resultNum, locale)
  const isImcCalculator = title.toLowerCase().includes('imc')
  const imcFullAnalysis = isImcCalculator ? getCalculatorImcFullAnalysisParagraphs(resultNum, locale) : null

  const beginCalculatorForm = () => {
    if (!calculatorStartSent.current) {
      calculatorStartSent.current = true
      trackLinkEvent(slug, 'start')
    }
    setShowCalculatorIntro(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!calculatorStartSent.current) {
      calculatorStartSent.current = true
      trackLinkEvent(slug, 'start')
    }
    if (!calculatorCompleteSent.current) {
      calculatorCompleteSent.current = true
      trackLinkEvent(slug, 'complete')
    }
    setShowResult(true)
  }

  useEffect(() => {
    if (!showResult) return
    if (calculatorResultViewSent.current) return
    calculatorResultViewSent.current = true
    trackLinkEvent(slug, 'result_view')
  }, [showResult, slug])

  const handleShareCalculatorResult = async () => {
    trackLinkEvent(slug, 'share_click')
    const shareText =
      locale === 'en'
        ? 'I just used this calculator on Ylada. Try it too:'
        : locale === 'es'
          ? 'Acabo de usar esta calculadora en Ylada. Hazla tú también:'
          : 'Acabei de usar essa calculadora no Ylada. Faça também:'
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'Ylada',
          text: shareText,
          url: shareUrl,
        })
        return
      }
    } catch {
      // ignore and fallback to WhatsApp share
    }
    if (typeof window !== 'undefined') {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const numLocale = locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR'
  const whatsappPrefillResult =
    showResult && whatsappUrl
      ? buildCalculatorWhatsAppPrefill(title, fieldsParaCalculadora, values, resultNum, resultLabel, locale)
      : ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 p-4 sm:p-6">
      <div
        className={`max-w-md w-full bg-white p-6 sm:p-8 ${
          showResult
            ? 'rounded-2xl border border-sky-100/60 shadow-xl shadow-sky-100/50'
            : showCalculatorIntro
              ? 'rounded-2xl border border-gray-100/80 shadow-xl'
              : 'rounded-2xl border border-gray-100 shadow-lg'
        }`}
      >
        {!showResult && showCalculatorIntro ? (
          <>
            <div className="mb-4">
              <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
                {introBadge}
              </span>
            </div>
            <h1 className="mb-3 text-xl font-bold leading-tight text-gray-900 sm:text-2xl">{introTitle}</h1>
            <p className="mb-3 text-sm leading-relaxed text-gray-600">{introLead}</p>
            <p className="mb-8 text-xs text-gray-500">{introMicro}</p>
            <button
              type="button"
              onClick={beginCalculatorForm}
              className="w-full rounded-xl bg-sky-600 px-4 py-4 font-semibold text-white shadow-lg shadow-sky-500/25 transition-colors hover:bg-sky-700"
            >
              {t.start}
            </button>
          </>
        ) : null}
        {!showResult && !showCalculatorIntro ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-1 flex items-start justify-between gap-2">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <button
                type="button"
                onClick={() => setShowCalculatorIntro(true)}
                className="shrink-0 text-xs font-medium text-sky-700 underline-offset-2 hover:underline"
              >
                {t.back}
              </button>
            </div>
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
        ) : null}
        {showResult ? (
          <>
            <div className="mb-4">
              <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">
                {t.yourResult}
              </span>
            </div>
            <p className="mb-2 text-xs text-gray-500">{title}</p>
            <p className="mb-4 text-sm text-gray-500">{resultIntro}</p>

            <div className="relative mb-5 overflow-hidden rounded-2xl border border-sky-100/80 bg-gradient-to-br from-sky-50 to-white shadow-sm">
              <div className="absolute bottom-0 left-0 top-0 w-1.5 rounded-l-2xl bg-gradient-to-b from-sky-400 to-sky-600" />
              <div className="px-5 py-5 pl-6 sm:px-6 sm:py-6">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-sky-600">{resultLabel}</p>
                <p className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                  {formatCopos250HydrationDisplay(resultNum, resultPrefix, resultSuffix, locale) ?? (
                    <>
                      {resultPrefix}
                      {resultNum.toLocaleString(numLocale, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      {resultSuffix}
                    </>
                  )}
                </p>
              </div>
            </div>

            {resultCopy ? (
              <div className="mb-5 space-y-3">
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{t.whatItMeans}</p>
                  <p className="text-sm leading-relaxed text-gray-700">{resultCopy.insight}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">{t.quickTip}</p>
                  <p className="text-sm leading-relaxed text-gray-700">{resultCopy.tip}</p>
                </div>
                {showFullAnalysis && imcFullAnalysis ? (
                  <div className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                    {imcFullAnalysis.map((p, i) => (
                      <p key={i} className="text-sm leading-relaxed text-gray-700">
                        {p}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="space-y-3">
              {whatsappUrl ? (
                <>
                  <p className="text-center text-sm text-gray-600">{t.quizResultHelperLine}</p>
                  <button
                    type="button"
                    onClick={() => onCtaClick(undefined, whatsappPrefillResult)}
                    className="w-full rounded-xl bg-sky-600 px-4 py-4 font-semibold text-white shadow-lg shadow-sky-500/25 transition-colors hover:bg-sky-700"
                  >
                    {ctaLabel}
                  </button>
                </>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  {t.contactNotAvailable.replace('{pessoa}', locale === 'en' ? 'professional' : locale === 'es' ? 'profesional' : 'profissional')}
                </p>
              )}
              <button
                type="button"
                onClick={handleShareCalculatorResult}
                className="w-full rounded-xl border border-sky-200 px-4 py-3 font-semibold text-sky-700 transition-colors hover:bg-sky-50"
              >
                {t.shareResult}
              </button>
              {imcFullAnalysis ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowFullAnalysis((prev) => {
                      if (!prev) trackLinkEvent(slug, 'full_analysis_expand')
                      return !prev
                    })
                  }}
                  className="w-full rounded-xl border border-sky-200 px-4 py-3 font-semibold text-sky-700 transition-colors hover:bg-sky-50"
                >
                  {showFullAnalysis ? t.hideFullAnalysis : t.seeFullAnalysis}
                </button>
              ) : null}
            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <PoweredByYlada variant="compact" />
            </div>
            <DiagnosisDisclaimer variant="informative" locale={locale} className="mt-4" />
          </>
        ) : null}
      </div>
    </div>
  )
}
