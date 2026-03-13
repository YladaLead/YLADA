/**
 * Busca na biblioteca do Noel (noel_strategy_library + noel_conversation_library)
 * e formata o contexto para o Layer 4 do prompt.
 *
 * Fluxo: situação (profileCodes) + perfil do profissional (professionalProfileCodes) → tópicos → estratégias.
 * Quando profileCodes ou professionalProfileCodes são passados, as estratégias são
 * preferidas pelos tópicos ligados a esses perfis.
 * Prioridade: biblioteca Noel → knowledge_base → IA pura.
 * Limite: 3 estratégias, 2 conversas (mantém prompt leve).
 *
 * Ver: docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md
 */

import { supabaseAdmin } from '@/lib/supabase'
import { PROFILE_STRATEGY_TOPICS } from '@/config/noel-strategic-profiles'
import { NOEL_PROFESSIONAL_PROFILES } from '@/config/noel-professional-profiles'
import { NOEL_STRATEGIC_OBJECTIVES } from '@/config/noel-strategic-objectives'
import { NOEL_FUNNEL_STAGES } from '@/config/noel-funnel-stages'

const MAX_STRATEGIES = 3
const MAX_CONVERSATIONS = 2

/** Palavras muito comuns a ignorar na busca por similaridade */
const STOPWORDS = new Set(
  'a o e de da do em no na que para com por mas se não ou como mais mas já está foi ser'.split(' ')
)

/**
 * Extrai termos relevantes da mensagem (2+ caracteres, não stopword) para busca ILIKE.
 */
function extractSearchTerms(message: string): string[] {
  const normalized = message
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w))
  return [...new Set(normalized)].slice(0, 5)
}

/** Parâmetros para busca na biblioteca: situação + perfil + objetivo + estágio do funil. */
export interface NoelLibrarySearchParams {
  /** Códigos dos perfis estratégicos (situação) detectados. */
  situationCodes?: string[]
  /** Códigos dos perfis do profissional detectados. */
  professionalProfileCodes?: string[]
  /** Códigos dos objetivos estratégicos detectados. */
  objectiveCodes?: string[]
  /** Códigos dos estágios do funil detectados (curiosidade vs decisão, etc.). */
  funnelStageCodes?: string[]
}

/** Estratégia com estrutura: Diagnóstico → Explicação → Próximo movimento → Exemplo. */
export interface StrategyRow {
  topic?: string | null
  problem?: string | null
  diagnostico?: string | null
  strategy: string
  example?: string | null
  next_action?: string | null
  /** Frase "Isso acontece quando..." para a resposta do Noel. */
  diagnostic_phrase?: string | null
  /** Explicação estratégica (o porquê). */
  explicacao?: string | null
  /** Próximo movimento em texto legível. */
  proximo_movimento?: string | null
}

/**
 * Busca estratégias: se situationCodes, professionalProfileCodes ou objectiveCodes informados, prefere topics; senão usa similaridade.
 * Combina tópicos de situação, perfil e objetivo.
 * Limite: MAX_STRATEGIES.
 */
async function fetchStrategies(
  message: string,
  params?: NoelLibrarySearchParams
): Promise<StrategyRow[]> {
  const preferredTopics: string[] = []

  // Tópicos da situação (perfis estratégicos)
  if (params?.situationCodes?.length) {
    for (const code of params.situationCodes) {
      const topics = PROFILE_STRATEGY_TOPICS[code]
      if (topics) preferredTopics.push(...topics)
    }
  }

  // Tópicos do perfil do profissional
  if (params?.professionalProfileCodes?.length) {
    for (const code of params.professionalProfileCodes) {
      const profile = NOEL_PROFESSIONAL_PROFILES.find((p) => p.profile_code === code)
      if (profile?.library_topics?.length) {
        preferredTopics.push(...profile.library_topics)
      }
    }
  }

  // Tópicos do objetivo estratégico (prioridade alta: foco da resposta)
  if (params?.objectiveCodes?.length) {
    for (const code of params.objectiveCodes) {
      const objective = NOEL_STRATEGIC_OBJECTIVES.find((o) => o.objective_code === code)
      if (objective?.library_topics?.length) {
        preferredTopics.push(...objective.library_topics)
      }
    }
  }

  // Tópicos do estágio do funil (curiosidade → diagnóstico antes de preço; decisão → explicar valor)
  if (params?.funnelStageCodes?.length) {
    for (const code of params.funnelStageCodes) {
      const stage = NOEL_FUNNEL_STAGES.find((s) => s.stage_code === code)
      if (stage?.library_topics?.length) {
        preferredTopics.push(...stage.library_topics)
      }
    }
  }

  const topicsSet = [...new Set(preferredTopics)]

  const selectFields = 'topic, problem, diagnostico, strategy, example, next_action, diagnostic_phrase, explicacao, proximo_movimento'

  if (topicsSet.length > 0) {
    const { data } = await supabaseAdmin
      .from('noel_strategy_library')
      .select(selectFields)
      .in('topic', topicsSet)
      .limit(MAX_STRATEGIES * 2)
    if (data?.length) return data.slice(0, MAX_STRATEGIES) as StrategyRow[]
  }

  const terms = extractSearchTerms(message)
  if (terms.length === 0) {
    const { data } = await supabaseAdmin
      .from('noel_strategy_library')
      .select(selectFields)
      .limit(MAX_STRATEGIES)
      .order('created_at', { ascending: false })
    return (data ?? []) as StrategyRow[]
  }

  const orConditions = terms.map(
    (t) => `topic.ilike.%${t}%,problem.ilike.%${t}%,strategy.ilike.%${t}%`
  )

  const { data } = await supabaseAdmin
    .from('noel_strategy_library')
    .select(selectFields)
    .or(orConditions.join(','))
    .limit(MAX_STRATEGIES * 2)

  if (!data?.length) {
    const { data: fallback } = await supabaseAdmin
      .from('noel_strategy_library')
      .select(selectFields)
      .limit(MAX_STRATEGIES)
      .order('created_at', { ascending: false })
    return (fallback ?? []) as StrategyRow[]
  }

  return data.slice(0, MAX_STRATEGIES) as StrategyRow[]
}

