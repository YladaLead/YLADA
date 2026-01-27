/**
 * POST /api/admin/whatsapp/carol/simulate-message
 *
 * Simula uma mensagem do cliente e dispara a Carol.
 * Tudo roda no servidor (instância Z-API via service role), evitando RLS no client.
 *
 * Comandos especiais (não simulados como cliente):
 * - "Envie lembrete da aula de hoje" → envia só o lembrete da sessão de HOJE (uma mensagem), nunca "opções".
 * - "chama ela" / "lembra ela" / "a [Nome] ficou de ver a melhor data" → follow-up acolhedor: pergunta se
 *   conseguiu ver qual horário, inclui opções, NÃO abre com "Oi [nome]" (tom neutro "Oi, tudo bem?").
 *
 * Se o admin digitar "envia o link da quarta" ou "envia link opção 2" ou "link amanhã 9h",
 * normaliza para "Opção 2" (ou "2") para a Carol enviar só o link daquela sessão.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import {
  processIncomingMessageWithCarol,
  getZApiInstance,
  formatSessionDateTime,
  generateCarolResponse,
  getRegistrationName,
  getFirstName,
} from '@/lib/whatsapp-carol-ai'
import { createZApiClient } from '@/lib/z-api'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json().catch(() => ({}))
    const { conversationId, message } = body

    if (!conversationId || !message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'conversationId e message são obrigatórios' },
        { status: 400 }
      )
    }

    const area = 'nutri'
    let messageToUse = message.trim()

    // —— Comando: "Envie lembrete da aula de hoje" — envia SOMENTE a sessão de hoje (nunca as duas opções)
    const looksLikeLembreteHoje =
      /lembrete\s+(da\s+)?aula\s+(de\s+)?hoje|lembrete\s+da\s+aula\s+hoje|envie(r)?\s+lembrete\s+(da\s+)?aula\s+(de\s+)?hoje|enviar\s+lembrete\s+(da\s+)?aula\s+(de\s+)?hoje/i.test(messageToUse) ||
      /lembrete\s+de\s+hoje|lembrete\s+hoje/i.test(messageToUse)

    if (looksLikeLembreteHoje) {
      const { data: conversation, error: convError } = await supabaseAdmin
        .from('whatsapp_conversations')
        .select('id, phone, name, context, area, instance_id')
        .eq('id', conversationId)
        .eq('area', area)
        .single()

      if (convError || !conversation) {
        return NextResponse.json(
          { success: false, error: 'Conversa não encontrada' },
          { status: 404 }
        )
      }

      const now = new Date()
      const todayBr = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
      const todayStr = todayBr.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }) // YYYY-MM-DD

      const { data: sessions } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('id, title, starts_at, zoom_link')
        .eq('area', area)
        .eq('is_active', true)
        .gte('starts_at', now.toISOString())
        .order('starts_at', { ascending: true })
        .limit(20)

      const sessionHoje = (sessions || []).find(
        (s) => new Date(s.starts_at).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }) === todayStr
      )

      if (!sessionHoje) {
        return NextResponse.json(
          { success: false, error: 'Nenhuma aula agendada para hoje. Cadastre uma sessão com data de hoje na agenda.' },
          { status: 400 }
        )
      }

      const ctx = (conversation.context as Record<string, unknown>) || {}
      const leadName = getFirstName((ctx.leadName as string) || conversation.name) || 'querido(a)'
      const { time } = formatSessionDateTime(sessionHoje.starts_at)

      const reminderMessage = `Olá ${leadName}! 

Sua aula é hoje às ${time}! 

💻 *Recomendação importante:*

O ideal é participar pelo computador ou notebook, pois:
* Compartilhamos slides
* Fazemos explicações visuais
* É importante acompanhar e anotar

Pelo celular, a experiência fica limitada e você pode perder partes importantes da aula.

🔗 ${sessionHoje.zoom_link}
`

      let instance = await getZApiInstance(area)
      if (!instance) {
        return NextResponse.json(
          { success: false, error: 'Instância Z-API não encontrada para a área nutri' },
          { status: 502 }
        )
      }
      const client = createZApiClient(instance.instance_id, instance.token)
      const sendResult = await client.sendTextMessage({
        phone: conversation.phone,
        message: reminderMessage,
      })

      if (!sendResult.success) {
        return NextResponse.json(
          { success: false, error: sendResult.error || 'Erro ao enviar lembrete' },
          { status: 500 }
        )
      }

      await supabaseAdmin.from('whatsapp_messages').insert({
        conversation_id: conversation.id,
        instance_id: instance.id,
        z_api_message_id: sendResult.id || null,
        sender_type: 'bot',
        sender_name: 'Carol - Secretária',
        message: reminderMessage,
        message_type: 'text',
        status: 'sent',
        is_bot_response: true,
      })

      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context: { ...ctx, workshop_session_id: sessionHoje.id, scheduled_date: sessionHoje.starts_at },
          last_message_at: new Date().toISOString(),
          last_message_from: 'bot',
        })
        .eq('id', conversation.id)

      return NextResponse.json({
        success: true,
        response: `Lembrete da aula de hoje (${time}) enviado com sucesso.`,
      })
    }

    // Normalizar instruções do admin "envia link da quarta / opção 2 / amanhã 9h" → "Opção 2" ou "2"
    const looksLikeSendLink =
      /envia(r)?\s*(o)?\s*link|manda(r)?\s*(o)?\s*link|link\s*(da|de|para)\s*(quarta|opção|op|amanhã|amanha|\d+h)/i.test(messageToUse) ||
      /(envia|manda)\s+.*\s+link\s+.*\s+(quarta|opção\s*2|op\s*2|amanhã\s*9h|9h)/i.test(messageToUse) ||
      /link\s+(da\s+)?quarta|opção\s*2|op\s*2|quarta\s*9h|amanhã\s*(às?\s*)?9h|amanha\s*(as?\s*)?9hs?/i.test(messageToUse)

    if (looksLikeSendLink) {
      const now = new Date().toISOString()
      const { data: list } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('id, title, starts_at, zoom_link')
        .eq('area', area)
        .eq('is_active', true)
        .gte('starts_at', now)
        .order('starts_at', { ascending: true })
        .limit(8)

      const hourBR = (startsAt: string) =>
        parseInt(
          new Date(startsAt).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false }),
          10
        )
      const isManha = (s: { starts_at: string }) => {
        const h = hourBR(s.starts_at)
        return h === 9 || h === 10
      }
      const first = list?.[0]
      const soonestManha = list?.find(isManha)
      const second = soonestManha && soonestManha.id !== first?.id ? soonestManha : list?.[1]
      const workshopSessions = first && second ? [first, second] : first ? [first] : []

      if (workshopSessions.length >= 2) {
        const fmt = (s: { starts_at: string }) => {
          const d = new Date(s.starts_at)
          const w = d.toLocaleDateString('pt-BR', { weekday: 'long', timeZone: 'America/Sao_Paulo' }).toLowerCase()
          const h = hourBR(s.starts_at)
          return { w, h }
        }
        const s0 = fmt(workshopSessions[0])
        const s1 = fmt(workshopSessions[1])
        const wantQuarta = /quarta/i.test(messageToUse)
        const wantOp2 = /opção\s*2|op\s*2|opcao\s*2/i.test(messageToUse)
        const want9h = /9\s*h|9hs|09:00|amanhã\s*9|amanha\s*9/i.test(messageToUse)

        if (wantOp2) {
          messageToUse = 'Opção 2'
        } else if (wantQuarta && s1.w.includes('quarta')) {
          messageToUse = 'Opção 2'
        } else if (wantQuarta && s0.w.includes('quarta')) {
          messageToUse = 'Opção 1'
        } else if (want9h && s1.h === 9) {
          messageToUse = 'Opção 2'
        } else if (want9h && s0.h === 9) {
          messageToUse = 'Opção 1'
        } else if (wantQuarta || want9h) {
          messageToUse = 'Opção 2'
        }
      } else if (workshopSessions.length === 1 && /link|quarta|opção|9h|amanhã/i.test(messageToUse)) {
        messageToUse = 'Opção 1'
      }
    }

    // 1. Buscar conversa (com context para follow-up / lembrete)
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, area, instance_id, context')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    const ctx = (conversation.context as Record<string, unknown>) || {}
    const tags = Array.isArray(ctx.tags) ? ctx.tags : []

    // —— Comando: "chama ela" / "lembra ela" / "ficou de ver a melhor data" — follow-up acolhedor (NÃO simula como cliente)
    const looksLikeFollowUp =
      /(chama|lembra)\s+(ela|a\s*\w+)/i.test(messageToUse) ||
      /ficou\s+de\s+ver(indificar)?\s*(a\s+melhor\s+)?data/i.test(messageToUse) ||
      /\w+\s+ficou\s+de\s+ver/i.test(messageToUse) ||
      /pergunta\s+se\s+(ela\s+)?conseguiu\s+ver/i.test(messageToUse)

    if (looksLikeFollowUp) {
      const { data: messages } = await supabaseAdmin
        .from('whatsapp_messages')
        .select('message, sender_type, created_at')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true })
        .limit(20)

      const conversationHistory = (messages || []).map((msg: { message?: string; sender_type?: string }) => ({
        role: (msg.sender_type === 'bot' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: msg.message || '',
      }))

      const now = new Date().toISOString()
      const { data: sessions } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('id, title, starts_at, zoom_link')
        .eq('area', area)
        .eq('is_active', true)
        .gte('starts_at', now)
        .order('starts_at', { ascending: true })
        .limit(8)

      const hourBR = (startsAt: string) =>
        parseInt(
          new Date(startsAt).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hour12: false }),
          10
        )
      const isManha = (s: { starts_at: string }) => {
        const h = hourBR(s.starts_at)
        return h === 9 || h === 10
      }
      const first = sessions?.[0]
      const soonestManha = sessions?.find(isManha)
      const second = soonestManha && soonestManha.id !== first?.id ? soonestManha : sessions?.[1]
      const workshopSessions = first && second ? [first, second] : first ? [first] : []

      const registrationName = await getRegistrationName(conversation.phone, area)
      let leadName = getFirstName(registrationName || (ctx as { lead_name?: string })?.lead_name || conversation.name) || undefined
      if (leadName && /ylada/i.test(leadName.trim())) leadName = undefined

      const carolInstruction =
        'O admin está pedindo para você fazer um follow-up com essa pessoa. Ela havia ficado de verificar a melhor data para participar da Aula Prática (Como Encher a Agenda). NÃO abra com "Oi [nome]" – use tom mais neutro, ex.: "Oi, tudo bem? 😊" ou "Seja muito bem-vinda!". Sua mensagem DEVE: (1) cumprimentar de forma leve (ex.: "Oi, tudo bem? 😊" ou "Seja muito bem-vinda!"); (2) dizer algo como "Vi que você estava analisando a melhor data para a Aula Prática ao Vivo de Como Encher a Agenda. Conseguiu ver qual horário funciona melhor pra você?"; (3) incluir as opções de aula (dia e hora). O objetivo é que ela aprenda como encher a agenda – seja acolhedora e ofereça as opções.'

      const messageToSend = await generateCarolResponse('Quero saber os horários da aula', conversationHistory, {
        tags: [...tags],
        workshopSessions,
        leadName,
        isFirstMessage: false,
        carolInstruction,
      })

      let instance = await getZApiInstance(area)
      if (!instance) {
        return NextResponse.json(
          { success: false, error: 'Instância Z-API não encontrada para a área nutri' },
          { status: 502 }
        )
      }
      const client = createZApiClient(instance.instance_id, instance.token)
      const sendResult = await client.sendTextMessage({
        phone: conversation.phone,
        message: messageToSend,
      })

      if (!sendResult.success) {
        return NextResponse.json(
          { success: false, error: sendResult.error || 'Erro ao enviar follow-up' },
          { status: 500 }
        )
      }

      await supabaseAdmin.from('whatsapp_messages').insert({
        conversation_id: conversation.id,
        instance_id: instance.id,
        z_api_message_id: sendResult.id || null,
        sender_type: 'bot',
        sender_name: 'Carol - Secretária',
        message: messageToSend,
        message_type: 'text',
        status: 'sent',
        is_bot_response: true,
      })

      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          last_message_at: new Date().toISOString(),
          last_message_from: 'bot',
        })
        .eq('id', conversation.id)

      return NextResponse.json({
        success: true,
        response: 'Follow-up enviado. Carol perguntou se conseguiu ver o horário e incluiu as opções.',
      })
    }

    // 2. Resolver instância Z-API (servidor usa service role → sem RLS)
    let instanceId: string | null = conversation.instance_id || null
    if (!instanceId) {
      const instance = await getZApiInstance(area)
      if (!instance) {
        return NextResponse.json(
          {
            success: false,
            error: 'Instância não encontrada. Verifique se há uma instância Z-API conectada para a área nutri',
          },
          { status: 502 }
        )
      }
      instanceId = instance.id
    }

    // 3. Inserir mensagem como se fosse do cliente (usar mensagem normalizada quando for "envia link da quarta" etc.)
    await supabaseAdmin.from('whatsapp_messages').insert({
      conversation_id: conversationId,
      instance_id: instanceId,
      sender_type: 'customer',
      sender_name: conversation.name || 'Cliente',
      message: messageToUse,
      message_type: 'text',
      status: 'delivered',
      is_bot_response: false,
    })

    // 4. Atualizar última mensagem da conversa
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_from: 'customer',
      })
      .eq('id', conversationId)

    // 5. Processar com Carol (usa mensagem normalizada para que "Opção 2" dispare envio só do link)
    const result = await processIncomingMessageWithCarol(
      conversationId,
      conversation.phone,
      messageToUse,
      conversation.area || area,
      instanceId
    )

    return NextResponse.json({
      success: result.success,
      response: result.response,
      error: result.error,
    })
  } catch (error: any) {
    console.error('[Carol simulate-message] Erro:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erro ao simular mensagem e processar com Carol',
      },
      { status: 500 }
    )
  }
}
