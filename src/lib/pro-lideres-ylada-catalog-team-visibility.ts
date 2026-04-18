import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Catálogo Pro Líderes: ausência de linha em leader_tenant_catalog_ylada_visibility = equipe vê.
 * Linha com visible_to_team = false = só o líder vê no catálogo da equipe.
 */
export async function isProLideresYladaLinkVisibleToTeamInCatalog(
  supabase: SupabaseClient,
  leaderTenantId: string,
  yladaLinkId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('leader_tenant_catalog_ylada_visibility')
    .select('visible_to_team')
    .eq('leader_tenant_id', leaderTenantId)
    .eq('ylada_link_id', yladaLinkId)
    .maybeSingle()

  if (error || !data) return true
  return Boolean(data.visible_to_team)
}

export async function hideProLideresYladaLinkFromTeamCatalog(
  supabase: SupabaseClient,
  leaderTenantId: string,
  yladaLinkId: string
): Promise<void> {
  const { error } = await supabase.from('leader_tenant_catalog_ylada_visibility').upsert(
    {
      leader_tenant_id: leaderTenantId,
      ylada_link_id: yladaLinkId,
      visible_to_team: false,
    },
    { onConflict: 'leader_tenant_id,ylada_link_id' }
  )
  if (error) throw error
}

export async function showProLideresYladaLinkToTeamCatalog(
  supabase: SupabaseClient,
  leaderTenantId: string,
  yladaLinkId: string
): Promise<void> {
  const { error } = await supabase
    .from('leader_tenant_catalog_ylada_visibility')
    .delete()
    .eq('leader_tenant_id', leaderTenantId)
    .eq('ylada_link_id', yladaLinkId)

  if (error) throw error
}
