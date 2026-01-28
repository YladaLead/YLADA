import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/whatsapp/workshop/participants/adicionar
 * Adiciona uma conversa como participante confirmado de uma sessão.
 * Se não existir conversa para o telefone, cria uma — assim "estar cadastrado na sessão"
 * (sistema ou manual) é o gatilho único para receber os lembretes pré-aula.
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

    // Instância Z-API (necessária para criar conversa se não existir)
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id')
      .eq('area', 'nutri')
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return NextResponse.json(
        { error: 'Instância Z-API não encontrada' },
        { status: 500 }
      )
    }

    const phoneClean = phone.replace(/\D/g, '')
    const phoneNorm = phoneClean.startsWith('55') ? phoneClean : '55' + phoneClean

    // Buscar conversa pelo telefone (mesma instância nutri)
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context')
      .eq('area', 'nutri')
      .eq('status', 'active')
      .eq('instance_id', instance.id)
      .or(`phone.eq.${phoneNorm},phone.like.%${phoneClean.slice(-8)}%`)
      .limit(1)
      .maybeSingle()

    if (convError) {
      return NextResponse.json(
        { error: `Erro ao buscar conversa: ${convError.message}` },
        { status: 500 }
      )
    }

    let conversationId: string
    let updated: { id: string; phone: string; name: string | null; context: unknown }

    if (conversation) {
      // Já existe conversa: atualizar context para associar à sessão
      const context = conversation.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      const newTags = [...new Set([...tags, 'agendou_aula', 'recebeu_link_workshop'])]

      const { data: updatedConv, error: updateError } = await supabaseAdmin
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
      conversationId = conversation.id
      updated = updatedConv!
    } else {
      // Não existe conversa: criar para que a pessoa entre na lista e receba lembretes
      const { data: newConv, error: insertError } = await supabaseAdmin
        .from('whatsapp_conversations')
        .insert({
          instance_id: instance.id,
          phone: phoneNorm,
          name: null,
          area: 'nutri',
          status: 'active',
          context: {
            tags: ['agendou_aula', 'recebeu_link_workshop'],
            workshop_session_id: sessionId,
            scheduled_date: session.starts_at,
            source: 'workshop_participant_add',
          },
        })
        .select('id, phone, name, context')
        .single()

      if (insertError || !newConv) {
        return NextResponse.json(
          { error: `Erro ao criar conversa: ${insertError?.message || 'Erro desconhecido'}` },
          { status: 500 }
        )
      }
      conversationId = newConv.id
      updated = newConv
    }

    // Agendar notificações pré-aula (em background)
    setTimeout(async () => {
      try {
        const { schedulePreClassNotifications } = await import('@/lib/whatsapp-automation/pre-class')
        await schedulePreClassNotifications(conversationId, sessionId)
        console.log('[Adicionar Participante] ✅ Notificações pré-aula agendadas para', conversationId)
      } catch (error: any) {
        console.error('[Adicionar Participante] ❌ Erro ao agendar notificações pré-aula:', error)
      }
    }, 1000)

    return NextResponse.json({
      success: true,
      message: conversation ? `${updated.name || 'Participante'} adicionado(a) à sessão` : 'Participante adicionado à sessão — conversa criada; receberá lembretes pré-aula.',
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
