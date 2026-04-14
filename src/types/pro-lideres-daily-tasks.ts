/** 0 = domingo … 6 = sábado (igual a `Date.getDay()` em JavaScript). */
export type ProLideresJsWeekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type ProLideresDailyTaskRow = {
  id: string
  leader_tenant_id: string
  title: string
  description: string | null
  points: number
  execution_weekdays: number[]
  sort_order: number
  created_by_user_id: string
  created_at: string
  updated_at: string
}

export type ProLideresDailyTaskCompletionRow = {
  id: string
  leader_tenant_id: string
  task_id: string
  member_user_id: string
  completed_on: string
  completed_at: string
}

export type ProLideresWeekdayReminderRow = {
  id: string
  leader_tenant_id: string
  weekday: number
  body: string
  updated_at: string
  created_at: string
}

/** Ordem de UI: segunda → domingo */
export const PL_WEEKDAY_ORDER: ProLideresJsWeekday[] = [1, 2, 3, 4, 5, 6, 0]

export const PL_WEEKDAY_LABEL: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
}

export const PL_WEEKDAY_LABEL_SHORT: Record<number, string> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
}

export function formatExecutionWeekdays(days: number[]): string {
  const set = new Set(days)
  const parts = PL_WEEKDAY_ORDER.filter((d) => set.has(d)).map((d) => PL_WEEKDAY_LABEL_SHORT[d])
  return parts.length ? parts.join(', ') : '—'
}
