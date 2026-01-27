/**
 * Sistema de Notificações Pré-Aula
 * Agenda notificações 24h, 12h, 2h e 30min antes da aula
 */

import { supabaseAdmin } from '@/lib/supabase'
import { scheduleMessage, cancelPendingMessagesForConversation } from './scheduler'
import { formatSessionDateTime, getRegistrationName, getFirstName } from '../whatsapp-carol-ai'

/**
 * Agenda notificações pré-aula quando alguém agenda uma sessão
 * 
 * @param conversationId - ID da conversa
 * @param sessionId - ID da sessão agendada
 */
export async function schedulePreClassNotifications(
  conversationId: string,
  sessionId: string
): Promise<{ success: boolean; scheduled: number; error?: string }> {
  try {
    // 1. Buscar conversa e sessão
    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('id', conversationId)
      .single()

    if (!conversation) {
      return { success: false, scheduled: 0, error: 'Conversa não encontrada' }
    }

    const { data: session } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, title, starts_at, zoom_link')
      .eq('id', sessionId)
      .single()

    if (!session) {
      return { success: false, scheduled: 0, error: 'Sessão não encontrada' }
    }

    // 2. Buscar nome do lead
    const registrationName = await getRegistrationName(conversation.phone, 'nutri')
    const leadName = getFirstName(registrationName || conversation.name) || 'querido(a)'

    // 3. Formatar data/hora da sessão
    const { weekday, date, time } = formatSessionDateTime(session.starts_at)
    const sessionDate = new Date(session.starts_at)

    // 4. Cancelar notificações pré-aula anteriores (se houver)
    await cancelPendingMessagesForConversation(conversationId, 'session_rescheduled')

    // 5. Agendar as 4 notificações
    let scheduled = 0

    // Notificação 24h antes
    const date24h = new Date(sessionDate.getTime() - 24 * 60 * 60 * 1000)
    const message24h = `Olá ${leadName}! 👋

Lembrete: Sua aula é amanhã!

🗓️ ${weekday}, ${date}
🕒 ${time} (horário de Brasília)

🔗 ${session.zoom_link}

Nos vemos lá! 😊`

    const result24h = await scheduleMessage({
      conversationId,
      messageType: 'pre_class_24h',
      scheduledFor: date24h,
      messageData: {
        message: message24h,
        session_id: sessionId,
        lead_name: leadName,
      },
    })
    if (result24h.success) scheduled++

    // Notificação 12h antes
    const date12h = new Date(sessionDate.getTime() - 12 * 60 * 60 * 1000)
    const message12h = `Olá ${leadName}! 

Sua aula é hoje às ${time}! 

💻 *Recomendação importante:*

O ideal é participar pelo computador ou notebook, pois:
* Compartilhamos slides
* Fazemos explicações visuais
* É importante acompanhar e anotar

Pelo celular, a experiência fica limitada e você pode perder partes importantes da aula.

🔗 ${session.zoom_link}`

    const result12h = await scheduleMessage({
      conversationId,
      messageType: 'pre_class_12h',
      scheduledFor: date12h,
      messageData: {
        message: message12h,
        session_id: sessionId,
        lead_name: leadName,
      },
    })
    if (result12h.success) scheduled++

    // Notificação 2h antes
    const date2h = new Date(sessionDate.getTime() - 2 * 60 * 60 * 1000)
    const message2h = `Olá ${leadName}! 

Sua aula começa em 2 horas! ⏰

⚠️ *Aviso importante:*

A sala do Zoom será aberta 10 minutos antes do horário da aula.

⏰ Após o início da aula, não será permitido entrar, ok?

Isso porque os 10 primeiros minutos são essenciais:
é nesse momento que identificamos os principais desafios das participantes para que a aula seja realmente prática e personalizada.

🔗 ${session.zoom_link}

Nos vemos em breve! 😊`

    const result2h = await scheduleMessage({
      conversationId,
      messageType: 'pre_class_2h',
      scheduledFor: date2h,
      messageData: {
        message: message2h,
        session_id: sessionId,
        lead_name: leadName,
      },
    })
    if (result2h.success) scheduled++

    // Notificação 30min antes
    const date30min = new Date(sessionDate.getTime() - 30 * 60 * 1000)
    const message30min = `Olá ${leadName}! 

A sala já está aberta! 🎉

🔗 ${session.zoom_link}

Você pode entrar agora e já começar a se preparar! 

Nos vemos em breve! 😊`

    const result30min = await scheduleMessage({
      conversationId,
      messageType: 'pre_class_30min',
      scheduledFor: date30min,
      messageData: {
        message: message30min,
        session_id: sessionId,
        lead_name: leadName,
      },
    })
    if (result30min.success) scheduled++

    return { success: true, scheduled }
  } catch (error: any) {
    console.error('[Pre-Class] Erro ao agendar notificações:', error)
    return { success: false, scheduled: 0, error: error.message }
  }
}

/**
 * Cancela notificações pré-aula quando sessão é cancelada ou reagendada
 */
export async function cancelPreClassNotifications(
  conversationId: string,
  reason: string = 'session_cancelled'
): Promise<void> {
  try {
    await cancelPendingMessagesForConversation(conversationId, reason)
  } catch (error: any) {
    console.error('[Pre-Class] Erro ao cancelar notificações:', error)
  }
}
