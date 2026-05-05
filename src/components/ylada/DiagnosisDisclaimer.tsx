'use client'

import type { Language } from '@/lib/i18n'

/**
 * Bloco padrão de orientação (disclaimer) para resultados de diagnóstico.
 * Protege a plataforma e os profissionais em áreas como saúde, psicologia, nutrição e bem-estar.
 *
 * Estrutura: sempre exibir após o resultado e antes do "Powered by YLADA".
 * @see docs/conversa-disclaimer
 */

export type DisclaimerVariant =
  | 'informative'
  | 'wellness'
  /** Recrutamento / negócio (sem tom clínico nem produto de bem-estar). */
  | 'recrutamento'
  /** Pro Líderes — recrutamento (copy neutra para quem responde ao link). */
  | 'recrutamento_pro_lideres'
  /** Varejo matriz (joias, perfumaria, nutra, seller): quiz orientativo, sem tom clínico. */
  | 'commerce'

const COMMERCE_DISCLAIMER_PT = [
  'Este resultado é um quiz orientativo com base nas respostas que você enviou.',
  'Não substitui atendimento em loja, avaliação presencial de produto nem orientação de saúde.',
  'Para combinações, pedidos, disponibilidade e políticas da loja, converse com quem compartilhou o link.',
] as const

const TEXTS: Record<DisclaimerVariant, string[]> = {
  informative: [
    'Este resultado é apenas uma avaliação informativa baseada nas respostas fornecidas.',
    'Ele não substitui diagnóstico profissional, consulta clínica ou avaliação especializada.',
    'Se você estiver enfrentando sintomas ou dificuldades, considere conversar com um profissional qualificado.',
  ],
  wellness: [
    'Este diagnóstico é apenas uma avaliação inicial baseada nas respostas fornecidas.',
    'Ele não substitui avaliação profissional, diagnóstico clínico ou orientação especializada.',
    'Caso esteja enfrentando sintomas ou dificuldades, procure orientação de um profissional qualificado.',
  ],
  recrutamento: [
    'Este resultado é uma avaliação orientativa com base nas suas respostas; não é consulta nem avaliação de saúde.',
    'Foca-se em interesse e perfil para conversa sobre oportunidade de negócio — não indica produtos de bem-estar nem tratamentos.',
    'Para próximos passos e esclarecimentos, converse com a pessoa que compartilhou este link.',
  ],
  recrutamento_pro_lideres: [
    'Este resultado é uma avaliação informal com base nas suas respostas, para apoiar conversa sobre oportunidade de negócio — sem compromisso.',
    'Não substitui aconselhamento jurídico, fiscal ou contábil nem avaliação médica; não constitui promessa de ganhos.',
    'Para próximos passos, produto ou modelo em concreto, converse com quem te enviou este link.',
  ],
  commerce: [...COMMERCE_DISCLAIMER_PT],
}

const TEXTS_COMMERCE_LOCALE: Record<Language, string[]> = {
  pt: [...COMMERCE_DISCLAIMER_PT],
  en: [
    'This result is an orientation quiz based on the answers you submitted.',
    'It does not replace in-store service, in-person product evaluation, or health advice.',
    'For combinations, orders, availability, and store policies, message whoever shared this link.',
  ],
  es: [
    'Este resultado es un quiz orientativo basado en las respuestas que enviaste.',
    'No sustituye atención en tienda, evaluación presencial del producto ni orientación de salud.',
    'Para combinaciones, pedidos, disponibilidad y políticas de la tienda, habla con quien compartió el enlace.',
  ],
}

type Props = {
  /** Variante do texto (bem-estar, recrutamento, Pro Líderes, etc.) */
  variant?: DisclaimerVariant
  /** Usado com `variant="commerce"` para EN/ES no link público. */
  locale?: Language
  /** Classe CSS adicional para o container */
  className?: string
}

export default function DiagnosisDisclaimer({
  variant = 'informative',
  locale = 'pt',
  className = '',
}: Props) {
  const lines =
    variant === 'commerce' ? TEXTS_COMMERCE_LOCALE[locale] ?? TEXTS_COMMERCE_LOCALE.pt : TEXTS[variant]

  return (
    <div
      className={`border-t border-gray-200 pt-6 text-center ${className}`}
      role="note"
      aria-label="Aviso sobre caráter informativo do resultado"
    >
      <p className="text-sm text-gray-600 leading-relaxed space-y-1">
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  )
}
