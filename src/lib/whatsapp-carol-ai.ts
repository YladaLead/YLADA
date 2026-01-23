/**
 * Carol - IA de Atendimento WhatsApp
 * 
 * Sistema completo de automação com OpenAI para:
 * - Recepção automática
 * - Atendimento de quem chamou
 * - Disparo para quem não chamou
 * - Remarketing para quem agendou mas não participou
 */

import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const WHATSAPP_NUMBER = '5519997230912' // Número principal

/**
 * System Prompt da Carol
 */
const CAROL_SYSTEM_PROMPT = `Você é a Carol, secretária da YLADA Nutri. Você é profissional, acolhedora e eficiente.

SEU PAPEL:
- Recepcionar pessoas que se inscreveram na Aula Prática ao Vivo
- Enviar opções de dias e horários disponíveis
- Responder dúvidas sobre a aula
- Ajudar com reagendamentos
- Fazer remarketing para quem agendou mas não participou

REGRAS IMPORTANTES:
1. Sempre seja acolhedora e profissional
2. Use emojis moderadamente (1-2 por mensagem)
3. Seja direta e objetiva
4. Sempre ofereça as opções de dias/horários quando apropriado
5. Para reagendamentos, seja flexível e ajude a encontrar melhor data

CONTEXTO DA AULA:
- Nome: "Aula Prática ao Vivo de Como Encher a Agenda"
- Duração: aproximadamente 45 minutos
- Formato: Online (Zoom)
- Objetivo: Ensinar estratégias práticas para encher a agenda

QUANDO ENVIAR OPÇÕES DE AULA:
- Quando pessoa pergunta sobre dias/horários
- Quando pessoa quer agendar
- Quando pessoa pede para reagendar
- Sempre inclua: dia da semana, data, hora e link do Zoom

QUANDO FAZER REMARKETING:
- Pessoa agendou mas não participou
- Seja empática: "Vi que você não conseguiu participar da aula anterior..."
- Ofereça novas opções de data/hora
- Seja persistente mas respeitosa

RESPOSTAS DEVE SER:
- Curta (máximo 3-4 linhas)
- Clara e direta
- Acolhedora
- Com call-to-action quando apropriado`

/**
 * Gera resposta da Carol usando OpenAI
 */
async function generateCarolResponse(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  context?: {
    tags?: string[]
    workshopSessions?: Array<{ title: string; starts_at: string; zoom_link: string }>
    leadName?: string
    hasScheduled?: boolean
    scheduledDate?: string
    participated?: boolean
  }
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return 'Olá! Sou a Carol, secretária da YLADA Nutri. Como posso te ajudar? 😊'
  }

  // Construir contexto adicional
  let contextText = ''
  if (context) {
    if (context.tags && context.tags.length > 0) {
      contextText += `\nTags da conversa: ${context.tags.join(', ')}\n`
    }
    if (context.hasScheduled) {
      contextText += `\nEsta pessoa já agendou para: ${context.scheduledDate || 'data não especificada'}\n`
    }
    if (context.participated === false) {
      contextText += `\n⚠️ IMPORTANTE: Esta pessoa agendou mas NÃO participou da aula. Faça remarketing oferecendo novas opções.\n`
    }
    if (context.workshopSessions && context.workshopSessions.length > 0) {
      contextText += `\nOpções de aula disponíveis:\n`
      context.workshopSessions.forEach((session, index) => {
        const date = new Date(session.starts_at)
        const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
        const dateStr = date.toLocaleDateString('pt-BR')
        const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        contextText += `${index + 1}. ${weekday}, ${dateStr} às ${time} - ${session.zoom_link}\n`
      })
    }
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: CAROL_SYSTEM_PROMPT + contextText,
    },
    ...conversationHistory.slice(-6), // Últimas 6 mensagens
    {
      role: 'user',
      content: message,
    },
  ]

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Modelo mais barato e rápido
      messages,
      temperature: 0.7,
      max_tokens: 300, // Respostas curtas
    })

    return completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem. Pode repetir?'
  } catch (error: any) {
    console.error('[Carol AI] Erro ao gerar resposta:', error)
    return 'Olá! Sou a Carol, secretária da YLADA Nutri. Como posso te ajudar? 😊'
  }
}

/**
 * Envia mensagem via WhatsApp usando Z-API
 */
