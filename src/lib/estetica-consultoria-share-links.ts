import type { SupabaseClient } from '@supabase/supabase-js'

/** Primeiro link principal; se a coluna `is_primary` ainda não existir, usa o mais antigo. */
export function pickPrimaryEsteticaShareLink<
  T extends { id: string; is_primary?: boolean | null; created_at: string },
>(links: T[]): T | null {
  if (!links.length) return null
  const flagged = links.find((l) => l.is_primary === true)
  if (flagged) return flagged
  return [...links].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]
}

export async function nextEsteticaShareLinkIsPrimary(
  sb: SupabaseClient,
  materialId: string,
  clientId: string | null
): Promise<boolean> {
  if (!clientId) return false
  const { count, error } = await sb
    .from('ylada_estetica_consultancy_share_links')
    .select('id', { count: 'exact', head: true })
    .eq('material_id', materialId)
    .eq('estetica_consult_client_id', clientId)
    .eq('is_primary', true)
  if (error) return true
  return (count ?? 0) === 0
}

export async function insertEsteticaConsultancyShareLinkRow(
  sb: SupabaseClient,
  base: Record<string, unknown>
): Promise<{ data: unknown; error: { message?: string; code?: string } | null }> {
  const materialId = String(base.material_id)
  const clientId = (base.estetica_consult_client_id as string | null) ?? null
  let isPrimary = await nextEsteticaShareLinkIsPrimary(sb, materialId, clientId)
  let payload: Record<string, unknown> = { ...base, is_primary: isPrimary }
  let { data, error } = await sb.from('ylada_estetica_consultancy_share_links').insert(payload).select('*').single()
  const code = (error as { code?: string } | null)?.code
  if (code === '23505' && isPrimary && clientId) {
    isPrimary = false
    payload = { ...base, is_primary: false }
    ;({ data, error } = await sb.from('ylada_estetica_consultancy_share_links').insert(payload).select('*').single())
  }
  return { data, error }
}
