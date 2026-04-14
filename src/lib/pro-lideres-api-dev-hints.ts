/** Dicas só em NODE_ENV=development para APIs Pro Líderes (localhost sem service role / tenant). */

export function proLideresApiDevHint(kind: 'noServiceRole' | 'noTenant'): { devHint?: string } {
  if (process.env.NODE_ENV !== 'development') return {}
  const messages = {
    noServiceRole:
      'Local: adicione SUPABASE_SERVICE_ROLE_KEY ao .env.local (Supabase → Project Settings → API → service_role) e reinicie o next dev.',
    noTenant:
      'Local: precisa de tenant em leader_tenants para este utilizador. Abra /pro-lideres/painel uma vez (provisiona) ou aplique as migrações SQL no Supabase.',
  }
  return { devHint: messages[kind] }
}
