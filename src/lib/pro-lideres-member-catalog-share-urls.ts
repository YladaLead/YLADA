import type { SupabaseClient } from '@supabase/supabase-js'

import type { ProLideresCatalogItem } from '@/lib/pro-lideres-catalog-build'

/**
 * Para membros no catálogo: troca `/l/{slug}` pelo link pessoal `/l/{slug}/{token|share_path_slug}`
 * quando existe linha em `pro_lideres_member_link_tokens`.
 */
export async function personalizeProLideresCatalogUrlsForMember(
  supabase: SupabaseClient,
  catalog: ProLideresCatalogItem[],
  opts: { leaderTenantId: string; memberUserId: string; baseUrl: string }
): Promise<ProLideresCatalogItem[]> {
  const yladaItems = catalog.filter((i) => i.source === 'ylada' && i.yladaLinkId)
  if (!yladaItems.length) return catalog

  const linkIds = [...new Set(yladaItems.map((i) => i.yladaLinkId as string))]
  const { data: tokRows } = await supabase
    .from('pro_lideres_member_link_tokens')
    .select('ylada_link_id, token, share_path_slug')
    .eq('leader_tenant_id', opts.leaderTenantId)
    .eq('member_user_id', opts.memberUserId)
    .in('ylada_link_id', linkIds)

  const pathSegByLinkId = new Map<string, string>()
  for (const r of tokRows ?? []) {
    const lid = r.ylada_link_id as string
    const customSlug = (r.share_path_slug as string | null)?.trim() || ''
    const tok = (r.token as string | null)?.trim() || ''
    const seg = customSlug || tok
    if (seg) pathSegByLinkId.set(lid, seg)
  }

  const slugFromHref = (href: string): string | null => {
    const m = href.match(/^\/l\/([^/]+)$/)
    return m ? decodeURIComponent(m[1]) : null
  }

  const prefix = opts.baseUrl.replace(/\/$/, '')
  return catalog.map((item) => {
    if (item.source !== 'ylada' || !item.yladaLinkId) return item
    const pathSeg = pathSegByLinkId.get(item.yladaLinkId)
    const linkSlug = slugFromHref(item.href)
    if (!pathSeg || !linkSlug) return item
    const path = `/l/${encodeURIComponent(linkSlug)}/${encodeURIComponent(pathSeg)}`
    return {
      ...item,
      href: path,
      publicUrl: prefix ? `${prefix}${path}` : path,
    }
  })
}
