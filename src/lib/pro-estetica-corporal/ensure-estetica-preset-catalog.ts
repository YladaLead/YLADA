import { supabaseAdmin } from '@/lib/supabase'
import { ESTETICA_PRESET_FLOW_ENTRIES } from '@/config/pro-estetica-corporal-preset-catalog'

/**
 * Remove presets antigos que apontavam para Wellness genérico ou /pt/links (matriz → onboarding).
 * Insere o atalho correcto para `/pro-estetica-corporal/painel/biblioteca-links` se ainda não existir.
 */
export async function ensureEsteticaCorporalPresetFlowEntries(leaderTenantId: string): Promise<void> {
  if (!supabaseAdmin || !leaderTenantId) return

  const delWell = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .delete()
    .eq('leader_tenant_id', leaderTenantId)
    .like('href', '/pt/wellness/templates%')
  if (delWell.error) console.warn('[ensureEsteticaCorporalPresetFlowEntries] cleanup wellness:', delWell.error.message)

  const delLinks = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .delete()
    .eq('leader_tenant_id', leaderTenantId)
    .eq('href', '/pt/links')
  if (delLinks.error) console.warn('[ensureEsteticaCorporalPresetFlowEntries] cleanup /pt/links:', delLinks.error.message)

  const { data: existing, error: listErr } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .select('href')
    .eq('leader_tenant_id', leaderTenantId)

  if (listErr) {
    console.warn('[ensureEsteticaCorporalPresetFlowEntries] list:', listErr.message)
    return
  }

  const hrefSet = new Set((existing ?? []).map((r) => String(r.href ?? '').trim()))

  for (const row of ESTETICA_PRESET_FLOW_ENTRIES) {
    const href = row.href.trim()
    if (hrefSet.has(href)) continue

    const { error: insErr } = await supabaseAdmin.from('leader_tenant_flow_entries').insert({
      leader_tenant_id: leaderTenantId,
      category: row.category,
      label: row.label,
      href,
      sort_order: row.sort_order,
    })

    if (insErr) {
      console.warn('[ensureEsteticaCorporalPresetFlowEntries] insert', href, insErr.message)
      continue
    }
    hrefSet.add(href)
  }
}
