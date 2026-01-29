/**
 * Diagnóstico e Ativação da Carol em Conversas Existentes
 * 
 * Analisa conversas antigas e prepara para ativação da Carol
 */

import { supabaseAdmin } from '@/lib/supabase'

export interface ConversationDiagnostic {
  conversationId: string
  phone: string
  name: string | null
  totalMessages: number
  customerMessages: number
  agentMessages: number
  botMessages: number
  firstMessageFrom: 'customer' | 'agent' | 'bot' | 'unknown'
  lastMessageFrom: 'customer' | 'agent' | 'bot' | 'unknown'
  hasWorkshopContext: boolean
  suggestedTags: string[]
  currentTags: string[]
  canActivateCarol: boolean
  reason?: string
  firstMessageDate: string | null
  lastMessageDate: string | null
  area: string | null
}

/**
 * Diagnostica uma conversa específica
 */
export async function diagnoseConversation(
  conversationId: string
): Promise<ConversationDiagnostic | null> {
  try {
    // 1. Buscar conversa
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, area, context, created_at')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      console.error('[Diagnóstico] Erro ao buscar conversa:', convError)
      return null
    }

    // 2. Buscar todas as mensagens
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('id, sender_type, message, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('[Diagnóstico] Erro ao buscar mensagens:', messagesError)
      return null
    }

    const allMessages = messages || []
    const customerMessages = allMessages.filter(m => m.sender_type === 'customer')
    const agentMessages = allMessages.filter(m => m.sender_type === 'agent')
    const botMessages = allMessages.filter(m => m.sender_type === 'bot')

    // 3. Determinar quem começou
    const firstMessage = allMessages[0]
    const firstMessageFrom: 'customer' | 'agent' | 'bot' | 'unknown' = 
      firstMessage?.sender_type === 'customer' ? 'customer' :
      firstMessage?.sender_type === 'agent' ? 'agent' :
      firstMessage?.sender_type === 'bot' ? 'bot' : 'unknown'

    // 4. Última mensagem
    const lastMessage = allMessages[allMessages.length - 1]
    const lastMessageFrom: 'customer' | 'agent' | 'bot' | 'unknown' = 
      lastMessage?.sender_type === 'customer' ? 'customer' :
      lastMessage?.sender_type === 'agent' ? 'agent' :
      lastMessage?.sender_type === 'bot' ? 'bot' : 'unknown'

    // 5. Verificar contexto de workshop
    const context = conversation.context || {}
    const currentTags = Array.isArray(context.tags) ? context.tags : []
    const hasWorkshopContext = 
      currentTags.includes('recebeu_link_workshop') ||
      currentTags.includes('agendou_aula') ||
      currentTags.includes('participou_aula') ||
      currentTags.includes('nao_participou_aula') ||
      !!context.workshop_session_id

    // 6. Sugerir tags baseado no histórico
    const suggestedTags: string[] = []
    
    // Tag de quem começou (adicionar apenas se não existir)
    if (firstMessageFrom === 'customer' && !currentTags.includes('cliente_iniciou')) {
      suggestedTags.push('cliente_iniciou')
    } else if (firstMessageFrom === 'agent' && !currentTags.includes('agente_iniciou')) {
      suggestedTags.push('agente_iniciou')
    }

    // Tag se já recebeu link
    if (hasWorkshopContext) {
      if (currentTags.includes('recebeu_link_workshop')) {
        suggestedTags.push('recebeu_link_workshop')
      }
      if (currentTags.includes('agendou_aula')) {
        suggestedTags.push('agendou_aula')
      }
      if (currentTags.includes('participou_aula')) {
        suggestedTags.push('participou_aula')
      }
      if (currentTags.includes('nao_participou_aula')) {
        suggestedTags.push('nao_participou_aula')
      }
    }

    // Tag se última mensagem foi do cliente (aguardando resposta)
    if (lastMessageFrom === 'customer') {
      suggestedTags.push('aguardando_resposta')
    }

    // 7. Verificar se pode ativar Carol
    let canActivateCarol = true
    let reason: string | undefined

    // Não ativar se já tem tag que indica que não deve usar Carol
    if (currentTags.includes('carol_disabled') || currentTags.includes('atendimento_manual')) {
      canActivateCarol = false
      reason = 'Conversa marcada para atendimento manual'
    }

    // Não ativar se área não é nutri (por enquanto Carol só funciona em nutri)
    if (conversation.area && conversation.area !== 'nutri') {
      canActivateCarol = false
      reason = `Área "${conversation.area}" não suporta Carol (apenas nutri)`
    }

    return {
      conversationId: conversation.id,
      phone: conversation.phone,
      name: conversation.name,
      totalMessages: allMessages.length,
      customerMessages: customerMessages.length,
      agentMessages: agentMessages.length,
      botMessages: botMessages.length,
      firstMessageFrom,
      lastMessageFrom,
      hasWorkshopContext,
      suggestedTags: [...new Set(suggestedTags)], // Remover duplicatas
      currentTags,
      canActivateCarol,
      reason,
      firstMessageDate: firstMessage?.created_at || null,
      lastMessageDate: lastMessage?.created_at || null,
      area: conversation.area,
    }
  } catch (error: any) {
    console.error('[Diagnóstico] Erro ao diagnosticar conversa:', error)
    return null
  }
}

