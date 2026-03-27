/**
 * Utilitários de data para evitar divergência entre lista (toLocaleDateString) e input type="date".
 *
 * Problema: datas em UTC (ex.: 2026-02-28T02:59:59Z) no Brasil aparecem como 27/02 na lista
 * mas toISOString().split('T')[0] vira "2026-02-28" no formulário → usuário vê 27 num lugar e 28 no outro.
 *
 * Regra: ao preencher input type="date" com uma data que também é exibida na lista com
 * toLocaleDateString('pt-BR'), use toLocalDateStringISO() para o valor do input.
 */

/**
 * Retorna a data no fuso local no formato YYYY-MM-DD (para input type="date").
 * Assim o dia exibido no input bate com o dia exibido por toLocaleDateString('pt-BR').
 */
export function toLocalDateStringISO(date: Date | string | null | undefined): string {
  if (date == null) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Fuso padrão para datas “civis” no admin (cadastro, vencimento exibido no Brasil). */
export const DATE_DISPLAY_TIMEZONE_BR = 'America/Sao_Paulo'

/**
 * Instante ISO → YYYY-MM-DD no calendário do fuso (ex. cadastro: evita dia “errado” vs .toISOString().split).
 */
export function toYmdInTimeZone(iso: string | Date | null | undefined, timeZone = DATE_DISPLAY_TIMEZONE_BR): string | null {
  if (iso == null) return null
  const d = typeof iso === 'string' ? new Date(iso) : iso
  if (Number.isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

/**
 * YYYY-MM-DD já “civil” → DD/MM/AAAA sem interpretar como UTC meia-noite (bug do new Date('2026-03-23')).
 */
export function formatYmdSlashPtBr(ymd: string | null | undefined): string {
  if (ymd == null || ymd === '') return '—'
  const s = ymd.trim().slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return '—'
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`
}

const YMD_RE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Início do dia civil YYYY-MM-DD em America/Sao_Paulo → ISO UTC.
 * Usa offset fixo -03:00 (Brasil sem horário de verão desde 2019).
 */
export function brYmdStartUtcIso(ymd: string): string {
  if (!YMD_RE.test(ymd)) throw new Error('brYmdStartUtcIso: YMD inválido')
  return new Date(`${ymd}T00:00:00-03:00`).toISOString()
}

/** Fim do dia civil (23:59:59.999) em America/Sao_Paulo → ISO UTC. */
export function brYmdEndUtcIso(ymd: string): string {
  if (!YMD_RE.test(ymd)) throw new Error('brYmdEndUtcIso: YMD inválido')
  return new Date(`${ymd}T23:59:59.999-03:00`).toISOString()
}

/** Dias inclusivos entre duas datas civis YYYY-MM-DD (calendário gregoriano). */
export function daysInclusiveYmd(de: string, ate: string): number {
  const [y1, m1, d1] = de.split('-').map(Number)
  const [y2, m2, d2] = ate.split('-').map(Number)
  const t1 = Date.UTC(y1, m1 - 1, d1)
  const t2 = Date.UTC(y2, m2 - 1, d2)
  return Math.floor((t2 - t1) / 86400000) + 1
}
