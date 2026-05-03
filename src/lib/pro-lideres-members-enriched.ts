import { supabaseAdmin } from '@/lib/supabase'
import type { ProLideresTeamAccessState, ProLideresTenantRole } from '@/types/leader-tenant'

/**
 * Membros ativos com `team_access_expires_at` já passada passam a `paused` (sincronização ao abrir Análise da equipe).
 */
export async function syncProLideresMemberExpiryPauses(tenantId: string): Promise<void> {
  if (!supabaseAdmin) return
  const now = new Date().toISOString()
  const { error } = await supabaseAdmin
    .from('leader_tenant_members')
    .update({ team_access_state: 'paused' })
    .eq('leader_tenant_id', tenantId)
    .eq('role', 'member')
    .eq('team_access_state', 'active')
    .not('team_access_expires_at', 'is', null)
    .lt('team_access_expires_at', now)

  if (error) {
    console.error('[syncProLideresMemberExpiryPauses]', error.message)
  }
}

export type ProLideresMemberListItem = {
  userId: string
  role: ProLideresTenantRole
  teamAccessState: ProLideresTeamAccessState
  /** ISO; null = sem data de fim definida. */
  teamAccessExpiresAt: string | null
  createdAt: string
  displayName: string | null
  email: string | null
}

/** Lista membros do tenant com nome/e-mail de user_profiles (só servidor, service role). */
export async function fetchProLideresMembersEnriched(
  tenantId: string
): Promise<ProLideresMemberListItem[]> {
  if (!supabaseAdmin) return []

  const { data: rows, error } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('user_id, role, team_access_state, team_access_expires_at, created_at')
    .eq('leader_tenant_id', tenantId)
    .order('role', { ascending: false })
    .order('created_at', { ascending: true })

  if (error || !rows?.length) return []

  const ids = rows.map((r) => r.user_id as string)
  const { data: profiles } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, nome_completo, email')
    .in('user_id', ids)

  const byId = new Map((profiles ?? []).map((p) => [p.user_id as string, p]))

  return rows.map((r) => {
    const p = byId.get(r.user_id as string)
    const rawState = (r.team_access_state as string | undefined) ?? 'active'
    const teamAccessState: ProLideresTeamAccessState =
      rawState === 'paused'
        ? 'paused'
        : rawState === 'pending_activation'
          ? 'pending_activation'
          : 'active'
    const exp = r.team_access_expires_at
    return {
      userId: r.user_id as string,
      role: r.role as ProLideresTenantRole,
      teamAccessState,
      teamAccessExpiresAt: typeof exp === 'string' && exp.trim() ? exp : null,
      createdAt: r.created_at as string,
      displayName: (p?.nome_completo as string | null) ?? null,
      email: (p?.email as string | null) ?? null,
    }
  })
}
