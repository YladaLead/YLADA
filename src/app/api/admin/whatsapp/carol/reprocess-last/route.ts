/**
 * POST /api/admin/whatsapp/carol/reprocess-last
 *
 * Reprocessa a última mensagem do cliente com a Carol (útil quando o webhook não disparou
 * ou a Carol não respondeu automaticamente).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { isCarolAutomationDisabled } from '@/config/whatsapp-automation'
import { supabaseAdmin } from '@/lib/supabase'
import { processIncomingMessageWithCarol } from '@/lib/whatsapp-carol-ai'

export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult
  if (isCarolAutomationDisabled()) {
    return NextResponse.json({ disabled: true, message: 'Automação temporariamente desligada' }, { status: 503 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const { conversationId } = body as { conversationId?: string }

    if (!conversationId || typeof conversationId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'conversationId é obrigatório' },
        { status: 400 }
      )
    }

    const area = 'nutri'

    const { data: conversation, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, area, instance_id')
      .eq('id', conversationId)
      .eq('area', area)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    const { data: lastMsg } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('message, created_at')
      .eq('conversation_id', conversationId)
      .eq('sender_type', 'customer')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!lastMsg?.message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Nenhuma mensagem do cliente nesta conversa para reprocessar' },
        { status: 400 }
      )
    }

    const instanceId = conversation.instance_id
    if (!instanceId) {
      return NextResponse.json(
        { success: false, error: 'Conversa sem instância Z-API vinculada' },
        { status: 400 }
      )
    }

    const result = await processIncomingMessageWithCarol(
      conversationId,
      conversation.phone,
      lastMsg.message.trim(),
      conversation.area || area,
      instanceId
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        response: result.response,
        message: 'Carol respondeu à última mensagem do cliente.',
      })
    }

    return NextResponse.json(
      { success: false, error: result.error || 'Carol não conseguiu responder' },
      { status: 500 }
    )
  } catch (error: any) {
    console.error('[Carol reprocess-last] Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao reprocessar com Carol' },
      { status: 500 }
    )
  }
}
