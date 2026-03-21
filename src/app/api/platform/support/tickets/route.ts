import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { notifyAgentsNewTicket } from '@/lib/support-notifications'
import { PLATFORM_SUPPORT_AREA } from '@/lib/platform-support-constants'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('area', PLATFORM_SUPPORT_AREA)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: tickets, error } = await query

    if (error) {
      console.error('[platform/support/tickets GET]', error)
      return NextResponse.json({ error: 'Erro ao buscar tickets' }, { status: 500 })
    }

    return NextResponse.json({ success: true, tickets: tickets || [] })
  } catch (e: any) {
    console.error('[platform/support/tickets GET]', e)
    return NextResponse.json({ error: 'Erro ao listar tickets' }, { status: 500 })
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
    const { assunto, primeira_mensagem, categoria, prioridade } = body

    if (!assunto || !primeira_mensagem) {
      return NextResponse.json(
        { error: 'Assunto e primeira mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    const { data: ticket, error } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        area: PLATFORM_SUPPORT_AREA,
        user_id: user.id,
        status: 'aguardando',
        categoria: categoria || 'outras',
        assunto: String(assunto).substring(0, 200),
        primeira_mensagem: String(primeira_mensagem),
        ultima_mensagem: String(primeira_mensagem),
        ultima_mensagem_em: new Date().toISOString(),
        prioridade: prioridade || 'normal',
        mensagens_count: 1,
      })
      .select()
      .single()

    if (error || !ticket) {
      console.error('[platform/support/tickets POST] insert', error)
      return NextResponse.json({ error: 'Erro ao criar ticket' }, { status: 500 })
    }

    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Usuário'

    await supabaseAdmin.from('support_messages').insert({
      ticket_id: ticket.id,
      sender_type: 'user',
      sender_id: user.id,
      sender_name: displayName,
      message: String(primeira_mensagem),
      is_bot_response: false,
    })

    notifyAgentsNewTicket({
      ticketId: ticket.id,
      area: PLATFORM_SUPPORT_AREA,
      assunto: String(assunto).substring(0, 200),
      primeiraMensagem: String(primeira_mensagem),
      prioridade: prioridade || 'normal',
      categoria: categoria || 'outras',
      userName: displayName,
      userEmail: user.email || undefined,
      createdAt: ticket.created_at,
    }).catch((err) => console.error('[platform/support/tickets] notify:', err))

    return NextResponse.json({ success: true, ticket })
  } catch (e: any) {
    console.error('[platform/support/tickets POST]', e)
    return NextResponse.json({ error: 'Erro ao criar ticket' }, { status: 500 })
  }
}
