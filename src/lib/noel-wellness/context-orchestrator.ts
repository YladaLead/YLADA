/**
 * Context Orchestration para o Noel.
 * Decide qual informação enviar para a IA, em que ordem e quanto — contexto enxuto e relevante.
 * Fluxo: Pergunta → Router classifica → Orchestrator seleciona contexto → IA recebe só o necessário.
 *
 * Ver: docs/YLADA-ARQUITETURA-COMPLETA.md
 */

import { classifyIntention, type NoelModule } from './classifier'

/** Intenção refinada para seleção de contexto (mais granular que o módulo). */
export type NoelIntent =
  | 'estrategia'
  | 'ferramenta'
  | 'script'
  | 'diagnostico'
  | 'emocional'
  | 'suporte'

export interface OrchestratedContext {
  consultantContext?: string
  strategicProfileContext?: string
  knowledgeContext?: string | null
  userMessage?: string
  /** Intenção detectada (para logs e métricas). */
  intent: NoelIntent
  /** Módulo do classificador (mentor | suporte | tecnico). */
  module: NoelModule
}

export interface BuildNoelContextOptions {
  /** Retorna contexto de perfil (consultor + estratégico). Se não passar, não injeta perfil. */
  getProfileContext?: (userId: string) => Promise<{
    consultantContext?: string
    strategicProfileContext?: string
  }>
  /** Retorna trecho de conhecimento relevante para a intenção. Se não passar, knowledgeContext fica vazio. */
  getKnowledge?: (message: string, intent: NoelIntent, module: NoelModule) => Promise<string | null>
  /** Últimas N mensagens para contexto de conversa (opcional; manter curto para modelos leves). */
  recentMessages?: Array<{ role: 'user' | 'assistant'; content: string }>
}

/**
 * Classifica a intenção para seleção de contexto (mais granular que mentor/suporte/tecnico).
 * Usado pelo orchestrator para decidir o que buscar (estratégia, diagnóstico, script, etc.).
 */
export function classifyIntentForContext(message: string): { intent: NoelIntent; module: NoelModule } {
  const lower = message.toLowerCase().trim()
  const classification = classifyIntention(message)
  const { module } = classification

  if (module === 'suporte') {
    return { intent: 'suporte', module }
  }

  if (
    /(criar|criando|fazer|montar|estrutura)\s*(um\s*)?(diagnóstico|diagnostico|quiz)/i.test(lower) ||
    /(diagnóstico|diagnostico)\s*(para|de)\s*/i.test(lower) ||
    /como\s*criar\s*(um\s*)?(diagnóstico|diagnostico)/i.test(lower)
  ) {
    return { intent: 'diagnostico', module: module === 'mentor' ? 'mentor' : module }
  }

  if (
    /(script|mensagem|texto)\s*(para|de|como)/i.test(lower) ||
    /(link|ferramenta|calculadora|quiz)\s*(de|para)/i.test(lower) ||
    /(me\s*d[ae]\s*)?(um\s*)?(script|link)/i.test(lower)
  ) {
    return { intent: 'script', module }
  }

  if (
    /(ferramenta|calculadora|quiz|biblioteca)\s*(como|qual|onde)/i.test(lower) ||
    /como\s*(usar|acessar|encontrar)\s*(a\s*)?(ferramenta|calculadora)/i.test(lower)
  ) {
    return { intent: 'ferramenta', module }
  }

  if (
    /(desanimado|desânimo|frustrado|inseguro|motivação|motivar|apoio)/i.test(lower) ||
    /(não\s*consigo|nunca\s*consigo|estou\s*pensando)/i.test(lower)
  ) {
    return { intent: 'emocional', module }
  }

  return { intent: 'estrategia', module }
}

/**
 * Monta o contexto orquestrado para o Noel: apenas o que é relevante para a pergunta.
 * 1) Classifica intenção
 * 2) Busca perfil (se getProfileContext fornecido)
 * 3) Busca conhecimento relevante (se getKnowledge fornecido e conforme intenção)
 * 4) Retorna objeto pronto para buildContextLayer().
 */
export async function buildNoelContext(
  userId: string,
  userMessage: string,
  options: BuildNoelContextOptions = {}
): Promise<OrchestratedContext> {
  const { getProfileContext, getKnowledge } = options
  const { intent, module } = classifyIntentForContext(userMessage)

  let consultantContext: string | undefined
  let strategicProfileContext: string | undefined
  let knowledgeContext: string | null = null

  if (getProfileContext) {
    try {
      const profile = await getProfileContext(userId)
      consultantContext = profile.consultantContext
      strategicProfileContext = profile.strategicProfileContext
    } catch (e) {
      console.warn('[Noel] Context Orchestrator: erro ao buscar perfil', e)
    }
  }

  if (getKnowledge) {
    try {
      const knowledge = await getKnowledge(userMessage, intent, module)
      knowledgeContext = knowledge ?? null
    } catch (e) {
      console.warn('[Noel] Context Orchestrator: erro ao buscar conhecimento', e)
    }
  }

  return {
    consultantContext,
    strategicProfileContext,
    knowledgeContext,
    userMessage,
    intent,
    module,
  }
}

/**
 * Seleciona quanto conhecimento incluir no contexto conforme a intenção (contexto enxuto).
 * Evita mandar tudo sempre; modelos leves respondem melhor com menos contexto.
 */
export function selectKnowledgeContext(
  items: Array<{ title?: string; content: string; category?: string }>,
  intent: NoelIntent
): string | null {
  if (items.length === 0) return null
  const maxItems = intent === 'script' ? 3 : intent === 'diagnostico' ? 2 : intent === 'estrategia' ? 2 : 1
  const slice = items.slice(0, maxItems)
  return slice
    .map((item) => `**${item.title || item.category || 'Conteúdo'}**:\n${item.content}`)
    .join('\n\n---\n\n')
}

/**
 * Mapeia profissão/segmento para tema de conhecimento (ex.: nutricionista → nutrição).
 * Usado para o Noel parecer especialista por área quando houver bibliotecas por segmento.
 */
export function segmentForProfession(profession: string | null | undefined): string {
  if (!profession) return 'geral'
  const p = profession.toLowerCase()
  if (p.includes('nutri')) return 'nutrição'
  if (p.includes('estética') || p.includes('estetica')) return 'estética'
  if (p.includes('psi')) return 'comportamento'
  if (p.includes('vend') || p.includes('comercial')) return 'vendas'
  if (p.includes('med') || p.includes('médico')) return 'medicina'
  return 'geral'
}
