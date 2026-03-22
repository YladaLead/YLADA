/**
 * E-mails de contas de teste / internas — não entram nos totais de “produção” no admin.
 * Domínio = parte após @ (case-insensitive).
 *
 * Variável opcional: ADMIN_TEST_EMAIL_DOMAINS=foo.com,bar.com (somente servidor).
 */

const DEFAULT_TEST_DOMAINS = ['ylada.com', 'ylada.com.br'] as const

function domainsFromEnv(): string[] {
  const raw = process.env.ADMIN_TEST_EMAIL_DOMAINS?.trim()
  if (!raw) return []
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function getAdminTestEmailDomains(): string[] {
  const extra = domainsFromEnv()
  const base = [...DEFAULT_TEST_DOMAINS]
  for (const d of extra) {
    if (!base.includes(d)) base.push(d)
  }
  return base
}

export function isAdminTestAccountEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false
  const at = email.lastIndexOf('@')
  if (at < 0 || at === email.length - 1) return false
  const domain = email.slice(at + 1).trim().toLowerCase()
  if (!domain) return false
  for (const d of getAdminTestEmailDomains()) {
    if (domain === d) return true
    if (domain.endsWith('.' + d)) return true
  }
  return false
}
