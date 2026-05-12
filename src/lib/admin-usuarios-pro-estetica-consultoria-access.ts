import type { SupabaseClient } from '@supabase/supabase-js'

type ConsultClientRow = {
  id: string
  leader_tenant_id: string | null
  contact_email: string | null
  access_valid_until: string | null
  segment: string | null
}

function toYmd(raw: string | null | undefined): string | null {
  if (!raw || !String(raw).trim()) return null
  const s = String(raw).trim().slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null
  return s
}

function pickBetter(
  a: { until: string; segment: string | null },
  b: { until: string; segment: string | null }
): { until: string; segment: string | null } {
  if (b.until > a.until) return b
  if (b.until < a.until) return a
  if (b.segment && !a.segment) return b
  return a
}

/**
 * Por utilizador: maior `access_valid_until` (YYYY-MM-DD) em `ylada_estetica_consult_clients`,
 * cruzando `leader_tenants` (vertical capilar/corporal) ou `contact_email` da ficha.
 */
export async function fetchProEsteticaConsultoriaAccessUntilByUserId(
  supabase: SupabaseClient,
  args: { userIds: string[]; userIdToEmail: Map<string, string> }
): Promise<Map<string, { until: string; segment: string | null }>> {
  const out = new Map<string, { until: string; segment: string | null }>()
  const { userIds, userIdToEmail } = args
  if (userIds.length === 0) return out

  const emailLowerToUserIds = new Map<string, string[]>()
  for (const [uid, em] of userIdToEmail) {
    const k = em.trim().toLowerCase()
    if (!k) continue
    if (!emailLowerToUserIds.has(k)) emailLowerToUserIds.set(k, [])
    emailLowerToUserIds.get(k)!.push(uid)
  }

  const { data: tenants, error: terr } = await supabase
    .from('leader_tenants')
    .select('id, owner_user_id')
    .in('owner_user_id', userIds)
    .in('vertical_code', ['estetica-capilar', 'estetica-corporal'])

  if (terr) {
    console.warn('[admin-usuarios-pro-estetica-consultoria-access] leader_tenants:', terr.message)
  }

  const tenantIdToOwner = new Map<string, string>()
  const tenantIds: string[] = []
  for (const row of tenants || []) {
    if (row?.id && row?.owner_user_id) {
      tenantIdToOwner.set(row.id, row.owner_user_id)
      tenantIds.push(row.id)
    }
  }

  const clientById = new Map<string, ConsultClientRow>()
  const ingest = (list: ConsultClientRow[] | null | undefined) => {
    for (const r of list || []) {
      if (r?.id) clientById.set(r.id, r)
    }
  }

  if (tenantIds.length > 0) {
    const { data, error } = await supabase
      .from('ylada_estetica_consult_clients')
      .select('id, leader_tenant_id, contact_email, access_valid_until, segment')
      .in('leader_tenant_id', tenantIds)
    if (error) {
      console.warn('[admin-usuarios-pro-estetica-consultoria-access] clients by tenant:', error.message)
    } else {
      ingest(data as ConsultClientRow[])
    }
  }

  const emailsDistinct = [...new Set([...userIdToEmail.values()].map((e) => e.trim()).filter(Boolean))]
  const chunk = 120
  for (let i = 0; i < emailsDistinct.length; i += chunk) {
    const slice = emailsDistinct.slice(i, i + chunk)
    const { data, error } = await supabase
      .from('ylada_estetica_consult_clients')
      .select('id, leader_tenant_id, contact_email, access_valid_until, segment')
      .in('contact_email', slice)
    if (error) {
      console.warn('[admin-usuarios-pro-estetica-consultoria-access] clients by email:', error.message)
      break
    }
    ingest(data as ConsultClientRow[])
  }

  for (const r of clientById.values()) {
    const until = toYmd(r.access_valid_until)
    if (!until) continue

    const seg = r.segment ? String(r.segment).trim().toLowerCase() : null
    const next = { until, segment: seg }

    const candidateUserIds = new Set<string>()
    if (r.leader_tenant_id) {
      const owner = tenantIdToOwner.get(r.leader_tenant_id)
      if (owner) candidateUserIds.add(owner)
    }
    if (r.contact_email) {
      const ids = emailLowerToUserIds.get(r.contact_email.trim().toLowerCase())
      if (ids) ids.forEach((id) => candidateUserIds.add(id))
    }

    for (const uid of candidateUserIds) {
      const cur = out.get(uid)
      if (!cur) out.set(uid, next)
      else out.set(uid, pickBetter(cur, next))
    }
  }

  return out
}
