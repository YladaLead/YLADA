/**
 * Sugere linha do catálogo Meus links com base na mensagem (sem LLM).
 */

export type ProLideresMemberNoelCatalogMatch = {
  label: string
  url: string
  score: number
}

const TOPIC_KEYWORDS: Array<{ tags: string[]; labelHints: string[] }> = [
  { tags: ['agua', 'hidrat', 'beber'], labelHints: ['água', 'agua', 'hidrata'] },
  { tags: ['emagrec', 'peso', 'imc', 'caloria'], labelHints: ['imc', 'caloria', 'emagrec', 'peso', 'metabol'] },
  { tags: ['proteina', 'proteína'], labelHints: ['proteína', 'proteina'] },
  { tags: ['oportunidade', 'negocio', 'negócio', 'renda', 'projeto', 'conhecer', 'apresent'], labelHints: ['oportunidade', 'negócio', 'negocio', 'carreira', 'projeto', 'recrut', 'apresent'] },
  { tags: ['quiz', 'diagnost', 'diagnóst'], labelHints: ['quiz', 'diagnóst', 'diagnost'] },
  { tags: ['sacola', 'kit', 'teste'], labelHints: ['sacola', 'kit', 'teste'] },
]

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

/** Parseia excerpt `- **Label** — url` */
export function parseProLideresMemberNoelCatalogLines(
  excerpt: string | null
): Array<{ label: string; url: string }> {
  if (!excerpt?.trim()) return []
  const out: Array<{ label: string; url: string }> = []
  for (const line of excerpt.split('\n')) {
    const m = line.match(/^\s*-\s*\*\*(.+?)\*\*\s*[—–-]\s*(https?:\S+)/i)
    if (m) out.push({ label: m[1].trim(), url: m[2].trim() })
  }
  return out
}

export function matchProLideresMemberNoelCatalog(
  message: string,
  catalogExcerpt: string | null,
  limit = 3
): ProLideresMemberNoelCatalogMatch[] {
  const items = parseProLideresMemberNoelCatalogLines(catalogExcerpt)
  if (!items.length) return []

  const m = norm(message)
  const scores: ProLideresMemberNoelCatalogMatch[] = []

  for (const item of items) {
    const labelN = norm(item.label)
    let semanticScore = 0

    for (const word of m.split(/\s+/)) {
      if (word.length < 4) continue
      if (labelN.includes(word)) semanticScore += 2
    }

    for (const topic of TOPIC_KEYWORDS) {
      const tagHit = topic.tags.some((t) => m.includes(t))
      const labelHit = topic.labelHints.some((h) => labelN.includes(h))
      if (tagHit && labelHit) semanticScore += 5
    }

    let score = semanticScore
    // Bônus “qual link” só quando já há match semântico — evita chutar o 1º do catálogo.
    if (semanticScore > 0 && /(qual link|que link|mandar link|link para)/.test(m)) score += 1

    if (score > 0) scores.push({ label: item.label, url: item.url, score })
  }

  return scores.sort((a, b) => b.score - a.score).slice(0, limit)
}

export function buildProLideresMemberNoelCatalogHint(
  matches: ProLideresMemberNoelCatalogMatch[]
): string | null {
  if (!matches.length) return null
  const lines = matches.map((x, i) => `${i + 1}. **${x.label}** — ${x.url}`)
  return `Links em Meus links mais adequados a este pedido:\n${lines.join('\n')}`
}
