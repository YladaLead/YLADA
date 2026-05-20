/**
 * Normaliza copy de scripts Pro Líderes: remove "socrático" e travessão (—) típico de IA.
 */

const SOCRATICO_RE = /\s*socrátic[oa]s?\b/gi
const EM_DASH_SURROUNDED_RE = /\s*—\s*/g
const EM_DASH_RE = /—/g
const MULTI_SPACE_RE = /\s{2,}/g
const COMMA_GLITCH_RE = /,\s*,/g

export function stripSocraticoFromCopy(text: string): string {
  return text.replace(SOCRATICO_RE, ' ')
}

export function replaceEmDashInCopy(text: string): string {
  return text.replace(EM_DASH_SURROUNDED_RE, ', ').replace(EM_DASH_RE, ', ')
}

function tidyPunctuation(text: string): string {
  return text
    .replace(COMMA_GLITCH_RE, ',')
    .replace(/\s+,/g, ',')
    .replace(/,\s*([.!?])/g, '$1')
    .replace(MULTI_SPACE_RE, ' ')
    .trim()
}

/** Limpa título ou corpo de script antes de gravar ou exibir. */
export function sanitizeProLideresScriptCopy(text: string | null | undefined): string {
  if (text == null || text === '') return ''
  let out = stripSocraticoFromCopy(text)
  out = replaceEmDashInCopy(out)
  return tidyPunctuation(out)
}
