import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'

/**
 * DELETE /api/whatsapp/conversations/[id]/messages/[messageId]
 * Deleta uma mensagem do WhatsApp
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const conversationId = params.id
    const messageId = params.messageId

    // Buscar mensagem no banco
    const { data: message, error: msgError } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('*, whatsapp_conversations!inner(phone, instance_id, z_api_instances(instance_id, token))')
      .eq('id', messageId)
      .eq('conversation_id', conversationId)
      .single()

    if (msgError || !message) {
      return NextResponse.json({ error: 'Mensagem não encontrada' }, { status: 404 })
    }

    // Verificar se é mensagem enviada por nós (bot/agent) - só pode deletar mensagens que enviamos
    const canDelete = message.sender_type === 'bot' || message.sender_type === 'agent' || message.is_bot_response

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Só é possível deletar mensagens enviadas pela Carol ou pelo admin' },
        { status: 403 }
      )
    }

    // Buscar dados da instância
    const conversation = message.whatsapp_conversations as any
    const instance = conversation?.z_api_instances

    if (!instance || !instance.instance_id || !instance.token) {
      return NextResponse.json(
        { error: 'Instância Z-API não encontrada ou não configurada' },
        { status: 404 }
      )
    }

    // Deletar mensagem via Z-API (se tiver z_api_message_id)
    if (message.z_api_message_id) {
      try {
        const client = createZApiClient(instance.instance_id, instance.token)
        const deleteResult = await client.deleteMessage({
          messageId: message.z_api_message_id,
          fromMe: true,
          phone: conversation.phone,
          from: 'everyone', // Deletar para todos
        })

        if (!deleteResult.success) {
          console.error('[Delete Message] Erro ao deletar via Z-API:', deleteResult.error)
          // Continuar mesmo se falhar na Z-API, vamos marcar como deletada no banco
        }
      } catch (error: any) {
        console.error('[Delete Message] Erro ao deletar via Z-API:', error)
        // Continuar mesmo se falhar
      }
    }

    // Marcar mensagem como deletada no banco (soft delete)
    const { error: updateError } = await supabaseAdmin
      .from('whatsapp_messages')
      .update({
        status: 'deleted',
        message: '[Mensagem deletada]',
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      message: 'Mensagem deletada com sucesso',
    })
  } catch (error: any) {
    console.error('[Delete Message] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar mensagem', details: error.message },
      { status: 500 }
    )
  }
}
