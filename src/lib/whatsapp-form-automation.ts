/**
 * Automação de WhatsApp para formulários
 * Envia mensagem automática quando formulário é preenchido
 */

import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'

/**
 * Formata data/hora da sessão em PT-BR
 */
function formatSessionPtBR(startsAtIso: string) {
  const d = new Date(startsAtIso)
  const weekday = d.toLocaleDateString('pt-BR', { weekday: 'long' })
  const date = d.toLocaleDateString('pt-BR')
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return { weekday, date, time }
}

/**
 * Envia mensagem automática de workshop para lead criado via formulário
 */
export async function sendWorkshopInviteToFormLead(
  phone: string,
  leadName: string,
  area: string = 'nutri',
  userId: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    // 1. Buscar próxima sessão ativa
    const { data: session } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('*')
      .eq('area', area)
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (!session) {
      console.log('[Form Automation] ⚠️ Nenhuma sessão ativa encontrada para área:', area)
      return { success: false, error: 'Nenhuma sessão ativa encontrada' }
    }

    // 2. Buscar configurações (flyer, etc)
    const { data: settings } = await supabaseAdmin
      .from('whatsapp_workshop_settings')
      .select('*')
      .eq('area', area)
      .maybeSingle()

    // 3. Buscar instância Z-API para a área
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      console.error('[Form Automation] ❌ Instância Z-API não encontrada para área:', area)
      return { success: false, error: 'Instância WhatsApp não configurada' }
    }

    const client = createZApiClient(instance.instance_id, instance.token)

    // 4. Formatar mensagem
    const { weekday, date, time } = formatSessionPtBR(session.starts_at)
    const greeting = leadName ? `Olá ${leadName}! 👋\n\n` : 'Olá! 👋\n\n'
    const messageText = `${greeting}Obrigada por preencher o formulário! 

🗓️ ${session.title}

📅 ${weekday}, ${date}
🕒 ${time} (Brasília)
🔗 ${session.zoom_link}

✅ Se precisar reagendar, responda REAGENDAR.`

    // 5. Enviar flyer (se configurado)
    if (settings?.flyer_url) {
      const caption = settings.flyer_caption?.trim()
        ? settings.flyer_caption
        : `${session.title}\n${weekday}, ${date} • ${time}`

      const flyerResult = await client.sendImageMessage({
        phone,
        image: settings.flyer_url,
        caption,
      })

      if (!flyerResult.success) {
        console.error('[Form Automation] ❌ Erro ao enviar flyer:', flyerResult.error)
        // Continuar mesmo se flyer falhar
      } else {
        console.log('[Form Automation] ✅ Flyer enviado com sucesso')
      }
    }

    // 6. Enviar mensagem de texto
    const result = await client.sendTextMessage({
      phone,
      message: messageText,
    })

    if (!result.success) {
      console.error('[Form Automation] ❌ Erro ao enviar mensagem:', result.error)
      return { success: false, error: result.error || 'Erro ao enviar mensagem' }
    }

    // 7. Criar ou atualizar conversa
    let conversationId: string | null = null

    // Buscar conversa existente
    const { data: existingConv } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id')
      .eq('phone', phone)
      .eq('instance_id', instance.id)
      .maybeSingle()

    if (existingConv) {
      conversationId = existingConv.id
      // Atualizar conversa existente com tags e contexto
      const prevContext = (existingConv.context || {}) as any
      const prevTags = Array.isArray(prevContext.tags) ? prevContext.tags : []
      
      // Adicionar tags se não existirem (em português)
      const newTags = [...new Set([...prevTags, 'veio_aula_pratica', 'recebeu_link_workshop', 'primeiro_contato'])]
      
      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context: {
            ...prevContext,
            workshop_session_id: session.id,
            source: 'form_automation',
            form_lead: true,
            tags: newTags,
          },
        })
        .eq('id', conversationId)
    } else {
      // Criar nova conversa com tags
      const { data: newConv, error: convError } = await supabaseAdmin
        .from('whatsapp_conversations')
        .insert({
          phone,
          instance_id: instance.id,
          area,
          customer_name: leadName || null,
          context: {
            workshop_session_id: session.id,
            source: 'form_automation',
            form_lead: true,
            tags: ['veio_aula_pratica', 'recebeu_link_workshop', 'primeiro_contato'],
          },
        })
        .select('id')
        .single()

      if (convError) {
        console.error('[Form Automation] ⚠️ Erro ao criar conversa:', convError)
      } else {
        conversationId = newConv.id
      }
    }

    // 8. Salvar mensagem no banco
    if (conversationId) {
      await supabaseAdmin.from('whatsapp_messages').insert({
        conversation_id: conversationId,
        instance_id: instance.id,
        z_api_message_id: result.id || null,
        sender_type: 'bot',
        sender_name: 'Automação',
        message: messageText,
        message_type: 'text',
        status: 'sent',
        is_bot_response: true,
      })
    }

    console.log('[Form Automation] ✅ Mensagem enviada com sucesso para:', phone)
    return { success: true, messageId: result.id }
  } catch (error: any) {
    console.error('[Form Automation] ❌ Erro geral:', error)
    return { success: false, error: error.message || 'Erro desconhecido' }
  }
}
