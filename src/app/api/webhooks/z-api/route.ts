/**
 * Webhook Z-API para receber mensagens
 * Endpoint: POST /api/webhooks/z-api
 * 
 * Configurar na Z-API:
 * - URL: https://seu-site.com/api/webhooks/z-api
 * - Eventos: "Ao receber" (On receive)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWhatsAppMessage } from '@/lib/z-api'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ZApiWebhookPayload {
  phone: string
  message: string
  name?: string
  timestamp?: string
  instanceId?: string
  messageId?: string
  type?: string
}

/**
 * Identifica área baseado no número ou contexto
 * IMPORTANTE: Esta instância é apenas para Nutri
 */
async function identifyArea(phone: string, message: string, instanceId: string): Promise<string | null> {
  // Verificar qual instância está recebendo (garantir que é Nutri)
  const { data: instance } = await supabase
    .from('z_api_instances')
    .select('area')
    .eq('instance_id', instanceId)
    .single()

  // Se a instância é Nutri, sempre retornar 'nutri'
  if (instance?.area === 'nutri') {
    return 'nutri'
  }

  // 1. Buscar no banco de dados por telefone
  const { data: conversation } = await supabase
    .from('whatsapp_conversations')
    .select('area')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (conversation?.area) {
    return conversation.area
  }

  // 2. Buscar em leads/usuários
  const { data: lead } = await supabase
    .from('leads')
    .select('area')
    .eq('telefone', phone)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (lead?.area) {
    return lead.area
  }

  // 3. Análise por palavras-chave (priorizar Nutri)
  const messageLower = message.toLowerCase()
  const nutriKeywords = ['nutrição', 'nutricionista', 'dieta', 'nutri', 'emagrecer', 'alimentação']

  if (nutriKeywords.some((keyword) => messageLower.includes(keyword))) {
    return 'nutri'
  }

  // Por padrão, se não identificar, retornar 'nutri' (já que esta instância é Nutri)
  return 'nutri'
}

/**
 * Busca instância Z-API baseado na área ou usa padrão
 */
async function getInstanceForArea(area: string | null): Promise<{
  instanceId: string
  token: string
} | null> {
  // Buscar instância específica da área
  if (area) {
    const { data: instance } = await supabase
      .from('z_api_instances')
      .select('instance_id, token')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .single()

    if (instance) {
      return {
        instanceId: instance.instance_id,
        token: instance.token,
      }
    }
  }

  // Usar primeira instância disponível como fallback
  const { data: instance } = await supabase
    .from('z_api_instances')
    .select('instance_id, token')
    .eq('status', 'connected')
    .limit(1)
    .single()

  if (instance) {
    return {
      instanceId: instance.instance_id,
      token: instance.token,
    }
  }

  return null
}

/**
 * Cria ou atualiza conversa
 */
