/**
 * Unicidade do handle de perfil entre os 3 espaços de nomes que o resolver lê
 * (`resolve-perfil-fluxo.ts`): `user_profiles.user_slug`, `leader_tenants.slug` e
 * `leader_tenant_members.pro_lideres_share_slug`.
 *
 * Decisão (Andre, 29/06): a precedência "user_profiles ganha" fica por ora; esta
 * checagem na CRIAÇÃO impede colisão NOVA (e portanto que a página de uma rede
 * fique escondida atrás de um user com o mesmo slug). É o 1º degrau pro namespace
 * único global do Chat 3. Colisões pré-existentes ficam pra migração depois.
 * @see blueprint-plataforma/Paginas_Entrada_Arquitetura.md §5
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { normalizeSlug } from '@/lib/slug-utils'

export type HandleTakenResult = {
  taken: boolean
  source?: 'user_slug' | 'leader_tenant' | 'pro_lideres_member_share_slug'
}

async function userSlugOwner(admin: SupabaseClient, handle: string): Promise<string | null> {
  const { data } = await admin
    .from('user_profiles')
    .select('user_id')
    .eq('user_slug', handle)
    .maybeSingle()
  return (data?.user_id as string) ?? null
}

async function leaderTenantOwner(admin: SupabaseClient, handle: string): Promise<string | null> {
  const { data } = await admin
    .from('leader_tenants')
    .select('owner_user_id')
    .eq('slug', handle)
    .maybeSingle()
  return (data?.owner_user_id as string) ?? null
}

async function memberShareOwner(admin: SupabaseClient, handle: string): Promise<string | null> {
  const { data } = await admin
    .from('leader_tenant_members')
    .select('user_id')
    .eq('pro_lideres_share_slug', handle)
    .maybeSingle()
  return (data?.user_id as string) ?? null
}

/**
 * Diz se `handle` já está tomado em qualquer um dos 3 espaços de nomes.
 * `excludeUserId` ignora linhas do próprio dono (edição do próprio handle).
 */
export async function findHandleConflict(
  admin: SupabaseClient,
  handle: string,
  excludeUserId?: string
): Promise<HandleTakenResult> {
  const norm = normalizeSlug(handle)
  if (!norm) return { taken: false }

  const userOwner = await userSlugOwner(admin, norm)
  if (userOwner && userOwner !== excludeUserId) return { taken: true, source: 'user_slug' }

  const tenantOwner = await leaderTenantOwner(admin, norm)
  if (tenantOwner && tenantOwner !== excludeUserId) return { taken: true, source: 'leader_tenant' }

  const memberOwner = await memberShareOwner(admin, norm)
  if (memberOwner && memberOwner !== excludeUserId) {
    return { taken: true, source: 'pro_lideres_member_share_slug' }
  }

  return { taken: false }
}

/** Conveniência booleana de {@link findHandleConflict}. */
export async function isHandleAvailableAcrossNamespaces(
  admin: SupabaseClient,
  handle: string,
  excludeUserId?: string
): Promise<boolean> {
  const { taken } = await findHandleConflict(admin, handle, excludeUserId)
  return !taken
}
