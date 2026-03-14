/**
 * Mapeamento question_id → intent_category para classificação semântica de respostas.
 * Usado em ylada_diagnosis_answers para análise de dados de intenção.
 * @see docs/DADOS-INTENCAO-YLADA.md
 */

export type IntentCategory =
  | 'dificuldade'
  | 'objetivo'
  | 'sintoma'
  | 'barreira'
  | 'tentativa'
  | 'causa'
  | 'contexto'
  | 'preferencia'
  | 'historico'
  | 'outro'

/** Padrões de question_id → intent_category. Ordem importa (mais específicos primeiro). */
const QUESTION_TO_INTENT: Array<{ pattern: RegExp | string; category: IntentCategory }> = [
  { pattern: /^symptoms?$|^sintomas?$/i, category: 'sintoma' },
  { pattern: /^barriers?$|^barreiras?$/i, category: 'barreira' },
  { pattern: /^history_flags?$|^historico$/i, category: 'historico' },
  { pattern: /^idade$|^age$/i, category: 'contexto' },
  { pattern: /^perfume_|^uso_principal$/i, category: 'preferencia' },
  { pattern: /^q1$/i, category: 'dificuldade' },
  { pattern: /^q2$/i, category: 'tentativa' },
  { pattern: /^q3$/i, category: 'causa' },
  { pattern: /^q4$/i, category: 'objetivo' },
  { pattern: /^objetivo$|^goal$/i, category: 'objetivo' },
  { pattern: /^dificuldade$|^maior_dificuldade$/i, category: 'dificuldade' },
  { pattern: /^causa$|^causa_provavel$/i, category: 'causa' },
  { pattern: /^tentativa|ja_tentei$/i, category: 'tentativa' },
]

/**
 * Infere intent_category a partir do question_id.
 */
export function inferIntentCategory(questionId: string): IntentCategory {
  const id = String(questionId || '').trim()
  if (!id) return 'outro'

  for (const { pattern, category } of QUESTION_TO_INTENT) {
    if (typeof pattern === 'string') {
      if (id.toLowerCase() === pattern.toLowerCase()) return category
    } else if (pattern.test(id)) {
      return category
    }
  }

  return 'outro'
}
