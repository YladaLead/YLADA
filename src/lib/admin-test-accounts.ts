/**
 * E-mails de contas de teste / internas — não entram nos totais de “produção” no admin.
 * Domínio = parte após @ (case-insensitive).
 * E-mails completos: lista fixa + ADMIN_TEST_EMAILS (servidor).
 *
 * Variáveis opcionais:
 * - ADMIN_TEST_EMAIL_DOMAINS=foo.com,bar.com
 * - ADMIN_TEST_EMAILS=um@gmail.com,outro@x.com
 */

const DEFAULT_TEST_DOMAINS = ['ylada.com', 'ylada.com.br', 'ylada.app'] as const

/** Contas conhecidas por e-mail completo (ex.: Gmail de demo). */
const DEFAULT_TEST_EMAILS_EXACT = ['portalmagra@gmail.com'] as const

function domainsFromEnv(): string[] {
  const raw = process.env.ADMIN_TEST_EMAIL_DOMAINS?.trim()
  if (!raw) return []
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

function exactEmailsFromEnv(): string[] {
  const raw = process.env.ADMIN_TEST_EMAILS?.trim()
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

export function getAdminTestEmailsExact(): string[] {
  const set = new Set<string>([...DEFAULT_TEST_EMAILS_EXACT, ...exactEmailsFromEnv()])
  return [...set]
}

export function isAdminTestAccountEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false
  const norm = email.trim().toLowerCase()
  if (!norm) return false
  for (const e of getAdminTestEmailsExact()) {
    if (norm === e) return true
  }
  const at = norm.lastIndexOf('@')
  if (at < 0 || at === norm.length - 1) return false
  const domain = norm.slice(at + 1).trim().toLowerCase()
  if (!domain) return false
  for (const d of getAdminTestEmailDomains()) {
    if (domain === d) return true
    if (domain.endsWith('.' + d)) return true
  }
  return false
}
