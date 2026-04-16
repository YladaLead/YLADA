import { supabaseAdmin } from '@/lib/supabase'
import type { ProLideresTeamAccessState, ProLideresTenantRole } from '@/types/leader-tenant'

export type ProLideresMemberListItem = {
  userId: string
  role: ProLideresTenantRole
  teamAccessState: ProLideresTeamAccessState
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
    .select('user_id, role, team_access_state, created_at')
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
      rawState === 'paused' ? 'paused' : 'active'
    return {
      userId: r.user_id as string,
      role: r.role as ProLideresTenantRole,
      teamAccessState,
      createdAt: r.created_at as string,
      displayName: (p?.nome_completo as string | null) ?? null,
      email: (p?.email as string | null) ?? null,
    }
  })
}
