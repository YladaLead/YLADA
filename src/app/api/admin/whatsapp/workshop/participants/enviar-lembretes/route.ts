/**
 * POST /api/admin/whatsapp/workshop/participants/enviar-lembretes
 *
 * Envia lembrete da aula para participantes selecionados (aula de hoje, 30 min antes ou 10 min antes).
 * Usado no modal "Participantes Confirmados" da agenda workshop.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import { formatSessionDateTime, getRegistrationName } from '@/lib/whatsapp-carol-ai'
import { isCarolAutomationDisabled } from '@/config/whatsapp-automation'

function getFirstName(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') return ''
  const parts = name.trim().split(/\s+/)
  return parts[0] || ''
}

export type LembreteTipo = 'aula_hoje' | '30min' | '10min'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) return authResult

    if (isCarolAutomationDisabled()) {
      return NextResponse.json(
        { success: false, error: 'Automação Carol desligada. Ligue em Vercel (CAROL_AUTOMATION_DISABLED=false) e faça redeploy.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { sessionId, conversationIds, tipo } = body as {
      sessionId?: string
      conversationIds?: string[]
      tipo?: LembreteTipo
    }

    if (!sessionId || !Array.isArray(conversationIds) || conversationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'sessionId e conversationIds (array não vazio) são obrigatórios' },
        { status: 400 }
      )
    }

    const allowedTipos: LembreteTipo[] = ['aula_hoje', '30min', '10min']
    if (!tipo || !allowedTipos.includes(tipo)) {
      return NextResponse.json(
        { success: false, error: 'tipo deve ser: aula_hoje, 30min ou 10min' },
        { status: 400 }
      )
    }

    const { data: session, error: sessionError } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, starts_at, zoom_link')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ success: false, error: 'Sessão não encontrada' }, { status: 404 })
    }

    const { weekday, date, time } = formatSessionDateTime(session.starts_at)

    const { data: conversations, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context, instance_id')
      .in('id', conversationIds)
      .eq('area', 'nutri')
      .eq('status', 'active')
      .contains('context', { workshop_session_id: sessionId })

    if (convError || !conversations?.length) {
      return NextResponse.json(
        { success: false, error: 'Nenhuma conversa encontrada para esta sessão' },
        { status: 404 }
      )
    }

    const instanceIds = [...new Set(conversations.map((c: any) => c.instance_id).filter(Boolean))]
    const { data: instances } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .in('id', instanceIds)

    const instanceMap = new Map((instances || []).map((i: any) => [i.id, i]))

    let sent = 0
    const errors: string[] = []

    for (const conv of conversations) {
      const instance = instanceMap.get(conv.instance_id)
      if (!instance?.token) {
        errors.push(`${conv.phone}: instância Z-API não encontrada`)
        continue
      }

      let leadName = (conv.context as any)?.lead_name || conv.name || null
      if (!leadName && conv.phone) {
        leadName = await getRegistrationName(conv.phone, 'nutri')
      }
      const firstName = getFirstName(leadName)

      let message: string
      if (tipo === 'aula_hoje') {
        message = `${firstName ? `Olá ${firstName}! ` : ''}Sua aula é hoje às ${time}! 

Ideal participar pelo computador e ter caneta e papel à mão — a aula é bem prática.
`
      } else if (tipo === '30min') {
        message = `${firstName ? `Olá ${firstName}! ` : ''}Em breve começaremos juntos! ⏰`
      } else {
        message = `✅ A sala já está aberta!

Entra agora pra garantir seu lugar, porque vamos começar pontualmente em poucos minutos.

Se puder, entra pelo computador e já deixa caneta e papel por perto (a aula é bem prática).

🔗 ${session.zoom_link}
`
      }

      try {
        const client = createZApiClient(instance.instance_id, instance.token)
        const result = await client.sendTextMessage({ phone: conv.phone, message })

        if (result.success) {
          await supabaseAdmin.from('whatsapp_messages').insert({
            conversation_id: conv.id,
            instance_id: instance.id,
            z_api_message_id: result.id || null,
            sender_type: 'bot',
            sender_name: 'Carol - Secretária',
            message,
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
            .eq('id', conv.id)
          sent++
        } else {
          errors.push(`${conv.phone}: ${result.error || 'Falha ao enviar'}`)
        }
      } catch (err: any) {
        errors.push(`${conv.phone}: ${err?.message || 'Erro'}`)
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      errors: errors.length ? errors : undefined,
      total: conversations.length,
    })
  } catch (error: any) {
    console.error('[Workshop enviar-lembretes] Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao enviar lembretes' },
      { status: 500 }
    )
  }
}
