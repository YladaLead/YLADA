import { supabaseAdmin } from '@/lib/supabase'
import { extractProLideresPresetFluxoIdFromSlug } from '@/lib/pro-lideres/pro-lideres-catalog-display-order'
import { isProLideresSalesExcludedFluxoId } from '@/lib/pro-lideres/pro-lideres-sales-excluded-fluxo-ids'

function presetFluxoIdFromConfig(configJson: unknown): string | null {
  if (!configJson || typeof configJson !== 'object' || Array.isArray(configJson)) return null
  const meta = (configJson as Record<string, unknown>).meta
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return null
  const fid = (meta as Record<string, unknown>).pro_lideres_fluxo_id
  return typeof fid === 'string' && fid.trim() ? fid.trim() : null
}

function shouldArchiveExcludedPresetLink(slug: string, configJson: unknown): boolean {
  const fromMeta = presetFluxoIdFromConfig(configJson)
  if (fromMeta && isProLideresSalesExcludedFluxoId(fromMeta)) return true
  const fromSlug = extractProLideresPresetFluxoIdFromSlug(slug)
  if (fromSlug && isProLideresSalesExcludedFluxoId(fromSlug)) return true
  return false
}

/**
 * Arquiva presets de vendas descontinuados (ex.: `metabolismo-lento`).
 * Catálogo Pro Líderes só lista `status = active`; `/l/[slug]` também exige ativo.
 */
export async function archiveProLideresExcludedPresetLinks(ownerUserId: string): Promise<void> {
  if (!supabaseAdmin || !ownerUserId) return

  const { data: rows, error } = await supabaseAdmin
    .from('ylada_links')
    .select('id, slug, config_json')
    .eq('user_id', ownerUserId)
    .eq('status', 'active')

  if (error) {
    console.warn('[archiveProLideresExcludedPresetLinks] list:', error.message)
    return
  }

  const toArchive = (rows ?? []).filter((r) =>
    shouldArchiveExcludedPresetLink(String(r.slug ?? ''), r.config_json)
  )

  if (toArchive.length === 0) return

  const ids = toArchive.map((r) => r.id as string)
  const { error: updateError } = await supabaseAdmin
    .from('ylada_links')
    .update({ status: 'archived' })
    .in('id', ids)

  if (updateError) {
    console.warn('[archiveProLideresExcludedPresetLinks] update:', updateError.message)
  }
}
