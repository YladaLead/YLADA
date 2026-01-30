/**
 * Automação de WhatsApp para formulários
 * Envia mensagem automática quando formulário é preenchido
 */

import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import { getFirstName } from '@/lib/whatsapp-carol-ai'
import { getFlowTemplate, applyTemplate } from '@/lib/whatsapp-flow-templates'

function toContactKey(phone: string): string {
  let digits = String(phone || '').replace(/\D/g, '')
  if (digits.startsWith('0')) digits = digits.slice(1)
  if (!digits) return ''
  // Se for BR sem código do país (10/11), prefixar 55
  if (!digits.startsWith('55') && (digits.length === 10 || digits.length === 11)) digits = `55${digits}`
  return digits
}

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
    // 🕐 DELAY: 60 segundos para dar tempo dela clicar no botão do WhatsApp primeiro.
    // Se ela clicar, a mensagem dela chega e nós respondemos (ela "nos chama"). Evita nós
    // iniciarmos a conversa em massa e reduz risco de problema com WhatsApp.
    console.log('[Form Automation] ⏳ Aguardando 60 segundos antes de enviar mensagem automática (prioridade: ela chamar primeiro)...')
    await new Promise(resolve => setTimeout(resolve, 60000))
    
    // 📱 Normalizar telefone para uma chave canônica (memória por pessoa)
    const phoneNormalized = toContactKey(phone)
    if (!phoneNormalized) {
      return { success: false, error: 'Telefone inválido' }
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
    
    // Verificar por telefone em QUALQUER conversa (qualquer instância) para evitar duplicata:
    // se a pessoa já clicou no WhatsApp, a conversa pode ter sido criada pelo webhook em outra instância.
    const { data: allConvsForPhone } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, context, last_message_at')
      .eq('contact_key', phoneNormalized)

    if (allConvsForPhone && allConvsForPhone.length > 0) {
      for (const existingConv of allConvsForPhone) {
        const { data: customerMessages } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('id')
          .eq('conversation_id', existingConv.id)
          .eq('sender_type', 'customer')
          .limit(1)
        if (customerMessages && customerMessages.length > 0) {
          console.log('[Form Automation] ⚠️ Pessoa já enviou mensagem (clicou no WhatsApp). Não enviamos — ela nos chamou.')
          return { success: false, error: 'Pessoa já iniciou a conversa pelo WhatsApp' }
        }
        const context = existingConv.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []
        const hasWelcomeTag = tags.includes('veio_aula_pratica')
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()
        const recentMessage = existingConv.last_message_at && new Date(existingConv.last_message_at) > new Date(twoMinutesAgo)
        if (hasWelcomeTag || recentMessage) {
          console.log('[Form Automation] ⚠️ Conversa já tem boas-vindas ou mensagem recente. Evitando duplicação.')
          return { success: false, error: 'Mensagem já foi enviada recentemente para esta conversa' }
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

    // 5. Usar apenas o primeiro nome do cadastro na saudação (nome real, nunca email).
    const rawName = (leadName && leadName.trim() && !String(leadName).includes('@')) ? leadName.trim() : ''
    const displayName = rawName ? getFirstName(rawName) : ''
    // Mensagem 1: saudação (template editável em /admin/whatsapp/fluxo ou padrão)
    let message1Greeting: string
    const greetingTemplate = await getFlowTemplate(area, 'welcome_form_greeting')
    if (greetingTemplate) {
      message1Greeting = applyTemplate(greetingTemplate, { nome: displayName })
    } else {
      const greetingLines: string[] = []
      if (displayName) greetingLines.push(`Oi ${displayName}, tudo bem? 😊`)
      else greetingLines.push('Oi, tudo bem? 😊')
      greetingLines.push('Seja muito bem-vinda!')
      greetingLines.push('Eu sou a Carol, da equipe Ylada Nutri.')
      message1Greeting = greetingLines.join('\n\n')
    }

    // Mensagem 2: texto da aula + opções (template editável ou padrão)
    let optionsText = ''
    sessions.forEach((sess, index) => {
      const { weekday, date, time } = formatSessionPtBR(sess.starts_at)
      optionsText += `*Opção ${index + 1}:*\n${weekday}, ${date}\n🕒 ${time} (horário de Brasília)\n\n`
    })
    let message2Body: string
    const bodyTemplate = await getFlowTemplate(area, 'welcome_form_body')
    if (bodyTemplate) {
      message2Body = applyTemplate(bodyTemplate, { nome: displayName })
        .replace(/\[OPÇÕES inseridas automaticamente\]/gi, optionsText.trim())
        .replace(/\{\{opcoes\}\}/gi, optionsText.trim())
    } else {
      message2Body = `Obrigada por se inscrever na Aula Prática ao Vivo – Agenda Cheia para Nutricionistas.

Essa aula é 100% prática e foi criada para ajudar nutricionistas que estão com agenda ociosa a organizar, atrair e preencher atendimentos de forma mais leve e estratégica.

As próximas aulas ao vivo vão acontecer nos seguintes dias e horários:

${optionsText}💬 Qual você prefere? 💚`
    }

    // 5.5 Evitar reenviar opções se já enviamos ou se a pessoa já nos chamou (recheck após 60s — evita corrida)
    const { data: convsBeforeSend } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id')
      .eq('contact_key', phoneNormalized)

    if (convsBeforeSend && convsBeforeSend.length > 0) {
      const doisMinutosAtras = new Date(Date.now() - 2 * 60 * 1000).toISOString()
      for (const conv of convsBeforeSend) {
        const { data: recentCustomerMsg } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('id')
          .eq('conversation_id', conv.id)
          .eq('sender_type', 'customer')
          .gte('created_at', doisMinutosAtras)
          .limit(1)
        if (recentCustomerMsg && recentCustomerMsg.length > 0) {
          console.log('[Form Automation] ⚠️ Pessoa já enviou mensagem nos últimos 2 min (clicou no WhatsApp). Não enviamos.')
          return { success: false, error: 'Pessoa já iniciou a conversa pelo WhatsApp' }
        }
      }
      const convIdToCheck = convsBeforeSend[0]?.id
      if (convIdToCheck) {
        const { data: botMessages } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('message')
          .eq('conversation_id', convIdToCheck)
          .eq('sender_type', 'bot')
        const alreadySentOptions = (botMessages || []).some((m: { message?: string | null }) => {
          const msg = String(m.message ?? '')
          return msg.includes('Opções de Aula') || msg.includes('Qual você prefere')
        })
        if (alreadySentOptions) {
          console.log('[Form Automation] ⚠️ Esta conversa já recebeu as opções de aula. Não reenviar.')
          return { success: false, error: 'Opções de aula já foram enviadas para esta conversa' }
        }
      }
    }

    // 6. Enviar em duas mensagens separadas (saudação primeiro; depois texto + opções, sem repetir data/hora)
    const result1 = await client.sendTextMessage({
      phone: phoneNormalized,
      message: message1Greeting,
    })
    if (!result1.success) {
      console.error('[Form Automation] ❌ Erro ao enviar 1ª mensagem:', result1.error)
      return { success: false, error: result1.error || 'Erro ao enviar mensagem' }
    }
    await new Promise((r) => setTimeout(r, 1500))
    const result2 = await client.sendTextMessage({
      phone: phoneNormalized,
      message: message2Body,
    })
    if (!result2.success) {
      console.error('[Form Automation] ❌ Erro ao enviar 2ª mensagem:', result2.error)
      return { success: false, error: result2.error || 'Erro ao enviar segunda mensagem' }
    }

    // 7. Criar ou atualizar conversa
    let conversationId: string | null = null

    // Buscar conversa existente (mesmo formato do webhook)
    const { data: existingConv } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id')
      .eq('contact_key', phoneNormalized)
      .eq('instance_id', instance.id)
      .maybeSingle()

    if (existingConv) {
      conversationId = existingConv.id
      // Atualizar conversa existente com tags e contexto
      const prevContext = (existingConv.context || {}) as any
      const prevTags = Array.isArray(prevContext.tags) ? prevContext.tags : []
      
      // Adicionar tags se não existirem (em português)
      // Só veio_aula_pratica e primeiro_contato aqui; recebeu_link_workshop só quando enviar o link do Zoom (após escolher opção)
      const newTags = [...new Set([...prevTags, 'veio_aula_pratica', 'primeiro_contato'])]
      
      // workshop_options_ids: ordem exata Opção 1/2 que a pessoa viu — ao responder "Opção 2", Carol usa [1] e evita trocar por terça
      // NÃO setar workshop_session_id aqui: a pessoa ainda não escolheu. Só a Carol seta quando detectar "Opção 1"/"Opção 2" no chat.
      const workshopOptionsIds = sessions.map((s: { id: string }) => s.id)
      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context: {
            ...prevContext,
            workshop_options_ids: workshopOptionsIds,
            source: 'form_automation',
            form_lead: true,
            tags: newTags,
          },
        })
        .eq('id', conversationId)
    } else {
      // Criar nova conversa com tags (name + customer_name alinhados; não gravar email como nome)
      // NÃO setar workshop_session_id: a pessoa ainda não escolheu horário no chat. Só a Carol seta ao detectar "Opção 1"/"Opção 2".
      const workshopOptionsIds = sessions.map((s: { id: string }) => s.id)
      const { data: newConv, error: convError } = await supabaseAdmin
        .from('whatsapp_conversations')
        .insert({
          phone: phoneNormalized,
          contact_key: phoneNormalized,
          instance_id: instance.id,
          area,
          name: displayName || null,
          customer_name: displayName || null,
          context: {
            workshop_options_ids: workshopOptionsIds,
            source: 'form_automation',
            form_lead: true,
            tags: ['veio_aula_pratica', 'primeiro_contato'],
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

    // 8. Salvar as duas mensagens no banco
    if (conversationId) {
      await supabaseAdmin.from('whatsapp_messages').insert([
        {
          conversation_id: conversationId,
          instance_id: instance.id,
          z_api_message_id: result1.id || null,
          sender_type: 'bot',
          sender_name: 'Carol - Secretária',
          message: message1Greeting,
          message_type: 'text',
          status: 'sent',
          is_bot_response: true,
        },
        {
          conversation_id: conversationId,
          instance_id: instance.id,
          z_api_message_id: result2.id || null,
          sender_type: 'bot',
          sender_name: 'Carol - Secretária',
          message: message2Body,
          message_type: 'text',
          status: 'sent',
          is_bot_response: true,
        },
      ])
    }

    console.log('[Form Automation] ✅ Duas mensagens enviadas com sucesso para:', phoneNormalized)
    return { success: true, messageId: result2.id }
  } catch (error: any) {
    console.error('[Form Automation] ❌ Erro geral:', error)
    return { success: false, error: error.message || 'Erro desconhecido' }
  }
}
