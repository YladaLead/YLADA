/**
 * Núcleo genérico de "vídeo compartilhável por membro" — Pró Líderes.
 *
 * Mesma arquitetura da HOM (vídeo do líder + WhatsApp do membro + link único por membro),
 * mas parametrizado por `kind` para servir várias páginas (HOM Herbalife, Início Rápido, …)
 * sem duplicar lib/rotas/componentes. A HOM e o Reset legados seguem nos próprios arquivos.
 *
 * Acesso público sempre via service-role (supabaseAdmin).
 */

import { supabaseAdmin } from '@/lib/supabase'
import {
  PRO_LIDERES_HOM_LEADER_SLUG,
  resolveProLideresHomLinkSubject,
} from '@/lib/pro-lideres-hom'
import {
  PRO_LIDERES_HOM_VIDEO_POSTER,
  PRO_LIDERES_RESET_VIDEO_POSTER,
} from '@/lib/pro-lideres-reset-content'

// Reuso do mesmo resolvedor de "quem é o sujeito do link" e do slug fixo do líder.
export {
  PRO_LIDERES_HOM_LEADER_SLUG as PRO_LIDERES_VIDEO_SHARE_LEADER_SLUG,
  resolveProLideresHomLinkSubject as resolveProLideresVideoShareLinkSubject,
}

export type VideoShareKind = 'hom-herbalife' | 'inicio-rapido'

export type VideoShareDescriptor = {
  /** Tabela de config por tenant (espelho de prolider_hom_config). */
  table: string
  /** Segmento do caminho público: /pro-lideres/v/<routeSegment>/<tenant>/<membro>. */
  routeSegment: VideoShareKind
  /** Vídeo MP4 padrão (public/videos) quando o líder não configurou. */
  defaultVideoUrl: string
  /** Poster (capa antes do play). */
  poster: string
  defaultHeadline: string
  defaultSubheadline: string
  /** Chaves usadas no OG / título da aba. */
  ogKey: string
  pageTitle: string
}

export const VIDEO_SHARE_REGISTRY: Record<VideoShareKind, VideoShareDescriptor> = {
  'hom-herbalife': {
    table: 'prolider_hom_herbalife_config',
    routeSegment: 'hom-herbalife',
    defaultVideoUrl: '/videos/reset-metabolico-hom-herbalife.mp4',
    poster: PRO_LIDERES_HOM_VIDEO_POSTER,
    defaultHeadline: 'Oportunidade Herbalife',
    defaultSubheadline: 'Assista à apresentação e descubra como começar',
    ogKey: 'hom',
    pageTitle: 'HOM Herbalife',
  },
  'inicio-rapido': {
    table: 'prolider_inicio_rapido_config',
    routeSegment: 'inicio-rapido',
    defaultVideoUrl: '/videos/reset-metabolico-inicio-rapido.mp4',
    poster: PRO_LIDERES_RESET_VIDEO_POSTER,
    defaultHeadline: 'Início Rápido',
    defaultSubheadline: 'Seu primeiro passo para começar com o pé direito',
    ogKey: 'hom',
    pageTitle: 'Início Rápido',
  },
}

export function isVideoShareKind(value: string | null | undefined): value is VideoShareKind {
  return value === 'hom-herbalife' || value === 'inicio-rapido'
}

export function getVideoShareDescriptor(kind: VideoShareKind): VideoShareDescriptor {
  return VIDEO_SHARE_REGISTRY[kind]
}

export type VideoShareConfig = {
  tenantId: string
  videoUrl: string | null
  headline: string
  subheadline: string
}

export async function fetchVideoShareConfig(
  kind: VideoShareKind,
  tenantId: string
): Promise<VideoShareConfig | null> {
  if (!supabaseAdmin) return null
  const d = getVideoShareDescriptor(kind)
  const { data, error } = await supabaseAdmin
    .from(d.table)
    .select('tenant_id, video_url, headline, subheadline')
    .eq('tenant_id', tenantId)
    .maybeSingle()
  if (error || !data) return null
  return {
    tenantId: data.tenant_id as string,
    videoUrl: (data.video_url as string | null) ?? null,
    headline: (data.headline as string) || d.defaultHeadline,
    subheadline: (data.subheadline as string) || d.defaultSubheadline,
  }
}

export async function upsertVideoShareConfig(
  kind: VideoShareKind,
  tenantId: string,
  patch: { videoUrl?: string | null; headline?: string; subheadline?: string }
): Promise<{ ok: boolean; error?: string }> {
  if (!supabaseAdmin) return { ok: false, error: 'Serviço indisponível' }
  const d = getVideoShareDescriptor(kind)
  const payload: Record<string, unknown> = {
    tenant_id: tenantId,
    updated_at: new Date().toISOString(),
  }
  if (patch.videoUrl !== undefined) payload.video_url = patch.videoUrl || null
  if (patch.headline !== undefined) payload.headline = patch.headline || d.defaultHeadline
  if (patch.subheadline !== undefined) payload.subheadline = patch.subheadline || d.defaultSubheadline

  const { error } = await supabaseAdmin
    .from(d.table)
    .upsert(payload, { onConflict: 'tenant_id' })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export type VideoSharePublicData = {
  headline: string
  subheadline: string
  videoUrl: string | null
  memberName: string | null
  memberWhatsapp: string | null
  leaderDisplayName: string | null
}

export async function fetchVideoSharePublicData(
  kind: VideoShareKind,
  tenantSlug: string,
  memberSlug: string
): Promise<VideoSharePublicData | null> {
  if (!supabaseAdmin) return null
  const d = getVideoShareDescriptor(kind)

  const { data: tenant, error: tErr } = await supabaseAdmin
    .from('leader_tenants')
    .select('id, display_name, owner_user_id, whatsapp')
    .eq('slug', tenantSlug)
    .maybeSingle()
  if (tErr || !tenant) return null
  const tenantId = tenant.id as string

  const cfg = await fetchVideoShareConfig(kind, tenantId)
  const base = {
    headline: cfg?.headline ?? d.defaultHeadline,
    subheadline: cfg?.subheadline ?? d.defaultSubheadline,
    videoUrl: cfg?.videoUrl ?? null,
    leaderDisplayName: (tenant.display_name as string | null) ?? null,
  }

  // Slug fixo "lider" → dados do próprio dono do tenant.
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

  // Membro pelo share_slug dentro do tenant (só ativos).
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

export type VideoShareMemberLink = {
  userId: string
  displayName: string | null
  shareSlug: string | null
  shareUrl: string | null
  hasWhatsapp: boolean
}

export async function fetchVideoShareMemberLinks(
  kind: VideoShareKind,
  tenantId: string,
  tenantSlug: string,
  baseUrl: string
): Promise<VideoShareMemberLink[]> {
  if (!supabaseAdmin) return []
  const d = getVideoShareDescriptor(kind)

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
    const shareUrl = slug
      ? `${baseUrl}/pro-lideres/v/${d.routeSegment}/${encodeURIComponent(tenantSlug)}/${encodeURIComponent(slug)}`
      : null
    return {
      userId,
      displayName: (profile?.nome_completo as string | null) ?? null,
      shareSlug: slug,
      shareUrl,
      hasWhatsapp: !!((profile?.whatsapp as string | null)?.trim()),
    }
  })
}

export function buildVideoShareMemberUrl(
  kind: VideoShareKind,
  baseUrl: string,
  tenantSlug: string,
  slug: string
): string {
  const d = getVideoShareDescriptor(kind)
  return `${baseUrl}/pro-lideres/v/${d.routeSegment}/${encodeURIComponent(tenantSlug)}/${encodeURIComponent(slug)}`
}
