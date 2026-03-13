/**
 * Mapa Estratégico do Profissional — visualização da jornada.
 * Etapas: posicionamento → atração → diagnóstico → conversa → clientes → fidelização → indicações.
 *
 * O Noel usa para orientar o próximo passo; o front pode exibir progresso.
 */

import { supabaseAdmin } from '@/lib/supabase'
import type { NoelMemoryRow } from './noel-memory'

export const STRATEGY_MAP_STAGES = [
  'posicionamento',
  'atracao',
  'diagnostico',
  'conversa',
  'clientes',
  'fidelizacao',
  'indicacoes',
] as const

export type StrategyMapStage = (typeof STRATEGY_MAP_STAGES)[number]

export interface StrategyMapRow {
  id?: string
  user_id: string
  segment: string
  profile?: string | null
  goal?: string | null
  posicionamento_ok?: boolean
  atracao_ok?: boolean
  diagnostico_ok?: boolean
  conversa_ok?: boolean
  clientes_ok?: boolean
  fidelizacao_ok?: boolean
  indicacoes_ok?: boolean
  diagnostics_created?: number
  conversations_started?: number
  clients_converted?: number
  current_stage?: string | null
  last_strategy?: string | null
  created_at?: string | null
  updated_at?: string | null
}

/** Ações que indicam progresso em cada etapa. */
const STAGE_ACTIONS: Record<string, string[]> = {
  posicionamento: [], // inferido de ter perfil
  atracao: ['link_gerado', 'criou_link', 'criou_diagnostico', 'criou_quiz', 'compartilhou_link', 'publicou_conteudo'],
  diagnostico: ['recebeu_respostas'],
  conversa: ['iniciou_conversas'],
  clientes: ['agendou_atendimento'],
  fidelizacao: [],
  indicacoes: [],
}

/**
 * Infere progresso do mapa a partir da memória e last_actions.
 */
function inferProgressFromMemory(memory: NoelMemoryRow | null): Partial<StrategyMapRow> {
  const actions = Array.isArray(memory?.last_actions) ? memory.last_actions : []
  const hasAction = (stage: string) =>
    STAGE_ACTIONS[stage]?.some((a) => actions.includes(a)) ?? false

  return {
    profile: memory?.professional_profile ?? undefined,
    goal: memory?.main_goal ?? undefined,
    posicionamento_ok: !!(memory?.professional_profile || memory?.main_problem),
    atracao_ok: hasAction('atracao'),
    diagnostico_ok: hasAction('diagnostico') || (hasAction('atracao') && actions.includes('compartilhou_link')),
    conversa_ok: hasAction('conversa'),
    clientes_ok: hasAction('clientes'),
    fidelizacao_ok: false, // requer dado externo
    indicacoes_ok: false, // requer dado externo
    current_stage: computeNextStage({
      posicionamento_ok: !!(memory?.professional_profile || memory?.main_problem),
      atracao_ok: hasAction('atracao'),
      diagnostico_ok: hasAction('diagnostico') || (hasAction('atracao') && actions.includes('compartilhou_link')),
      conversa_ok: hasAction('conversa'),
      clientes_ok: hasAction('clientes'),
      fidelizacao_ok: false,
      indicacoes_ok: false,
    }),
  }
}

/**
 * Calcula a próxima etapa a focar.
 */
function computeNextStage(progress: {
  posicionamento_ok?: boolean
  atracao_ok?: boolean
  diagnostico_ok?: boolean
  conversa_ok?: boolean
  clientes_ok?: boolean
  fidelizacao_ok?: boolean
  indicacoes_ok?: boolean
}): StrategyMapStage {
  if (!progress.posicionamento_ok) return 'posicionamento'
  if (!progress.atracao_ok) return 'atracao'
  if (!progress.diagnostico_ok) return 'diagnostico'
  if (!progress.conversa_ok) return 'conversa'
  if (!progress.clientes_ok) return 'clientes'
  if (!progress.fidelizacao_ok) return 'fidelizacao'
  if (!progress.indicacoes_ok) return 'indicacoes'
  return 'indicacoes'
}

/**
 * Busca o mapa do profissional (cria/atualiza a partir da memória se necessário).
 */
