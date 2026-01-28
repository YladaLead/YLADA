/**
 * Sistema de Agendamento de Mensagens WhatsApp
 * 
 * Gerencia o agendamento, processamento e cancelamento de mensagens
 */

import { supabaseAdmin } from '@/lib/supabase'

export type MessageType = 
  | 'welcome'
  | 'pre_class_24h'
  | 'pre_class_12h'
  | 'pre_class_2h'
  | 'pre_class_30min'
  | 'pre_class_10min'
  | 'reminder_12h'

export type ScheduledMessageStatus = 'pending' | 'sent' | 'cancelled' | 'failed'

export interface ScheduledMessage {
  id: string
  conversation_id?: string | null
  phone?: string | null
  message_type: MessageType
  scheduled_for: string
  status: ScheduledMessageStatus
  message_data: {
    message: string
    session_id?: string
    lead_name?: string
    [key: string]: any
  }
  retry_count: number
  max_retries: number
  error_message?: string | null
  sent_at?: string | null
  cancelled_at?: string | null
  cancelled_reason?: string | null
  created_at: string
  updated_at: string
}

/**
 * Agenda uma mensagem para envio futuro
 */
export async function scheduleMessage(params: {
  conversationId?: string
  phone?: string
  messageType: MessageType
  scheduledFor: Date
  messageData: {
    message: string
    session_id?: string
    lead_name?: string
    [key: string]: any
  }
  maxRetries?: number
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    if (!params.conversationId && !params.phone) {
      return { success: false, error: 'conversationId ou phone é obrigatório' }
    }

    const { data, error } = await supabaseAdmin
      .from('whatsapp_scheduled_messages')
      .insert({
        conversation_id: params.conversationId || null,
        phone: params.phone || null,
        message_type: params.messageType,
        scheduled_for: params.scheduledFor.toISOString(),
        message_data: params.messageData,
        max_retries: params.maxRetries || 3,
        status: 'pending',
      })
      .select('id')
      .single()

    if (error) {
      console.error('[Scheduler] Erro ao agendar mensagem:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: data.id }
  } catch (error: any) {
    console.error('[Scheduler] Erro ao agendar mensagem:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Busca mensagens pendentes que devem ser enviadas agora
 */
export async function getPendingMessages(limit: number = 50): Promise<{
  success: boolean
  messages?: ScheduledMessage[]
  error?: string
}> {
  try {
    const now = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('whatsapp_scheduled_messages')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', now)
      .order('scheduled_for', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('[Scheduler] Erro ao buscar mensagens pendentes:', error)
      return { success: false, error: error.message }
    }

    return { success: true, messages: data as ScheduledMessage[] }
  } catch (error: any) {
    console.error('[Scheduler] Erro ao buscar mensagens pendentes:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Marca mensagem como enviada
 */
export async function markAsSent(
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('whatsapp_scheduled_messages')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', messageId)

    if (error) {
      console.error('[Scheduler] Erro ao marcar como enviada:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('[Scheduler] Erro ao marcar como enviada:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Marca mensagem como falhou
 */
export async function markAsFailed(
  messageId: string,
  errorMessage: string,
  incrementRetry: boolean = true
): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar mensagem atual
    const { data: message } = await supabaseAdmin
      .from('whatsapp_scheduled_messages')
      .select('retry_count, max_retries')
      .eq('id', messageId)
      .single()

    if (!message) {
      return { success: false, error: 'Mensagem não encontrada' }
    }

    const newRetryCount = incrementRetry ? message.retry_count + 1 : message.retry_count
    const shouldMarkAsFailed = newRetryCount >= message.max_retries

    const { error } = await supabaseAdmin
      .from('whatsapp_scheduled_messages')
      .update({
        status: shouldMarkAsFailed ? 'failed' : 'pending',
        retry_count: newRetryCount,
        error_message: errorMessage,
      })
      .eq('id', messageId)

    if (error) {
      console.error('[Scheduler] Erro ao marcar como falhou:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('[Scheduler] Erro ao marcar como falhou:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Cancela mensagens agendadas
 * 
 * @param filters - Filtros para cancelar: conversationId, phone, messageType, etc
 * @param reason - Motivo do cancelamento
 */
export async function cancelScheduledMessages(params: {
  conversationId?: string
  phone?: string
  messageType?: MessageType
  reason?: string
}): Promise<{ success: boolean; cancelled: number; error?: string }> {
  try {
    let query = supabaseAdmin
      .from('whatsapp_scheduled_messages')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_reason: params.reason || 'manual',
      })
      .eq('status', 'pending')

    if (params.conversationId) {
      query = query.eq('conversation_id', params.conversationId)
    }

    if (params.phone) {
      query = query.eq('phone', params.phone)
    }

    if (params.messageType) {
      query = query.eq('message_type', params.messageType)
    }

    const { data, error } = await query.select('id')

    if (error) {
      console.error('[Scheduler] Erro ao cancelar mensagens:', error)
      return { success: false, cancelled: 0, error: error.message }
    }

    return { success: true, cancelled: data?.length || 0 }
  } catch (error: any) {
    console.error('[Scheduler] Erro ao cancelar mensagens:', error)
    return { success: false, cancelled: 0, error: error.message }
  }
}

/**
 * Cancela todas as mensagens pendentes de uma conversa
 * Útil quando a pessoa responde (não precisa mais enviar)
 */
export async function cancelPendingMessagesForConversation(
  conversationId: string,
  reason: string = 'user_responded'
): Promise<{ success: boolean; cancelled: number; error?: string }> {
  return cancelScheduledMessages({
    conversationId,
    reason,
  })
}

/**
 * Cancela todas as mensagens pendentes de um telefone
 * Útil quando a pessoa responde mas ainda não tem conversa criada
 */
export async function cancelPendingMessagesForPhone(
  phone: string,
  reason: string = 'user_responded'
): Promise<{ success: boolean; cancelled: number; error?: string }> {
  return cancelScheduledMessages({
    phone,
    reason,
  })
}
