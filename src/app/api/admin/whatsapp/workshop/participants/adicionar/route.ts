import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/whatsapp/workshop/participants/adicionar
 * Adiciona uma conversa como participante confirmado de uma sessão
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { sessionId, phone } = body

    if (!sessionId || !phone) {
      return NextResponse.json(
        { error: 'sessionId e phone são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar sessão
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, starts_at')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    // Buscar conversa pelo telefone
    const phoneClean = phone.replace(/\D/g, '')
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', 'nutri')
      .eq('status', 'active')
      .or(`phone.eq.${phoneClean},phone.like.%${phoneClean.slice(-8)}%`)
      .limit(1)
      .maybeSingle()

    if (convError) {
      return NextResponse.json(
        { error: `Erro ao buscar conversa: ${convError.message}` },
        { status: 500 }
      )
    }

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversa não encontrada para este telefone' },
        { status: 404 }
      )
    }

    // Atualizar context da conversa para associar à sessão
    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []

    // Adicionar tags se não existirem
    const newTags = [...new Set([...tags, 'agendou_aula', 'recebeu_link_workshop'])]

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        context: {
          ...context,
          tags: newTags,
          workshop_session_id: sessionId,
          scheduled_date: session.starts_at,
        },
      })
      .eq('id', conversation.id)
      .select('id, phone, name, context')
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: `Erro ao associar à sessão: ${updateError.message}` },
        { status: 500 }
      )
    }

    // Agendar notificações pré-aula (em background, não bloquear resposta)
    setTimeout(async () => {
      try {
        const { schedulePreClassNotifications } = await import('@/lib/whatsapp-automation/pre-class')
        await schedulePreClassNotifications(conversation.id, sessionId)
        console.log('[Adicionar Participante] ✅ Notificações pré-aula agendadas para', conversation.id)
      } catch (error: any) {
        console.error('[Adicionar Participante] ❌ Erro ao agendar notificações pré-aula:', error)
      }
    }, 1000)

    return NextResponse.json({
      success: true,
      message: `${conversation.name || 'Participante'} adicionado(a) à sessão`,
      conversation: updated,
    })
  } catch (error: any) {
    console.error('[Adicionar Participante] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao adicionar participante' },
      { status: 500 }
    )
  }
}
