/**
 * POST /api/admin/whatsapp/workshop/participants/remover
 * Remove uma pessoa do agendamento (desagenda). Limpa workshop_session_id e tags de agendamento.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { conversationId, sessionId } = body

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId é obrigatório' },
        { status: 400 }
      )
    }

    const { data: conversation, error: fetchError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, context')
      .eq('id', conversationId)
      .eq('area', 'nutri')
      .single()

    if (fetchError || !conversation) {
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    const context = (conversation.context as Record<string, unknown>) || {}
    const currentSessionId = context.workshop_session_id

    if (!currentSessionId) {
      return NextResponse.json(
        { error: 'Esta pessoa não está agendada em nenhuma sessão.' },
        { status: 400 }
      )
    }

    if (sessionId && currentSessionId !== sessionId) {
      return NextResponse.json(
        { error: 'Esta pessoa não está agendada nesta sessão.' },
        { status: 400 }
      )
    }

    const tags = Array.isArray(context.tags) ? context.tags : []
    const newTags = tags.filter(
      (t: string) =>
        t !== 'agendou_aula' &&
        t !== 'recebeu_link_workshop'
      // Mantemos participou_aula / nao_participou_aula se existirem (histórico)
    )

    const { workshop_session_id, scheduled_date, ...restContext } = context
    const newContext = {
      ...restContext,
      tags: newTags,
      workshop_session_id: null,
      scheduled_date: null,
    }

    const { error: updateError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .update({ context: newContext })
      .eq('id', conversationId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      message: 'Agendamento removido. A pessoa não consta mais como confirmada para esta aula.',
    })
  } catch (error: any) {
    console.error('[Workshop Participants Remover] Erro:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao remover agendamento' },
      { status: 500 }
    )
  }
}
