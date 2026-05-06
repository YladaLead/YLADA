/** Compara textos de diagnóstico para evitar blocos repetidos na UI. */

export function normalizeForDiagnosisCompare(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function areVerySimilarDiagnosisStrings(a?: string, b?: string): boolean {
  const x = normalizeForDiagnosisCompare(a || '')
  const y = normalizeForDiagnosisCompare(b || '')
  if (!x || !y) return false
  if (x === y) return true
  const xWords = x.split(' ').filter(Boolean)
  const yWords = y.split(' ').filter(Boolean)
  if (xWords.length === 0 || yWords.length === 0) return false
  const xSet = new Set(xWords)
  const overlap = yWords.filter((w) => xSet.has(w)).length
  const ratio = overlap / Math.max(xWords.length, yWords.length)
  return ratio >= 0.8
}
