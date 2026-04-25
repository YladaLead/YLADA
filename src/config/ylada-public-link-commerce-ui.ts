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
  diagnosis: string
  whatItMeans: string
  goodNews: string
  moreFactors: string
  resultDisclaimer: string
  talkToPro: string
  quizResultHelperLine: string
}

const COMMERCE_COPY: Record<Language, CommercePublicLinkCopy> = {
  pt: {
    quizIntroBadge: 'Quiz rápido',
    quizIntroLead:
      'Em poucos toques você recebe um primeiro recorte do seu jeito de escolher: estilo, intenção na hora de comprar e um bom gancho para falar no WhatsApp com quem vende — sem conversa vaga e sem começar só no preço.',
    quizIntroMicro: 'Tempo estimado: cerca de 1 minuto',
    yourResult: 'Seu resultado',
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

const GENERIC_RESULT_DESC: Record<Language, RegExp> = {
  pt: /^resultado personalizado com base nas suas escolhas\.?$/i,
  en: /^personalized result based on your choices\.?$/i,
  es: /^resultado personalizado con base en tus elecciones\.?$/i,
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
