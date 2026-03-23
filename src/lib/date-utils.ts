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