export async function getStrategyMap(
  userId: string,
  segment: string,
  memory?: NoelMemoryRow | null
): Promise<StrategyMapRow | null> {
  if (!supabaseAdmin) return null

  const { data: existing } = await supabaseAdmin
    .from('ylada_professional_strategy_map')
    .select('*')
    .eq('user_id', userId)
    .eq('segment', segment)
    .maybeSingle()

  const inferred = inferProgressFromMemory(memory ?? null)

  if (existing) {
    const merged: Partial<StrategyMapRow> = {
      ...existing,
      profile: inferred.profile ?? existing.profile,
      goal: inferred.goal ?? existing.goal,
      posicionamento_ok: inferred.posicionamento_ok || existing.posicionamento_ok,
      atracao_ok: inferred.atracao_ok || existing.atracao_ok,
      diagnostico_ok: inferred.diagnostico_ok || existing.diagnostico_ok,
      conversa_ok: inferred.conversa_ok || existing.conversa_ok,
      clientes_ok: inferred.clientes_ok || existing.clientes_ok,
      fidelizacao_ok: inferred.fidelizacao_ok || existing.fidelizacao_ok,
      indicacoes_ok: inferred.indicacoes_ok || existing.indicacoes_ok,
      current_stage: inferred.current_stage ?? existing.current_stage,
    }
    return merged as StrategyMapRow
  }

  const row: Partial<StrategyMapRow> = {
    user_id: userId,
    segment,
    profile: inferred.profile,
    goal: inferred.goal,
    posicionamento_ok: inferred.posicionamento_ok ?? false,
    atracao_ok: inferred.atracao_ok ?? false,
    diagnostico_ok: inferred.diagnostico_ok ?? false,
    conversa_ok: inferred.conversa_ok ?? false,
    clientes_ok: inferred.clientes_ok ?? false,
    fidelizacao_ok: inferred.fidelizacao_ok ?? false,
    indicacoes_ok: inferred.indicacoes_ok ?? false,
    current_stage: inferred.current_stage,
  }

  const { data: inserted } = await supabaseAdmin
    .from('ylada_professional_strategy_map')
    .upsert(row, { onConflict: 'user_id,segment', ignoreDuplicates: false })
    .select()
    .single()

  return (inserted ?? row) as StrategyMapRow
}

/**
 * Atualiza o mapa quando a memória é atualizada (chamado após upsertNoelMemory).
 */
