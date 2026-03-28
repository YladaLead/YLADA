/**
 * Hub /pt/segmentos: texto livre em "Outro" que claramente indica beleza/salão
 * → mesmo destino do botão Beleza/Estética, em vez de solicitar acesso genérico.
 */

const BELEZA_ESTETICA_KEYWORDS_NORMALIZED = [
  'beleza',
  'salao',
  'cabeleireir',
  'cabeleira',
  'hair',
  'barbearia',
  'barbeiro',
  'manicure',
  'manicura',
  'unha',
  'maquiag',
  'sobrancelh',
  'depilac',
  'esteticista',
  'estetica',
  'penteado',
  'colorac',
  'tricolog',
  'alongamento',
  'micropigment',
  'pedicure',
  'lash',
  'cilio',
  'cilios',
  'nail',
  'visag',
  'estudio de beleza',
  'studio de beleza',
]

function normalizeForMatch(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Evita encaminhar casos óbvios de estética médica / dermatologia para o funil de beleza. */
function looksLikeMedicalAestheticContext(normalized: string): boolean {
  return (
    /\bmedicina\b/.test(normalized) ||
    /\bmedico\b/.test(normalized) ||
    /\bmedica\b/.test(normalized) ||
    /\bdermatolog/.test(normalized) ||
    /\bcirurgia\b/.test(normalized) ||
    /\bcirurgiao\b/.test(normalized) ||
    /\bcirurgica\b/.test(normalized) ||
    /\bhospital\b/.test(normalized)
  )
}

export function freeTextMatchesBelezaEsteticaSegment(text: string): boolean {
  const n = normalizeForMatch(text)
  if (n.length < 2) return false
  if (looksLikeMedicalAestheticContext(n)) return false
  if (/\bspa\b/.test(n)) return true
  return BELEZA_ESTETICA_KEYWORDS_NORMALIZED.some((kw) => n.includes(kw))
}
