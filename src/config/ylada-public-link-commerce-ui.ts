/**
 * Copy da experiência pública de quiz/diagnóstico para segmentos de **varejo** na matriz YLADA
 * (joias, perfumaria, nutra, seller): tom de valor + conversão no WhatsApp, sem linguagem clínica.
 * @see ActiveLinksProModal / conversa-disclaimer (variante `commerce` em DiagnosisDisclaimer)
 */
import type { Language } from '@/lib/i18n'

export const YLADA_MATRIX_COMMERCE_PUBLIC_LINK_SEGMENT_CODES = ['joias', 'perfumaria', 'seller', 'nutra'] as const

export type MatrixCommercePublicLinkSegment =
  (typeof YLADA_MATRIX_COMMERCE_PUBLIC_LINK_SEGMENT_CODES)[number]

export function isMatrixCommercePublicLinkSegment(segment: string | null | undefined): boolean {
  const s = String(segment || '')
    .toLowerCase()
    .trim()
  return (YLADA_MATRIX_COMMERCE_PUBLIC_LINK_SEGMENT_CODES as readonly string[]).includes(s)
}

export type CommercePublicLinkCopy = {
  quizIntroBadge: string
  quizIntroLead: string
  quizIntroMicro: string
  yourResult: string
  /** Sobre o título h1 acima do cartão de resultado (varejo). */
  profileLabel: string
  diagnosis: string
  whatItMeans: string
  goodNews: string
  moreFactors: string
  resultDisclaimer: string
  talkToPro: string
  quizResultHelperLine: string
}

/** Headline curta (h1), linha de impacto (cartão azul) e parágrafo “O que isso mostra”. */
export type MatrixCommerceQuizNarrative = {
  profileTitle: string
  impactLine: string
  supportingLine: string
}

