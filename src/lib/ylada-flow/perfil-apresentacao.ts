/**
 * Dados pra renderizar a página de entrada `/[perfil]` nua:
 * apresentação do profissional (nome, manchete, bio, foto) + vitrine CURADA
 * dos fluxos dele (hub) + código do loop pro selo.
 * Reusa o resolver de dono do `/[perfil]/[fluxo]` (sem tabela nova).
 * @see blueprint-plataforma/Paginas_Entrada_Arquitetura.md §1.1
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { resolvePerfilToOwner } from '@/lib/ylada-flow/resolve-perfil-fluxo'
import {
  curarFluxos,
  extrairMetaCuradoria,
  type FluxoCandidato,
  type FluxoCurado,
} from '@/lib/ylada-flow/perfil-curadoria'

export type PerfilApresentacao = {
  nome: string
  headline: string | null
  bio: string | null
  avatarUrl: string | null
  /** Vitrine curada (marcados pelo dono, ou os mais recentes como fallback). */
  fluxos: FluxoCurado[]
  /** Código do loop do dono pro selo (read-only; null se ele ainda não tem um). */
  seloRef: string | null
}

type PerfilRow = {
  nome_completo?: unknown
  headline?: unknown
  bio?: unknown
  avatar_url?: unknown
}

type LinkRow = {
  slug?: unknown
  title?: unknown
  config_json?: unknown
  created_at?: unknown
}

function textoOuNull(valor: unknown): string | null {
  return typeof valor === 'string' && valor.trim() ? valor.trim() : null
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
  return textoOuNull(data?.code)
}

/** Apresentação do dono. Tolerante: headline/avatar_url podem não existir ainda. */
async function fetchOwnerPresentation(
  admin: SupabaseClient,
  userId: string
): Promise<{ nome: string; headline: string | null; bio: string | null; avatarUrl: string | null }> {
  const row = await selectPerfilRow(admin, userId)
  return {
    nome: textoOuNull(row?.nome_completo) ?? '',
    headline: textoOuNull(row?.headline),
    bio: textoOuNull(row?.bio),
    avatarUrl: textoOuNull(row?.avatar_url),
  }
}

/** Busca o perfil; se headline/avatar_url não existem no schema, cai no básico. */
async function selectPerfilRow(admin: SupabaseClient, userId: string): Promise<PerfilRow | null> {
  const full = await admin
    .from('user_profiles')
    .select('nome_completo, bio, headline, avatar_url')
    .eq('user_id', userId)
    .maybeSingle()
  if (!full.error) return (full.data as PerfilRow) ?? null

  const basic = await admin
    .from('user_profiles')
    .select('nome_completo, bio')
    .eq('user_id', userId)
    .maybeSingle()
  return (basic.data as PerfilRow) ?? null
}

/** Título legível do link (prioriza config_json.page.title, cai no title da linha). */
function linkTitle(row: LinkRow): string {
  const cfg = (row.config_json as Record<string, unknown>) ?? {}
  const page = (cfg.page as Record<string, unknown>) ?? {}
  if (typeof page.title === 'string' && page.title.trim()) return page.title.trim()
  if (typeof row.title === 'string' && row.title.trim()) return row.title.trim()
  return 'Diagnóstico'
}

/** Rótulo do tipo (só "Calculadora" em sinal claro; senão "Diagnóstico"). */
function tipoFluxo(slug: string, configJson: unknown): string {
  const cfg = (configJson as { meta?: { architecture?: unknown } }) ?? {}
  const arch = typeof cfg.meta?.architecture === 'string' ? cfg.meta.architecture.toLowerCase() : ''
  const ehCalculadora = arch.includes('calc') || /(^|[-_])(calc|agua|imc|proteina|calorias)/.test(slug)
  return ehCalculadora ? 'Calculadora' : 'Diagnóstico'
}

/** Linha de link → candidato à curadoria (com marcadores de destaque). */
function montarCandidato(row: LinkRow): FluxoCandidato | null {
  const slug = textoOuNull(row.slug)?.toLowerCase()
  if (!slug) return null
  const { destaque, ordem } = extrairMetaCuradoria(row.config_json)
  return {
    slug,
    titulo: linkTitle(row),
    subtitulo: tipoFluxo(slug, row.config_json),
    destaque,
    ordem,
    criadoEm: typeof row.created_at === 'string' ? row.created_at : new Date(0).toISOString(),
  }
}

/** Fluxos ativos do dono → vitrine curada (destaque marcado, ou recentes). */
async function fetchOwnerFluxos(admin: SupabaseClient, userId: string): Promise<FluxoCurado[]> {
  const { data: rows } = await admin
    .from('ylada_links')
    .select('slug, title, config_json, created_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const candidatos = (rows ?? [])
    .map((row) => montarCandidato(row as LinkRow))
    .filter((c): c is FluxoCandidato => c !== null)
  return curarFluxos(candidatos)
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

  return {
    nome: presentation.nome,
    headline: presentation.headline,
    bio: presentation.bio,
    avatarUrl: presentation.avatarUrl,
    fluxos,
    seloRef,
  }
}
