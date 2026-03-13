/**
 * Busca na biblioteca do Noel (noel_strategy_library + noel_conversation_library)
 * e formata o contexto para o Layer 4 do prompt.
 *
 * Quando profileCodes é passado (perfil detectado antes), as estratégias são
 * preferidas pelos tópicos ligados a esse perfil (PROFILE_STRATEGY_TOPICS).
 * Prioridade: biblioteca Noel → knowledge_base → IA pura.
 * Limite: 3 estratégias, 2 conversas (mantém prompt leve).
 *
 * Ver: docs/NOEL-ESTADO-ATUAL-E-PONTOS-INTEGRACAO-BIBLIOTECA.md
 */

import { supabaseAdmin } from '@/lib/supabase'
import { PROFILE_STRATEGY_TOPICS } from '@/config/noel-strategic-profiles'

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

/**
 * Busca estratégias: se profileCodes informado, prefere topics do perfil; senão usa similaridade com a mensagem.
 * Limite: MAX_STRATEGIES.
 */
async function fetchStrategies(
  message: string,
  profileCodes?: string[]
): Promise<Array<{ strategy: string; example?: string | null }>> {
  const preferredTopics: string[] = []
  if (profileCodes?.length) {
    for (const code of profileCodes) {
      const topics = PROFILE_STRATEGY_TOPICS[code]
      if (topics) preferredTopics.push(...topics)
    }
  }
  const topicsSet = [...new Set(preferredTopics)]

  if (topicsSet.length > 0) {
    const { data } = await supabaseAdmin
      .from('noel_strategy_library')
      .select('strategy, example')
      .in('topic', topicsSet)
      .limit(MAX_STRATEGIES * 2)
    if (data?.length) return data.slice(0, MAX_STRATEGIES)
  }

  const terms = extractSearchTerms(message)
  if (terms.length === 0) {
    const { data } = await supabaseAdmin
      .from('noel_strategy_library')
      .select('strategy, example')
      .limit(MAX_STRATEGIES)
      .order('created_at', { ascending: false })
    return data ?? []
  }

  const orConditions = terms.map(
    (t) => `topic.ilike.%${t}%,problem.ilike.%${t}%,strategy.ilike.%${t}%`
  )

  const { data } = await supabaseAdmin
    .from('noel_strategy_library')
    .select('strategy, example')
    .or(orConditions.join(','))
    .limit(MAX_STRATEGIES * 2)

  if (!data?.length) {
    const { data: fallback } = await supabaseAdmin
      .from('noel_strategy_library')
      .select('strategy, example')
      .limit(MAX_STRATEGIES)
      .order('created_at', { ascending: false })
    return fallback ?? []
  }

  return data.slice(0, MAX_STRATEGIES)
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
 * Monta o texto formatado para o modelo (Estratégias relevantes + Exemplos de conversa).
 * Estrutura ideal sugerida pelo Cláudio para o prompt.
 */
function formatLibraryContext(
  strategies: Array<{ strategy: string; example?: string | null }>,
  conversations: Array<{ user_question: string; good_answer: string }>
): string {
  const parts: string[] = []

  if (strategies.length > 0) {
    const list = strategies
      .map((s, i) => `${i + 1}. ${s.strategy.trim()}${s.example ? ` (ex.: ${s.example.trim()})` : ''}`)
      .join('\n')
    parts.push('Estratégias relevantes:\n' + list)
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
 * @param profileCodes - Códigos dos perfis estratégicos já detectados; quando informado, estratégias são filtradas por topic preferido do perfil.
 */
export async function getNoelLibraryContext(message: string, profileCodes?: string[]): Promise<string> {
  try {
    const [strategies, conversations] = await Promise.all([
      fetchStrategies(message, profileCodes),
      fetchConversations(message),
    ])
    return formatLibraryContext(strategies, conversations)
  } catch (e) {
    console.warn('[Noel] getNoelLibraryContext erro:', e)
    return ''
  }
}
