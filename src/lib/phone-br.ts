/**
 * Normalização de telefone BR para evitar conversas duplicadas.
 * Celular BR = 55 + DDD (2) + 9 + 8 dígitos = 13 dígitos.
 * Se vier 55 + DDD + 8 dígitos (12 dígitos), insere o 9 após o DDD para unificar.
 */

export function normalizePhoneBr(phone: string): string {
  const d = (phone || '').replace(/\D/g, '')
  if (d.length < 10) return d
  // 55 + 2 (DDD) + 8 dígitos = 12 → converter para 55 + 2 + "9" + 8 = 13 (celular)
  if (d.startsWith('55') && d.length === 12) {
    return d.slice(0, 4) + '9' + d.slice(4)
  }
  // 15 dígitos começando com "10" (ex.: 105518208736052): pode ser prefixo + BR 13 dígitos
  if (d.length === 15 && d.startsWith('10') && d.slice(2, 4) === '55') {
    return d.slice(2, 15)
  }
  return d
}
