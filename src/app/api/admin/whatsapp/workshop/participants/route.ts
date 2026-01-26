import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendRegistrationLinkAfterClass, sendRemarketingToNonParticipant } from '@/lib/whatsapp-carol-ai'

/**
 * GET /api/admin/whatsapp/workshop/participants
 * Lista participantes confirmados de uma sessão específica
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id é obrigatório' }, { status: 400 })
    }

    // Buscar conversas que têm workshop_session_id = sessionId
    const { data: conversations, error } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context, created_at, last_message_at')
      .eq('area', 'nutri')
      .eq('status', 'active')
      .contains('context', { workshop_session_id: sessionId })

    if (error) {
      throw error
    }

    // Enriquecer com informações de participação
    const participants = (conversations || []).map((conv: any) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      const hasParticipated = tags.includes('participou_aula')
      const hasNotParticipated = tags.includes('nao_participou_aula')

      return {
        conversationId: conv.id,
        phone: conv.phone,
        name: conv.name || null,
        hasParticipated,
        hasNotParticipated,
        tags,
        createdAt: conv.created_at,
        lastMessageAt: conv.last_message_at,
      }
    })

    return NextResponse.json({
      success: true,
      participants,
      total: participants.length,
    })
  } catch (error: any) {
    console.error('[Workshop Participants] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar participantes', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/whatsapp/workshop/participants
 * Marca participante como "participou" ou "não participou"
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { conversationId, participated } = body

    if (!conversationId || typeof participated !== 'boolean') {
      return NextResponse.json(
        { error: 'conversationId e participated são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar conversa atual
    const { data: conversation, error: fetchError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('context')
      .eq('id', conversationId)
      .single()

    if (fetchError || !conversation) {
      return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })
    }

    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []

    // Remover tags antigas de participação
    const newTags = tags.filter(
      (tag: string) => tag !== 'participou_aula' && tag !== 'nao_participou_aula'
    )

    // Adicionar tag apropriada
    if (participated) {
      newTags.push('participou_aula')
      // Remover tag de não participou se existir
    } else {
      newTags.push('nao_participou_aula')
    }

    // Verificar se a tag "participou_aula" está sendo adicionada agora
    const hadParticipatedTag = tags.includes('participou_aula')
    const isAddingParticipatedTag = participated && !hadParticipatedTag

    // Verificar se a tag "nao_participou_aula" está sendo adicionada agora
    // IMPORTANTE: Disparar remarketing se:
    // 1. Está marcando como "não participou" E a tag não existia antes
    // 2. OU estava marcado como "participou" antes e agora está mudando para "não participou"
    const hadNotParticipatedTag = tags.includes('nao_participou_aula')
    const wasParticipatedBefore = hadParticipatedTag && !hadNotParticipatedTag
    const isAddingNotParticipatedTag = !participated && (!hadNotParticipatedTag || wasParticipatedBefore)

    // Atualizar conversa
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        context: {
          ...context,
          tags: newTags,
          participated_at: participated ? new Date().toISOString() : null,
        },
      })
      .eq('id', conversationId)
      .select('*')
      .single()

    if (updateError) {
      throw updateError
    }

    // 🚀 Disparar flow automaticamente quando tag "participou_aula" é adicionada
    if (isAddingParticipatedTag) {
      console.log('[Workshop Participants] 🎉 Tag participou_aula adicionada - disparando flow automaticamente')
      // Disparar em background (não bloquear a resposta)
      sendRegistrationLinkAfterClass(conversationId).catch((error: any) => {
        console.error('[Workshop Participants] ❌ Erro ao disparar flow:', error)
      })
    }

    // 🚀 Disparar remarketing automaticamente quando tag "nao_participou_aula" é adicionada
    // Disparar se:
    // 1. Está marcando como "não participou" E a tag não existia antes
    // 2. OU estava marcado como "participou" e agora está mudando para "não participou"
    if (isAddingNotParticipatedTag) {
      console.log('[Workshop Participants] 📱 Tag nao_participou_aula adicionada - disparando remarketing automaticamente', {
        conversationId,
        hadNotParticipatedTag,
        hadParticipatedTag,
        wasParticipatedBefore,
        participated
      })
      // Disparar em background (não bloquear a resposta)
      sendRemarketingToNonParticipant(conversationId).catch((error: any) => {
        console.error('[Workshop Participants] ❌ Erro ao disparar remarketing:', error)
      })
    } else {
      console.log('[Workshop Participants] ⏭️ Remarketing não disparado:', {
        conversationId,
        participated,
        hadNotParticipatedTag,
        hadParticipatedTag,
        isAddingNotParticipatedTag
      })
    }

    return NextResponse.json({
      success: true,
      message: participated
        ? 'Participante marcado como participou'
        : 'Participante marcado como não participou',
      conversation: updated,
    })
  } catch (error: any) {
    console.error('[Workshop Participants] Erro ao marcar participação:', error)
    return NextResponse.json(
      { error: 'Erro ao marcar participação', details: error.message },
      { status: 500 }
    )
  }
}
