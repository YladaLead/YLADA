/**
 * Dados pra renderizar a página de entrada `/[perfil]` nua:
 * apresentação do profissional + lista dos fluxos públicos dele (hub).
 * Reusa o resolver de dono do `/[perfil]/[fluxo]` (sem tabela nova).
 * @see blueprint-plataforma/Paginas_Entrada_Arquitetura.md §1.1
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { resolvePerfilToOwner } from '@/lib/ylada-flow/resolve-perfil-fluxo'

export type PerfilFluxoCard = {
  slug: string
  titulo: string
}

export type PerfilApresentacao = {
  nome: string
  bio: string | null
  fluxos: PerfilFluxoCard[]
  /** Código do loop do dono pro selo (read-only; null se ele ainda não tem um). */
  seloRef: string | null
}

/** Lê (sem criar) o código de loop do dono pro selo "Powered by Ylada". */
async function fetchOwnerReferralCode(
  admin: SupabaseClient,
  userId: string
): Promise<string | null> {
  const { data } = await admin
    .from('referral_codes')
    .select('code')
    .eq('user_id', userId)
    .maybeSingle()
  return typeof data?.code === 'string' && data.code.trim() ? data.code.trim() : null
}

/** Nome de exibição + bio do dono (vale pra liberal, líder e membro: todos têm user_id). */
async function fetchOwnerPresentation(
  admin: SupabaseClient,
  userId: string
): Promise<{ nome: string; bio: string | null }> {
  const { data } = await admin
    .from('user_profiles')
    .select('nome_completo, bio')
    .eq('user_id', userId)
    .maybeSingle()
  const nome = typeof data?.nome_completo === 'string' ? data.nome_completo.trim() : ''
  const bio = typeof data?.bio === 'string' && data.bio.trim() ? data.bio.trim() : null
  return { nome, bio }
}

/** Título legível do link (prioriza config_json.page.title, cai no title da linha). */
function linkTitle(row: { title?: unknown; config_json?: unknown }): string {
  const cfg = (row.config_json as Record<string, unknown>) ?? {}
  const page = (cfg.page as Record<string, unknown>) ?? {}
  if (typeof page.title === 'string' && page.title.trim()) return page.title.trim()
  if (typeof row.title === 'string' && row.title.trim()) return row.title.trim()
  return 'Diagnóstico'
}

/** Fluxos públicos ativos do dono → cards (link `/[perfil]/[slug]`, que o resolver round-trips). */
async function fetchOwnerFluxos(
  admin: SupabaseClient,
  userId: string
): Promise<PerfilFluxoCard[]> {
  const { data: rows } = await admin
    .from('ylada_links')
    .select('slug, title, config_json, created_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  return (rows ?? [])
    .filter((row) => typeof row.slug === 'string' && row.slug.trim())
    .map((row) => ({ slug: (row.slug as string).toLowerCase(), titulo: linkTitle(row) }))
}

/** Monta a apresentação do perfil, ou null se o handle não resolve um dono. */
export async function fetchPerfilApresentacao(
  admin: SupabaseClient,
  perfil: string
): Promise<PerfilApresentacao | null> {
  const owner = await resolvePerfilToOwner(admin, perfil)
  if (!owner) return null

  const [presentation, fluxos, seloRef] = await Promise.all([
    fetchOwnerPresentation(admin, owner.userId),
    fetchOwnerFluxos(admin, owner.userId),
    fetchOwnerReferralCode(admin, owner.userId),
  ])

  return { nome: presentation.nome, bio: presentation.bio, fluxos, seloRef }
}
