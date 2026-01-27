/**
 * POST /api/admin/whatsapp/carol/simulate-message
 *
 * Simula uma mensagem do cliente e dispara a Carol.
 * Tudo roda no servidor (instância Z-API via service role), evitando RLS no client.
 *
 * Se o admin digitar "envia o link da quarta" ou "envia link opção 2" ou "link amanhã 9h",
 * normaliza para "Opção 2" (ou "2") para a Carol enviar só o link daquela sessão.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { processIncomingMessageWithCarol, getZApiInstance } from '@/lib/whatsapp-carol-ai'
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

    // Normalizar instruções do admin "envia link da quarta / opção 2 / amanhã 9h" → "Opção 2" ou "2"
    const lower = messageToUse.toLowerCase()
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

    // 1. Buscar conversa
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, area, instance_id')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversa não encontrada' },
        { status: 404 }
      )
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
