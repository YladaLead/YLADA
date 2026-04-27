import { supabaseAdmin } from '@/lib/supabase'
import { ESTETICA_CAPILAR_PRESET_FLOW_ENTRIES } from '@/config/pro-estetica-capilar-preset-catalog'

/**
 * Remove presets antigos que apontavam para Wellness genérico ou /pt/links.
 * Insere o atalho para `/pro-estetica-capilar/painel/biblioteca-links` se ainda não existir.
 */
export async function ensureEsteticaCapilarPresetFlowEntries(leaderTenantId: string): Promise<void> {
  if (!supabaseAdmin || !leaderTenantId) return

  const delWell = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .delete()
    .eq('leader_tenant_id', leaderTenantId)
    .like('href', '/pt/wellness/templates%')
  if (delWell.error) console.warn('[ensureEsteticaCapilarPresetFlowEntries] cleanup wellness:', delWell.error.message)

  const delLinks = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .delete()
    .eq('leader_tenant_id', leaderTenantId)
    .eq('href', '/pt/links')
  if (delLinks.error) console.warn('[ensureEsteticaCapilarPresetFlowEntries] cleanup /pt/links:', delLinks.error.message)

  const { data: existing, error: listErr } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .select('href')
    .eq('leader_tenant_id', leaderTenantId)

  if (listErr) {
    console.warn('[ensureEsteticaCapilarPresetFlowEntries] list:', listErr.message)
    return
  }

  const hrefSet = new Set((existing ?? []).map((r) => String(r.href ?? '').trim()))

  for (const row of ESTETICA_CAPILAR_PRESET_FLOW_ENTRIES) {
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
      console.warn('[ensureEsteticaCapilarPresetFlowEntries] insert', href, insErr.message)
      continue
    }
    hrefSet.add(href)
  }
}
