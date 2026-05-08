/**
 * Normaliza segmentos de URL de links públicos `/l/[slug]/…` para coincidir com `ylada_links.slug`
 * e resolução de membro na BD.
 *
 * Apps de mensagem e proxies por vezes enviam percent-encoding literal ou Unicode em forma
 * diferente (NFD vs NFC) — o que quebrava a prévia no WhatsApp (404 → HTML sem OG rico).
 */
export function normalizeYladaPublicLinkPathSegment(raw: string): string {
  let s = raw.trim()
  if (!s) return s

  for (let i = 0; i < 3; i++) {
    if (!/%[0-9A-Fa-f]{2}/.test(s)) break
    try {
      const decoded = decodeURIComponent(s)
      if (decoded === s) break
      s = decoded
    } catch {
      break
    }
  }

  try {
    return s.normalize('NFC')
  } catch {
    return s
  }
}
