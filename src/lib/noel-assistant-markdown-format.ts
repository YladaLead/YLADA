/**
 * Formatação determinística do markdown do Noel no chat (prévia de quiz + âncora de link).
 * Compartilhado entre matriz e membro Pro Líderes — não altera prompts de geração.
 */

import { sanitizeNoelAssistantOutput } from '@/lib/noel-output-sanitize'

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

function looksLikeYladaPublicLinkHref(href: string): boolean {
  const t = href.trim()
  if (t.startsWith('/l/')) return true
  try {
    return new URL(t).pathname.startsWith('/l/')
  } catch {
    return /\/l\/[a-z0-9_-]+/i.test(t)
  }
}

function publicLinkDedupeKey(href: string): string {
  const t = href.trim()
  try {
    const u = new URL(t)
    return `${u.origin}${u.pathname.replace(/\/$/, '')}`
  } catch {
    return t.replace(/\/$/, '')
  }
}

/**
 * Segunda ocorrência do mesmo /l/… vira só texto — evita chip duplicado no script sugerido.
 */
export function collapseDuplicateNoelPublicLinkAnchors(text: string): string {
  const seen = new Set<string>()
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (full, label: string, url: string) => {
    if (!looksLikeYladaPublicLinkHref(url)) return full
    const key = publicLinkDedupeKey(url)
    if (seen.has(key)) return label.trim()
    seen.add(key)
    return full
  })
}

const NOEL_RIGID_SECTION_LABELS = [
  'Texto para Postagem',
  'Sugestões de Personalização',
  'Modelo de postagem',
  'Exemplo de postagem',
  'Conteúdo Engajador',
  'Chamada para Ação',
  'Segmente seu Público',
  'Feedback e Resultados',
  'Redes Sociais e Grupos',
  'Na prática',
  'Mensagem pronta',
  'Link para enviar',
  'Próximo passo',
  'Legenda curta',
  'Entender o Funil',
  'Atração',
  'Educação',
  'Qualificação',
  'Análise e Ajustes',
  'Treinamento e Suporte',
  'Celebrar Resultados',
  'Defina Metas Claras',
  'Reunião de Alinhamento',
  'Reconhecimento',
  'Feedback Contínuo',
  'Atividades de Team Building',
  'Desenvolvimento Pessoal',
] as const

/**
 * Remove rótulos de template (**Texto para Postagem:** etc.) que deixam a resposta “montada”.
 */
/** Remove **1. Título:** / **Objetivo:** genéricos que o modelo usa em respostas “manual”. */
function flattenNoelGenericBoldSectionLabels(text: string): string {
  let t = text.replace(/\r\n/g, '\n')
  t = t.replace(/^\s*\*\*\d+\.\s*[^*\n]{1,120}:?\*\*\s*$/gim, '')
  t = t.replace(/^\s*\*\*[^*\n]{2,120}:?\*\*\s*$/gim, '')
  t = t.replace(/^\s*\*\*[^*\n]{2,120}:?\*\*\s+/gm, '')
  return t
}

export function flattenNoelRigidSectionLabels(text: string): string {
  let t = text.replace(/\r\n/g, '\n')
  for (const label of NOEL_RIGID_SECTION_LABELS) {
    const esc = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    t = t.replace(new RegExp(`^\\s*\\*\\*${esc}:?\\*\\*\\s*$`, 'gim'), '')
    t = t.replace(new RegExp(`\\*\\*${esc}:?\\*\\*\\s*`, 'gi'), '')
    t = t.replace(new RegExp(`^\\s*${esc}\\s*:\\s*$`, 'gim'), '')
    t = t.replace(new RegExp(`^${esc}\\s*:\\s*`, 'gim'), '')
  }
  t = flattenNoelGenericBoldSectionLabels(t)
  return cleanupOrphanMarkdownSectionColons(t.replace(/\n{3,}/g, '\n\n').trim())
}

/**
 * Remove `---` que o modelo (ou normalizador legado) coloca entre parágrafos.
 * Mantém só quando a linha seguinte é `### Pergunta N` (prévia de quiz).
 */
