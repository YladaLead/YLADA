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
