/**
 * Worker - Processa mensagens agendadas
 * 
 * Busca mensagens pendentes e envia via Z-API
 */

import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import { getPendingMessages, markAsSent, markAsFailed, ScheduledMessage } from './scheduler'
import { sendWhatsAppMessage, isAllowedTimeToSendMessage } from '../whatsapp-carol-ai'

/**
 * Processa mensagens agendadas pendentes
 * 
 * @param limit - Número máximo de mensagens para processar
 * @returns Resultado do processamento
 */
export async function processScheduledMessages(limit: number = 50): Promise<{
  processed: number
  sent: number
  failed: number
  cancelled: number
  errors: number
}> {
  try {
    // 1. Buscar mensagens pendentes
    const { success, messages, error } = await getPendingMessages(limit)

    if (!success || !messages || messages.length === 0) {
      return { processed: 0, sent: 0, failed: 0, cancelled: 0, errors: 0 }
    }

    if (error) {
      console.error('[Worker] Erro ao buscar mensagens pendentes:', error)
      return { processed: 0, sent: 0, failed: 0, cancelled: 0, errors: 1 }
    }

    let processed = 0
    let sent = 0
    let failed = 0
    let cancelled = 0
    let errors = 0

    // 2. Processar cada mensagem
    for (const message of messages) {
      try {
        processed++

        // Verificar se foi cancelada (pode ter sido cancelada enquanto estava na fila)
        if (message.status === 'cancelled') {
          cancelled++
          continue
        }

        // Buscar instância Z-API
        const area = message.conversation_id 
          ? await getAreaFromConversation(message.conversation_id)
          : 'nutri' // Default para nutri

        const instance = await getZApiInstance(area)
        if (!instance) {
          await markAsFailed(message.id, 'Instância Z-API não encontrada')
          failed++
          errors++
          continue
        }

        // Buscar telefone
        let phone: string | null = null
        if (message.conversation_id) {
          const { data: conv } = await supabaseAdmin
            .from('whatsapp_conversations')
            .select('phone')
            .eq('id', message.conversation_id)
            .single()
          
          phone = conv?.phone || null
        } else if (message.phone) {
          phone = message.phone
        }

        if (!phone) {
          await markAsFailed(message.id, 'Telefone não encontrado')
          failed++
          errors++
          continue
        }

        // Verificar se está em horário permitido para enviar
        const timeCheck = isAllowedTimeToSendMessage()
        if (!timeCheck.allowed) {
          // Se não está em horário permitido, verificar se a mensagem já passou do horário agendado
          const scheduledFor = new Date(message.scheduled_for)
          const now = new Date()
          
          // Se a mensagem foi agendada para um horário específico e ainda não passou, manter pendente
          if (now < scheduledFor) {
            // Ainda não é hora de enviar, manter pendente
            continue
          }
          
          // Se já passou do horário agendado mas não está em horário permitido,
          // reagendar para o próximo horário permitido
          const nextAllowedTime = timeCheck.nextAllowedTime || new Date(Date.now() + 24 * 60 * 60 * 1000)
          
          await supabaseAdmin
            .from('whatsapp_scheduled_messages')
            .update({
              scheduled_for: nextAllowedTime.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', message.id)
          
          console.log(`[Worker] ⏰ Mensagem ${message.id} reagendada para ${nextAllowedTime.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} - ${timeCheck.reason}`)
          continue
        }

        // Verificar se pessoa já respondeu (cancelar se sim)
        if (message.conversation_id) {
          const { data: recentMessage } = await supabaseAdmin
            .from('whatsapp_messages')
            .select('id, created_at')
            .eq('conversation_id', message.conversation_id)
            .eq('sender_type', 'customer')
            .gte('created_at', message.created_at) // Mensagem depois que foi agendada
            .limit(1)
            .maybeSingle()

          if (recentMessage) {
            // Pessoa respondeu, cancelar
            await supabaseAdmin
              .from('whatsapp_scheduled_messages')
              .update({
                status: 'cancelled',
                cancelled_at: new Date().toISOString(),
                cancelled_reason: 'user_responded',
              })
              .eq('id', message.id)
            
            cancelled++
            continue
          }
        }

        // Enviar mensagem
        const messageText = message.message_data?.message || ''
        if (!messageText) {
          await markAsFailed(message.id, 'Mensagem vazia')
          failed++
          errors++
          continue
        }

        const sendResult = await sendWhatsAppMessage(
          phone,
          messageText,
          instance.instance_id,
          instance.token
        )

        if (sendResult.success) {
          // Marcar como enviada
          await markAsSent(message.id)

          // Criar/atualizar conversa se necessário
          if (message.conversation_id) {
            // Atualizar última mensagem
            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                last_message_at: new Date().toISOString(),
                last_message_from: 'bot',
              })
              .eq('id', message.conversation_id)

            // Salvar mensagem no histórico
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: message.conversation_id,
              instance_id: instance.id,
              z_api_message_id: sendResult.messageId || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message: messageText,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })
          } else {
            // Criar conversa se não existe
            const contactKey = String(phone || '').replace(/\D/g, '')
            const { data: existingConv } = await supabaseAdmin
              .from('whatsapp_conversations')
              .select('id')
              .eq('contact_key', contactKey)
              .eq('instance_id', instance.id)
              .maybeSingle()

            if (!existingConv) {
              const { data: newConv } = await supabaseAdmin
                .from('whatsapp_conversations')
                .insert({
                  phone,
                  contact_key: contactKey,
                  instance_id: instance.id,
                  area: 'nutri',
                  name: message.message_data?.lead_name || null,
                  context: {
                    tags: message.message_type === 'welcome' 
                      ? ['veio_aula_pratica', 'primeiro_contato']
                      : [],
                    source: 'automation',
                  },
                })
                .select('id')
                .single()

              if (newConv) {
                // Salvar mensagem
                await supabaseAdmin.from('whatsapp_messages').insert({
                  conversation_id: newConv.id,
                  instance_id: instance.id,
                  z_api_message_id: sendResult.messageId || null,
                  sender_type: 'bot',
                  sender_name: 'Carol - Secretária',
                  message: messageText,
                  message_type: 'text',
                  status: 'sent',
                  is_bot_response: true,
                })
              }
            }
          }

          sent++

          // Delay entre mensagens
          await new Promise(resolve => setTimeout(resolve, 2000))
        } else {
          // Falhou ao enviar
          await markAsFailed(message.id, sendResult.error || 'Erro ao enviar mensagem')
          failed++
          errors++
        }
      } catch (error: any) {
        console.error(`[Worker] Erro ao processar mensagem ${message.id}:`, error)
        await markAsFailed(message.id, error.message || 'Erro desconhecido')
        failed++
        errors++
      }
    }

    return { processed, sent, failed, cancelled, errors }
  } catch (error: any) {
    console.error('[Worker] Erro ao processar mensagens agendadas:', error)
    return { processed: 0, sent: 0, failed: 0, cancelled: 0, errors: 1 }
  }
}

/**
 * Helper: Buscar área da conversa
 */
async function getAreaFromConversation(conversationId: string): Promise<string> {
  try {
    const { data } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('area')
      .eq('id', conversationId)
      .single()

    return data?.area || 'nutri'
  } catch {
    return 'nutri'
  }
}

/**
 * Helper: Buscar instância Z-API
 */
async function getZApiInstance(area: string) {
  // Primeiro tenta buscar por área e status connected
  let { data: instance } = await supabaseAdmin
    .from('z_api_instances')
    .select('id, instance_id, token')
    .eq('area', area)
    .eq('status', 'connected')
    .limit(1)
    .maybeSingle()

  // Se não encontrou, tenta buscar apenas por área
  if (!instance) {
    const { data: instanceByArea } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .limit(1)
      .maybeSingle()
    
    if (instanceByArea) {
      instance = instanceByArea
    }
  }

  // Se ainda não encontrou, tenta buscar qualquer instância conectada
  if (!instance) {
    const { data: instanceFallback } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()
    
    if (instanceFallback) {
      instance = instanceFallback
    }
  }

  return instance
}