/**
 * Busca exemplos de conversa (cenários gerais ou por termo).
 * Limite: MAX_CONVERSATIONS.
 */
async function fetchConversations(message: string): Promise<
  Array<{ user_question: string; good_answer: string }>
> {
  const terms = extractSearchTerms(message)
  if (terms.length === 0) {
    const { data } = await supabaseAdmin
      .from('noel_conversation_library')
      .select('user_question, good_answer')
      .limit(MAX_CONVERSATIONS)
      .order('created_at', { ascending: false })
    return data ?? []
  }

  const orConditions = terms.map(
    (t) => `scenario.ilike.%${t}%,user_question.ilike.%${t}%,good_answer.ilike.%${t}%`
  )

  const { data } = await supabaseAdmin
    .from('noel_conversation_library')
    .select('user_question, good_answer')
    .or(orConditions.join(','))
    .limit(MAX_CONVERSATIONS * 2)

  if (!data?.length) {
    const { data: fallback } = await supabaseAdmin
      .from('noel_conversation_library')
      .select('user_question, good_answer')
      .limit(MAX_CONVERSATIONS)
      .order('created_at', { ascending: false })
    return fallback ?? []
  }

  return data.slice(0, MAX_CONVERSATIONS)
}

/**
 * Monta o texto formatado para o modelo.
 * Estrutura: Diagnóstico → Explicação → Próximo movimento → Exemplo (resposta estruturada do Noel).
 */
function formatLibraryContext(
  strategies: StrategyRow[],
  conversations: Array<{ user_question: string; good_answer: string }>
): string {
  const parts: string[] = []

  if (strategies.length > 0) {
    const list = strategies
      .map((s, i) => {
        const name = s.topic ? `[${s.topic}]` : `${i + 1}.`
        const lines: string[] = [`${name}`]
        const diag = s.diagnostic_phrase?.trim() || (s.problem?.trim() ? `Isso acontece quando ${s.problem.trim()}` : null)
        if (diag) lines.push(`   Diagnóstico: ${diag}`)
        const expl = s.explicacao?.trim() || s.strategy?.trim()
        if (expl) lines.push(`   Explicação: ${expl}`)
        const prox = s.proximo_movimento?.trim() || s.next_action?.trim()
        if (prox) lines.push(`   Próximo movimento: ${prox}`)
        if (s.example?.trim()) lines.push(`   Exemplo: "${s.example.trim()}"`)
        return lines.join('\n')
      })
      .join('\n\n')
    parts.push('Estratégias relevantes (use esta estrutura na resposta: Diagnóstico → Explicação → Próximo movimento → Exemplo):\n' + list)
  }

  if (conversations.length > 0) {
    const examples = conversations
      .map(
        (c) =>
          `Cliente: ${c.user_question.trim()}\nResposta sugerida:\n"${c.good_answer.trim()}"`
      )
      .join('\n\n')
    parts.push('Exemplos de conversa:\n' + examples)
  }

  return parts.join('\n\n')
}

/**
 * Retorna o contexto da biblioteca do Noel (estratégias + conversas) formatado
 * para ser injetado no prompt.
 * @param message - Mensagem do profissional (usada para similaridade quando não há perfil).
 * @param params - situationCodes (perfis estratégicos) e/ou professionalProfileCodes (perfil do profissional).
 *                 Aceita também profileCodes (legado) como alias de situationCodes.
 */
export async function getNoelLibraryContext(
  message: string,
  params?: NoelLibrarySearchParams | string[]
): Promise<string> {
  try {
    const searchParams: NoelLibrarySearchParams | undefined =
      Array.isArray(params)
        ? { situationCodes: params }
        : params

    const [strategies, conversations] = await Promise.all([
      fetchStrategies(message, searchParams),
      fetchConversations(message),
    ])
    return formatLibraryContext(strategies, conversations)
  } catch (e) {
    console.warn('[Noel] getNoelLibraryContext erro:', e)
    return ''
  }
}

/**
 * Retorna contexto + estratégias (para persistir diagnóstico da conversa).
 */
export async function getNoelLibraryContextWithStrategies(
  message: string,
  params?: NoelLibrarySearchParams | string[]
): Promise<{ context: string; strategies: StrategyRow[] }> {
  try {
    const searchParams: NoelLibrarySearchParams | undefined =
      Array.isArray(params)
        ? { situationCodes: params }
        : params

    const [strategies, conversations] = await Promise.all([
      fetchStrategies(message, searchParams),
      fetchConversations(message),
    ])
    return {
      context: formatLibraryContext(strategies, conversations),
      strategies,
    }
  } catch (e) {
    console.warn('[Noel] getNoelLibraryContextWithStrategies erro:', e)
    return { context: '', strategies: [] }
  }
}
