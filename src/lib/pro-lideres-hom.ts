/**
 * Funções de servidor para a funcionalidade HOM (Home Open Meeting) — Pró Líderes.
 * Usa sempre o service-role (supabaseAdmin) para acesso público.
 */

import { supabaseAdmin } from '@/lib/supabase'
import {
  PRO_LIDERES_HOM_DEFAULT_VIDEO_URL,
} from '@/lib/pro-lideres-reset-content'

export type ProLideresHOMConfig = {
  id: string
  tenantId: string
  videoUrl: string | null
  headline: string
  subheadline: string
}

const DEFAULT_HEADLINE = 'Oportunidade: R$500 extra por semana com bebidas funcionais'
const DEFAULT_SUBHEADLINE = 'Assista à apresentação completa e escolha o próximo passo'

/** URL efetiva do vídeo HOM — MP4 local por padrão; ignora YouTube legado (overlay de título). */
export function resolveHomVideoUrl(stored: string | null | undefined): string {
  const trimmed = stored?.trim()
  if (!trimmed) return PRO_LIDERES_HOM_DEFAULT_VIDEO_URL
  if (/youtube\.com|youtu\.be/i.test(trimmed)) return PRO_LIDERES_HOM_DEFAULT_VIDEO_URL
  return trimmed
}

/** Slug fixo na URL pública da HOM para o dono do tenant (líder). */
export const PRO_LIDERES_HOM_LEADER_SLUG = 'lider' as const

export type ProLideresHomLinkSubject = {
  shareSlug: string | null
  subjectUserId: string
  leaderTeamPreview: boolean
}

/**
 * Resolve slug + utilizador cujo WhatsApp/nome entram na página HOM.
 * Em «ver como equipe», o líder autenticado não tem linha de membro com slug — usa-se o link /lider do dono.
 */
export async function resolveProLideresHomLinkSubject(
  tenantId: string,
  tenantOwnerUserId: string,
  userId: string,
  options: { leaderTeamPreview: boolean }
): Promise<ProLideresHomLinkSubject> {
  if (options.leaderTeamPreview) {
    return {
      shareSlug: PRO_LIDERES_HOM_LEADER_SLUG,
      subjectUserId: tenantOwnerUserId,
      leaderTeamPreview: true,
    }
  }

  if (!supabaseAdmin) {
    return { shareSlug: null, subjectUserId: userId, leaderTeamPreview: false }
  }

  const { data: member } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('pro_lideres_share_slug, role')
    .eq('leader_tenant_id', tenantId)
    .eq('user_id', userId)
    .maybeSingle()

  const slugRaw = (member?.pro_lideres_share_slug as string | null)?.trim() || null
  if (slugRaw) {
    return { shareSlug: slugRaw, subjectUserId: userId, leaderTeamPreview: false }
  }

  // Dono/co-líder com role leader na tabela mas sem slug de membro: mesmo caminho público /lider
  if ((member?.role as string | undefined) === 'leader' && userId === tenantOwnerUserId) {
    return {
      shareSlug: PRO_LIDERES_HOM_LEADER_SLUG,
      subjectUserId: tenantOwnerUserId,
      leaderTeamPreview: false,
    }
  }

  return { shareSlug: null, subjectUserId: userId, leaderTeamPreview: false }
}

// ── Config do líder ───────────────────────────────────────────────────────────

export async function fetchHOMConfig(tenantId: string): Promise<ProLideresHOMConfig | null> {
  if (!supabaseAdmin) return null
  const { data, error } = await supabaseAdmin
    .from('prolider_hom_config')
    .select('id, tenant_id, video_url, headline, subheadline')
    .eq('tenant_id', tenantId)
    .maybeSingle()
  if (error || !data) return null
  return {
    id: data.id as string,
    tenantId: data.tenant_id as string,
    videoUrl: (data.video_url as string | null) ?? null,
    headline: (data.headline as string) || DEFAULT_HEADLINE,
    subheadline: (data.subheadline as string) || DEFAULT_SUBHEADLINE,
  }
}

