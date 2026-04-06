/** Formatação simples para exibição (DDD + celular/fixo). */
export function formatBrazilPhoneDisplay(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.startsWith('55') && d.length >= 12) d = d.slice(2)
  if (d.length === 11) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  }
  if (d.length === 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  }
  const t = raw.trim()
  return t.length > 0 ? t : d
}
