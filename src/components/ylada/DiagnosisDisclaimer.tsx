'use client'

/**
 * Bloco padrão de orientação (disclaimer) para resultados de diagnóstico.
 * Protege a plataforma e os profissionais em áreas como saúde, psicologia, nutrição e bem-estar.
 *
 * Estrutura: sempre exibir após o resultado e antes do "Powered by YLADA".
 * @see docs/conversa-disclaimer
 */

export type DisclaimerVariant = 'informative' | 'wellness'

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
}

type Props = {
  /** Variante do texto: "informative" (padrão, universal) ou "wellness" (bem-estar) */
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
