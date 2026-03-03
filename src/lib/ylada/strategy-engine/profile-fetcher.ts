/**
 * Busca perfil e comportamento para o Strategy Engine.
 * Usado por /api/ylada/interpret (profile_first) e /api/ylada/strategy.
 * Suporta perfil simulado (cookie ylada_simulate_profile) para testes.
 * @see docs/PLANO-IMPLANTACAO-DIRECAO-ESTRATEGICA.md (Etapa 5)
 */

import { supabaseAdmin } from '@/lib/supabase'
import { getPerfilSimuladoByKey } from '@/data/perfis-simulados'
import { enrichBehaviorWithLastLinkType } from './behavior'
import type { ProfileInput, BehaviorInput } from './types'

/** Converte perfil simulado (YladaNoelProfileRow) para ProfileInput. */
function simulatedToProfileInput(
  simulated: { profile_type?: string | null; profession?: string | null; category?: string | null; sub_category?: string | null; dor_principal?: string | null; fase_negocio?: string | null; prioridade_atual?: string | null; objetivos_curto_prazo?: string | null; metas_principais?: string | null; capacidade_semana?: number | null; tempo_atuacao_anos?: number | null },
  userId: string,
  segment: string,
  overrides: { profileType?: string | null; profession?: string | null; objective?: string | null }
): ProfileInput {
  return {
    user_id: userId,
    segment,
    profile_type: overrides.profileType ?? simulated.profile_type ?? undefined,
    profession: overrides.profession ?? simulated.profession ?? undefined,
    area_profissional: simulated.profession ?? simulated.category ?? undefined,
    category: simulated.category ?? undefined,
    sub_category: simulated.sub_category ?? undefined,
    dor_principal: simulated.dor_principal ?? undefined,
    fase_negocio: simulated.fase_negocio ?? undefined,
    prioridade_atual: simulated.prioridade_atual ?? undefined,
    objetivos_curto_prazo: simulated.objetivos_curto_prazo ?? undefined,
    metas_principais: simulated.metas_principais ?? undefined,
    capacidade_semana: simulated.capacidade_semana ?? undefined,
    tempo_atuacao_anos: simulated.tempo_atuacao_anos ?? undefined,
    objetivo: overrides.objective ?? 'captar',
    language: 'pt',
  }
}

/** Verifica se o usuário tem perfil Noel (banco ou simulado). */
export async function hasNoelProfile(userId: string, segment: string, simulateKey?: string | null): Promise<boolean> {
  if (simulateKey) {
    const sim = getPerfilSimuladoByKey(simulateKey)
    if (sim && sim.segment === segment) return true
  }
  if (!supabaseAdmin) return false
  const { data } = await supabaseAdmin
    .from('ylada_noel_profile')
    .select('id')
    .eq('user_id', userId)
    .eq('segment', segment)
    .maybeSingle()
  return !!data
}

/** Monta ProfileInput a partir do banco, perfil simulado ou overrides. */
export async function buildProfileInput(
  userId: string,
  segment: string,
  overrides: { profileType?: string | null; profession?: string | null; objective?: string | null },
  simulateKey?: string | null
): Promise<ProfileInput> {
  const base: ProfileInput = {
    user_id: userId,
    segment,
    profile_type: overrides.profileType ?? undefined,
    profession: overrides.profession ?? undefined,
    objetivo: overrides.objective ?? 'captar',
    language: 'pt',
  }

  if (simulateKey) {
    const sim = getPerfilSimuladoByKey(simulateKey)
    if (sim && sim.segment === segment) {
      return simulatedToProfileInput(sim, userId, segment, overrides)
    }
  }

  if (!supabaseAdmin) return base

  const { data: row } = await supabaseAdmin
    .from('ylada_noel_profile')
    .select('profile_type, profession, category, sub_category, dor_principal, fase_negocio, prioridade_atual, objetivos_curto_prazo, metas_principais, capacidade_semana, tempo_atuacao_anos')
    .eq('user_id', userId)
    .eq('segment', segment)
    .maybeSingle()

  if (!row) return base

  return {
    ...base,
    profile_type: overrides.profileType ?? row.profile_type ?? base.profile_type,
    profession: overrides.profession ?? row.profession ?? base.profession,
    area_profissional: row.profession ?? row.category ?? base.area_profissional,
    category: row.category ?? undefined,
    sub_category: row.sub_category ?? undefined,
    dor_principal: row.dor_principal ?? undefined,
    fase_negocio: row.fase_negocio ?? undefined,
    prioridade_atual: row.prioridade_atual ?? undefined,
    objetivos_curto_prazo: row.objetivos_curto_prazo ?? undefined,
    metas_principais: row.metas_principais ?? undefined,
    capacidade_semana: row.capacidade_semana ?? undefined,
    tempo_atuacao_anos: row.tempo_atuacao_anos ?? undefined,
  }
}

/** Busca métricas de comportamento para o strategy-engine. */
export async function fetchBehavior(userId: string): Promise<BehaviorInput | undefined> {
  if (!supabaseAdmin) return undefined

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const iso = sevenDaysAgo.toISOString()

  const { data: links } = await supabaseAdmin
    .from('ylada_links')
    .select('id, created_at, config_json')
    .eq('user_id', userId)
    .eq('status', 'active')

  const linkIds = (links ?? []).map((l) => l.id)
  const linksTotal = linkIds.length

  if (linkIds.length === 0) {
    return { links_created_total: 0 }
  }

  const sorted = [...(links ?? [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  const lastLink = sorted[0]
  const lastLinkConfig = lastLink?.config_json as Record<string, unknown> | undefined

  let submissionsLast7 = 0
  if (linkIds.length > 0) {
    const { count } = await supabaseAdmin
      .from('ylada_diagnosis_metrics')
      .select('id', { count: 'exact', head: true })
      .in('link_id', linkIds)
      .gte('created_at', iso)
    submissionsLast7 = count ?? 0
  }

  const linksLast7 = links?.filter((l) => new Date(l.created_at) >= sevenDaysAgo).length ?? 0

  const base: BehaviorInput = {
    links_created_total: linksTotal,
    links_created_last_7_days: linksLast7,
    last_link_created_at: lastLink?.created_at ?? undefined,
    submissions_last_7_days: submissionsLast7,
  }

  return enrichBehaviorWithLastLinkType(base, lastLinkConfig)
}
