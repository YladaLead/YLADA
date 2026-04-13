'use client'

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
  /** Pro Líderes + contexto equipa Herbalife (oportunidade de negócio independente). */
  | 'recrutamento_pro_lideres'

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
    'Este resultado é uma avaliação orientativa com base nas tuas respostas; não é consulta nem avaliação de saúde.',
    'Foca-se em interesse e perfil para conversa sobre oportunidade de negócio — não indica produtos de bem-estar nem tratamentos.',
    'Para próximos passos e esclarecimentos, fala com a pessoa que partilhou este link.',
  ],
  recrutamento_pro_lideres: [
    'Este resultado é uma avaliação informal para conversa sobre oportunidade de negócio no contexto Pro Líderes (equipa independente Herbalife).',
    'Não substitui aconselhamento jurídico, fiscal ou contabilístico; não constitui promessa de ganhos nem avaliação médica.',
    'Para produtos, oportunidade e regras oficiais, esclarece com quem te enviou o link ou com os canais da Herbalife.',
  ],
}

type Props = {
  /** Variante do texto (bem-estar, recrutamento, Pro Líderes, etc.) */
  variant?: DisclaimerVariant
  /** Classe CSS adicional para o container */
  className?: string
}

export default function DiagnosisDisclaimer({ variant = 'informative', className = '' }: Props) {
  const lines = TEXTS[variant]

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