async function getOrCreateConversation(
  instanceId: string,
  phone: string,
  name: string | undefined,
  area: string | null
) {
  // Buscar instância no banco
  const { data: instance } = await supabase
    .from('z_api_instances')
    .select('id')
    .eq('instance_id', instanceId)
    .single()

  if (!instance) {
    throw new Error('Instância não encontrada no banco')
  }

  // Buscar conversa existente
  const { data: existing } = await supabase
    .from('whatsapp_conversations')
    .select('id')
    .eq('instance_id', instance.id)
    .eq('phone', phone)
    .limit(1)
    .single()

  if (existing) {
    // Atualizar área se não tiver
    if (!existing.area && area) {
      await supabase
        .from('whatsapp_conversations')
        .update({ area, name: name || undefined })
        .eq('id', existing.id)
    }
    return existing.id
  }

  // Criar nova conversa
  const { data: newConversation, error } = await supabase
    .from('whatsapp_conversations')
    .insert({
      instance_id: instance.id,
      phone,
      name: name || null,
      area: area || null,
      status: 'active',
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Erro ao criar conversa: ${error.message}`)
  }

  return newConversation.id
}

/**
 * Salva mensagem no banco
 */
async function saveMessage(
  conversationId: string,
  instanceId: string,
  payload: ZApiWebhookPayload
) {
  // Buscar ID da instância no banco
  const { data: instance } = await supabase
    .from('z_api_instances')
    .select('id')
    .eq('instance_id', instanceId)
    .single()

  if (!instance) {
    throw new Error('Instância não encontrada')
  }

  const { error } = await supabase.from('whatsapp_messages').insert({
    conversation_id: conversationId,
    instance_id: instance.id,
    z_api_message_id: payload.messageId || null,
    sender_type: 'customer',
    sender_name: payload.name || null,
    sender_phone: payload.phone,
    message: payload.message,
    message_type: payload.type || 'text',
    status: 'delivered',
    is_bot_response: false,
  })

  if (error) {
    console.error('[Z-API Webhook] Erro ao salvar mensagem:', error)
    throw error
  }
}

/**
 * Envia notificação para administradores
 */
async function notifyAdmins(conversationId: string, phone: string, message: string) {
  // Buscar administradores
  const { data: admins } = await supabase
    .from('auth.users')
    .select('id')
    .eq('raw_user_meta_data->>role', 'admin')
    .limit(10)

  if (!admins || admins.length === 0) {
    return
  }

  // Criar notificações
  const notifications = admins.map((admin) => ({
    conversation_id: conversationId,
    user_id: admin.id,
    notification_type: 'new_message',
    title: 'Nova mensagem WhatsApp',
    message: `Nova mensagem de ${phone}: ${message.substring(0, 100)}`,
    metadata: { phone, message_preview: message.substring(0, 100) },
  }))

  await supabase.from('whatsapp_notifications').insert(notifications)

  // Enviar notificação via Z-API para número de notificação (se configurado)
  const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
  if (notificationPhone) {
    try {
      const instance = await getInstanceForArea(null)
      if (instance) {
        await sendWhatsAppMessage(
          notificationPhone,
          `🔔 Nova mensagem WhatsApp\n\n📱 De: ${phone}\n💬 ${message.substring(0, 200)}`,
          instance.instanceId,
          instance.token
        )
      }
    } catch (error) {
      console.error('[Z-API Webhook] Erro ao enviar notificação:', error)
    }
  }
}

/**
 * POST /api/webhooks/z-api
 */
export async function POST(request: NextRequest) {
  try {
    const body: ZApiWebhookPayload = await request.json()

    console.log('[Z-API Webhook] 📥 Mensagem recebida:', {
      phone: body.phone,
      message: body.message?.substring(0, 50),
      instanceId: body.instanceId,
      fullBody: JSON.stringify(body).substring(0, 200), // Log completo para debug
    })

    // Validar payload
    if (!body.phone || !body.message) {
      return NextResponse.json(
        { error: 'phone e message são obrigatórios' },
        { status: 400 }
      )
    }

    // O webhook da Z-API envia o instanceId no payload
    // Se não vier, usa do banco de dados (melhor para múltiplas instâncias)
    let instanceId = body.instanceId
    
    // Se não veio no payload, buscar do banco (primeira instância conectada)
    if (!instanceId) {
      const { data: instance } = await supabase
        .from('z_api_instances')
        .select('instance_id')
        .eq('status', 'connected')
        .limit(1)
        .single()
      
      if (instance) {
        instanceId = instance.instance_id
      } else {
        // Fallback: usar do env (útil para testes)
        instanceId = process.env.Z_API_INSTANCE_ID
      }
    }
    
    if (!instanceId) {
      return NextResponse.json(
        { error: 'instanceId não encontrado. Configure no banco ou no .env' },
        { status: 400 }
      )
    }

    console.log('[Z-API Webhook] 🔍 InstanceId encontrado:', instanceId)

    // 1. Identificar área (sempre Nutri para esta instância)
    const area = await identifyArea(body.phone, body.message, instanceId)
    console.log('[Z-API Webhook] 🏷️ Área identificada:', area)

    // 2. Criar ou buscar conversa
    const conversationId = await getOrCreateConversation(
      instanceId,
      body.phone,
      body.name,
      area
    )
    console.log('[Z-API Webhook] 💬 Conversa ID:', conversationId)

    // 3. Salvar mensagem
    await saveMessage(conversationId, instanceId, body)
    console.log('[Z-API Webhook] ✅ Mensagem salva no banco')

    // 4. Notificar administradores
    await notifyAdmins(conversationId, body.phone, body.message)
    console.log('[Z-API Webhook] 🔔 Notificações enviadas')

    // 5. TODO: Processar com bot (NOEL, Nutri, etc.) se configurado
    // Isso será implementado depois

    console.log('[Z-API Webhook] ✅ Processamento completo')
    return NextResponse.json({ received: true, conversationId, area })
  } catch (error: any) {
    console.error('[Z-API Webhook] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}
