/**
 * Lista de e-mails com acesso liberado à Jornada (bypass de bloqueio)
 * Usado para testes e verificações
 */
export const JORNADA_UNLOCKED_EMAILS: string[] = [
  'renataborges.mpm@gmail.com',
  'faulaandre@gmail.com'
]

/**
 * Verifica se um e-mail tem acesso liberado
 */
export function isEmailUnlocked(email: string | null | undefined): boolean {
  if (!email) return false
  return JORNADA_UNLOCKED_EMAILS.includes(email.toLowerCase().trim())
}

