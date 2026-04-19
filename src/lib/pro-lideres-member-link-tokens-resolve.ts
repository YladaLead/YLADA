import type { SupabaseClient } from '@supabase/supabase-js'

export type ProLideresMemberTokenRow = {
  member_user_id: string
  token: string
  leader_tenant_id: string
  ylada_link_id: string
}

/**
 * Resolve linha de atribuição por token opaco ou por share_path_slug (minúsculas na BD).
 */
export async function resolveProLideresMemberLinkAttribution(
  supabase: SupabaseClient,
  yladaLinkId: string,
  segment: string
): Promise<ProLideresMemberTokenRow | null> {
  const seg = segment.trim()
  if (!seg) return null

  const { data: byToken } = await supabase
    .from('pro_lideres_member_link_tokens')
    .select('member_user_id, token, leader_tenant_id, ylada_link_id')
    .eq('ylada_link_id', yladaLinkId)
    .eq('token', seg)
    .maybeSingle()

  if (
    byToken?.member_user_id &&
    byToken.token &&
    byToken.leader_tenant_id &&
    byToken.ylada_link_id &&
    String(byToken.ylada_link_id) === String(yladaLinkId)
  ) {
    return {
      member_user_id: byToken.member_user_id as string,
      token: byToken.token as string,
      leader_tenant_id: byToken.leader_tenant_id as string,
      ylada_link_id: byToken.ylada_link_id as string,
    }
  }

  const slugLower = seg.toLowerCase()
  const { data: bySlug } = await supabase
    .from('pro_lideres_member_link_tokens')
    .select('member_user_id, token, leader_tenant_id, ylada_link_id')
    .eq('ylada_link_id', yladaLinkId)
    .eq('share_path_slug', slugLower)
    .maybeSingle()

  if (
    bySlug?.member_user_id &&
    bySlug.token &&
    bySlug.leader_tenant_id &&
    bySlug.ylada_link_id &&
    String(bySlug.ylada_link_id) === String(yladaLinkId)
  ) {
    return {
      member_user_id: bySlug.member_user_id as string,
      token: bySlug.token as string,
      leader_tenant_id: bySlug.leader_tenant_id as string,
      ylada_link_id: bySlug.ylada_link_id as string,
    }
  }

  return null
}

/** Valida e normaliza slug de URL (minúsculas); null = remover slug personalizado. */
export function parseProLideresMemberSharePathSlug(
  raw: unknown
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (raw === null || raw === undefined) {
    return { ok: true, value: null }
  }
  if (typeof raw !== 'string') {
    return { ok: false, error: 'share_path_slug inválido' }
  }
  const s = raw.trim().toLowerCase()
  if (!s) {
    return { ok: true, value: null }
  }
  if (s.length < 3 || s.length > 40) {
    return { ok: false, error: 'O slug deve ter entre 3 e 40 caracteres.' }
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) {
    return { ok: false, error: 'Use apenas letras minúsculas, números e hífens (sem espaços).' }
  }
  return { ok: true, value: s }
}
