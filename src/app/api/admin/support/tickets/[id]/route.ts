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
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    const { data: ticket, error } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !ticket || ticket.area !== PLATFORM_SUPPORT_AREA) {
      return NextResponse.json({ error: 'Ticket não encontrado' }, { status: 404 })
    }

    const { data: messages } = await supabaseAdmin
      .from('support_messages')
      .select('*')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true })

    const { data: u } = await supabaseAdmin.auth.admin.getUserById(ticket.user_id)
    const user_name =
      u?.user?.user_metadata?.full_name ||
      u?.user?.email?.split('@')[0] ||
      'Usuário'
    const user_email = u?.user?.email || null

    return NextResponse.json({
      success: true,
      ticket: {
        ...ticket,
        user_name,
        user_email,
        messages: messages || [],
      },
    })
  } catch (e: any) {
    console.error('[admin/support/tickets/[id] GET]', e)
    return NextResponse.json({ error: 'Erro ao buscar ticket' }, { status: 500 })
  }
}
