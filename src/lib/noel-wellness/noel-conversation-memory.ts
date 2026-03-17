/**
 * Memória de conversa do Noel — janela deslizante (últimas 8 mensagens).
 *
 * Estratégia: manter apenas as últimas N mensagens por usuário para contexto
 * entre sessões, sem custo de armazenamento crescente.
 *
 * Tabela: noel_conversation_memory
 */

import { supabaseAdmin } from '@/lib/supabase'

const MAX_MESSAGES_PER_USER = 8

export interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Retorna as últimas N mensagens do usuário (ordenadas por created_at ASC).
 */
export async function getRecentMessages(
  userId: string,
  limit: number = MAX_MESSAGES_PER_USER
): Promise<ConversationMessage[]> {
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('noel_conversation_memory')
    .select('message_role, message_content, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) {
    console.warn('[Noel] getRecentMessages erro:', error.message)
    return []
  }

  if (!data || data.length === 0) return []

  return data.map((row) => ({
    role: row.message_role as 'user' | 'assistant',
    content: row.message_content || '',
  }))
}

/**
 * Adiciona uma mensagem e mantém apenas as últimas MAX_MESSAGES_PER_USER.
 * Usa janela deslizante: insere nova, depois remove as mais antigas.
 */
export async function addMessage(
  userId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  if (!supabaseAdmin) return
  if (!content || typeof content !== 'string') return

  const trimmed = content.trim().substring(0, 8000) // Limite por mensagem

  const { error: insertError } = await supabaseAdmin
    .from('noel_conversation_memory')
    .insert({
      user_id: userId,
      message_role: role,
      message_content: trimmed,
    })

  if (insertError) {
    console.warn('[Noel] addMessage insert erro:', insertError.message)
    return
  }

  // Manter janela: deletar mensagens além da 8ª mais antiga
  const { data: toDelete } = await supabaseAdmin
    .from('noel_conversation_memory')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (!toDelete || toDelete.length <= MAX_MESSAGES_PER_USER) return

  const idsToDelete = toDelete
    .slice(0, toDelete.length - MAX_MESSAGES_PER_USER)
    .map((r) => r.id)

  if (idsToDelete.length > 0) {
    await supabaseAdmin
      .from('noel_conversation_memory')
      .delete()
      .in('id', idsToDelete)
  }
}

/**
 * Adiciona par user + assistant de uma vez (após troca completa).
 */
export async function addExchange(
  userId: string,
  userMessage: string,
  assistantResponse: string
): Promise<void> {
  await addMessage(userId, 'user', userMessage)
  await addMessage(userId, 'assistant', assistantResponse)
}
