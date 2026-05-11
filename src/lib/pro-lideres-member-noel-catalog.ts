import type { SupabaseClient } from '@supabase/supabase-js'
import type { LeaderTenantRow } from '@/types/leader-tenant'
import { buildProLideresCatalog } from '@/lib/pro-lideres-catalog-build'
import { personalizeProLideresCatalogUrlsForMember } from '@/lib/pro-lideres-member-catalog-share-urls'

const MAX_CHARS = 12000

/**
 * Lista compacta (título + URL) dos itens do catálogo visíveis ao membro — contexto do Noel campo.
 */
export async function buildProLideresMemberNoelCatalogExcerpt(
  supabase: SupabaseClient,
  params: {
    tenant: LeaderTenantRow
    memberUserId: string
    baseUrl: string
  }
): Promise<string | null> {
  const { tenant, memberUserId, baseUrl } = params

  const { data: rows, error } = await supabase
    .from('leader_tenant_flow_entries')
    .select('id, category, label, href, sort_order, notes, visible_to_team')
    .eq('leader_tenant_id', tenant.id)
    .order('sort_order', { ascending: true })

  if (error) {
    console.warn('[pro-lideres-member-noel-catalog] flow entries', error.message)
    return null
  }

  const customRows = (rows ?? []).map((r) => ({
    id: r.id as string,
    label: r.label as string,
    href: r.href as string,
    sort_order: typeof r.sort_order === 'number' ? r.sort_order : 0,
    category: r.category as string,
    notes: typeof r.notes === 'string' ? r.notes : '',
    visible_to_team: typeof r.visible_to_team === 'boolean' ? r.visible_to_team : true,
  }))

  const { data: visRows, error: visErr } = await supabase
    .from('leader_tenant_catalog_ylada_visibility')
    .select('ylada_link_id, visible_to_team')
    .eq('leader_tenant_id', tenant.id)

  const yladaVisibleToTeamByLinkId: Record<string, boolean> = {}
  if (!visErr && visRows) {
    for (const v of visRows) {
      const lid = v.ylada_link_id as string | undefined
      if (lid) yladaVisibleToTeamByLinkId[lid] = Boolean(v.visible_to_team)
    }
  } else if (
    visErr &&
    !/leader_tenant_catalog_ylada_visibility|Could not find|does not exist|schema cache/i.test(visErr.message ?? '')
  ) {
    console.warn('[pro-lideres-member-noel-catalog] visibility', visErr.message)
    return null
  }

  let catalog = await buildProLideresCatalog(tenant.owner_user_id, baseUrl, customRows, {
    yladaVisibleToTeamByLinkId,
  })
  catalog = catalog.filter((item) => item.visibleToTeam)
  catalog = await personalizeProLideresCatalogUrlsForMember(supabase, catalog, {
    leaderTenantId: tenant.id,
    memberUserId,
    baseUrl,
  })

  const lines: string[] = []
  const origin = baseUrl.replace(/\/$/, '')
  for (const item of catalog) {
    const label = (item.label || '').trim()
    if (!label) continue
    const pub = (item.publicUrl || '').trim()
    const href = (item.href || '').trim()
    const url =
      pub && pub.startsWith('http')
        ? pub
        : href.startsWith('http')
          ? href
          : `${origin}${href.startsWith('/') ? '' : '/'}${href}`
    lines.push(`- **${label}** — ${url}`)
    if (lines.join('\n').length > MAX_CHARS) break
  }
  if (!lines.length) return null
  return lines.join('\n').slice(0, MAX_CHARS)
}
