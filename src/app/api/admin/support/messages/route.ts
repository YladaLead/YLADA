import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { notifyUserNewMessage } from '@/lib/support-notifications'
import { PLATFORM_SUPPORT_AREA } from '@/lib/platform-support-constants'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
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

    const { data: adminAuth } = await supabaseAdmin.auth.admin.getUserById(user.id)
    const senderName =
      adminAuth?.user?.user_metadata?.full_name ||
      adminAuth?.user?.email?.split('@')[0] ||
      'Equipe YLADA'

    const text = String(message).trim()

    const { data: row, error: insErr } = await supabaseAdmin
      .from('support_messages')
      .insert({
        ticket_id,
        sender_type: 'agent',
        sender_id: user.id,
        sender_name: senderName,
        message: text,
        is_bot_response: false,
      })
      .select()
      .single()

    if (insErr || !row) {
      console.error('[admin/support/messages POST]', insErr)
      return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 })
    }

    const updateData: Record<string, unknown> = {
      ultima_mensagem: text,
      ultima_mensagem_em: new Date().toISOString(),
      mensagens_count: (ticket.mensagens_count || 0) + 1,
      updated_at: new Date().toISOString(),
      agent_id: ticket.agent_id || user.id,
      status: ticket.status === 'aguardando' ? 'em_atendimento' : ticket.status,
    }

    if (!ticket.agent_id) {
      updateData.assigned_at = new Date().toISOString()
    }

    await supabaseAdmin.from('support_tickets').update(updateData).eq('id', ticket_id)

    notifyUserNewMessage(
      ticket_id,
      PLATFORM_SUPPORT_AREA,
      text,
      ticket.user_id,
      senderName
    ).catch(() => {})

    return NextResponse.json({ success: true, message: row })
  } catch (e: any) {
    console.error('[admin/support/messages POST]', e)
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 })
  }
}
