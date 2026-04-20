/**
 * Noel Pro Líderes: o modelo às vezes inventa slugs estilo `pl-…-r-tema` (padrão de presets)
 * que não existem em `ylada_links`. O backend devolve o URL canónico do `/api/ylada/links/generate`.
 */

function canonicalSlugAndOrigin(canonicalPublicUrl: string): { slug: string; origin: string; url: string } | null {
  const c = canonicalPublicUrl.trim()
  if (!c) return null
  try {
    const u = new URL(c)
    const m = u.pathname.match(/^\/l\/([a-z0-9_-]+)\/?$/i)
    if (!m?.[1]) return null
    return { slug: m[1].toLowerCase(), origin: u.origin, url: c.replace(/\/$/, '') }
  } catch {
    return null
  }
}

/** Substitui qualquer `https?://…/l/{slug}` (localhost, Vercel, ylada.com) pelo URL canónico quando o slug difere. */
export function rewriteYladaQuizUrlsInMarkdownToCanonical(markdown: string, canonicalPublicUrl: string): string {
  const meta = canonicalSlugAndOrigin(canonicalPublicUrl)
  if (!markdown.trim() || !meta) return markdown
  const { slug: canonicalSlug, origin, url: canonicalUrl } = meta

  const replaceIfWrongSlug = (full: string, slug: string) =>
    String(slug).toLowerCase() === canonicalSlug ? full : canonicalUrl

  let out = markdown.replace(/https?:\/\/[^\s)]+\/l\/([a-z0-9_-]+)/gi, (full, slug: string) =>
    replaceIfWrongSlug(full, slug)
  )

  out = out.replace(/\]\(\/l\/([a-z0-9_-]+)\)/gi, (full, slug: string) => {
    if (String(slug).toLowerCase() === canonicalSlug) return full
    return `](${origin}/l/${canonicalSlug})`
  })

  return out
}

/** Remove linhas que são só um URL público `/l/…` (duplicado do chip ou slug errado); os botões cobrem copiar/abrir. */
export function stripBareYladaPublicQuizUrlLines(markdown: string, canonicalPublicUrl: string): string {
  if (!canonicalSlugAndOrigin(canonicalPublicUrl) || !markdown.trim()) return markdown
  const out = markdown
    .split('\n')
    .filter((line) => !/^https?:\/\/[^\s)]+\/l\/[a-z0-9_-]+\s*$/i.test(line.trim()))
    .join('\n')
  return out.replace(/\n{3,}/g, '\n\n').trimEnd()
}

/** O painel já tem botões (copiar, testar, catálogo); este bloco só duplica instruções. */
export function stripMarkdownProLideresProximoPassoSection(markdown: string): string {
  return markdown.replace(/\n+###\s*Pr[oó]ximo\s+passo\b[\s\S]*$/i, '').trimEnd()
}
