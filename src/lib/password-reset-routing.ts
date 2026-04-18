/**
 * Roteamento padrão de recuperação de senha (link do e-mail → página de nova senha).
 * Modelo atual: acesso unificado em ylada.com; o segmento escolhe-se depois no produto.
 * Por isso o reset **não** envia mais para /pt/nutri, /pt/coach ou /pt/wellness — só matriz + admin.
 */

/** Path relativo (pathname) para redirectTo do generateLink Supabase. */
export function getResetPasswordPathForUserPerfil(perfil: string | null | undefined): string {
  const p = (perfil || '').toLowerCase().trim()
  if (p === 'admin') return '/admin/reset-password'
  return '/pt/reset-password'
}

/** Chave para texto do e-mail (sendPasswordResetEmail). */
export type PasswordResetEmailAreaKey = 'wellness' | 'nutri' | 'coach' | 'nutra' | 'ylada' | 'admin'

/** Com produto unificado em ylada.com, o e-mail de reset usa sobretudo o rótulo YLADA (admin mantém exceção). */
export function getPasswordResetEmailAreaKey(perfil: string | null | undefined): PasswordResetEmailAreaKey {
  const p = (perfil || '').toLowerCase().trim()
  if (p === 'admin') return 'admin'
  return 'ylada'
}
