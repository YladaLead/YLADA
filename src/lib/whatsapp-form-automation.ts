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
    // 1. Buscar as duas próximas sessões ativas
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('*')
      .eq('area', area)
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    if (!sessions || sessions.length === 0) {
      console.log('[Form Automation] ⚠️ Nenhuma sessão ativa encontrada para área:', area)
      return { success: false, error: 'Nenhuma sessão ativa encontrada' }
    }

    const session = sessions[0] // Primeira sessão (para contexto)

    // 2. Buscar configurações (flyer, etc)
    const { data: settings } = await supabaseAdmin
      .from('whatsapp_workshop_settings')
      .select('*')
      .eq('area', area)
      .maybeSingle()

    // 3. Buscar instância Z-API para a área
    // Primeiro tenta buscar por área e status connected
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token, status, area')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    // Se não encontrou, tenta buscar apenas por área (sem filtro de status)
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token, status, area')
        .eq('area', area)
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
        console.log('[Form Automation] ⚠️ Instância encontrada mas status não é "connected":', instanceByArea.status)
      }
    }

    // Se ainda não encontrou, tenta buscar qualquer instância conectada (fallback)
    if (!instance) {
      const { data: anyInstance } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token, status, area')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      
      if (anyInstance) {
        instance = anyInstance
        console.log('[Form Automation] ⚠️ Usando instância de outra área como fallback:', anyInstance.area)
      }
    }

    if (!instance) {
      // Log detalhado para debug
      const { data: allInstances } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, status, area')
        .limit(10)
      
      console.error('[Form Automation] ❌ Instância Z-API não encontrada para área:', area, {
        searchedArea: area,
        allInstances: allInstances || []
      })
      return { success: false, error: 'Instância WhatsApp não configurada' }
    }

    const client = createZApiClient(instance.instance_id, instance.token)

    // 4. Formatar mensagem de recepção com as duas próximas opções
    const greeting = leadName ? `Olá ${leadName}, seja bem-vindo! 👋\n\n` : 'Olá, seja bem-vindo! 👋\n\n'
    
    // Formatar as duas próximas opções
    let optionsText = ''
    sessions.forEach((sess, index) => {
      const { weekday, date, time } = formatSessionPtBR(sess.starts_at)
      optionsText += `\n📅 **Opção ${index + 1}:**\n${weekday}, ${date}\n🕒 ${time} (Brasília)\n🔗 ${sess.zoom_link}\n`
    })

    const receptionMessage = `${greeting}Obrigada por fazer sua inscrição na Aula Prática ao Vivo de Como Encher a Agenda! 🎉

Aqui estão as duas próximas opções de aula:

${optionsText}✅ Se precisar reagendar, responda REAGENDAR.

Qualquer dúvida, é só me chamar! 💚`

    // 5. Enviar mensagem de recepção com opções
    const result = await client.sendTextMessage({
      phone,
      message: receptionMessage,
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
        sender_name: 'Carol - Secretária',
        message: receptionMessage,
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
