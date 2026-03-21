import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { notifyAgentNewMessage, notifyPlatformStaffUserReplied } from '@/lib/support-notifications'
import { PLATFORM_SUPPORT_AREA } from '@/lib/platform-support-constants'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const ticketId = new URL(request.url).searchParams.get('ticket_id')
    if (!ticketId) {
      return NextResponse.json({ error: 'ticket_id é obrigatório' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    const { data: ticket, error: tErr } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId)
      .single()

    if (tErr || !ticket || ticket.area !== PLATFORM_SUPPORT_AREA || ticket.user_id !== user.id) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 })
    }

    const { data: messages, error: mErr } = await supabaseAdmin
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    if (mErr) {
      return NextResponse.json({ error: 'Erro ao buscar mensagens' }, { status: 500 })
    }

    return NextResponse.json({ success: true, messages: messages || [] })
  } catch (e: any) {
    console.error('[platform/support/messages GET]', e)
    return NextResponse.json({ error: 'Erro ao buscar mensagens' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    const body = await request.json()
    const { ticket_id, message } = body

    if (!ticket_id || !message || String(message).trim() === '') {
      return NextResponse.json({ error: 'ticket_id e message são obrigatórios' }, { status: 400 })
    }

    const { data: ticket, error: tErr } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', ticket_id)
      .single()

    if (tErr || !ticket || ticket.area !== PLATFORM_SUPPORT_AREA) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 })
    }

    if (ticket.user_id !== user.id) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Usuário'

    const text = String(message).trim()

    const { data: row, error: insErr } = await supabaseAdmin
      .from('support_messages')
      .insert({
        ticket_id,
        sender_type: 'user',
        sender_id: user.id,
        sender_name: displayName,
        message: text,
        is_bot_response: false,
      })
      .select()
      .single()

    if (insErr || !row) {
      console.error('[platform/support/messages POST]', insErr)
      return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 })
    }

    await supabaseAdmin
      .from('support_tickets')
      .update({
        ultima_mensagem: text,
        ultima_mensagem_em: new Date().toISOString(),
        mensagens_count: (ticket.mensagens_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticket_id)

    notifyPlatformStaffUserReplied({
      ticketId: ticket_id,
      snippet: text,
      userName: displayName,
      userEmail: user.email || undefined,
    }).catch((err) => console.error('[platform/support/messages] notify staff:', err))

    if (ticket.agent_id) {
      notifyAgentNewMessage(ticket_id, PLATFORM_SUPPORT_AREA, text, ticket.agent_id).catch(() => {})
    }

    return NextResponse.json({ success: true, message: row })
  } catch (e: any) {
    console.error('[platform/support/messages POST]', e)
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 })
  }
}
