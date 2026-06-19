import { eachDayYmdInRange, formatYmdPtBrWithWeekday } from '@/lib/pro-lideres-dates-br'
import { pointsForUserInRange, weekdayFromYmd } from '@/lib/pro-lideres-daily-tasks-points'
import type {
  ProLideresDailyTaskCompletionRow,
  ProLideresDailyTaskCountRow,
  ProLideresDailyTaskRow,
} from '@/types/pro-lideres-daily-tasks'

export type MemberTaskItem = {
  task: ProLideresDailyTaskRow
  done: boolean
  /** Quantidade registrada no dia (apenas tarefas com contador). */
  quantity?: number
}

export type MemberDayReport = {
  ymd: string
  label: string
  applicableCount: number
  doneCount: number
  done: MemberTaskItem[]
  pending: MemberTaskItem[]
  fullDayComplete: boolean
}

export type MemberExecutionReport = {
  days: MemberDayReport[]
  totalDone: number
  totalPending: number
  points: number
}

export function buildMemberExecutionReport(
  userId: string,
  tasks: ProLideresDailyTaskRow[],
  completions: ProLideresDailyTaskCompletionRow[],
  from: string,
  to: string,
  counts: ProLideresDailyTaskCountRow[] = []
): MemberExecutionReport {
  const days: MemberDayReport[] = []
  let totalDone = 0
  let totalPending = 0

  // Mapa quantidade por (tarefa|dia) do membro.
  const qtyByKey = new Map<string, number>()
  for (const c of counts) {
    if (c.member_user_id !== userId) continue
    qtyByKey.set(`${c.task_id}|${c.counted_on}`, c.quantity)
  }

  for (const ymd of eachDayYmdInRange(from, to)) {
    const dow = weekdayFromYmd(ymd)
    const applicable = tasks
      .filter((t) => (t.execution_weekdays ?? []).includes(dow))
      .sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at))
    if (applicable.length === 0) continue

    const doneIds = new Set(
      completions
        .filter((c) => c.member_user_id === userId && c.completed_on === ymd)
        .map((c) => c.task_id)
    )

    const done: MemberTaskItem[] = []
    const pending: MemberTaskItem[] = []
    for (const task of applicable) {
      const item: MemberTaskItem = { task, done: doneIds.has(task.id) }
      if (task.count_enabled) {
        item.quantity = qtyByKey.get(`${task.id}|${ymd}`) ?? 0
      }
      if (item.done) {
        done.push(item)
        totalDone += 1
      } else {
        pending.push(item)
        totalPending += 1
      }
    }

    days.push({
      ymd,
      label: formatYmdPtBrWithWeekday(ymd),
      applicableCount: applicable.length,
      doneCount: done.length,
      done,
      pending,
      fullDayComplete: pending.length === 0 && applicable.length > 0,
    })
  }

  const points = pointsForUserInRange(userId, tasks, completions, from, to)

  return { days, totalDone, totalPending, points }
}