export function softenNoelDecorativeHorizontalRules(text: string): string {
  let t = text.replace(/\r\n/g, '\n')
  // Remove `---` decorativo; mantém só quando a linha seguinte é `### Pergunta N` (prévia de quiz).
  t = t.replace(/\n?---\s*\n+(?!\s*###\s+Pergunta\s+\d+\b)/gi, '\n\n')
  t = t.replace(/^\s*---\s*(\n+|$)/, '')
  t = t.replace(/(?:\n---\s*){2,}/g, '\n\n')
  t = t.replace(/\n+---\s*$/, '')
  return t.replace(/\n{3,}/g, '\n\n').trim()
}

export function noelAssistantMarkdownHasRenderableText(text: string): boolean {
  const t = softenNoelDecorativeHorizontalRules(text).replace(/\s+/g, ' ').trim()
  return t.length > 0
}

/** Remove colchetes tipo [insira…] / [Seu link aqui] que deixam a resposta “formulário em branco”. */
export function stripNoelBracketPlaceholders(text: string): string {
  let t = text
  t = t.replace(/\[(?:insira|Insira|INSIRA)[^\]]*\]/gi, '')
  t = t.replace(/\[(?:Seu|seu)\s+link\s+aqui\]/gi, '')
  t = t.replace(/\[(?:benef[ií]cio|Benef[ií]cio)[^\]]*\]/gi, 'um direcionamento prático')
  t = t.replace(/\[[^\]]{12,}\]/g, (m) =>
    /(?:insira|seu link|benef[ií]cio|adapt|preench|coloque|substitu)/i.test(m) ? '' : m
  )
  return t.replace(/ {2,}/g, ' ').replace(/\(\s*\)/g, '')
}

/** Linhas de “preencha o template” que o modelo às vezes acrescenta. */
export function stripNoelTemplateInstructionLines(text: string): string {
  return text
    .split('\n')
    .filter((line) => {
      const t = line.trim()
      if (!t) return true
      if (/^(insira|adapte|substitua|preencha|personalize)\b/i.test(t)) return false
      if (/^[-*•]\s*(insira|adapte|substitua|preencha)/i.test(t)) return false
      if (/^esse formato é direto/i.test(t)) return false
      return true
    })
    .join('\n')
}

/** Sobra de `:` quando o rótulo em negrito foi removido (ex.: `: Publique conteúdos…`). */
export function cleanupOrphanMarkdownSectionColons(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const cleaned = lines
    .map((line) => line.replace(/^\s*[:：]\s*/, ''))
    .filter((line) => {
      const tr = line.trim()
      return tr !== ':' && tr !== '：'
    })
  return cleaned.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

const COLON_BULLET_LINE = /^\s*[:：]\s*(.+)$/

/**
 * Listas com `: item` (artefato de template) viram parágrafos com espaço entre eles.
 * Ex.: "Vamos lá:\n\n: Publique…\n: Compartilhe…" → "Vamos lá\n\nPublique…\n\nCompartilhe…"
 */
export function reflowNoelColonBulletLines(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed === ':' || trimmed === '：') continue
    const colonItem = line.match(COLON_BULLET_LINE)
    if (colonItem) {
      const body = colonItem[1].trim()
      if (!body) continue
      const prev = out[out.length - 1]
      if (prev !== undefined && prev.trim() !== '') out.push('')
      out.push(body)
      if (lines[i + 1]?.match(COLON_BULLET_LINE)) out.push('')
      continue
    }

    const introColon = line.match(/^(.{0,120}?):\s*$/)
    if (introColon && lines[i + 1]?.match(COLON_BULLET_LINE)) {
      out.push(introColon[1].trim())
      out.push('')
      continue
    }

    out.push(line)
  }

  return out.join('\n')
}

/** Linhas de prosa coladas com `\n` simples → parágrafos (`\n\n`) para respirar no chat. */
export function ensureProseParagraphBreaks(text: string): string {
  const lines = text.split('\n')
  const out: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    out.push(line)
    if (!line.trim()) continue

    const next = lines[i + 1]
    if (!next?.trim()) continue
    if (/^#{1,6}\s/.test(next)) continue
    if (/^[-*+]\s/.test(next)) continue
    if (/^\*\*[A-D]\)\*\*/.test(next)) continue
    if (/^\d+\.\s/.test(next)) continue
    if (COLON_BULLET_LINE.test(next)) continue
    if (line.trim().length >= 20 && next.trim().length >= 20) out.push('')
  }

  return out.join('\n')
}

