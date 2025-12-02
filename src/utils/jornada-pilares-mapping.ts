/**
 * Mapeamento estático dos dias da Jornada relacionados a cada Pilar
 * Baseado no prompt do usuário
 */
export const jornadaPilaresMapping: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5, 6], // Pilar 1 - Filosofia YLADA
  2: [7, 15, 16, 17, 18], // Pilar 2 - Rotina Mínima YLADA
  3: [8, 9, 10, 11, 12, 13], // Pilar 3 - Captação YLADA
  4: [14, 25], // Pilar 4 - Atendimento que Encanta
  5: [22, 23, 24, 26, 27, 28, 29, 30] // Pilar 5 - GSAL
}

/**
 * Retorna os dias da Jornada relacionados a um Pilar
 */
export function getJornadaDaysForPilar(pilarId: number): number[] {
  return jornadaPilaresMapping[pilarId] || []
}

/**
 * Retorna o Pilar relacionado a um dia da Jornada
 */
export function getPilarForJornadaDay(dayNumber: number): number | null {
  for (const [pilarId, days] of Object.entries(jornadaPilaresMapping)) {
    if (days.includes(dayNumber)) {
      return parseInt(pilarId)
    }
  }
  return null
}

