import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { PLATFORM_SUPPORT_AREA } from '@/lib/platform-support-constants'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    const { data: ticket, error } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !ticket) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 })
    }

    if (ticket.area !== PLATFORM_SUPPORT_AREA || ticket.user_id !== user.id) {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const { data: messages } = await supabaseAdmin
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticket.id)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      success: true,
      ticket: {
        ...ticket,
        messages: messages || [],
      },
    })
  } catch (e: any) {
    console.error('[platform/support/tickets/[id] GET]', e)
    return NextResponse.json({ error: 'Erro ao buscar ticket' }, { status: 500 })
  }
}