/**
 * Diagnostica múltiplas conversas
 */
export async function diagnoseMultipleConversations(
  conversationIds: string[]
): Promise<ConversationDiagnostic[]> {
  const diagnostics: ConversationDiagnostic[] = []
  
  for (const id of conversationIds) {
    const diagnostic = await diagnoseConversation(id)
    if (diagnostic) {
      diagnostics.push(diagnostic)
    }
  }
  
  return diagnostics
}

/**
 * Ativa Carol em uma conversa (adiciona tags e prepara contexto).
 * @param force - Se true, remove carol_disabled/atendimento_manual e ativa mesmo quando o diagnóstico bloqueia por "atendimento manual"
 */
export async function activateCarolInConversation(
  conversationId: string,
  tagsToAdd: string[] = [],
  force: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Diagnosticar primeiro
    const diagnostic = await diagnoseConversation(conversationId)
    
    if (!diagnostic) {
      return { success: false, error: 'Conversa não encontrada' }
    }

    const blockedByManual = !diagnostic.canActivateCarol && (
      diagnostic.reason === 'Conversa marcada para atendimento manual'
    )
    if (!diagnostic.canActivateCarol && !(force && blockedByManual)) {
      return { 
        success: false, 
        error: diagnostic.reason || 'Não é possível ativar Carol nesta conversa' 
      }
    }

    // 2. Buscar contexto atual
    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('context')
      .eq('id', conversationId)
      .single()

    if (!conversation) {
      return { success: false, error: 'Conversa não encontrada' }
    }

    const currentContext = conversation.context || {}
    let currentTags = Array.isArray(currentContext.tags) ? currentContext.tags : []
    // Forçar ativação: remover tags que bloqueiam
    if (force && blockedByManual) {
      currentTags = currentTags.filter(
        (t: string) => t !== 'carol_disabled' && t !== 'atendimento_manual'
      )
    }

    // 3. Combinar tags sugeridas + tags fornecidas + tags atuais (sem duplicatas)
    const allTags = [...new Set([
      ...diagnostic.suggestedTags,
      ...tagsToAdd,
      ...currentTags,
      'carol_ativa' // Tag indicando que Carol está ativa
    ])]

    // 4. Atualizar contexto
    const { error: updateError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        context: {
          ...currentContext,
          tags: allTags,
          carol_activated_at: new Date().toISOString(),
        },
      })
      .eq('id', conversationId)

    if (updateError) {
      console.error('[Ativação Carol] Erro ao atualizar conversa:', updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('[Ativação Carol] Erro:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Ativa Carol em múltiplas conversas
 */
export async function activateCarolInMultipleConversations(
  conversationIds: string[],
  tagsToAdd: string[] = [],
  force: boolean = false
): Promise<{ 
  success: number
  errors: number
  results: Array<{ conversationId: string; success: boolean; error?: string }>
}> {
  const results: Array<{ conversationId: string; success: boolean; error?: string }> = []
  let success = 0
  let errors = 0

  for (const id of conversationIds) {
    const result = await activateCarolInConversation(id, tagsToAdd, force)
    results.push({
      conversationId: id,
      success: result.success,
      error: result.error,
    })
    
    if (result.success) {
      success++
    } else {
      errors++
    }
  }

  return { success, errors, results }
}
