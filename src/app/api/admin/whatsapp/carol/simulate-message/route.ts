/**
 * POST /api/admin/whatsapp/carol/simulate-message
 *
 * Simula uma mensagem do cliente e dispara a Carol.
 * Tudo roda no servidor (instância Z-API via service role), evitando RLS no client.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { processIncomingMessageWithCarol, getZApiInstance } from '@/lib/whatsapp-carol-ai'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json().catch(() => ({}))
    const { conversationId, message } = body

    if (!conversationId || !message || typeof message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'conversationId e message são obrigatórios' },
        { status: 400 }
      )
    }

    const area = 'nutri'

    // 1. Buscar conversa
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, area, instance_id')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // 2. Resolver instância Z-API (servidor usa service role → sem RLS)
    let instanceId: string | null = conversation.instance_id || null
    if (!instanceId) {
      const instance = await getZApiInstance(area)
      if (!instance) {
        return NextResponse.json(
          {
            success: false,
            error: 'Instância não encontrada. Verifique se há uma instância Z-API conectada para a área nutri',
          },
          { status: 502 }
        )
      }
      instanceId = instance.id
    }

    // 3. Inserir mensagem como se fosse do cliente
    await supabaseAdmin.from('whatsapp_messages').insert({
      conversation_id: conversationId,
      instance_id: instanceId,
      sender_type: 'customer',
      sender_name: conversation.name || 'Cliente',
      message: message.trim(),
      message_type: 'text',
      status: 'delivered',
      is_bot_response: false,
    })

    // 4. Atualizar última mensagem da conversa
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_from: 'customer',
      })
      .eq('id', conversationId)

    // 5. Processar com Carol (usa instanceId = UUID ou instance_id da z_api)
    const result = await processIncomingMessageWithCarol(
      conversationId,
      conversation.phone,
      message.trim(),
      conversation.area || area,
      instanceId
    )

    return NextResponse.json({
      success: result.success,
      response: result.response,
      error: result.error,
    })
  } catch (error: any) {
    console.error('[Carol simulate-message] Erro:', error)
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erro ao simular mensagem e processar com Carol',
      },
      { status: 500 }
    )
  }
}