export async function upsertHOMConfig(
  tenantId: string,
  patch: { videoUrl?: string | null; headline?: string; subheadline?: string }
): Promise<{ ok: boolean; error?: string }> {
  if (!supabaseAdmin) return { ok: false, error: 'Serviço indisponível' }
  const payload: Record<string, unknown> = {
    tenant_id: tenantId,
    updated_at: new Date().toISOString(),
  }
  if (patch.videoUrl !== undefined) payload.video_url = patch.videoUrl || null
  if (patch.headline !== undefined) payload.headline = patch.headline || DEFAULT_HEADLINE
  if (patch.subheadline !== undefined) payload.subheadline = patch.subheadline || DEFAULT_SUBHEADLINE

  const { error } = await supabaseAdmin
    .from('prolider_hom_config')
    .upsert(payload, { onConflict: 'tenant_id' })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// ── Dados públicos para a página da HOM ──────────────────────────────────────

export type HOMPublicData = {
  headline: string
  subheadline: string
  videoUrl: string | null
  memberName: string | null
  memberWhatsapp: string | null
  leaderDisplayName: string | null
}

export async function fetchHOMPublicData(
  tenantSlug: string,
  memberSlug: string
): Promise<HOMPublicData | null> {
  if (!supabaseAdmin) return null

  // 1. Tenant
  const { data: tenant, error: tErr } = await supabaseAdmin
    .from('leader_tenants')
    .select('id, display_name, owner_user_id, whatsapp')
    .eq('slug', tenantSlug)
    .maybeSingle()
  if (tErr || !tenant) return null
  const tenantId = tenant.id as string

  // 2a. Slug especial "lider" → usa dados do próprio dono do tenant
  if (memberSlug === 'lider') {
    const ownerUserId = tenant.owner_user_id as string
    const { data: ownerProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('nome_completo, whatsapp')
      .eq('user_id', ownerUserId)
      .maybeSingle()
    const cfg = await fetchHOMConfig(tenantId)
    const whatsapp = (ownerProfile?.whatsapp as string | null)?.trim()
      || (tenant.whatsapp as string | null)?.trim()
      || null
    return {
      headline: cfg?.headline ?? DEFAULT_HEADLINE,
      subheadline: cfg?.subheadline ?? DEFAULT_SUBHEADLINE,
      videoUrl: resolveHomVideoUrl(cfg?.videoUrl),
      memberName: (ownerProfile?.nome_completo as string | null) ?? (tenant.display_name as string | null) ?? null,
      memberWhatsapp: whatsapp,
      leaderDisplayName: (tenant.display_name as string | null) ?? null,
    }
  }

  // 2b. Membro pelo share_slug dentro do tenant
  const { data: member, error: mErr } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('user_id, team_access_state')
    .eq('leader_tenant_id', tenantId)
    .eq('pro_lideres_share_slug', memberSlug)
    .maybeSingle()
  if (mErr || !member) return null
  // Só membros ativos têm página funcional
  if (member.team_access_state !== 'active') return null
  const userId = member.user_id as string

  // 3. Perfil do membro (nome + WhatsApp)
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('nome_completo, whatsapp')
    .eq('user_id', userId)
    .maybeSingle()

  // 4. Config HOM do tenant
  const cfg = await fetchHOMConfig(tenantId)

  return {
    headline: cfg?.headline ?? DEFAULT_HEADLINE,
    subheadline: cfg?.subheadline ?? DEFAULT_SUBHEADLINE,
    videoUrl: resolveHomVideoUrl(cfg?.videoUrl),
    memberName: (profile?.nome_completo as string | null) ?? null,
    memberWhatsapp: (profile?.whatsapp as string | null) ?? null,
    leaderDisplayName: (tenant.display_name as string | null) ?? null,
  }
}

// ── Lista de membros para o painel do líder ───────────────────────────────────

export type HOMMemberLink = {
  userId: string
  displayName: string | null
  shareSlug: string | null
  homUrl: string | null
  hasWhatsapp: boolean
}

export async function fetchHOMMemberLinks(
  tenantId: string,
  tenantSlug: string,
  baseUrl: string
): Promise<HOMMemberLink[]> {
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

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.user_id as string, p])
  )

  return members.map((m) => {
    const userId = m.user_id as string
    const slug = (m.pro_lideres_share_slug as string | null) ?? null
    const profile = profileMap.get(userId)
    const homUrl =
      slug
        ? `${baseUrl}/pro-lideres/hom/${encodeURIComponent(tenantSlug)}/${encodeURIComponent(slug)}`
        : null
    return {
      userId,
      displayName: (profile?.nome_completo as string | null) ?? null,
      shareSlug: slug,
      homUrl,
      hasWhatsapp: !!((profile?.whatsapp as string | null)?.trim()),
    }
  })
}
