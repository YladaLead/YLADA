/**
 * Reset Metabólico — landing pública por membro (Pro Líderes).
 * Mesma arquitetura da HOM: vídeo do líder + WhatsApp do membro.
 */

import { supabaseAdmin } from '@/lib/supabase'
import {
  PRO_LIDERES_RESET_DEFAULT_DESCRIPTION,
  PRO_LIDERES_RESET_DEFAULT_HEADLINE,
  PRO_LIDERES_RESET_DEFAULT_SUBHEADLINE,
} from '@/lib/pro-lideres-reset-content'
import {
  PRO_LIDERES_HOM_LEADER_SLUG,
  resolveProLideresHomLinkSubject,
} from '@/lib/pro-lideres-hom'

export type ProLideresResetConfig = {
  id: string
  tenantId: string
  videoUrl: string | null
  headline: string
  subheadline: string
  description: string
}

const DEFAULT_HEADLINE = PRO_LIDERES_RESET_DEFAULT_HEADLINE
const DEFAULT_SUBHEADLINE = PRO_LIDERES_RESET_DEFAULT_SUBHEADLINE
const DEFAULT_DESCRIPTION = PRO_LIDERES_RESET_DEFAULT_DESCRIPTION

export { PRO_LIDERES_HOM_LEADER_SLUG as PRO_LIDERES_RESET_LEADER_SLUG }
export { resolveProLideresHomLinkSubject as resolveProLideresResetLinkSubject }

export async function fetchResetConfig(tenantId: string): Promise<ProLideresResetConfig | null> {
  if (!supabaseAdmin) return null
  const { data, error } = await supabaseAdmin
    .from('prolider_reset_config')
    .select('id, tenant_id, video_url, headline, subheadline, description')
    .eq('tenant_id', tenantId)
    .maybeSingle()
  if (error || !data) return null
  return {
    id: data.id as string,
    tenantId: data.tenant_id as string,
    videoUrl: (data.video_url as string | null) ?? null,
    headline: (data.headline as string) || DEFAULT_HEADLINE,
    subheadline: (data.subheadline as string) || DEFAULT_SUBHEADLINE,
    description: (data.description as string) || DEFAULT_DESCRIPTION,
  }
}

export async function upsertResetConfig(
  tenantId: string,
  patch: {
    videoUrl?: string | null
    headline?: string
    subheadline?: string
    description?: string
  }
): Promise<{ ok: boolean; error?: string }> {
  if (!supabaseAdmin) return { ok: false, error: 'Serviço indisponível' }
  const payload: Record<string, unknown> = {
    tenant_id: tenantId,
    updated_at: new Date().toISOString(),
  }
  if (patch.videoUrl !== undefined) payload.video_url = patch.videoUrl || null
  if (patch.headline !== undefined) payload.headline = patch.headline || DEFAULT_HEADLINE
  if (patch.subheadline !== undefined) payload.subheadline = patch.subheadline || DEFAULT_SUBHEADLINE
  if (patch.description !== undefined) payload.description = patch.description || DEFAULT_DESCRIPTION

  const { error } = await supabaseAdmin
    .from('prolider_reset_config')
    .upsert(payload, { onConflict: 'tenant_id' })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export type ResetPublicData = {
  headline: string
  subheadline: string
  description: string
  videoUrl: string | null
  memberName: string | null
  memberWhatsapp: string | null
  leaderDisplayName: string | null
}

export async function fetchResetPublicData(
  tenantSlug: string,
  memberSlug: string
): Promise<ResetPublicData | null> {
  if (!supabaseAdmin) return null

  const { data: tenant, error: tErr } = await supabaseAdmin
    .from('leader_tenants')
    .select('id, display_name, owner_user_id, whatsapp')
    .eq('slug', tenantSlug)
    .maybeSingle()
  if (tErr || !tenant) return null
  const tenantId = tenant.id as string

  const cfg = await fetchResetConfig(tenantId)
  const base = {
    headline: cfg?.headline ?? DEFAULT_HEADLINE,
    subheadline: cfg?.subheadline ?? DEFAULT_SUBHEADLINE,
    description: cfg?.description ?? DEFAULT_DESCRIPTION,
    videoUrl: cfg?.videoUrl ?? null,
    leaderDisplayName: (tenant.display_name as string | null) ?? null,
  }

  if (memberSlug === PRO_LIDERES_HOM_LEADER_SLUG) {
    const ownerUserId = tenant.owner_user_id as string
    const { data: ownerProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('nome_completo, whatsapp')
      .eq('user_id', ownerUserId)
      .maybeSingle()
    const whatsapp =
      (ownerProfile?.whatsapp as string | null)?.trim() ||
      (tenant.whatsapp as string | null)?.trim() ||
      null
    return {
      ...base,
      memberName:
        (ownerProfile?.nome_completo as string | null) ??
        (tenant.display_name as string | null) ??
        null,
      memberWhatsapp: whatsapp,
    }
  }

  const { data: member, error: mErr } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('user_id, team_access_state')
    .eq('leader_tenant_id', tenantId)
    .eq('pro_lideres_share_slug', memberSlug)
    .maybeSingle()
  if (mErr || !member) return null
  if (member.team_access_state !== 'active') return null

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('nome_completo, whatsapp')
    .eq('user_id', member.user_id as string)
    .maybeSingle()

  return {
    ...base,
    memberName: (profile?.nome_completo as string | null) ?? null,
    memberWhatsapp: (profile?.whatsapp as string | null) ?? null,
  }
}

export type ResetMemberLink = {
  userId: string
  displayName: string | null
  shareSlug: string | null
  resetUrl: string | null
  hasWhatsapp: boolean
}

export async function fetchResetMemberLinks(
  tenantId: string,
  tenantSlug: string,
  baseUrl: string
): Promise<ResetMemberLink[]> {
  if (!supabaseAdmin) return []

  const { data: members, error } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('user_id, team_access_state, pro_lideres_share_slug')
    .eq('leader_tenant_id', tenantId)
    .eq('role', 'member')
    .eq('team_access_state', 'active')
    .order('created_at', { ascending: true })

  if (error || !members?.length) return []

  const ids = members.map((m) => m.user_id as string)
  const { data: profiles } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, nome_completo, whatsapp')
    .in('user_id', ids)

  const profileMap = new Map((profiles ?? []).map((p) => [p.user_id as string, p]))

  return members.map((m) => {
    const userId = m.user_id as string
    const slug = (m.pro_lideres_share_slug as string | null) ?? null
    const profile = profileMap.get(userId)
    const resetUrl = slug
      ? `${baseUrl}/pro-lideres/reset/${encodeURIComponent(tenantSlug)}/${encodeURIComponent(slug)}`
      : null
    return {
      userId,
      displayName: (profile?.nome_completo as string | null) ?? null,
      shareSlug: slug,
      resetUrl,
      hasWhatsapp: !!((profile?.whatsapp as string | null)?.trim()),
    }
  })
}
