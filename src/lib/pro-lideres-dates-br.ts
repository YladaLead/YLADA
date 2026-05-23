/** Datas civis no fuso da equipe (Brasil). */
export const PRO_LIDERES_TZ = 'America/Sao_Paulo'

export function proLideresTodayYmdBr(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: PRO_LIDERES_TZ })
}

export function addDaysYmd(ymd: string, delta: number): string {
  const [y, m, day] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, day + delta))
  return dt.toISOString().slice(0, 10)
}

export function proLideresYesterdayYmdBr(): string {
  return addDaysYmd(proLideresTodayYmdBr(), -1)
}

/** Ex.: 22/05/2026 */
export function formatYmdPtBrShort(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/** Ex.: seg., 22/05 */
export function formatYmdPtBrWithWeekday(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number)
  const label = new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/** Dias civis inclusive [from, to]; por padrão do mais recente ao mais antigo. */
export function eachDayYmdInRange(from: string, to: string, descending = true): string[] {
  if (from > to) return []
  const days: string[] = []
  let cur = from
  while (cur <= to) {
    days.push(cur)
    cur = addDaysYmd(cur, 1)
  }
  return descending ? days.reverse() : days
}
