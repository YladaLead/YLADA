/**
 * Pós-processamento determinístico da saída do Noel (todas as rotas).
 * O GUIA_DE_VOZ proíbe travessão; o modelo escapa — corrigimos aqui.
 */

const EM_DASH_SURROUNDED_RE = /\s+[—–]\s+/g
const EM_DASH_RE = /[—–]/g
const COMMA_GLITCH_RE = /,\s*,/g
const MULTI_SPACE_RE = / {2,}/g

/** Troca travessão entre espaços por vírgula; demais por vírgula também. */
export function replaceNoelEmDashInText(text: string): string {
  return text.replace(EM_DASH_SURROUNDED_RE, ', ').replace(EM_DASH_RE, ', ')
}

function tidyNoelPunctuation(text: string): string {
  return text
    .replace(COMMA_GLITCH_RE, ',')
    .replace(/\s+,/g, ',')
    .replace(/,\s*([.!?])/g, '$1')
    .replace(MULTI_SPACE_RE, ' ')
    .trim()
}

/** Sanitiza texto assistente do Noel antes de exibir ou devolver na API. */
export function sanitizeNoelAssistantOutput(text: string): string {
  if (!text.trim()) return text
  let out = replaceNoelEmDashInText(text)
  out = tidyNoelPunctuation(out)
  return out
}
