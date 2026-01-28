import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendRegistrationLinkAfterClass, sendRemarketingToNonParticipant, getRegistrationName } from '@/lib/whatsapp-carol-ai'
import { isCarolAutomationDisabled } from '@/config/whatsapp-automation'

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
      .select('id, phone, name, customer_name, context, created_at, last_message_at')
      .eq('area', 'nutri')
      .eq('status', 'active')
      .contains('context', { workshop_session_id: sessionId })

    if (error) {
      throw error
    }

    // Enriquecer com informações de participação
    // Nome: priorizar customer_name (form/cadastro) e context.lead_name sobre name (evitar "Ylada Nutri");
    // se ainda vazio, buscar em workshop_inscricoes/contact_submissions via getRegistrationName
    const participants = await Promise.all(
      (conversations || []).map(async (conv: any) => {
        const context = conv.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []
        const hasParticipated = tags.includes('participou_aula')
        const hasNotParticipated = tags.includes('nao_participou_aula')
        let displayName =
          conv.customer_name ||
          (context.lead_name && String(context.lead_name).trim()) ||
          (conv.name && conv.name !== 'Ylada Nutri' ? conv.name : null) ||
          null

        if (!displayName && conv.phone) {
          const regName = await getRegistrationName(conv.phone, 'nutri')
          displayName = regName || null
        }

        return {
          conversationId: conv.id,
          phone: conv.phone,
          name: displayName || null,
          hasParticipated,
          hasNotParticipated,
          tags,
          createdAt: conv.created_at,
          lastMessageAt: conv.last_message_at,
        }
      })
    )

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
    // IMPORTANTE: Disparar remarketing sempre que marcar como "não participou"
    // (mesmo se a tag já existia, pois pode ser uma correção ou mudança de status)
    const hadNotParticipatedTag = tags.includes('nao_participou_aula')
    const wasParticipatedBefore = hadParticipatedTag && !hadNotParticipatedTag
    // Disparar se está marcando como "não participou" E:
    // - A tag não existia antes, OU
    // - Estava marcado como "participou" antes (mudança de status)
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

    // 🚀 Disparar flow automaticamente quando tag "participou_aula" é adicionada (desligado quando isCarolAutomationDisabled)
    if (isAddingParticipatedTag && !isCarolAutomationDisabled()) {
      console.log('[Workshop Participants] 🎉 Tag participou_aula adicionada - disparando flow automaticamente', {
        conversationId,
        phone: updated?.phone,
        name: updated?.name
      })
      setTimeout(async () => {
        try {
          const result = await sendRegistrationLinkAfterClass(conversationId)
          if (result.success) {
            console.log('[Workshop Participants] ✅ Flow disparado com sucesso para', conversationId)
          } else {
            console.error('[Workshop Participants] ❌ Erro ao disparar flow:', result.error)
            if (result.error?.includes('não encontrada') || result.error?.includes('não participou')) {
              setTimeout(async () => {
                const retryResult = await sendRegistrationLinkAfterClass(conversationId)
                if (retryResult.success) {
                  console.log('[Workshop Participants] ✅ Flow disparado na segunda tentativa para', conversationId)
                } else {
                  console.error('[Workshop Participants] ❌ Flow falhou na segunda tentativa:', retryResult.error)
                }
              }, 2000)
            }
          }
        } catch (error: any) {
          console.error('[Workshop Participants] ❌ Erro ao disparar flow:', error)
        }
      }, 1000)
    } else if (isAddingParticipatedTag && isCarolAutomationDisabled()) {
      console.log('[Workshop Participants] Automação desligada - link pós-participou não enviado.')
    }

    // 🚀 Disparar remarketing quando marca como "não participou" (desligado quando isCarolAutomationDisabled)
    if (!participated && !isCarolAutomationDisabled()) {
      console.log('[Workshop Participants] 📱 Marcado como "não participou" - disparando remarketing automaticamente', {
        conversationId,
        phone: updated?.phone
      })
      setTimeout(async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          const result = await sendRemarketingToNonParticipant(conversationId)
          if (result.success) {
            console.log('[Workshop Participants] ✅ Remarketing enviado com sucesso para', conversationId)
          } else {
            console.warn('[Workshop Participants] ⚠️ Remarketing não enviado:', result.error)
            if (result.error?.includes('não está marcada')) {
              setTimeout(async () => {
                const retryResult = await sendRemarketingToNonParticipant(conversationId)
                if (retryResult.success) {
                  console.log('[Workshop Participants] ✅ Remarketing enviado na segunda tentativa para', conversationId)
                } else {
                  console.error('[Workshop Participants] ❌ Remarketing falhou na segunda tentativa:', retryResult.error)
                }
              }, 2000)
            }
          }
        } catch (error: any) {
          console.error('[Workshop Participants] ❌ Erro ao disparar remarketing:', error)
        }
      }, 1000)
    } else if (!participated && isCarolAutomationDisabled()) {
      console.log('[Workshop Participants] Automação desligada - remarketing não enviado.')
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
