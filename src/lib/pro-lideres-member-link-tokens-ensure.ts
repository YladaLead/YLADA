import { randomBytes } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'

function genToken(): string {
  return randomBytes(16).toString('hex')
}

/**
 * Garante uma linha em `pro_lideres_member_link_tokens` para cada par (membro, link YLADA).
 * Usado ao montar o catálogo do membro para que URLs tragam sempre segmento/token de rastreio.
 */
export async function ensureProLideresMemberLinkTokensForMemberOnLinks(
  admin: SupabaseClient,
  opts: { leaderTenantId: string; memberUserId: string; yladaLinkIds: string[] }
): Promise<void> {
  const ids = [...new Set(opts.yladaLinkIds.filter(Boolean))]
  if (!ids.length) return

  const { data: existing, error: selErr } = await admin
    .from('pro_lideres_member_link_tokens')
    .select('ylada_link_id')
    .eq('leader_tenant_id', opts.leaderTenantId)
    .eq('member_user_id', opts.memberUserId)
    .in('ylada_link_id', ids)

  if (selErr) {
    console.warn('[ensure member link tokens] select', selErr.message)
    return
  }

  const have = new Set((existing ?? []).map((r) => r.ylada_link_id as string))
  for (const linkId of ids) {
    if (have.has(linkId)) continue
    let inserted = false
    for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
      const token = genToken()
      const { error: insErr } = await admin.from('pro_lideres_member_link_tokens').insert({
        leader_tenant_id: opts.leaderTenantId,
        member_user_id: opts.memberUserId,
        ylada_link_id: linkId,
        token,
      })
      if (!insErr) inserted = true
    }
  }
}
