import type { SupabaseClient } from '@supabase/supabase-js'
import { parseProLideresMemberSharePathSlug } from '@/lib/pro-lideres-member-link-tokens-resolve'

/** WhatsApp mínimo para “entrega”: pelo menos 10 dígitos (ex.: DDI 55 + número BR). */
export function whatsappMeetsProLideresMandatory(raw: string | null | undefined): boolean {
  const w = typeof raw === 'string' ? raw.trim() : ''
  if (!w) return false
  const digits = w.replace(/\D/g, '')
  return digits.length >= 10
}

export type ProLideresMemberMandatoryGap = {
  needsAction: boolean
  missingShareSlug: boolean
  missingWhatsapp: boolean
}

/**
 * Membro da equipe (não líder): exige slug de divulgação + WhatsApp com dígitos suficientes.
 */
export async function getProLideresMemberMandatoryProfileGap(
  supabase: SupabaseClient,
  tenantId: string,
  userId: string
): Promise<ProLideresMemberMandatoryGap> {
  const { data: row, error: rowErr } = await supabase
    .from('leader_tenant_members')
    .select('pro_lideres_share_slug, role')
    .eq('leader_tenant_id', tenantId)
    .eq('user_id', userId)
    .maybeSingle()

  if (rowErr) {
    console.error('[getProLideresMemberMandatoryProfileGap]', rowErr.message)
    return { needsAction: true, missingShareSlug: true, missingWhatsapp: true }
  }

  if (!row || (row.role as string) === 'leader') {
    return { needsAction: false, missingShareSlug: false, missingWhatsapp: false }
  }

  const slugRaw = (row.pro_lideres_share_slug as string | null)?.trim() ?? ''
  const parsed = parseProLideresMemberSharePathSlug(slugRaw)
  const missingShareSlug = !parsed.ok || !parsed.value

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('whatsapp')
    .eq('user_id', userId)
    .maybeSingle()

  const wp = (profile as { whatsapp?: string | null } | null)?.whatsapp
  const missingWhatsapp = !whatsappMeetsProLideresMandatory(typeof wp === 'string' ? wp : '')

  return {
    needsAction: missingShareSlug || missingWhatsapp,
    missingShareSlug,
    missingWhatsapp,
  }
}

/** Verifica se outro membro do tenant já usa este slug (normalizado). */
export async function isProLideresShareSlugTakenInTenant(
  supabase: SupabaseClient,
  tenantId: string,
  normalizedSlug: string,
  excludeUserId: string | null
): Promise<boolean> {
  let q = supabase
    .from('leader_tenant_members')
    .select('user_id')
    .eq('leader_tenant_id', tenantId)
    .eq('pro_lideres_share_slug', normalizedSlug)
    .limit(1)
  if (excludeUserId) {
    q = q.neq('user_id', excludeUserId)
  }
  const { data } = await q.maybeSingle()
  return Boolean(data?.user_id)
}

/** Preenche share_path_slug nos tokens do membro quando ainda está vazio (alinhado ao slug da equipa). */
export async function syncProLideresMemberLinkTokensShareSlug(
  supabase: SupabaseClient,
  tenantId: string,
  userId: string,
  normalizedSlug: string
): Promise<void> {
  if (!normalizedSlug || /^[a-f0-9]{32}$/i.test(normalizedSlug)) return
  const { data: rows } = await supabase
    .from('pro_lideres_member_link_tokens')
    .select('id, share_path_slug')
    .eq('leader_tenant_id', tenantId)
    .eq('member_user_id', userId)

  for (const r of rows ?? []) {
    if ((r as { share_path_slug?: string | null }).share_path_slug) continue
    const { error } = await supabase
      .from('pro_lideres_member_link_tokens')
      .update({ share_path_slug: normalizedSlug })
      .eq('id', r.id as string)
    if (error?.code === '23505') {
      /* slug já usado noutro membro neste link — mantém só token */
    }
  }
}
