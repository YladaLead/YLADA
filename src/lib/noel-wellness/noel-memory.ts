/**
 * Memória estratégica do Noel — acompanha a jornada do profissional entre conversas.
 * Permite que o Noel responda "O que faço agora?" com base no que já aconteceu.
 *
 * Fluxo: ler memória → injetar no prompt → responder → atualizar memória com o detectado.
 */

import { supabaseAdmin } from '@/lib/supabase'

export interface NoelMemoryRow {
  id?: string
  user_id: string
  segment: string
  professional_profile?: string | null
  main_goal?: string | null
  main_problem?: string | null
  current_strategy?: string | null
  funnel_stage?: string | null
  last_actions?: string[]
  last_interaction_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

/** Parâmetros para atualizar a memória após uma conversa. */
export interface NoelMemoryUpdate {
  professional_profile?: string
  main_goal?: string
  main_problem?: string
  current_strategy?: string
  funnel_stage?: string
  /** Ação a adicionar (ex.: criou_link_emagrecimento). Será append em last_actions. */
  action_to_add?: string
}

const MAX_LAST_ACTIONS = 10

/**
 * Busca a memória do profissional para o segmento.
 */
export async function getNoelMemory(
  userId: string,
  segment: string
): Promise<NoelMemoryRow | null> {
  if (!supabaseAdmin) return null
  const { data } = await supabaseAdmin
    .from('ylada_noel_memory')
    .select('*')
    .eq('user_id', userId)
    .eq('segment', segment)
    .maybeSingle()
  return data as NoelMemoryRow | null
}

/**
 * Formata a memória para injetar no prompt do Noel.
 */
export function formatNoelMemoryForPrompt(memory: NoelMemoryRow | null): string {
  if (!memory) return ''

  const parts: string[] = []
  if (memory.professional_profile) {
    parts.push(`Perfil: ${memory.professional_profile}`)
  }
  if (memory.main_goal) {
    parts.push(`Objetivo: ${memory.main_goal}`)
  }
  if (memory.main_problem) {
    parts.push(`Problema/situação: ${memory.main_problem}`)
  }
  if (memory.current_strategy) {
    parts.push(`Estratégia em uso: ${memory.current_strategy}`)
  }
  if (memory.funnel_stage) {
    parts.push(`Estágio: ${memory.funnel_stage}`)
  }
  const actions = Array.isArray(memory.last_actions) ? memory.last_actions : []
  if (actions.length > 0) {
    parts.push(`Ações recentes: ${actions.slice(-5).join(', ')}`)
  }

  if (parts.length === 0) return ''
  return parts.join('\n')
}

/**
 * Atualiza (upsert) a memória do profissional.
 * Mescla valores novos com os existentes; action_to_add é append em last_actions.
 */
export async function upsertNoelMemory(
  userId: string,
  segment: string,
  update: NoelMemoryUpdate
): Promise<void> {
  if (!supabaseAdmin) return

  const existing = await getNoelMemory(userId, segment)

  let lastActions: string[] = Array.isArray(existing?.last_actions) ? [...existing.last_actions] : []
  if (update.action_to_add?.trim()) {
    const action = update.action_to_add.trim()
    lastActions = [...lastActions.filter((a) => a !== action), action].slice(-MAX_LAST_ACTIONS)
  }

  const row: Partial<NoelMemoryRow> = {
    user_id: userId,
    segment,
    professional_profile: update.professional_profile ?? existing?.professional_profile ?? null,
    main_goal: update.main_goal ?? existing?.main_goal ?? null,
    main_problem: update.main_problem ?? existing?.main_problem ?? null,
    current_strategy: update.current_strategy ?? existing?.current_strategy ?? null,
    funnel_stage: update.funnel_stage ?? existing?.funnel_stage ?? null,
    last_actions: lastActions,
    last_interaction_at: new Date().toISOString(),
  }

  const { error } = await supabaseAdmin
    .from('ylada_noel_memory')
    .upsert(row, { onConflict: 'user_id,segment', ignoreDuplicates: false })
  if (error) {
    console.warn('[Noel] upsertNoelMemory erro:', error)
  }
}

/** Detecta ação na mensagem do usuário para atualizar last_actions. */
const ACTION_PATTERNS: Array<{ pattern: RegExp; action: string }> = [
  { pattern: /criei\s+(o\s+)?(link|quiz|diagn[oó]stico)/i, action: 'criou_link_diagnostico' },
  { pattern: /criei\s+(o\s+)?link/i, action: 'criou_link' },
  { pattern: /criei\s+(o\s+)?quiz/i, action: 'criou_quiz' },
  { pattern: /criei\s+(o\s+)?diagn[oó]stico/i, action: 'criou_diagnostico' },
  { pattern: /compartilhei|compartilhou|enviei\s+o\s+link|mandei\s+o\s+link/i, action: 'compartilhou_link' },
  { pattern: /publiquei|postei|coloquei\s+no\s+(insta|instagram)/i, action: 'publicou_conteudo' },
  { pattern: /conversei\s+com|falei\s+com|entrei\s+em\s+contato/i, action: 'iniciou_conversas' },
  { pattern: /as\s+pessoas\s+(est[aã]o\s+)?respondendo|pessoas\s+responderam/i, action: 'recebeu_respostas' },
  { pattern: /agendei|consegui\s+agendar|fechou\s+(um\s+)?(atendimento|cliente)/i, action: 'agendou_atendimento' },
]

/**
 * Extrai ação da mensagem do usuário (para last_actions).
 */
export function detectActionFromMessage(message: string): string | null {
  const m = message.trim()
  if (!m) return null
  for (const { pattern, action } of ACTION_PATTERNS) {
    if (pattern.test(m)) return action
  }
  return null
}
