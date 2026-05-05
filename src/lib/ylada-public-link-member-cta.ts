import type { SupabaseClient } from '@supabase/supabase-js'
import { fetchWhatsappE164ForUserId } from '@/lib/ylada-public-link-whatsapp'
import { resolveProLideresMemberLinkAttribution } from '@/lib/pro-lideres-member-link-tokens-resolve'

/**
 * Resolve o WhatsApp (E.164 só dígitos) para visitante em /l/[slug]/[membro] ou ?pl_m=.
 */
export async function resolveProLideresPublicMemberCtaForLinkId(
  admin: SupabaseClient,
  yladaLinkId: string,
  memberSegment: string
): Promise<{ whatsapp: string | null; token: string | null } | null> {
  const seg = memberSegment.trim()
  if (!seg) return null

  const row = await resolveProLideresMemberLinkAttribution(admin, yladaLinkId, seg)
  if (!row) return null

  const whatsapp = await fetchWhatsappE164ForUserId(admin, row.member_user_id)
  return { whatsapp, token: row.token }
}

/** Para rotas que só têm o slug (ex.: API pública). */
export async function resolveProLideresPublicMemberCtaForSlug(
  admin: SupabaseClient,
  linkSlug: string,
  memberSegment: string
): Promise<{ whatsapp: string | null; token: string | null } | null> {
  const { data: link, error } = await admin
    .from('ylada_links')
    .select('id')
    .eq('slug', linkSlug.trim())
    .eq('status', 'active')
    .maybeSingle()

  if (error || !link?.id) return null
  return resolveProLideresPublicMemberCtaForLinkId(admin, link.id as string, memberSegment)
}
