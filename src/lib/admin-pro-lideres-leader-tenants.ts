import type { SupabaseClient } from '@supabase/supabase-js'

export type AdminProLideresLeaderTenantOption = {
  id: string
  displayName: string
  contactEmail: string | null
  ownerUserId: string
  /** Fim da assinatura `pro_lideres_team` do dono (ISO). */
  subscriptionExpiresAt: string | null
}

/**
 * Espaços Pro Líderes (h-lider) cujo dono tem assinatura equipe ativa — quem comprou Pro Líderes.
 * Não inclui tenants de demo/auto-provision sem pagamento nem lista de presidentes Wellness.
 */
export async function fetchPaidProLideresLeaderTenants(
  admin: SupabaseClient,
  verticalCode = 'h-lider'
): Promise<AdminProLideresLeaderTenantOption[]> {
  const now = new Date().toISOString()

  const { data: subs, error: subsErr } = await admin
    .from('subscriptions')
    .select('user_id, current_period_end')
    .eq('area', 'pro_lideres_team')
    .eq('status', 'active')
    .gt('current_period_end', now)

  if (subsErr) {
    console.error('[fetchPaidProLideresLeaderTenants] subscriptions', subsErr)
    return []
  }

  const expiryByOwner = new Map<string, string>()
  for (const row of subs ?? []) {
    const uid = (row as { user_id?: string }).user_id
    const end = (row as { current_period_end?: string }).current_period_end
    if (!uid) continue
    const prev = expiryByOwner.get(uid)
    if (!prev || (end && end > prev)) expiryByOwner.set(uid, end ?? prev)
  }

  const paidOwnerIds = [...expiryByOwner.keys()]
  if (paidOwnerIds.length === 0) return []

  const { data: tenants, error: tenantsErr } = await admin
    .from('leader_tenants')
    .select('id, display_name, team_name, contact_email, owner_user_id, vertical_code')
    .eq('vertical_code', verticalCode)
    .in('owner_user_id', paidOwnerIds)
    .order('display_name', { ascending: true })

  if (tenantsErr) {
    console.error('[fetchPaidProLideresLeaderTenants] leader_tenants', tenantsErr)
    return []
  }

  const ownerIds = (tenants ?? [])
    .map((t) => (t as { owner_user_id?: string }).owner_user_id)
    .filter(Boolean) as string[]

  const profileNameByUserId = new Map<string, string>()
  if (ownerIds.length > 0) {
    const { data: profiles } = await admin
      .from('user_profiles')
      .select('user_id, nome_completo, email')
      .in('user_id', ownerIds)
    for (const p of profiles ?? []) {
      const uid = (p as { user_id?: string }).user_id
      const nome = ((p as { nome_completo?: string }).nome_completo ?? '').trim()
      if (uid && nome) profileNameByUserId.set(uid, nome)
    }
  }

  return (tenants ?? []).map((t) => {
    const ownerId = t.owner_user_id as string
    const profileName = profileNameByUserId.get(ownerId)
    const displayName =
      (t.display_name as string | null)?.trim() ||
      (t.team_name as string | null)?.trim() ||
      profileName ||
      (t.contact_email as string | null)?.trim() ||
      'Sem nome'

    return {
      id: t.id as string,
      displayName,
      contactEmail: (t.contact_email as string | null)?.trim() || null,
      ownerUserId: ownerId,
      subscriptionExpiresAt: expiryByOwner.get(ownerId) ?? null,
    }
  })
}
