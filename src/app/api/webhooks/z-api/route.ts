/**
 * Webhook Z-API para receber mensagens
 * Endpoint: POST /api/webhooks/z-api
 * 
 * Configurar na Z-API:
 * - URL: https://seu-site.com/api/webhooks/z-api
 * - Eventos: "Ao receber" (On receive)
 * 
 * IMPORTANTE: Este endpoint só aceita POST (não GET)
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/webhooks/z-api (não suportado)
 * Webhooks só funcionam com POST
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Método não permitido',
      message: 'Este endpoint só aceita requisições POST. Webhooks devem ser configurados na Z-API para enviar POST requests.',
      hint: 'Configure o webhook na Z-API com a URL: https://www.ylada.com/api/webhooks/z-api'
    },
    { status: 405 }
  )
}
import { createClient } from '@supabase/supabase-js'
import { sendWhatsAppMessage } from '@/lib/z-api'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ZApiWebhookPayload {
  phone?: string
  from?: string // Z-API pode enviar 'from' ao invés de 'phone'
  message?: string
  text?: string // Z-API pode enviar 'text' ao invés de 'message'
  body?: string // Z-API pode enviar 'body' ao invés de 'message'
  name?: string
  timestamp?: string
  instanceId?: string
  instance?: string // Z-API pode enviar 'instance' ao invés de 'instanceId'
  messageId?: string
  type?: string
  // Campos adicionais que Z-API pode enviar
  [key: string]: any
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
      // Buscar instância da área Nutri (ou usar a instância atual)
      const { data: instances } = await supabase
        .from('z_api_instances')
        .select('instance_id, token')
        .eq('area', 'nutri')
        .eq('status', 'connected')
        .limit(1)
      
      const instance = instances && instances.length > 0 ? instances[0] : null
      
      if (instance) {
        console.log('[Z-API Webhook] 📱 Enviando notificação para:', notificationPhone)
        await sendWhatsAppMessage(
          notificationPhone,
          `🔔 Nova mensagem WhatsApp\n\n📱 De: ${phone}\n💬 ${message.substring(0, 200)}`,
          instance.instance_id,
          instance.token
        )
        console.log('[Z-API Webhook] ✅ Notificação enviada com sucesso')
      } else {
        console.warn('[Z-API Webhook] ⚠️ Instância não encontrada para enviar notificação')
      }
    } catch (error) {
      console.error('[Z-API Webhook] ❌ Erro ao enviar notificação:', error)
    }
  } else {
    console.log('[Z-API Webhook] ℹ️ Z_API_NOTIFICATION_PHONE não configurado')
  }
}

/**
 * POST /api/webhooks/z-api
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json()
    
    // Log completo do payload recebido para debug
    console.log('[Z-API Webhook] 📥 Payload completo recebido:', JSON.stringify(rawBody, null, 2))

    // Normalizar payload - Z-API envia em formato específico
    // Formato Z-API: { phone, text: { message }, instance, etc. }
    const body: any = rawBody
    
    // Extrair phone (Z-API envia como 'phone')
    const phone = body.phone || body.from || body.sender || null
    
    // Extrair message - Z-API envia como text.message ou diretamente como message
    let message: string | null = null
    if (body.text && typeof body.text === 'object' && body.text.message) {
      // Formato Z-API: { text: { message: "..." } }
      message = body.text.message
    } else if (body.text && typeof body.text === 'string') {
      // Formato alternativo: { text: "..." }
      message = body.text
    } else if (body.message) {
      // Formato direto: { message: "..." }
      message = body.message
    } else if (body.body) {
      // Formato alternativo: { body: "..." }
      message = body.body
    }
    
    // Extrair instanceId (Z-API pode enviar como 'instance' ou 'instanceId')
    const instanceId = body.instanceId || body.instance || body.instance_id || null
    
    // Extrair name (Z-API pode enviar como 'name', 'senderName', 'contactName', etc.)
    const name = body.name || body.senderName || body.contactName || body.contact?.name || null
    
    // Extrair type (Z-API envia como 'type')
    const type = body.type || 'text'
    
    // Extrair messageId (Z-API envia como 'messageId')
    const messageId = body.messageId || null
    
    // Extrair timestamp (Z-API pode enviar como 'momment' em milissegundos ou 'timestamp')
    let timestamp: string | null = null
    if (body.momment) {
      // Converter milissegundos para ISO string
      timestamp = new Date(body.momment).toISOString()
    } else if (body.timestamp) {
      timestamp = body.timestamp
    } else {
      timestamp = new Date().toISOString()
    }
    
    console.log('[Z-API Webhook] 🔍 Dados normalizados:', {
      phone,
      message: message?.substring(0, 50),
      instanceId,
      name,
      type,
      rawKeys: Object.keys(rawBody)
    })

    // Validar payload
    if (!phone || !message) {
      console.error('[Z-API Webhook] ❌ Payload inválido:', {
        phone: phone || 'FALTANDO',
        message: message ? message.substring(0, 50) : 'FALTANDO',
        rawBody: JSON.stringify(rawBody).substring(0, 500)
      })
      return NextResponse.json(
        { 
          error: 'phone/from e message/text são obrigatórios',
          received: rawBody,
          hint: 'Z-API deve enviar: phone/from e message/text/body'
        },
        { status: 400 }
      )
    }

    // O webhook da Z-API envia o instanceId no payload
    // Se não vier, usa do banco de dados (melhor para múltiplas instâncias)
    let finalInstanceId = instanceId
    
    // Se não veio no payload, buscar do banco (primeira instância conectada)
    if (!finalInstanceId) {
      const { data: instance } = await supabase
        .from('z_api_instances')
        .select('instance_id')
        .eq('status', 'connected')
        .limit(1)
        .single()
      
      if (instance) {
        finalInstanceId = instance.instance_id
      } else {
        // Fallback: usar do env (útil para testes)
        finalInstanceId = process.env.Z_API_INSTANCE_ID
      }
    }
    
    if (!finalInstanceId) {
      console.error('[Z-API Webhook] ❌ InstanceId não encontrado')
      return NextResponse.json(
        { error: 'instanceId não encontrado. Configure no banco ou no .env' },
        { status: 400 }
      )
    }

    console.log('[Z-API Webhook] 🔍 InstanceId encontrado:', finalInstanceId)

    // 1. Identificar área (sempre Nutri para esta instância)
    const area = await identifyArea(phone, message, finalInstanceId)
    console.log('[Z-API Webhook] 🏷️ Área identificada:', area)

    // 2. Criar ou buscar conversa
    const conversationId = await getOrCreateConversation(
      finalInstanceId,
      phone,
      name || null,
      area
    )
    console.log('[Z-API Webhook] 💬 Conversa ID:', conversationId)

    // 3. Salvar mensagem (usar payload normalizado)
    const normalizedPayload: ZApiWebhookPayload = {
      phone,
      message,
      name: name || null,
      instanceId: finalInstanceId,
      messageId: messageId || null,
      type: type || 'text',
      timestamp: timestamp || new Date().toISOString()
    }
    
    await saveMessage(conversationId, finalInstanceId, normalizedPayload)
    console.log('[Z-API Webhook] ✅ Mensagem salva no banco')

    // 4. Notificar administradores
    await notifyAdmins(conversationId, phone, message)
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
