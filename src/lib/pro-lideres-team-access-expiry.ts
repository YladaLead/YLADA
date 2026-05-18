/**
 * Calcula `team_access_expires_at` a partir de dias relativos ou data fixa (YYYY-MM-DD).
 */
export function resolveTeamAccessExpiresAt(input: {
  accessDays?: number | null
  accessExpiresAt?: string | null
  /** Se true, data no passado é rejeitada (ativação pelo líder). */
  requireFutureDate?: boolean
}): { expiresAt: string | null; error?: string } {
  const hasDate =
    input.accessExpiresAt !== undefined &&
    input.accessExpiresAt !== null &&
    String(input.accessExpiresAt).trim() !== ''
  const hasDays = input.accessDays !== undefined && input.accessDays !== null

  if (hasDate && hasDays) {
    return { expiresAt: null, error: 'Use dias de validade ou data fixa, não os dois ao mesmo tempo.' }
  }

  if (hasDate) {
    const parsed = parseAccessExpiresAtDate(String(input.accessExpiresAt).trim())
    if ('error' in parsed) return { expiresAt: null, error: parsed.error }
    if (input.requireFutureDate && parsed.getTime() <= Date.now()) {
      return { expiresAt: null, error: 'A data de validade deve ser no futuro.' }
    }
    return { expiresAt: parsed.toISOString() }
  }

  if (hasDays) {
    if (typeof input.accessDays !== 'number' || !Number.isFinite(input.accessDays)) {
      return { expiresAt: null, error: 'accessDays inválido.' }
    }
    const d = Math.floor(input.accessDays)
    if (d < 1 || d > 3660) {
      return {
        expiresAt: null,
        error: 'Indique entre 1 e 3660 dias de validade, ou use uma data fixa.',
      }
    }
    const until = new Date()
    until.setHours(23, 59, 59, 999)
    until.setDate(until.getDate() + d)
    return { expiresAt: until.toISOString() }
  }

  return { expiresAt: null }
}

/** Fim do dia civil local para input type="date" (YYYY-MM-DD). */
function parseAccessExpiresAtDate(raw: string): Date | { error: string } {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, mo, d] = raw.split('-').map((x) => parseInt(x, 10))
    if (!y || !mo || !d) return { error: 'Data inválida.' }
    const end = new Date(y, mo - 1, d, 23, 59, 59, 999)
    if (Number.isNaN(end.getTime())) return { error: 'Data inválida.' }
    return end
  }
  const dt = new Date(raw)
  if (Number.isNaN(dt.getTime())) return { error: 'Data inválida.' }
  return dt
}

/** Dias entre hoje (início do dia) e uma data YYYY-MM-DD — para atalho no UI. */
export function daysFromTodayToDateString(dateYmd: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateYmd)) return null
  const [y, mo, d] = dateYmd.split('-').map((x) => parseInt(x, 10))
  const target = new Date(y, mo - 1, d, 23, 59, 59, 999)
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const diff = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return diff > 0 && diff <= 3660 ? diff : null
}