export async function syncStrategyMapFromMemory(
  userId: string,
  segment: string,
  memory: NoelMemoryRow | null
): Promise<void> {
  if (!supabaseAdmin || !memory) return

  const inferred = inferProgressFromMemory(memory)

  const { data: existing } = await supabaseAdmin
    .from('ylada_professional_strategy_map')
    .select('posicionamento_ok, atracao_ok, diagnostico_ok, conversa_ok, clientes_ok, fidelizacao_ok, indicacoes_ok')
    .eq('user_id', userId)
    .eq('segment', segment)
    .maybeSingle()

  const row = {
    user_id: userId,
    segment,
    profile: inferred.profile,
    goal: inferred.goal,
    posicionamento_ok: inferred.posicionamento_ok || existing?.posicionamento_ok,
    atracao_ok: inferred.atracao_ok || existing?.atracao_ok,
    diagnostico_ok: inferred.diagnostico_ok || existing?.diagnostico_ok,
    conversa_ok: inferred.conversa_ok || existing?.conversa_ok,
    clientes_ok: inferred.clientes_ok || existing?.clientes_ok,
    fidelizacao_ok: inferred.fidelizacao_ok || existing?.fidelizacao_ok,
    indicacoes_ok: inferred.indicacoes_ok || existing?.indicacoes_ok,
    current_stage: inferred.current_stage,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabaseAdmin
    .from('ylada_professional_strategy_map')
    .upsert(row, { onConflict: 'user_id,segment', ignoreDuplicates: false })

  if (error) console.warn('[Noel] syncStrategyMapFromMemory:', error)
}

/** Resultado do diagnóstico estratégico do profissional (para atualizar mapa). */
export interface ProfessionalDiagnosisForMap {
  profile_title: string
  main_blocker: string
  recommended_strategy: string
  next_action: string
  growth_stage: StrategyMapStage
}

/**
 * Atualiza o mapa a partir do resultado do diagnóstico estratégico do profissional.
 * Define current_stage = growth_stage e enriquece profile/goal.
 */
export async function updateStrategyMapFromDiagnosis(
  userId: string,
  segment: string,
  diagnosis: ProfessionalDiagnosisForMap
): Promise<void> {
  if (!supabaseAdmin) return

  const { data: existing } = await supabaseAdmin
    .from('ylada_professional_strategy_map')
    .select('posicionamento_ok, atracao_ok, diagnostico_ok, conversa_ok, clientes_ok, fidelizacao_ok, indicacoes_ok')
    .eq('user_id', userId)
    .eq('segment', segment)
    .maybeSingle()

  const row = {
    user_id: userId,
    segment,
    profile: diagnosis.profile_title,
    goal: diagnosis.next_action,
    current_stage: diagnosis.growth_stage,
    last_strategy: diagnosis.recommended_strategy,
    posicionamento_ok: existing?.posicionamento_ok ?? false,
    atracao_ok: existing?.atracao_ok ?? false,
    diagnostico_ok: existing?.diagnostico_ok ?? false,
    conversa_ok: existing?.conversa_ok ?? false,
    clientes_ok: existing?.clientes_ok ?? false,
    fidelizacao_ok: existing?.fidelizacao_ok ?? false,
    indicacoes_ok: existing?.indicacoes_ok ?? false,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabaseAdmin
    .from('ylada_professional_strategy_map')
    .upsert(row, { onConflict: 'user_id,segment', ignoreDuplicates: false })

  if (error) console.warn('[Noel] updateStrategyMapFromDiagnosis:', error)
}

/**
 * Formata o mapa para injetar no prompt do Noel.
 */
export function formatStrategyMapForPrompt(map: StrategyMapRow | null): string {
  if (!map) return ''

  const stages: Array<{ name: string; ok: boolean }> = [
    { name: 'Posicionamento', ok: !!map.posicionamento_ok },
    { name: 'Atração', ok: !!map.atracao_ok },
    { name: 'Diagnóstico', ok: !!map.diagnostico_ok },
    { name: 'Conversa', ok: !!map.conversa_ok },
    { name: 'Clientes', ok: !!map.clientes_ok },
    { name: 'Fidelização', ok: !!map.fidelizacao_ok },
    { name: 'Indicações', ok: !!map.indicacoes_ok },
  ]

  const lines = stages.map((s) => `[${s.name}] ${s.ok ? '✔' : '▢'}`).join('\n')
  const nextStage = map.current_stage
    ? `Próxima etapa a focar: ${map.current_stage}`
    : ''

  return [lines, nextStage].filter(Boolean).join('\n')
}

const STAGE_NAMES: Record<StrategyMapStage, string> = {
  posicionamento: 'Posicionamento',
  atracao: 'Atração',
  diagnostico: 'Diagnóstico',
  conversa: 'Conversa',
  clientes: 'Clientes',
  fidelizacao: 'Fidelização',
  indicacoes: 'Indicações',
}

const STAGE_OK_KEYS: Record<StrategyMapStage, keyof StrategyMapRow> = {
  posicionamento: 'posicionamento_ok',
  atracao: 'atracao_ok',
  diagnostico: 'diagnostico_ok',
  conversa: 'conversa_ok',
  clientes: 'clientes_ok',
  fidelizacao: 'fidelizacao_ok',
  indicacoes: 'indicacoes_ok',
}

/**
 * Retorna o mapa formatado para a API (frontend).
 */
export function formatStrategyMapForApi(map: StrategyMapRow | null): {
  stages: Array<{ id: string; name: string; completed: boolean }>
  current_stage: string | null
  profile: string | null
  goal: string | null
} | null {
  if (!map) return null

  return {
    stages: STRATEGY_MAP_STAGES.map((id) => ({
      id,
      name: STAGE_NAMES[id],
      completed: !!(map[STAGE_OK_KEYS[id]] as boolean),
    })),
    current_stage: map.current_stage ?? null,
    profile: map.profile ?? null,
    goal: map.goal ?? null,
  }
}