const SENTENCE_END_RE = /[^.!?…]+[.!?…]+(?:\s+|$)/g

function isNoelQuizPreviewMarkdown(text: string): boolean {
  return /###\s+Pergunta\s+\d+/i.test(text) || (/\*\*\d+\./.test(text) && /[A-D]\)/.test(text))
}

/**
 * Quebra blocos longos (parede de texto) em parágrafos curtos — leitura mobile.
 */
export function splitNoelDenseParagraphsForMobile(text: string, maxChars = 200): string {
  if (isNoelQuizPreviewMarkdown(text)) return text

  const blocks = text.split(/\n\n+/)
  const out: string[] = []

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue
    if (trimmed.length <= maxChars || !/\.\s+/.test(trimmed)) {
      out.push(trimmed)
      continue
    }

    const sentences = trimmed.match(SENTENCE_END_RE) ?? [trimmed]
    let chunk: string[] = []
    let chunkLen = 0

    for (const raw of sentences) {
      const s = raw.trim()
      if (!s) continue
      if (chunkLen + s.length > maxChars && chunk.length > 0) {
        out.push(chunk.join(' ').trim())
        chunk = [s]
        chunkLen = s.length
      } else {
        chunk.push(s)
        chunkLen += s.length + 1
      }
    }
    if (chunk.length > 0) out.push(chunk.join(' ').trim())
  }

  return out.join('\n\n')
}

/**
 * Pipeline único de polimento do markdown do Noel no chat (UI + API membro matriz pura).
 */
export function polishNoelAssistantMarkdownForChat(raw: string): string {
  let t = sanitizeNoelAssistantOutput(raw.replace(/\r\n/g, '\n').trim())
  if (!t) return t

  t = renumberNoelQuizPreviewQuestions(t)
  t = separateNoelPublicLinkAnchorLine(t)
  t = collapseDuplicateNoelPublicLinkAnchors(t)

  const quizPreview = /###\s+Pergunta\s+\d+/i.test(t) || (/\*\*\d+\./.test(t) && /[A-D]\)/.test(t))

  t = t.replace(/([^\n])\s+(\d+)\.\s+(?=[^\d\s])/g, '$1\n\n$2. ')

  let prev = ''
  while (prev !== t) {
    prev = t
    t = t.replace(/\s+([A-D])\)\s+/, '\n\n**$1)** ')
  }
  t = t.replace(/^([A-D])\)\s+/gm, '**$1)** ')
  t = t.replace(/\*\*Pergunta\s+(\d+)\*\*\s*:?\s*/gi, '\n\n### Pergunta $1\n\n')
  t = t.replace(/(^|\n)Pergunta\s+(\d+)\s*:\s*/gi, '$1\n\n### Pergunta $2\n\n')

  if (quizPreview) {
    t = t.replace(/\n(###\s+Pergunta\s+([2-9]|\d{2,})\b)/gi, '\n\n---\n\n$1')
    t = t.replace(/(?:\n---\s*){2,}/g, '\n\n---\n\n')
  }

  t = softenNoelDecorativeHorizontalRules(t)
  t = flattenNoelRigidSectionLabels(t)
  t = reflowNoelColonBulletLines(t)
  t = stripNoelBracketPlaceholders(t)
  t = stripNoelTemplateInstructionLines(t)
  t = cleanupOrphanMarkdownSectionColons(t)
  if (!quizPreview) {
    t = t.replace(/^\s*#{1,3}\s*Pr[oó]ximos?\s+passos\b[^\n]*\n+/gim, '')
    t = t.replace(/^\s*\*\*Pr[oó]ximos?\s+passos:?\*\*\s*$/gim, '')
  }
  t = ensureProseParagraphBreaks(t)
  t = splitNoelDenseParagraphsForMobile(t)
  t = t.replace(/\n{3,}/g, '\n\n').trim()
  return t
}
