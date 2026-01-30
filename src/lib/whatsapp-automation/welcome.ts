/**
 * Sistema de Boas-vindas
 * Agenda mensagens de boas-vindas para leads que preencheram workshop
 */

import { supabaseAdmin } from '@/lib/supabase'
import { scheduleMessage, cancelPendingMessagesForPhone } from './scheduler'
import { isAllowedTimeToSendMessage, getFirstName } from '../whatsapp-carol-ai'

/**
 * Agenda boas-vindas para leads que preencheram workshop mas não têm conversa ativa
 * 
 * Esta função pode ser chamada:
 * - Manualmente (botão admin)
 * - Quando detectar lead novo (event-driven)
 * - Verificação periódica (worker on-demand)
 */
export async function scheduleWelcomeMessages(): Promise<{
  scheduled: number
  skipped: number
  errors: number
}> {
  try {
    // Verificar se está em horário permitido
    const timeCheck = isAllowedTimeToSendMessage()
    const scheduledFor = timeCheck.allowed 
      ? new Date() // Se está em horário permitido, agendar para agora
      : (timeCheck.nextAllowedTime || new Date(Date.now() + 24 * 60 * 60 * 1000)) // Senão, próximo horário permitido
    
    if (!timeCheck.allowed) {
      console.log('[Welcome] ⏰ Fora do horário permitido, agendando para:', {
        reason: timeCheck.reason,
        nextAllowedTime: scheduledFor.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      })
    }

    // 1. Buscar leads dos últimos 7 dias
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    
    let workshopLeads: Array<{ nome: string; telefone: string; created_at: string }> = []
    
    // Tentar buscar de workshop_inscricoes primeiro
    const { data: inscricoes } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('nome, telefone, created_at')
      .eq('status', 'inscrito')
      .gte('created_at', seteDiasAtras)
      .order('created_at', { ascending: false })
    
    if (inscricoes && inscricoes.length > 0) {
      workshopLeads = inscricoes
        .filter((i: any) => i.telefone)
        .map((i: any) => ({
          nome: i.nome || 'Cliente',
          telefone: i.telefone,
          created_at: i.created_at,
        }))
    } else {
      // Fallback: buscar de leads
      const { data: leads } = await supabaseAdmin
        .from('leads')
        .select('nome, telefone, created_at')
        .or('source.eq.workshop_agenda_instavel_landing_page,source.ilike.%workshop%')
        .gte('created_at', seteDiasAtras)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (leads) {
        workshopLeads = leads
          .filter((l: any) => l.telefone)
          .map((l: any) => ({
            nome: l.nome || 'Cliente',
            telefone: l.telefone,
            created_at: l.created_at,
          }))
      }
    }

    if (!workshopLeads || workshopLeads.length === 0) {
      return { scheduled: 0, skipped: 0, errors: 0 }
    }

    // 2. Buscar próximas sessões (mesma regra do form/Carol: próxima + manhã 9h/10h quando existir)
    const { data: allSessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('title, starts_at, zoom_link')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(8)
    const list = allSessions || []
    const hourBR = (startsAt: string) =>
      parseInt(new Date(startsAt).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false }), 10)
    const isManha = (s: { starts_at: string }) => (hourBR(s.starts_at) === 9 || hourBR(s.starts_at) === 10)
    const first = list[0]
    const soonestManha = list.find(isManha)
    const second = soonestManha && soonestManha.starts_at !== first?.starts_at ? soonestManha : list[1]
    const sessions = first && second ? [first, second] : first ? [first] : []

    // 3. Verificar quais precisam de boas-vindas e agendar
    let scheduled = 0
    let skipped = 0
    let errors = 0

    for (const lead of workshopLeads) {
      try {
        if (!lead.telefone) {
          skipped++
          continue
        }

        const phoneClean = lead.telefone.replace(/\D/g, '')
        if (phoneClean.length < 10) {
          skipped++
          continue
        }

        const phoneFormatted = phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`
        const contactKey = phoneFormatted.replace(/\D/g, '')

        // Verificar se já tem conversa com mensagem do cliente
        const { data: conversation } = await supabaseAdmin
          .from('whatsapp_conversations')
          .select('id')
          .eq('contact_key', contactKey)
          .eq('area', 'nutri')
          .maybeSingle()

        let shouldSchedule = false

        if (!conversation) {
          // Não tem conversa, precisa receber boas-vindas
          shouldSchedule = true
        } else {
          // Verificar se cliente já enviou mensagem
          const { data: customerMessage } = await supabaseAdmin
            .from('whatsapp_messages')
            .select('id')
            .eq('conversation_id', conversation.id)
            .eq('sender_type', 'customer')
            .limit(1)
            .maybeSingle()

          if (!customerMessage) {
            // Tem conversa mas cliente nunca enviou mensagem
            shouldSchedule = true
          }
        }

        // Verificar se já tem boas-vindas agendada
        if (shouldSchedule) {
          const { data: existingSchedule } = await supabaseAdmin
            .from('whatsapp_scheduled_messages')
            .select('id')
            .eq('phone', phoneFormatted)
            .eq('message_type', 'welcome')
            .in('status', ['pending', 'sent'])
            .maybeSingle()

          if (existingSchedule) {
            // Já tem agendada, pular
            skipped++
            continue
          }

          // Formatar opções de aula (horário de Brasília para não sair 18h/12h em UTC)
          let optionsText = ''
          const tz = 'America/Sao_Paulo'
          if (sessions && sessions.length > 0) {
            sessions.forEach((session, index) => {
              const date = new Date(session.starts_at)
              const weekday = date.toLocaleDateString('pt-BR', { timeZone: tz, weekday: 'long' })
              const dateStr = date.toLocaleDateString('pt-BR', { timeZone: tz, day: '2-digit', month: '2-digit', year: 'numeric' })
              const time = date.toLocaleTimeString('pt-BR', { timeZone: tz, hour: '2-digit', minute: '2-digit' })
              optionsText += `\n🗓️ **Opção ${index + 1}:**\n${weekday}, ${dateStr}\n🕒 ${time} (Brasília)\n🔗 ${session.zoom_link}\n`
            })
          }

          const firstName = getFirstName(lead.nome) || lead.nome
          const welcomeMessage = `Olá ${firstName}, seja bem-vindo! 👋

Obrigada por fazer sua inscrição na Aula Prática ao Vivo de Como Encher a Agenda! 🎉

Aqui estão as duas próximas opções de aula:

${optionsText}✅ Se precisar reagendar, responda REAGENDAR.

Qualquer dúvida, é só me chamar! 💚`

          // Agendar mensagem (scheduledFor já foi definido no início da função)

          const result = await scheduleMessage({
            phone: phoneFormatted,
            messageType: 'welcome',
            scheduledFor,
            messageData: {
              message: welcomeMessage,
              lead_name: lead.nome,
            },
          })

          if (result.success) {
            scheduled++
          } else {
            errors++
            console.error(`[Welcome] Erro ao agendar para ${phoneFormatted}:`, result.error)
          }
        } else {
          skipped++
        }
      } catch (error: any) {
        console.error(`[Welcome] Erro ao processar lead ${lead.telefone}:`, error)
        errors++
      }
    }

    return { scheduled, skipped, errors }
  } catch (error: any) {
    console.error('[Welcome] Erro ao processar leads:', error)
    return { scheduled: 0, skipped: 0, errors: 1 }
  }
}

/**
 * Cancela boas-vindas agendadas quando pessoa responde
 * Chamado automaticamente quando recebe mensagem do cliente
 */
export async function cancelWelcomeIfResponded(phone: string): Promise<void> {
  try {
    await cancelPendingMessagesForPhone(phone, 'user_responded')
  } catch (error: any) {
    console.error('[Welcome] Erro ao cancelar boas-vindas:', error)
  }
}