async function sendWhatsAppMessage(
  phone: string,
  message: string,
  instanceId: string,
  token: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const client = createZApiClient(instanceId, token)
    const result = await client.sendTextMessage({ phone, message })

    if (!result.success) {
      return { success: false, error: result.error }
    }

    return { success: true, messageId: result.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Processa mensagem recebida e responde automaticamente com Carol
 */
export async function processIncomingMessageWithCarol(
  conversationId: string,
  phone: string,
  message: string,
  area: string = 'nutri',
  instanceId: string
): Promise<{ success: boolean; response?: string; error?: string }> {
  try {
    console.log('[Carol AI] 🚀 Iniciando processamento:', {
      conversationId,
      phone,
      messagePreview: message?.substring(0, 50),
      area,
      instanceId,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY
    })

    // Verificar se OpenAI está configurado
    if (!process.env.OPENAI_API_KEY) {
      console.error('[Carol AI] ❌ OPENAI_API_KEY não configurada')
      return { success: false, error: 'OpenAI API Key não configurada' }
    }

    // 1. Buscar contexto da conversa
    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('context, customer_name')
      .eq('id', conversationId)
      .single()

    if (!conversation) {
      console.error('[Carol AI] ❌ Conversa não encontrada:', conversationId)
      return { success: false, error: 'Conversa não encontrada' }
    }

    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []
    const workshopSessionId = context.workshop_session_id

    // 2. Buscar sessões de workshop disponíveis
    let workshopSessions: Array<{ title: string; starts_at: string; zoom_link: string }> = []
    if (workshopSessionId) {
      const { data: session } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('title, starts_at, zoom_link')
        .eq('id', workshopSessionId)
        .single()
      if (session) {
        workshopSessions.push(session)
      }
    } else {
      // Buscar próximas 2 sessões
      const { data: sessions } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('title, starts_at, zoom_link')
        .eq('area', area)
        .eq('is_active', true)
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
        .limit(2)
      workshopSessions = sessions || []
    }

    // 3. Verificar se participou ou não
    const participated = tags.includes('participou_aula')
    const hasScheduled = tags.includes('recebeu_link_workshop') || workshopSessionId
    const scheduledDate = context.scheduled_date || null

    // 4. Buscar histórico de mensagens
    const { data: messages } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('sender_type, message')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(20)

    const conversationHistory = (messages || [])
      .filter(m => m.sender_type === 'customer' || m.sender_type === 'bot' || m.sender_type === 'agent')
      .map(m => ({
        role: m.sender_type === 'customer' ? 'user' as const : 'assistant' as const,
        content: m.message || '',
      }))

    // 5. Gerar resposta da Carol
    console.log('[Carol AI] 💭 Gerando resposta com contexto:', {
      tags,
      hasSessions: workshopSessions.length > 0,
      leadName: conversation.customer_name,
      hasScheduled,
      participated
    })

    const carolResponse = await generateCarolResponse(message, conversationHistory, {
      tags,
      workshopSessions,
      leadName: conversation.customer_name || undefined,
      hasScheduled,
      scheduledDate,
      participated: participated ? true : (tags.includes('nao_participou_aula') ? false : undefined),
    })

    console.log('[Carol AI] ✅ Resposta gerada:', {
      responsePreview: carolResponse?.substring(0, 100),
      length: carolResponse?.length
    })

    // 6. Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('instance_id, token')
      .eq('id', instanceId)
      .single()

    if (!instance) {
      return { success: false, error: 'Instância Z-API não encontrada' }
    }

    // 7. Enviar resposta
    const sendResult = await sendWhatsAppMessage(
      phone,
      carolResponse,
      instance.instance_id,
      instance.token
    )

    if (!sendResult.success) {
      return { success: false, error: sendResult.error }
    }

    // 8. Salvar mensagem no banco
    await supabaseAdmin.from('whatsapp_messages').insert({
      conversation_id: conversationId,
      instance_id: instanceId,
      z_api_message_id: sendResult.messageId || null,
      sender_type: 'bot',
      sender_name: 'Carol - Secretária',
      message: carolResponse,
      message_type: 'text',
      status: 'sent',
      is_bot_response: true,
    })

    // 9. Atualizar última mensagem da conversa
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_from: 'bot',
      })
      .eq('id', conversationId)

    return { success: true, response: carolResponse }
  } catch (error: any) {
    console.error('[Carol AI] Erro ao processar mensagem:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Dispara mensagem de boas-vindas para quem preencheu mas não chamou
 */
export async function sendWelcomeToNonContactedLeads(): Promise<{
  sent: number
  errors: number
}> {
  try {
    // 1. Buscar leads que preencheram workshop mas não têm conversa ativa
    // Buscar de workshop_inscricoes OU de leads com source = workshop_agenda_instavel_landing_page
    const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    
    // Tentar buscar de workshop_inscricoes primeiro
    let workshopLeads: Array<{ nome: string; email: string; telefone: string; created_at: string }> = []
    
    const { data: inscricoes } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('nome, email, telefone, created_at')
      .eq('status', 'inscrito')
      .gte('created_at', seteDiasAtras)
      .order('created_at', { ascending: false })
    
    if (inscricoes && inscricoes.length > 0) {
      workshopLeads = inscricoes.map((i: any) => ({
        nome: i.nome,
        email: i.email || '',
        telefone: i.telefone,
        created_at: i.created_at,
      }))
    } else {
      // Fallback: buscar de leads com source workshop
      const { data: leads } = await supabaseAdmin
        .from('leads')
        .select('nome, email, telefone, created_at')
        .or('source.eq.workshop_agenda_instavel_landing_page,source.ilike.%workshop%')
        .gte('created_at', seteDiasAtras)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (leads) {
        workshopLeads = leads
          .filter((l: any) => l.telefone)
          .map((l: any) => ({
            nome: l.nome || '',
            email: l.email || '',
            telefone: l.telefone,
            created_at: l.created_at,
          }))
      }
    }

    if (!workshopLeads || workshopLeads.length === 0) {
      return { sent: 0, errors: 0 }
    }

    // 2. Verificar quais não têm conversa ativa no WhatsApp
    const leadsToContact: Array<{ nome: string; telefone: string }> = []
    
    for (const lead of workshopLeads) {
      if (!lead.telefone) continue

      const phoneClean = lead.telefone.replace(/\D/g, '')
      if (phoneClean.length < 10) continue

      // Verificar se tem conversa com mensagens do cliente
      const { data: conversation } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('id')
        .eq('phone', phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`)
        .eq('area', 'nutri')
        .maybeSingle()

      if (!conversation) {
        // Não tem conversa, precisa receber boas-vindas
        leadsToContact.push({
          nome: lead.nome,
          telefone: phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`,
        })
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
          leadsToContact.push({
            nome: lead.nome,
            telefone: phoneClean.startsWith('55') ? phoneClean : `55${phoneClean}`,
          })
        }
      }
    }

    // 3. Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { sent: 0, errors: leadsToContact.length }
    }

    // 4. Buscar próximas 2 sessões
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('title, starts_at, zoom_link')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    // 5. Enviar mensagem para cada lead
    let sent = 0
    let errors = 0

    for (const lead of leadsToContact) {
      try {
        // Formatar opções de aula
        let optionsText = ''
        if (sessions && sessions.length > 0) {
          sessions.forEach((session, index) => {
            const date = new Date(session.starts_at)
            const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
            const dateStr = date.toLocaleDateString('pt-BR')
            const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            optionsText += `\n📅 **Opção ${index + 1}:**\n${weekday}, ${dateStr}\n🕒 ${time} (Brasília)\n🔗 ${session.zoom_link}\n`
          })
        }

        const welcomeMessage = `Olá ${lead.nome}, seja bem-vindo! 👋

Obrigada por fazer sua inscrição na Aula Prática ao Vivo de Como Encher a Agenda! 🎉

Aqui estão as duas próximas opções de aula:

${optionsText}✅ Se precisar reagendar, responda REAGENDAR.

Qualquer dúvida, é só me chamar! 💚

Carol - Secretária YLADA Nutri`

        const sendResult = await sendWhatsAppMessage(
          lead.telefone,
          welcomeMessage,
          instance.instance_id,
          instance.token
        )

        if (sendResult.success) {
          // Criar ou atualizar conversa
          const { data: existingConv } = await supabaseAdmin
            .from('whatsapp_conversations')
            .select('id')
            .eq('phone', lead.telefone)
            .eq('instance_id', instance.id)
            .maybeSingle()

          let conversationId: string | null = null

          if (existingConv) {
            conversationId = existingConv.id
            // Atualizar tags
            const prevContext = (existingConv.context || {}) as any
            const prevTags = Array.isArray(prevContext.tags) ? prevContext.tags : []
            const newTags = [...new Set([...prevTags, 'veio_aula_pratica', 'recebeu_link_workshop', 'primeiro_contato'])]

            await supabaseAdmin
              .from('whatsapp_conversations')
              .update({
                context: {
                  ...prevContext,
                  tags: newTags,
                  source: 'welcome_automation',
                },
              })
              .eq('id', conversationId)
          } else {
            const { data: newConv } = await supabaseAdmin
              .from('whatsapp_conversations')
              .insert({
                phone: lead.telefone,
                instance_id: instance.id,
                area: 'nutri',
                customer_name: lead.nome,
                context: {
                  tags: ['veio_aula_pratica', 'recebeu_link_workshop', 'primeiro_contato'],
                  source: 'welcome_automation',
                },
              })
              .select('id')
              .single()

            conversationId = newConv?.id || null
          }

          // Salvar mensagem
          if (conversationId) {
            await supabaseAdmin.from('whatsapp_messages').insert({
              conversation_id: conversationId,
              instance_id: instance.id,
              z_api_message_id: sendResult.messageId || null,
              sender_type: 'bot',
              sender_name: 'Carol - Secretária',
              message: welcomeMessage,
              message_type: 'text',
              status: 'sent',
              is_bot_response: true,
            })
          }

          sent++
        } else {
          errors++
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar para ${lead.telefone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar leads não contactados:', error)
    return { sent: 0, errors: 0 }
  }
}

/**
 * Dispara remarketing para quem agendou mas não participou
 */
export async function sendRemarketingToNonParticipants(): Promise<{
  sent: number
  errors: number
}> {
  try {
    // 1. Buscar conversas com tag "nao_participou_aula" ou "adiou_aula"
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, customer_name, context')
      .eq('area', 'nutri')
      .eq('status', 'active')

    if (!conversations) {
      return { sent: 0, errors: 0 }
    }

    // 2. Filtrar quem não participou
    const nonParticipants = conversations.filter((conv) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      return (
        tags.includes('nao_participou_aula') ||
        tags.includes('adiou_aula')
      ) && !tags.includes('participou_aula')
    })

    if (nonParticipants.length === 0) {
      return { sent: 0, errors: 0 }
    }

    // 3. Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return { sent: 0, errors: nonParticipants.length }
    }

    // 4. Buscar próximas 2 sessões
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('title, starts_at, zoom_link')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    // 5. Enviar mensagem de remarketing
    let sent = 0
    let errors = 0

    for (const conv of nonParticipants) {
      try {
        // Formatar opções
        let optionsText = ''
        if (sessions && sessions.length > 0) {
          sessions.forEach((session, index) => {
            const date = new Date(session.starts_at)
            const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
            const dateStr = date.toLocaleDateString('pt-BR')
            const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            optionsText += `\n📅 **Opção ${index + 1}:**\n${weekday}, ${dateStr}\n🕒 ${time} (Brasília)\n🔗 ${session.zoom_link}\n`
          })
        }

        const remarketingMessage = `Olá ${conv.customer_name || 'querido(a)'}! 👋

Vi que você não conseguiu participar da aula anterior. Tudo bem, acontece! 😊

Que tal tentarmos novamente? Aqui estão novas opções de dias e horários:

${optionsText}Se alguma dessas opções funcionar para você, é só me avisar! 

Qualquer dúvida, estou aqui! 💚

Carol - Secretária YLADA Nutri`

        const sendResult = await sendWhatsAppMessage(
          conv.phone,
          remarketingMessage,
          instance.instance_id,
          instance.token
        )

        if (sendResult.success) {
          // Atualizar tag
          const context = conv.context || {}
          const tags = Array.isArray(context.tags) ? context.tags : []
          const newTags = [...new Set([...tags, 'recebeu_segundo_link'])]

          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: {
                ...context,
                tags: newTags,
                last_remarketing_at: new Date().toISOString(),
              },
            })
            .eq('id', conv.id)

          // Salvar mensagem
          await supabaseAdmin.from('whatsapp_messages').insert({
            conversation_id: conv.id,
            instance_id: instance.id,
            z_api_message_id: sendResult.messageId || null,
            sender_type: 'bot',
            sender_name: 'Carol - Secretária',
            message: remarketingMessage,
            message_type: 'text',
            status: 'sent',
            is_bot_response: true,
          })

          sent++
        } else {
          errors++
        }
      } catch (error: any) {
        console.error(`[Carol] Erro ao enviar remarketing para ${conv.phone}:`, error)
        errors++
      }
    }

    return { sent, errors }
  } catch (error: any) {
    console.error('[Carol] Erro ao processar remarketing:', error)
    return { sent: 0, errors: 0 }
  }
}
