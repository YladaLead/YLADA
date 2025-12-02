/**
 * Utilitários para verificar acesso aos dias da Jornada
 */

import { isEmailUnlocked } from '@/config/jornada-unlocked-emails'

export interface JornadaProgress {
  current_day: number | null
  completed_days: number
  total_days: number
}

/**
 * Verifica se o usuário pode acessar um dia específico
 * 
 * Regras:
 * - E-mails na lista de liberados: acesso total (bypass)
 * - Dia 1 sempre liberado
 * - Dia X liberado se currentDay >= X (ou seja, já está no dia X ou passou dele)
 * - Dia X bloqueado se currentDay < X (ou seja, ainda não concluiu o dia anterior)
 * 
 * Exemplo:
 * - Se currentDay = 3: dias 1, 2, 3 liberados; dia 4+ bloqueados
 * - Se currentDay = 1: apenas dia 1 liberado; dias 2+ bloqueados
 */
export function canAccessDay(
  targetDay: number,
  progress: JornadaProgress | null,
  userEmail?: string | null
): boolean {
  // Bypass para e-mails liberados
  if (userEmail && isEmailUnlocked(userEmail)) {
    return true
  }

  if (!progress || !progress.current_day) {
    // Se não há progresso, só o dia 1 está liberado
    return targetDay === 1
  }

  const currentDay = progress.current_day

  // Dia 1 sempre liberado
  if (targetDay === 1) {
    return true
  }

  // Dia X liberado se currentDay >= X (ou seja, já está no dia X ou passou dele)
  return currentDay >= targetDay
}

/**
 * Verifica se um dia está bloqueado
 */
export function isDayLocked(
  targetDay: number,
  progress: JornadaProgress | null,
  userEmail?: string | null
): boolean {
  return !canAccessDay(targetDay, progress, userEmail)
}

/**
 * Retorna o próximo dia disponível
 */
export function getNextAvailableDay(progress: JornadaProgress | null): number {
  if (!progress || !progress.current_day) {
    return 1
  }
  return progress.current_day + 1
}

