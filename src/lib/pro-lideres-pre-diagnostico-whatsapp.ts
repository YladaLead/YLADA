/**
 * Monta uma linha única de WhatsApp a partir de `whatsapp_ddi` + `whatsapp` nos answers (mesmo padrão da estética).
 */
export function consultoriaAnswersToWhatsappLine(answers: Record<string, unknown>): string | null {
  const ddiRaw = answers.whatsapp_ddi == null ? '' : String(answers.whatsapp_ddi).trim()
  const ddi = ddiRaw ? ddiRaw.replace(/\s+—\s+.+$/, '').trim() : ''
  const wa = answers.whatsapp == null ? '' : String(answers.whatsapp).trim()
  if (!wa) return null
  const prefix = ddi || '+55'
  const line = `${prefix} ${wa}`.replace(/\s+/g, ' ').trim()
  return line.slice(0, 80) || null
}

export function consultoriaWhatsappLineHasMinDigits(line: string | null, minDigits = 8): boolean {
  if (!line) return false
  const n = line.replace(/\D/g, '').length
  return n >= minDigits
}