function stripDiacritics(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function normalizeCommercePhrase(text: string): string {
  return stripDiacritics(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function clipLabel(text: string, max: number): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, Math.max(0, max - 1)).trim()}…`
}

const GENERIC_RESULT_DESC: Record<Language, RegExp> = {
  pt: /^resultado personalizado com base nas suas escolhas\.?$/i,
  en: /^personalized result based on your choices\.?$/i,
  es: /^resultado personalizado con base en tus elecciones\.?$/i,
}

export function isGenericCommerceLibraryDescription(description: string, locale: Language): boolean {
  const d = description.trim()
  const re = GENERIC_RESULT_DESC[locale] ?? GENERIC_RESULT_DESC.pt
  return re.test(d)
}

/** Headline de template ou da API que ainda é placeholder (“Seu resultado”, etc.). */
export function isTrivialMatrixCommerceHeadline(headline: string): boolean {
  const v = normalizeCommercePhrase(headline)
  if (!v || v.length < 4) return true
  const trivial = new Set([
    'seu resultado',
    'tu resultado',
    'your result',
    'resultado',
    'result',
    'perfil',
    'profile',
    'resultado personalizado',
  ])
  if (trivial.has(v)) return true
  if (v.startsWith('seu resultado')) return true
  if (v.startsWith('tu resultado')) return true
  if (v.startsWith('your result')) return true
  return false
}

/**
 * Monta título + cartão + texto explicativo a partir das opções escolhidas (ordem do quiz).
 * Usado em links públicos de varejo quando a API ou o template ainda devolvem placeholders.
 */
export function buildMatrixCommerceNarrativeFromSelectedLabels(
  locale: Language,
  selectedLabels: string[],
  segmentCode?: string | null
): MatrixCommerceQuizNarrative | null {
  const labels = selectedLabels.map((s) => String(s || '').trim()).filter(Boolean)
  if (labels.length < 2) return null
  const first = labels[0]
  const second = labels[1]
  const last = labels[labels.length - 1]
  const seg = String(segmentCode || '')
    .toLowerCase()
    .trim()
  const isJoias = seg === 'joias'

  if (locale === 'en') {
    const profileTitle = `${last}: ${clipLabel(first, 34)}`
    const impactLine = isJoias
      ? `Your picks read as "${clipLabel(first, 44)}" + "${clipLabel(second, 44)}" with "${clipLabel(last, 36)}" as the anchor — a clear map for metal, scale, and vibe.`
      : `Your answers connect "${clipLabel(first, 44)}" with "${clipLabel(second, 44)}" and center on "${clipLabel(last, 36)}" — a sharper brief for whoever serves you.`
    const supportingLine = isJoias
      ? `On WhatsApp, lead with this snapshot: ask for two real-life options, metal finish, and sizing. You show intent as a buyer — not a vague “just browsing” thread.`
      : `On WhatsApp, send this snapshot and ask for two tailored recommendations (use case, bundle, and budget). You show clear intent — not a vague “just checking” thread.`
    return { profileTitle, impactLine, supportingLine }
  }
  if (locale === 'es') {
    const profileTitle = `${last}: ${clipLabel(first, 34)}`
    const impactLine = isJoias
      ? `En tus respuestas se ve "${clipLabel(first, 44)}" junto a "${clipLabel(second, 44)}" y cierra en "${clipLabel(last, 36)}" — una brújula para baño, tamaño y intensidad.`
      : `Tus respuestas enlazan "${clipLabel(first, 44)}" con "${clipLabel(second, 44)}" y el eje es "${clipLabel(last, 36)}" — un briefing más claro para quien te atiende.`
    const supportingLine = isJoias
      ? `En WhatsApp usa este resumen: pide dos opciones con foto real, baño y talla. Entras como compradora informada, no como conversación genérica.`
      : `En WhatsApp envía este resumen y pide dos recomendaciones concretas (uso, combinaciones y rango). Entras con intención clara, no con charla vaga.`
    return { profileTitle, impactLine, supportingLine }
  }

  const profileTitle = `${last}: ${clipLabel(first, 36)}`
  const impactLine = isJoias
    ? `Pelas suas respostas, "${clipLabel(first, 44)}" combina com "${clipLabel(second, 44)}" e o fio condutor é "${clipLabel(last, 36)}" — isso orienta banho (prata/ouro), tamanho e se a peça pede delicadeza ou destaque.`
    : `Pelas suas respostas, "${clipLabel(first, 44)}" conversa com "${clipLabel(second, 44)}" e o eixo fica em "${clipLabel(last, 36)}" — um briefing mais certeiro para quem vai te atender.`
  const supportingLine = isJoias
    ? `No WhatsApp, mande esse recorte pedindo duas sugestões de conjunto com foto ao vivo e banho adequado: você mostra intenção de compra e a conversa já começa no gosto — sem recomeçar do zero nem ficar só no preço.`
    : `No WhatsApp, envie esse resumo pedindo duas recomendações objetivas (uso, combinações e faixa): você mostra intenção e a conversa já começa com contexto — sem mensagem vaga.`
  return { profileTitle, impactLine, supportingLine }
}

const COMMERCE_COPY: Record<Language, CommercePublicLinkCopy> = {
  pt: {
    quizIntroBadge: 'Quiz rápido',
    quizIntroLead:
      'Em poucos toques você recebe um primeiro recorte do seu jeito de escolher: estilo, intenção na hora de comprar e um bom gancho para falar no WhatsApp com quem vende — sem conversa vaga e sem começar só no preço.',
    quizIntroMicro: 'Tempo estimado: cerca de 1 minuto',
    yourResult: 'Seu resultado',
    profileLabel: 'Seu recorte de estilo',
    diagnosis: 'Recorte do quiz',
    whatItMeans: 'O que isso mostra',
    goodNews:
      'Na prática, muita gente usa esse recorte para pedir foto real, comparar duas opções e fechar melhor — com mais segurança na escolha.',
    moreFactors: 'Próximo passo',
    resultDisclaimer:
      'Este resumo reflete apenas as respostas deste quiz. Quem te atende pode sugerir peças, tamanhos, combinações e condições conforme catálogo e políticas da loja.',
    talkToPro:
      'Se quiser uma sugestão mais certeira para o seu caso, mande uma mensagem dizendo o que você busca (por exemplo: ocasião, estilo e faixa de investimento).',
    quizResultHelperLine:
      'Use o botão abaixo para continuar no WhatsApp com quem compartilhou este quiz — já com o contexto das suas respostas.',
  },
  en: {
    quizIntroBadge: 'Quick quiz',
    quizIntroLead:
      'In a few taps you get a first read of how you choose: style, purchase intent, and a clean way to message the seller on WhatsApp — not a vague chat and not opening with price only.',
    quizIntroMicro: 'Estimated time: about 1 minute',
    yourResult: 'Your result',
    profileLabel: 'Your style read',
    diagnosis: 'Quiz snapshot',
    whatItMeans: 'What this shows',
    goodNews:
      'In practice, many people use this snapshot to ask for real photos, compare two options, and buy with more confidence.',
    moreFactors: 'Next step',
    resultDisclaimer:
      'This summary only reflects your answers in this quiz. The seller can suggest pieces, sizes, bundles, and terms based on their catalog and policies.',
    talkToPro:
      'If you want a sharper suggestion for your case, send a short message with what you are looking for (for example: occasion, style, and budget range).',
    quizResultHelperLine:
      'Use the button below to continue on WhatsApp with whoever shared this quiz — with your answers as context.',
  },
  es: {
    quizIntroBadge: 'Quiz rápido',
    quizIntroLead:
      'En pocos toques recibes un primer recorte de cómo eliges: estilo, intención de compra y un buen gancho para escribir por WhatsApp a quien vende — sin charla vaga y sin empezar solo por el precio.',
    quizIntroMicro: 'Tiempo estimado: alrededor de 1 minuto',
    yourResult: 'Tu resultado',
    profileLabel: 'Tu lectura de estilo',
    diagnosis: 'Recorte del quiz',
    whatItMeans: 'Qué muestra esto',
    goodNews:
      'En la práctica, mucha gente usa este recorte para pedir foto real, comparar dos opciones y decidir con más seguridad.',
    moreFactors: 'Próximo paso',
    resultDisclaimer:
      'Este resumen refleja solo las respuestas de este quiz. Quien te atiende puede sugerir piezas, tallas, combinaciones y condiciones según su catálogo y políticas.',
    talkToPro:
      'Si quieres una sugerencia más precisa para tu caso, envía un mensaje con lo que buscas (por ejemplo: ocasión, estilo y rango de inversión).',
    quizResultHelperLine:
      'Usa el botón de abajo para seguir en WhatsApp con quien compartió este quiz — ya con el contexto de tus respuestas.',
  },
}

/** Textos da tela de quiz/resultado para varejo (merge sobre `PUBLIC_LINK_UI`). */
export function getMatrixCommercePublicLinkCopy(locale: Language): CommercePublicLinkCopy {
  return COMMERCE_COPY[locale] ?? COMMERCE_COPY.pt
}

/** Substitui descrição placeholder dos templates de biblioteca por texto orientado a valor + WhatsApp. */
export function enrichCommerceResultDescriptionIfGeneric(
  locale: Language,
  segmentCode: string | null | undefined,
  description: string
): string {
  if (!isMatrixCommercePublicLinkSegment(segmentCode)) return description
  const d = description.trim()
  const re = GENERIC_RESULT_DESC[locale] ?? GENERIC_RESULT_DESC.pt
  if (!re.test(d)) return description
  if (locale === 'en') {
    return 'Based on your answers, you clarify style and priorities — a solid starting point to ask for combinations, sizing, and piece suggestions without a generic chat.'
  }
  if (locale === 'es') {
    return 'Con base en tus respuestas, dejas claro un camino de estilo y prioridad: un buen punto de partida para pedir combinaciones, talla e ideas de piezas sin una conversación genérica.'
  }
  return 'Com base nas suas respostas, você deixa claro um caminho de estilo e prioridade — um bom ponto de partida para pedir combinações, tamanho e indicação de peças sem conversa genérica.'
}
