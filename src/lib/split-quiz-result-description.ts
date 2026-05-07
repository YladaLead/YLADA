/**
 * Divide descrição do quiz (schema_json) para a primeira dobra alinhada à calculadora pública
 * e calcula o texto exclusivo da análise expandida (sem repetir cartões da primeira dobra).
 */

function normCompact(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase()
}

/** Remove parágrafos que repetem literalmente (ou quase) o que já está nos cartões / headline. */
export function dedupeQuizExpandedBody(body: string, foldChunks: string[]): string {
  const raw = body.replace(/\r\n/g, '\n').trim()
  if (!raw) return ''
  const forb = foldChunks.map(normCompact).filter((x) => x.length > 20)
  if (forb.length === 0) return raw

  const paras = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  const kept = paras.filter((p) => {
    const n = normCompact(p.replace(/^[*_`"'“”]+|[*_`"'“”]+$/g, ''))
    if (n.length < 24) return true
    for (const f of forb) {
      if (n === f) return false
      if (n.length >= 60 && f.length >= 60) {
        const a = n.slice(0, 120)
        const b = f.slice(0, 120)
        if (a.includes(b) || b.includes(a)) return false
      }
    }
    return true
  })
  let out = kept.join('\n\n').trim()

  // Remove blocos com rótulo que já foram espelhados nos cartões (cópia com cabeçalho).
  out = out
    .replace(
      /(?:^|\n)\s*CAUSA\s+PROVÁVEL\s*:?\s*\n+[\s\S]*?(?=\n\s*(?:PREOCUPA|DICA|PRÓXIMOS|PROXIMOS|A boa notícia|A boa noticia|$))/gi,
      '\n'
    )
    .replace(
      /(?:^|\n)\s*PREOCUPA(?:ÇÕES|COES)\s*:?\s*\n+[\s\S]*?(?=\n\s*(?:DICA|PRÓXIMOS|PROXIMOS|A boa notícia|A boa noticia|$))/gi,
      '\n'
    )
    .trim()

  return out.replace(/\n{3,}/g, '\n\n').trim()
}

function splitBodyIntoInsightTipAndTail(body: string): { insight: string; tip: string; expandedTail: string } {
  const d = body.trim()
  if (!d) return { insight: '', tip: '', expandedTail: '' }

  const parts = d
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  if (parts.length >= 3) {
    return {
      insight: parts[0]!,
      tip: parts[1]!,
      expandedTail: parts.slice(2).join('\n\n').trim(),
    }
  }
  if (parts.length === 2) {
    return { insight: parts[0]!, tip: parts[1]!, expandedTail: '' }
  }

  const sentences = d.split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean)
  if (sentences.length >= 2) {
    const mid = Math.max(1, Math.ceil(sentences.length / 2))
    return {
      insight: sentences.slice(0, mid).join(' '),
      tip: sentences.slice(mid).join(' '),
      expandedTail: '',
    }
  }

  return { insight: d, tip: '', expandedTail: '' }
}

export function splitQuizDescriptionForPublicResult(description: string): {
  consequence: string | null
  insight: string
  tip: string
  expandedTail: string
} {
  let d = description.replace(/\r\n/g, '\n').trim()
  let consequence: string | null = null

  const cons = d.match(
    /^\s*(?:CONSEQUÊNCIA|CONSEQUENCIA|Consequence)\s*:?\s*\n?\s*(.+?)(?=\n\n|\n(?:CAUSA|PREOCUPA|PRECAU|DICA|PRÓXIMOS|PROXIMOS|A boa notícia|A boa noticia)|$)/is
  )
  if (cons && typeof cons.index === 'number') {
    consequence = cons[1].replace(/\s+/g, ' ').trim()
    d = `${d.slice(0, cons.index)}${d.slice(cons.index + cons[0].length)}`.trim()
  }

  const inner = splitBodyIntoInsightTipAndTail(d)
  return { consequence, ...inner }
}
