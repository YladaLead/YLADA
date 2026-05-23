import type { ProLideresDailyTaskCompletionRow, ProLideresDailyTaskRow } from '@/types/pro-lideres-daily-tasks'

/** Dia da semana JS (0=dom … 6=sáb) para uma data civil local Y-M-D. */
export function weekdayFromYmd(ymd: string): number {
  const [y, m, d] = ymd.split('-').map((x) => parseInt(x, 10))
  return new Date(y, m - 1, d).getDay()
}

/** Soma pontos das tarefas concluídas no intervalo (sem bónus extra). */
export function pointsForUserInRange(
  userId: string,
  tasks: ProLideresDailyTaskRow[],
  completions: ProLideresDailyTaskCompletionRow[],
  from: string,
  to: string
): number {
  const taskById = new Map(tasks.map((t) => [t.id, t]))

  let total = 0
  for (const c of completions) {
    if (c.member_user_id !== userId) continue
    if (c.completed_on < from || c.completed_on > to) continue
    const t = taskById.get(c.task_id)
    if (t) total += t.points
  }

  return total
}
