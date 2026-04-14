import type { ProLideresDailyTaskCompletionRow, ProLideresDailyTaskRow } from '@/types/pro-lideres-daily-tasks'

/** Dia da semana JS (0=dom … 6=sáb) para uma data civil local Y-M-D. */
export function weekdayFromYmd(ymd: string): number {
  const [y, m, d] = ymd.split('-').map((x) => parseInt(x, 10))
  return new Date(y, m - 1, d).getDay()
}

/**
 * Soma pontos das conclusões no intervalo + bónus de «dia completo» (uma vez por dia em que todas as tarefas
 * aplicáveis a esse dia da semana estão concluídas).
 */
export function pointsForUserInRange(
  userId: string,
  tasks: ProLideresDailyTaskRow[],
  completions: ProLideresDailyTaskCompletionRow[],
  from: string,
  to: string,
  fullDayBonusPerDay: number
): number {
  const taskById = new Map(tasks.map((t) => [t.id, t]))

  const inRange = (c: ProLideresDailyTaskCompletionRow) =>
    c.member_user_id === userId && c.completed_on >= from && c.completed_on <= to

  let base = 0
  const datesWithActivity = new Set<string>()
  for (const c of completions) {
    if (!inRange(c)) continue
    datesWithActivity.add(c.completed_on)
    const t = taskById.get(c.task_id)
    if (t) base += t.points
  }

  if (fullDayBonusPerDay <= 0) return base

  let bonus = 0
  for (const dateStr of datesWithActivity) {
    const dow = weekdayFromYmd(dateStr)
    const applicable = tasks.filter((t) => (t.execution_weekdays ?? []).includes(dow))
    if (applicable.length === 0) continue
    const doneIds = new Set(
      completions
        .filter((c) => c.member_user_id === userId && c.completed_on === dateStr)
        .map((c) => c.task_id)
    )
    if (applicable.every((t) => doneIds.has(t.id))) {
      bonus += fullDayBonusPerDay
    }
  }

  return base + bonus
}
