/**
 * Formatação determinística do markdown do Noel no chat (prévia de quiz + âncora de link).
 * Compartilhado entre matriz e membro Pro Líderes — não altera prompts de geração.
 */

const QUIZ_QUESTION_LINE =
  /^(\*\*)?(\d+)\.\s+(.+?)(\*\*)?\s*$/

const REPEATED_QUIZ_ONE_MARKER = /^(\*\*)?1\.\s+/gm

const NOEL_PUBLIC_LINK_ANCHOR = /\[(?:Acessar|Acesse)[^\]]*\]\(/i

/** Verdadeiro quando o modelo reinicia "1." em cada pergunta (markdown vira 1. 1. 1.). */
export function shouldRenumberNoelQuizPreviewOnes(text: string): boolean {
  return (text.match(REPEATED_QUIZ_ONE_MARKER) ?? []).length >= 2
}

function isLikelyQuizQuestionLine(content: string): boolean {
  const t = content.trim()
  if (!t) return false
  if (t.endsWith('?')) return true
  return t.length >= 12
}

function formatQuizQuestionLine(seq: number, content: string): string {
  return `**${seq}. ${content.trim()}**`
}

/**
 * Renumera perguntas de prévia que repetem "1." e as coloca em negrito (evita lista ordenada).
 * Ex.: "1. P1?\nA) …\n\n1. P2?" → "**1. P1?**\nA) …\n\n**2. P2?**"
 */
export function renumberNoelQuizPreviewQuestions(text: string): string {
  if (!shouldRenumberNoelQuizPreviewOnes(text)) return text

  let seq = 0
  return text
    .split('\n')
    .map((line) => {
      const m = line.match(QUIZ_QUESTION_LINE)
      if (!m || !isLikelyQuizQuestionLine(m[3])) return line
      seq += 1
      return formatQuizQuestionLine(seq, m[3])
    })
    .join('\n')
}

/**
 * Separa rótulo colado na âncora pública do link (ex.: "Calculadora de Sono,[Acessar](url)").
 */
export function separateNoelPublicLinkAnchorLine(text: string): string {
  let t = text
  t = t.replace(
    /,\s*(\[(?:Acessar|Acesse)[^\]]*\]\()/gi,
    '\n\n$1'
  )
  t = t.replace(
    /([^\s\n,\[])(\[(?:Acessar|Acesse)[^\]]*\]\()/gi,
    '$1\n\n$2'
  )
  return t
}

export function noelAssistantMarkdownHasPublicLinkAnchor(text: string): boolean {
  return NOEL_PUBLIC_LINK_ANCHOR.test(text)
}
