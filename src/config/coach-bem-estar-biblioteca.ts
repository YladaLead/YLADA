/**
 * Biblioteca YLADA — área Coach de bem-estar.
 * Mesma base que Nutri/médicos (itens com `nutrition`, `medicine`, `psychology` + `fitness` compartilhado),
 * excluindo só o bloco **fitness-puro** de treino/performance (migração 243).
 *
 * @see `/api/ylada/biblioteca?subscope=coach_bem_estar`
 */
export const COACH_BEM_ESTAR_BIBLIOTECA_SUBSCOPE = 'coach_bem_estar' as const

/** Segmentos cuja interseção com `segment_codes` do item entra na query inicial. */
export const COACH_BEM_ESTAR_BIBLIOTECA_SEGMENT_OVERLAP: readonly string[] = [
  'nutrition',
  'nutrition_vendedor',
  'medicine',
  'psychology',
  'psychoanalysis',
  'fitness',
]

/**
 * Itens só com `fitness` e estes temas = vitrine “academia” (fora do posicionamento coach de bem-estar).
 * Itens `nutrition`+`fitness` etc. permanecem (IMC, metabolismo, hábitos…).
 */
const TEMAS_APENAS_FITNESS_EXCLUIDOS = new Set(['treino', 'performance', 'recuperacao'])

export type CoachBemEstarBibliotecaItem = {
  segment_codes?: string[] | null
  tema?: string | null
}

export function filtrarBibliotecaItensCoachBemEstar<T extends CoachBemEstarBibliotecaItem>(items: T[]): T[] {
  return items.filter((item) => {
    const codes = Array.isArray(item.segment_codes) ? item.segment_codes : []
    const tema = (item.tema || '').toLowerCase().trim()

    const hasNutrition = codes.includes('nutrition') || codes.includes('nutrition_vendedor')
    const hasMedicine = codes.includes('medicine')
    const hasPsych = codes.includes('psychology') || codes.includes('psychoanalysis')
    const hasFitness = codes.includes('fitness')
    const onlyFitness = hasFitness && !hasNutrition && !hasMedicine && !hasPsych

    if (onlyFitness && TEMAS_APENAS_FITNESS_EXCLUIDOS.has(tema)) {
      return false
    }
    return true
  })
}
