import type { SupabaseClient } from '@supabase/supabase-js'

export type LeaderTenantTabulatorRow = {
  id: string
  leader_tenant_id: string
  label: string
  sort_order: number
  created_at: string
}

const MAX_LABEL_LEN = 120

export function normalizeTabulatorLabelInput(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').slice(0, MAX_LABEL_LEN)
}

/** Lista ordenada para o convite e para o painel do líder. */
export async function fetchTabulatorsForTenant(
  admin: SupabaseClient,
  leaderTenantId: string
): Promise<LeaderTenantTabulatorRow[]> {
  const { data, error } = await admin
    .from('leader_tenant_tabulators')
    .select('id, leader_tenant_id, label, sort_order, created_at')
    .eq('leader_tenant_id', leaderTenantId)
    .order('sort_order', { ascending: true })
    .order('label', { ascending: true })

  if (error) {
    console.error('[fetchTabulatorsForTenant]', error)
    return []
  }
  return (data ?? []) as LeaderTenantTabulatorRow[]
}

/** Rótulos na ordem do painel (para resposta pública do validate). */
export async function fetchTabulatorLabelsForTenant(
  admin: SupabaseClient,
  leaderTenantId: string
): Promise<string[]> {
  const rows = await fetchTabulatorsForTenant(admin, leaderTenantId)
  return rows.map((r) => r.label.trim()).filter(Boolean)
}

/**
 * Confirma que o texto enviado coincide com um tabulador do tenant (comparação sem distinguir maiúsculas).
 * Devolve o label gravado na tabela (canónico) ou null.
 */
export async function resolveCanonicalTabulatorLabelForTenant(
  admin: SupabaseClient,
  leaderTenantId: string,
  submitted: string
): Promise<string | null> {
  const needle = submitted.trim().toLowerCase()
  if (!needle) return null
  const rows = await fetchTabulatorsForTenant(admin, leaderTenantId)
  const hit = rows.find((r) => r.label.trim().toLowerCase() === needle)
  return hit ? hit.label.trim() : null
}
