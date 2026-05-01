import type { SupabaseClient } from '@supabase/supabase-js'

export type AdminProProductBadge = 'pro_terapia_capilar' | 'pro_estetica_corporal' | 'pro_lideres'

const VERTICAL_CAPILAR = 'estetica-capilar'
const VERTICAL_CORPORAL = 'estetica-corporal'
const VERTICAL_H_LIDER = 'h-lider'

const BADGE_PRIORITY: AdminProProductBadge[] = [
  'pro_terapia_capilar',
  'pro_estetica_corporal',
  'pro_lideres',
]

function badgeFromVertical(raw: string | null | undefined): AdminProProductBadge | null {
  const s = (raw ?? '').trim()
  if (s === VERTICAL_CAPILAR) return 'pro_terapia_capilar'
  if (s === VERTICAL_CORPORAL) return 'pro_estetica_corporal'
  if (s === VERTICAL_H_LIDER) return 'pro_lideres'
  return null
}

function mergeBadge(
  prev: AdminProProductBadge | undefined,
  next: AdminProProductBadge
): AdminProProductBadge {
  if (!prev) return next
  const ia = BADGE_PRIORITY.indexOf(prev)
  const ib = BADGE_PRIORITY.indexOf(next)
  if (ib < 0) return prev
  if (ia < 0) return next
  return ia <= ib ? prev : next
}

/**
 * Para Admin > Usuários: mapeia `user_id` → produto Pro (vertical em `leader_tenants` ou ligação corporal).
 * Não altera `user_profiles.perfil`; só enriquece a coluna Área na listagem.
 */
export async function fetchAdminProProductBadgesByUserId(
  admin: SupabaseClient,
  userIds: string[]
): Promise<Map<string, AdminProProductBadge>> {
  const out = new Map<string, AdminProProductBadge>()
  if (userIds.length === 0) return out

  const add = (uid: string, vertical: string | null | undefined) => {
    const badge = badgeFromVertical(vertical)
    if (!badge) return
    out.set(uid, mergeBadge(out.get(uid), badge))
  }

  const { data: owned, error: ownedErr } = await admin
    .from('leader_tenants')
    .select('owner_user_id, vertical_code')
    .in('owner_user_id', userIds)

  if (!ownedErr && owned) {
    for (const row of owned as { owner_user_id?: string; vertical_code?: string | null }[]) {
      if (row.owner_user_id) add(row.owner_user_id, row.vertical_code)
    }
  }

  const { data: members, error: memErr } = await admin
    .from('leader_tenant_members')
    .select('user_id, leader_tenant_id')
    .in('user_id', userIds)

  const memberRows = (!memErr && members ? members : []) as {
    user_id?: string
    leader_tenant_id?: string
  }[]
  const tenantIdsFromMembers = [...new Set(memberRows.map((m) => m.leader_tenant_id).filter(Boolean) as string[])]

  if (tenantIdsFromMembers.length > 0) {
    const { data: tenRows } = await admin
      .from('leader_tenants')
      .select('id, vertical_code')
      .in('id', tenantIdsFromMembers)
    const vertByTenant = new Map<string, string>()
    for (const t of (tenRows || []) as { id?: string; vertical_code?: string | null }[]) {
      if (t.id && t.vertical_code) vertByTenant.set(t.id, t.vertical_code)
    }
    for (const m of memberRows) {
      if (!m.user_id || !m.leader_tenant_id) continue
      const vc = vertByTenant.get(m.leader_tenant_id)
      if (vc) add(m.user_id, vc)
    }
  }

  const { data: pecRows, error: pecErr } = await admin
    .from('pro_estetica_corporal_settings')
    .select('user_id, leader_tenant_id')
    .in('user_id', userIds)

  if (!pecErr && pecRows && pecRows.length > 0) {
    const linkIds = [
      ...new Set((pecRows as { leader_tenant_id?: string }[]).map((p) => p.leader_tenant_id).filter(Boolean) as string[]),
    ]
    if (linkIds.length > 0) {
      const { data: ten2 } = await admin.from('leader_tenants').select('id, vertical_code').in('id', linkIds)
      const vmap = new Map<string, string>()
      for (const t of (ten2 || []) as { id?: string; vertical_code?: string | null }[]) {
        if (t.id && t.vertical_code) vmap.set(t.id, t.vertical_code)
      }
      for (const row of pecRows as { user_id?: string; leader_tenant_id?: string }[]) {
        if (!row.user_id || !row.leader_tenant_id) continue
        const vc = vmap.get(row.leader_tenant_id)
        if (vc) add(row.user_id, vc)
      }
    }
  }

  return out
}
