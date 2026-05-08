/**
 * Catálogo Pro Líderes: `publicUrl` da API pode vir só como path (`/l/...`).
 * Colar path sem domínio no WhatsApp muitas vezes não gera preview nem link clicável.
 */
export function resolveAbsoluteProLideresCatalogPublicUrl(publicUrl: string): string {
  const u = (publicUrl || '').trim()
  if (!u) return u
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('/')) {
    if (typeof window !== 'undefined' && window.location?.origin) {
      return `${window.location.origin}${u}`
    }
    const base = (process.env.NEXT_PUBLIC_APP_URL || '').trim().replace(/\/$/, '')
    if (base) return `${base}${u}`
  }
  return u
}
