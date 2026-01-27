/**
 * Automação de WhatsApp para formulários
 * Envia mensagem automática quando formulário é preenchido
 */

import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'

/**
 * Formata data/hora da sessão em PT-BR (horário de Brasília)
 * Mesmo critério da Carol para evitar horários diferentes entre form e Carol.
 */
function formatSessionPtBR(startsAtIso: string) {
  const d = new Date(startsAtIso)
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
  const weekday = d.toLocaleDateString('pt-BR', { ...opts, weekday: 'long' })
  const date = d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = d.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })
  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
    date,
    time,
  }
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
    // 🕐 DELAY: Aguardar 15 segundos antes de enviar para evitar duplicação
    // A pessoa pode clicar no botão do WhatsApp após preencher o cadastro
    console.log('[Form Automation] ⏳ Aguardando 15 segundos antes de enviar mensagem automática...')
    await new Promise(resolve => setTimeout(resolve, 15000))
    
    // 📱 Normalizar telefone no mesmo padrão do webhook (BR = 55 + 10/11 dígitos) para evitar 2 conversas
    let phoneNormalized = phone.replace(/\D/g, '')
    if (phoneNormalized.length >= 10 && phoneNormalized.length <= 11 && !phoneNormalized.startsWith('55')) {
      if (phoneNormalized.startsWith('0')) phoneNormalized = phoneNormalized.slice(1)
      phoneNormalized = '55' + phoneNormalized
    }
    
    // 🛡️ Verificar se já existe conversa ativa para evitar duplicação
    
    // Buscar instância primeiro para verificar conversa
    let { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token, status, area')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()
    
    if (!instance) {
      const { data: instanceByArea } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token, status, area')
        .eq('area', area)
        .limit(1)
        .maybeSingle()
      
      if (instanceByArea) {
        instance = instanceByArea
      }
    }
    
    if (!instance) {
      const { data: anyInstance } = await supabaseAdmin
        .from('z_api_instances')
        .select('id, instance_id, token, status, area')
        .eq('status', 'connected')
        .limit(1)
        .maybeSingle()
      
      if (anyInstance) {
        instance = anyInstance
      }
    }
    
    if (instance) {
      // Verificar se já existe conversa com mensagens recentes (últimos 2 minutos)
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()
      const { data: existingConv } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('id, context, last_message_at')
        .eq('phone', phoneNormalized)
        .eq('instance_id', instance.id)
        .maybeSingle()
      
      if (existingConv) {
        // Verificar se já recebeu mensagem de boas-vindas recentemente
        const context = existingConv.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []
        const hasWelcomeTag = tags.includes('veio_aula_pratica') || tags.includes('recebeu_link_workshop')
        const recentMessage = existingConv.last_message_at && new Date(existingConv.last_message_at) > new Date(twoMinutesAgo)
        
        if (hasWelcomeTag || recentMessage) {
          console.log('[Form Automation] ⚠️ Conversa já existe e já recebeu mensagem recente. Evitando duplicação.')
          return { 
            success: false, 
            error: 'Mensagem já foi enviada recentemente para esta conversa' 
          }
        }
      }
    }
    // 1. Buscar próximas sessões ativas (mais que 2 para incluir manhã quando existir)
    const { data: allSessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('*')
      .eq('area', area)
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(8)

    if (!allSessions || allSessions.length === 0) {
      console.log('[Form Automation] ⚠️ Nenhuma sessão ativa encontrada para área:', area)
      return { success: false, error: 'Nenhuma sessão ativa encontrada' }
    }

    // Incluir sessão da manhã (9h/10h BRT) quando existir, em vez de só as 2 primeiras por ordem
    const hourBR = (startsAt: string) =>
      parseInt(new Date(startsAt).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false }), 10)
    const isManha = (s: { starts_at: string }) => {
      const h = hourBR(s.starts_at)
      return h === 9 || h === 10
    }
    const first = allSessions[0]
    const soonestManha = allSessions.find(isManha)
    const second = soonestManha && soonestManha.id !== first.id ? soonestManha : allSessions[1]
    const sessions = second ? [first, second] : [first]

    const session = sessions[0] // Primeira sessão (para contexto)

    // 2. Buscar configurações (flyer, etc)
    const { data: settings } = await supabaseAdmin
      .from('whatsapp_workshop_settings')
      .select('*')
      .eq('area', area)
      .maybeSingle()

    // 3. Instância já foi buscada acima na verificação de duplicação
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

    // 4. NÃO verificar horário aqui - quando pessoa faz cadastro e clica no botão,
    // ela está esperando resposta imediata, independente de dia/horário
    // Esta é uma resposta a uma ação direta do usuário, não uma mensagem automática

    // 5. Usar nome do cadastro na saudação só se for nome real (nunca email).
    // Tom alinhado à Carol: "Oi [Nome], tudo bem? Seja muito bem-vinda! Eu sou a Carol, da equipe Ylada Nutri."
    const displayName = (leadName && leadName.trim() && !String(leadName).includes('@'))
      ? leadName.trim()
      : ''
    const greetingLines: string[] = []
    if (displayName) {
      greetingLines.push(`Oi ${displayName}, tudo bem? 😊`)
    } else {
      greetingLines.push('Oi, tudo bem? 😊')
    }
    greetingLines.push('Seja muito bem-vinda!')
    greetingLines.push('Eu sou a Carol, da equipe Ylada Nutri.')
    const greeting = greetingLines.join('\n\n') + '\n\n'
    
    // Formatar as duas próximas opções (igual ao formato da Carol)
    let optionsText = ''
    sessions.forEach((sess, index) => {
      const { weekday, date, time } = formatSessionPtBR(sess.starts_at)
      optionsText += `\n*Opção ${index + 1}:*\n${weekday}, ${date}\n🕒 ${time} (horário de Brasília)\n\n`
    })

    const receptionMessage = `${greeting}Obrigada por se inscrever na Aula Prática ao Vivo – Agenda Cheia para Nutricionistas.

Essa aula é 100% prática e foi criada para ajudar nutricionistas que estão com agenda ociosa a organizar, atrair e preencher atendimentos de forma mais leve e estratégica.

As próximas aulas ao vivo vão acontecer nos seguintes dias e horários:

${optionsText}💬 Qual você prefere? 💚`

    // 6. Enviar mensagem de recepção com opções
    const result = await client.sendTextMessage({
      phone: phoneNormalized,
      message: receptionMessage,
    })

    if (!result.success) {
      console.error('[Form Automation] ❌ Erro ao enviar mensagem:', result.error)
      return { success: false, error: result.error || 'Erro ao enviar mensagem' }
    }

    // 7. Criar ou atualizar conversa
    let conversationId: string | null = null

    // Buscar conversa existente (mesmo formato do webhook)
    const { data: existingConv } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id')
      .eq('phone', phoneNormalized)
      .eq('instance_id', instance.id)
      .maybeSingle()

    if (existingConv) {
      conversationId = existingConv.id
      // Atualizar conversa existente com tags e contexto
      const prevContext = (existingConv.context || {}) as any
      const prevTags = Array.isArray(prevContext.tags) ? prevContext.tags : []
      
      // Adicionar tags se não existirem (em português)
      const newTags = [...new Set([...prevTags, 'veio_aula_pratica', 'recebeu_link_workshop', 'primeiro_contato'])]
      
      // workshop_options_ids: ordem exata Opção 1/2 que a pessoa viu — ao responder "Opção 2", Carol usa [1] e evita trocar por terça
      const workshopOptionsIds = sessions.map((s: { id: string }) => s.id)
      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context: {
            ...prevContext,
            workshop_session_id: session.id,
            workshop_options_ids: workshopOptionsIds,
            source: 'form_automation',
            form_lead: true,
            tags: newTags,
          },
        })
        .eq('id', conversationId)
    } else {
      // Criar nova conversa com tags (name + customer_name alinhados; não gravar email como nome)
      const workshopOptionsIds = sessions.map((s: { id: string }) => s.id)
      const { data: newConv, error: convError } = await supabaseAdmin
        .from('whatsapp_conversations')
        .insert({
          phone: phoneNormalized,
          instance_id: instance.id,
          area,
          name: displayName || null,
          customer_name: displayName || null,
          context: {
            workshop_session_id: session.id,
            workshop_options_ids: workshopOptionsIds,
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

    console.log('[Form Automation] ✅ Mensagem enviada com sucesso para:', phoneNormalized)
    return { success: true, messageId: result.id }
  } catch (error: any) {
    console.error('[Form Automation] ❌ Erro geral:', error)
    return { success: false, error: error.message || 'Erro desconhecido' }
  }
}
