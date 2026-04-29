const MAX_LEN = 2000

export type ParsedTeamBankPaymentUrl =
  | { action: 'omit' }
  | { action: 'clear' }
  | { action: 'set'; url: string }
  | { action: 'error'; message: string }

/** Campo opcional em PATCH: omitir chave, limpar (null/"") ou URL http(s). */
export function parseTeamBankPaymentUrlField(raw: unknown): ParsedTeamBankPaymentUrl {
  if (raw === undefined) return { action: 'omit' }
  if (raw === null) return { action: 'clear' }
  const s = String(raw).trim()
  if (!s) return { action: 'clear' }
  if (s.length > MAX_LEN) {
    return { action: 'error', message: 'O endereço não pode exceder 2000 caracteres.' }
  }
  try {
    const u = new URL(s)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return {
        action: 'error',
        message: 'Use um endereço que comece por https:// ou http://.',
      }
    }
    return { action: 'set', url: u.toString() }
  } catch {
    return { action: 'error', message: 'Endereço inválido.' }
  }
}
