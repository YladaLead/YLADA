import { supabaseAdmin } from '@/lib/supabase'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

export type ProLideresMemberListItem = {
  userId: string
  role: ProLideresTenantRole
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
    .select('user_id, role, created_at')
    .eq('leader_tenant_id', tenantId)
    .order('role', { ascending: false })
    .order('created_at', { ascending: true })

  if (error || !rows?.length) return []

  const ids = rows.map((r) => r.user_id as string)
  const { data: profiles } = await supabaseAdmin
    .from('user_profiles')
    .select('id, nome_completo, email')
    .in('id', ids)

  const byId = new Map((profiles ?? []).map((p) => [p.id as string, p]))

  return rows.map((r) => {
    const p = byId.get(r.user_id as string)
    return {
      userId: r.user_id as string,
      role: r.role as ProLideresTenantRole,
      createdAt: r.created_at as string,
      displayName: (p?.nome_completo as string | null) ?? null,
      email: (p?.email as string | null) ?? null,
    }
  })
}
