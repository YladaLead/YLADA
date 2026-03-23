/**
 * Campos do formulário da calculadora de projeção (PROJECTION_CALCULATOR).
 * Sempre numéricos, sem opções de múltipla escolha — evita fallback Sim/Não na UI pública.
 */

export type ProjectionFormField = { id: string; label: string; type: 'number' }

function themeHints(themeRaw: string): { weight: boolean; bloat: boolean } {
  const t = (themeRaw || '').toLowerCase()
  return {
    weight: /emagrec|peso|gordura|magreza|kg\b|emagrecer|perda\s+de\s+peso/.test(t),
    bloat: /inch(a|o)|desinch|reten|líquido|liquido|barriga|inchaco/.test(t),
  }
}

/** Quatro perguntas na ordem esperada pelo motor: q1→atual, q2→meta, q3→dias, q4→consistência 1–10 */
export function buildProjectionFormFields(themeRaw: string): ProjectionFormField[] {
  const { weight, bloat } = themeHints(themeRaw)

  if (weight && bloat) {
    return [
      { id: 'q1', label: 'Peso atual (kg)', type: 'number' },
      { id: 'q2', label: 'Meta de peso (kg)', type: 'number' },
      { id: 'q3', label: 'Prazo desejado (dias)', type: 'number' },
      { id: 'q4', label: 'Consistência prevista (1 = baixa, 10 = alta)', type: 'number' },
    ]
  }
  if (weight) {
    return [
      { id: 'q1', label: 'Peso atual (kg)', type: 'number' },
      { id: 'q2', label: 'Meta de peso (kg)', type: 'number' },
      { id: 'q3', label: 'Prazo (dias) — ex.: 30, 60, 100', type: 'number' },
      { id: 'q4', label: 'Nível de consistência (1 a 10)', type: 'number' },
    ]
  }
  if (bloat) {
    return [
      { id: 'q1', label: 'Medida ou peso atual (número)', type: 'number' },
      { id: 'q2', label: 'Meta desejada (mesma unidade)', type: 'number' },
      { id: 'q3', label: 'Prazo (dias)', type: 'number' },
      { id: 'q4', label: 'Consistência com hábitos (1 a 10)', type: 'number' },
    ]
  }
  return [
    { id: 'q1', label: 'Valor atual (número)', type: 'number' },
    { id: 'q2', label: 'Meta desejada (número)', type: 'number' },
    { id: 'q3', label: 'Prazo (dias)', type: 'number' },
    { id: 'q4', label: 'Consistência esperada (1 a 10)', type: 'number' },
  ]
}

/** Permite reaproveitar só os rótulos do interpret — nunca opções de múltipla escolha. */
export function projectionQuestionsOverrideAllowed(
  questions: Array<{ options?: string[] }> | null | undefined
): boolean {
  return (
    Array.isArray(questions) &&
    questions.length === 4 &&
    questions.every((q) => !Array.isArray(q.options) || q.options.length === 0)
  )
}
