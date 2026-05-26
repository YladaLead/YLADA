import type { SupabaseClient } from '@supabase/supabase-js'

const VERTICAL_H_LIDER = 'h-lider'

export type AdminProLideresLeaderContext = {
  tenantId: string
  tenantDisplayName: string
  leaderOwnerUserId: string
  leaderOwnerName: string
  /** Nome do líder para coluna/filtro (perfil ou e-mail do tenant). */
  leaderLabel: string
  isOwner: boolean
}

type TenantRow = {
  id: string
  display_name: string | null
  team_name: string | null
  contact_email: string | null
  owner_user_id: string
}

function tenantDisplayName(row: {
  display_name?: string | null
  team_name?: string | null
  contact_email?: string | null
}): string {
  return (
    (row.display_name as string | null)?.trim() ||
    (row.team_name as string | null)?.trim() ||
    (row.contact_email as string | null)?.trim() ||
    'Equipe Pro Líderes'
  )
}

/** Dono + membros de um tenant h-lider (filtro admin por líder). */
export async function fetchUserIdsForProLideresTenant(
  admin: SupabaseClient,
  tenantId: string
): Promise<string[]> {
  const { data: tenant } = await admin
    .from('leader_tenants')
    .select('owner_user_id, vertical_code')
    .eq('id', tenantId)
    .maybeSingle()

  if (!tenant || (tenant.vertical_code as string) !== VERTICAL_H_LIDER) return []

  const ids = new Set<string>()
  const ownerId = tenant.owner_user_id as string | undefined
  if (ownerId) ids.add(ownerId)

  const { data: members } = await admin
    .from('leader_tenant_members')
    .select('user_id')
    .eq('leader_tenant_id', tenantId)

  for (const m of members ?? []) {
    const uid = (m as { user_id?: string }).user_id
    if (uid) ids.add(uid)
  }

  return [...ids]
}

/**
 * Contexto de líder/equipe Pro Líderes (h-lider) por `user_id` — coluna e filtro no admin.
 * Membro com vários tenants: usa o vínculo h-lider mais recente (`created_at` desc).
 */
export async function fetchAdminProLideresLeaderContextByUserId(
  admin: SupabaseClient,
  userIds: string[]
): Promise<Map<string, AdminProLideresLeaderContext>> {
  const out = new Map<string, AdminProLideresLeaderContext>()
  if (userIds.length === 0) return out

  const tenantById = new Map<string, TenantRow>()

  const { data: owned } = await admin
    .from('leader_tenants')
    .select('id, display_name, team_name, contact_email, owner_user_id')
    .eq('vertical_code', VERTICAL_H_LIDER)
    .in('owner_user_id', userIds)

  for (const t of (owned ?? []) as TenantRow[]) {
    tenantById.set(t.id, t)
  }

  const { data: memberRows } = await admin
    .from('leader_tenant_members')
    .select('user_id, leader_tenant_id, created_at')
    .in('user_id', userIds)
    .order('created_at', { ascending: false })

  const members = (memberRows ?? []) as {
    user_id?: string
    leader_tenant_id?: string
  }[]

  const tenantIdsNeeded = [
    ...new Set(
      members
        .map((m) => m.leader_tenant_id)
        .filter((id): id is string => Boolean(id) && !tenantById.has(id as string)) as string[]
    ),
  ]

  if (tenantIdsNeeded.length > 0) {
    const { data: tenRows } = await admin
      .from('leader_tenants')
      .select('id, display_name, team_name, contact_email, owner_user_id')
      .in('id', tenantIdsNeeded)
      .eq('vertical_code', VERTICAL_H_LIDER)

    for (const t of (tenRows ?? []) as TenantRow[]) {
      tenantById.set(t.id, t)
    }
  }

  const ownerIds = [...new Set([...tenantById.values()].map((t) => t.owner_user_id))]
  const ownerNameById = await batchOwnerNames(admin, ownerIds)

  for (const t of tenantById.values()) {
    if (!userIds.includes(t.owner_user_id)) continue
    const ownerName = ownerNameById.get(t.owner_user_id) ?? tenantDisplayName(t)
    out.set(t.owner_user_id, {
      tenantId: t.id,
      tenantDisplayName: tenantDisplayName(t),
      leaderOwnerUserId: t.owner_user_id,
      leaderOwnerName: ownerName,
      leaderLabel: ownerName,
      isOwner: true,
    })
  }

  for (const m of members) {
    const uid = m.user_id
    const tid = m.leader_tenant_id
    if (!uid || !tid || out.has(uid)) continue
    const tenant = tenantById.get(tid)
    if (!tenant) continue
    const ownerName = ownerNameById.get(tenant.owner_user_id) ?? tenantDisplayName(tenant)
    out.set(uid, {
      tenantId: tenant.id,
      tenantDisplayName: tenantDisplayName(tenant),
      leaderOwnerUserId: tenant.owner_user_id,
      leaderOwnerName: ownerName,
      leaderLabel: ownerName,
      isOwner: false,
    })
  }

  return out
}

async function batchOwnerNames(
  admin: SupabaseClient,
  ownerIds: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  if (ownerIds.length === 0) return map

  const { data: profiles } = await admin
    .from('user_profiles')
    .select('user_id, nome_completo, email')
    .in('user_id', ownerIds)

  for (const p of profiles ?? []) {
    const uid = (p as { user_id?: string }).user_id
    const nome = ((p as { nome_completo?: string }).nome_completo ?? '').trim()
    const email = ((p as { email?: string }).email ?? '').trim()
    if (uid) map.set(uid, nome || email.split('@')[0] || 'Líder')
  }

  return map
}
