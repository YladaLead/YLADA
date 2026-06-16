/**
 * Resolve `(perfil, fluxo) → slug` do link canônico `/l/[slug]`.
 * Reusa user_slug, leader_tenants.slug e ylada_links existentes — sem tabela nova.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { normalizeSlug } from '@/lib/slug-utils'
import { proLideresPresetSlug } from '@/lib/pro-lideres/wellness-fluxo-to-ylada-config'
import { extractProLideresPresetFluxoIdFromSlug } from '@/lib/pro-lideres/pro-lideres-catalog-display-order'

export type PerfilOwnerResolution = {
  userId: string
  source: 'user_slug' | 'leader_tenant' | 'pro_lideres_member_share_slug'
}

const FLUXO_ALIASES: Record<string, string[]> = {
  'calc-hidratacao': ['agua', 'calc-hidratacao'],
  agua: ['agua', 'calc-hidratacao'],
}

function fluxoCandidates(fluxo: string): string[] {
  const norm = normalizeSlug(fluxo)
  const aliases = FLUXO_ALIASES[norm] ?? [norm]
  return [...new Set(aliases)]
}

/** Resolve handle público do profissional → user_id dono dos links. */
export async function resolvePerfilToOwner(
  admin: SupabaseClient,
  perfil: string
): Promise<PerfilOwnerResolution | null> {
  const handle = normalizeSlug(perfil)
  if (!handle) return null

  const { data: profile } = await admin
    .from('user_profiles')
    .select('user_id')
    .eq('user_slug', handle)
    .maybeSingle()

  if (profile?.user_id) {
    return { userId: profile.user_id as string, source: 'user_slug' }
  }

  const { data: tenant } = await admin
    .from('leader_tenants')
    .select('owner_user_id')
    .eq('slug', handle)
    .maybeSingle()

  if (tenant?.owner_user_id) {
    return { userId: tenant.owner_user_id as string, source: 'leader_tenant' }
  }

  const { data: member } = await admin
    .from('leader_tenant_members')
    .select('user_id')
    .eq('pro_lideres_share_slug', handle)
    .maybeSingle()

  if (member?.user_id) {
    return { userId: member.user_id as string, source: 'pro_lideres_member_share_slug' }
  }

  return null
}

async function yladaLinkSlugExists(
  admin: SupabaseClient,
  slug: string,
  userId?: string
): Promise<boolean> {
  let q = admin.from('ylada_links').select('slug').eq('slug', slug).eq('status', 'active')
  if (userId) q = q.eq('user_id', userId)
  const { data } = await q.maybeSingle()
  return Boolean(data?.slug)
}

async function findYladaLinkSlugByMetaFluxo(
  admin: SupabaseClient,
  userId: string,
  fluxoId: string
): Promise<string | null> {
  const { data: rows } = await admin
    .from('ylada_links')
    .select('slug, config_json')
    .eq('user_id', userId)
    .eq('status', 'active')

  for (const row of rows ?? []) {
    const slug = row.slug as string
    const cfg = (row.config_json as Record<string, unknown>) ?? {}
    const meta = (cfg.meta as Record<string, unknown>) ?? {}
    const metaFluxo =
      typeof meta.pro_lideres_fluxo_id === 'string'
        ? meta.pro_lideres_fluxo_id
        : typeof meta.flow_id === 'string'
          ? meta.flow_id
          : typeof meta.handle === 'string'
            ? meta.handle
            : ''
    if (metaFluxo && normalizeSlug(metaFluxo) === normalizeSlug(fluxoId)) return slug
    const fromSlug = extractProLideresPresetFluxoIdFromSlug(slug)
    if (fromSlug && normalizeSlug(fromSlug) === normalizeSlug(fluxoId)) return slug
    if (normalizeSlug(slug) === normalizeSlug(fluxoId)) return slug
  }

  return null
}

/** Resolve fluxo (handle na URL) → slug ativo em ylada_links para o dono. */
export async function resolveFluxoToLinkSlug(
  admin: SupabaseClient,
  userId: string,
  fluxo: string
): Promise<string | null> {
  const candidates = fluxoCandidates(fluxo)

  for (const fluxoId of candidates) {
    if (fluxoId.startsWith('pl-') && (await yladaLinkSlugExists(admin, fluxoId, userId))) {
      return fluxoId
    }

    for (const kind of ['sales', 'recruitment'] as const) {
      const presetSlug = proLideresPresetSlug(userId, kind, fluxoId)
      if (await yladaLinkSlugExists(admin, presetSlug)) return presetSlug
    }

    if (await yladaLinkSlugExists(admin, fluxoId, userId)) return fluxoId

    const byMeta = await findYladaLinkSlugByMetaFluxo(admin, userId, fluxoId)
    if (byMeta) return byMeta
  }

  const { data: template } = await admin
    .from('user_templates')
    .select('slug')
    .eq('user_id', userId)
    .in('slug', candidates)
    .maybeSingle()

  if (template?.slug) {
    const toolSlug = normalizeSlug(template.slug as string)
    for (const fluxoId of fluxoCandidates(toolSlug)) {
      for (const kind of ['sales', 'recruitment'] as const) {
        const presetSlug = proLideresPresetSlug(userId, kind, fluxoId)
        if (await yladaLinkSlugExists(admin, presetSlug)) return presetSlug
      }
      const byMeta = await findYladaLinkSlugByMetaFluxo(admin, userId, fluxoId)
      if (byMeta) return byMeta
    }
  }

  return null
}

/** `(perfil, fluxo) → slug` do `/l/[slug]` ou null se não houver link ativo. */
export async function resolvePerfilFluxoToLinkSlug(
  admin: SupabaseClient,
  perfil: string,
  fluxo: string
): Promise<string | null> {
  const owner = await resolvePerfilToOwner(admin, perfil)
  if (!owner) return null
  return resolveFluxoToLinkSlug(admin, owner.userId, fluxo)
}
