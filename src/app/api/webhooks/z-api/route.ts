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

  // 3. Análise por palavras-chave (detectar segmento específico)
  const messageLower = message.toLowerCase()
  
  // Palavras-chave para AULA PRÁTICA (Nutri)
  const aulaPraticaKeywords = [
    'aula prática', 'aula pratica', 'workshop', 'apresentação', 'consulta',
    'nutrição', 'nutricionista', 'dieta', 'nutri', 'emagrecer', 'alimentação',
    'plano nutricional', 'acompanhamento nutricional', 'agendar consulta'
  ]
  
  // Palavras-chave para BEBIDAS FUNCIONAIS (Wellness)
  const bebidasKeywords = [
    'bebida funcional', 'bebidas funcionais', 'kit energia', 'acelera',
    'turbo detox', 'hype drink', 'herbalife', 'distribuidor', 'oportunidade',
    'renda extra', 'negócio', 'vender bebidas'
  ]
  
  // Verificar se é aula prática (nutri)
  if (aulaPraticaKeywords.some((keyword) => messageLower.includes(keyword))) {
    console.log('[identifyArea] ✅ Detectado: Aula Prática (Nutri)')
    return 'nutri'
  }
  
  // Verificar se é bebidas funcionais (wellness)
  if (bebidasKeywords.some((keyword) => messageLower.includes(keyword))) {
    console.log('[identifyArea] ✅ Detectado: Bebidas Funcionais (Wellness)')
    return 'wellness'
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
  area: string | null,
  contextPatch?: Record<string, any> | null
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
    .select('id, area, name, context')
    .eq('instance_id', instance.id)
    .eq('phone', phone)
    .limit(1)
    .single()

  if (existing) {
    // Atualizar área/nome/context se necessário
    const updateData: any = {}
    if (!existing.area && area) updateData.area = area
    if (!existing.name && name) updateData.name = name

    if (contextPatch && typeof contextPatch === 'object') {
      const prev = (existing.context && typeof existing.context === 'object' && !Array.isArray(existing.context))
        ? (existing.context as any)
        : {}
      updateData.context = { ...prev, ...contextPatch }
    }

    if (Object.keys(updateData).length > 0) {
      await supabase.from('whatsapp_conversations').update(updateData).eq('id', existing.id)
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
      context: contextPatch || null,
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
  payload: ZApiWebhookPayload,
  isFromUs: boolean = false
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

  // Se é mensagem enviada por nós, verificar se já existe para evitar duplicatas
  if (isFromUs && payload.messageId) {
    const { data: existing } = await supabase
      .from('whatsapp_messages')
      .select('id')
      .eq('z_api_message_id', payload.messageId)
      .maybeSingle()
    
    if (existing) {
      console.log('[Z-API Webhook] ⏭️ Mensagem já existe, ignorando duplicata:', payload.messageId)
      return // Mensagem já existe, não salvar novamente
    }
  }

  // Determinar sender_type baseado em isFromUs
  const senderType = isFromUs ? 'agent' : 'customer'
  const status = isFromUs ? 'sent' : 'delivered'

  const { error } = await supabase.from('whatsapp_messages').insert({
    conversation_id: conversationId,
    instance_id: instance.id,
    z_api_message_id: payload.messageId || null,
    sender_type: senderType,
    sender_name: isFromUs ? 'Telefone' : (payload.name || null),
    sender_phone: payload.phone,
    message: payload.message,
    message_type: payload.type || 'text',
    status: status,
    is_bot_response: false,
  })

  if (error) {
    console.error('[Z-API Webhook] Erro ao salvar mensagem:', error)
    throw error
  }
  
  // Atualizar last_message_at e last_message_from da conversa
  const now = new Date().toISOString()
  await supabase
    .from('whatsapp_conversations')
    .update({
      last_message_at: now,
      last_message_from: senderType === 'agent' ? 'agent' : 'customer',
      updated_at: now,
    })
    .eq('id', conversationId)
  
  // Atualizar contadores
  if (senderType === 'customer') {
    // Incrementar unread_count se for mensagem do cliente
    try {
      await supabase.rpc('increment', {
        table_name: 'whatsapp_conversations',
        column_name: 'unread_count',
        row_id: conversationId,
      })
    } catch {
      // Se RPC não existir, fazer update manual
      const { data: conv } = await supabase
        .from('whatsapp_conversations')
        .select('unread_count')
        .eq('id', conversationId)
        .single()
      
      if (conv) {
        await supabase
          .from('whatsapp_conversations')
          .update({ unread_count: (conv.unread_count || 0) + 1 })
          .eq('id', conversationId)
      }
    }
  }
  
  // Incrementar total_messages
  try {
    await supabase.rpc('increment', {
      table_name: 'whatsapp_conversations',
      column_name: 'total_messages',
      row_id: conversationId,
    })
  } catch {
    // Se RPC não existir, fazer update manual
    const { data: conv } = await supabase
      .from('whatsapp_conversations')
      .select('total_messages')
      .eq('id', conversationId)
      .single()
    
    if (conv) {
      await supabase
        .from('whatsapp_conversations')
        .update({ total_messages: (conv.total_messages || 0) + 1 })
        .eq('id', conversationId)
    }
  }
  
  console.log('[Z-API Webhook] ✅ Mensagem salva e conversa atualizada:', {
    type: senderType,
    status,
    isFromUs,
    conversationId
  })
}

/**
 * Envia notificação para administradores
 */
async function notifyAdmins(conversationId: string, phone: string, message: string) {
  // Log inicial para debug
  console.log('[Z-API Webhook] 🔔 INÍCIO: Função notifyAdmins chamada', {
    conversationId,
    phone,
    messageLength: message?.length || 0
  })
  
  // Buscar administradores
  console.log('[Z-API Webhook] 👥 Buscando administradores...')
  const { data: admins, error: adminsError } = await supabase
    .from('auth.users')
    .select('id')
    .eq('raw_user_meta_data->>role', 'admin')
    .limit(10)

  console.log('[Z-API Webhook] 👥 Resultado busca admins:', {
    found: admins?.length || 0,
    error: adminsError?.message,
    adminIds: admins?.map(a => a.id) || []
  })

  if (!admins || admins.length === 0) {
    console.log('[Z-API Webhook] ⚠️ Nenhum administrador encontrado, pulando notificações no banco')
    // Continuar mesmo sem admins para enviar notificação via WhatsApp
  }

  // Criar notificações no banco (se houver admins)
  if (admins && admins.length > 0) {
    const notifications = admins.map((admin) => ({
      conversation_id: conversationId,
      user_id: admin.id,
      notification_type: 'new_message',
      title: 'Nova mensagem WhatsApp',
      message: `Nova mensagem de ${phone}: ${message.substring(0, 100)}`,
      metadata: { phone, message_preview: message.substring(0, 100) },
    }))

    const { error: notifyError } = await supabase.from('whatsapp_notifications').insert(notifications)
    if (notifyError) {
      console.error('[Z-API Webhook] ❌ Erro ao salvar notificações no banco:', notifyError)
    } else {
      console.log('[Z-API Webhook] ✅ Notificações salvas no banco para', admins.length, 'admin(s)')
    }
  }

  // Enviar notificação via Z-API para número de notificação (se configurado)
  const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
  
  // IMPORTANTE: Prevenir loop infinito - não enviar notificação se a mensagem veio do próprio número de notificação
  const notificationPhoneClean = notificationPhone?.replace(/\D/g, '') || ''
  const phoneClean = phone.replace(/\D/g, '')
  
  // Verificar se a mensagem veio do próprio número de notificação
  if (notificationPhoneClean && phoneClean === notificationPhoneClean) {
    console.log('[Z-API Webhook] ⚠️ Mensagem veio do próprio número de notificação, evitando loop infinito:', {
      phone: phoneClean,
      notificationPhone: notificationPhoneClean
    })
    return // Não enviar notificação para evitar loop
  }
  
  // Log detalhado da variável de ambiente
  console.log('[Z-API Webhook] 🔔 Verificando notificação:', {
    notificationPhone: notificationPhone || 'NÃO CONFIGURADO',
    phoneLength: notificationPhone?.length || 0,
    hasNotificationPhone: !!notificationPhone,
    phoneOrigem: phoneClean,
    phoneNotificacao: notificationPhoneClean,
    isLoop: phoneClean === notificationPhoneClean,
    envKeys: Object.keys(process.env).filter(k => k.includes('NOTIFICATION') || k.includes('Z_API')).join(', ')
  })
  
  if (notificationPhone) {
    try {
      // Buscar instância da área Nutri (ou usar a instância atual)
      console.log('[Z-API Webhook] 🔍 Buscando instância Z-API para enviar notificação...')
      const { data: instances, error: instanceError } = await supabase
        .from('z_api_instances')
        .select('instance_id, token, status, area')
        .eq('area', 'nutri')
        .eq('status', 'connected')
        .neq('instance_id', 'SEU_INSTANCE_ID_AQUI') // Excluir instâncias de exemplo
        .neq('instance_id', 'YOUR_INSTANCE_ID') // Excluir instâncias de exemplo
        .order('updated_at', { ascending: false }) // Pegar a mais recente
        .limit(1)
      
      console.log('[Z-API Webhook] 🔍 Resultado busca instância:', {
        found: instances?.length || 0,
        instances: instances?.map(i => ({ 
          instance_id: i.instance_id, 
          status: i.status, 
          area: i.area,
          tokenLength: i.token?.length || 0,
          tokenPreview: i.token ? `${i.token.substring(0, 4)}...${i.token.substring(i.token.length - 4)}` : 'NULL'
        })),
        error: instanceError?.message
      })
      
      // Filtrar instâncias de exemplo/placeholder
      if (instances && instances.length > 0) {
        const validInstances = instances.filter(i => 
          i.instance_id && 
          i.instance_id !== 'SEU_INSTANCE_ID_AQUI' &&
          i.instance_id !== 'YOUR_INSTANCE_ID' &&
          !i.instance_id.includes('EXEMPLO') &&
          !i.instance_id.includes('EXAMPLE') &&
          i.token &&
          i.token !== 'SEU_TOKEN_AQUI' &&
          i.token !== 'YOUR_TOKEN' &&
          !i.token.includes('EXEMPLO') &&
          !i.token.includes('EXAMPLE')
        )
        
        if (validInstances.length > 0) {
          instances = validInstances
          console.log('[Z-API Webhook] ✅ Instâncias válidas após filtro:', validInstances.length)
        } else {
          console.warn('[Z-API Webhook] ⚠️ Apenas instâncias de exemplo encontradas, removendo...')
          instances = []
        }
      }
      
      // Tentar buscar qualquer instância conectada se não encontrar da área nutri
      let instance = instances && instances.length > 0 ? instances[0] : null
      
      if (!instance || instance.status !== 'connected') {
        console.log('[Z-API Webhook] ⚠️ Instância Nutri não encontrada ou não conectada, buscando qualquer instância conectada...')
        const { data: anyInstances } = await supabase
          .from('z_api_instances')
          .select('instance_id, token, status, area')
          .eq('status', 'connected')
          .neq('instance_id', 'SEU_INSTANCE_ID_AQUI') // Excluir instâncias de exemplo
          .neq('instance_id', 'YOUR_INSTANCE_ID') // Excluir instâncias de exemplo
          .order('updated_at', { ascending: false }) // Pegar a mais recente
          .limit(1)
        
        if (anyInstances && anyInstances.length > 0) {
          instance = anyInstances[0]
          console.log('[Z-API Webhook] ✅ Usando instância alternativa:', {
            instance_id: instance.instance_id,
            status: instance.status,
            area: instance.area
          })
        }
      }
      
      if (instance && instance.instance_id && instance.token) {
        console.log('[Z-API Webhook] 📱 Enviando notificação para:', {
          notificationPhone,
          instanceId: instance.instance_id,
          tokenLength: instance.token.length,
          tokenPreview: `${instance.token.substring(0, 4)}...${instance.token.substring(instance.token.length - 4)}`
        })
        
        // Formatar número de notificação (garantir formato internacional)
        let formattedNotificationPhone = notificationPhone.replace(/\D/g, '')
        const countryCodes = ['1', '55', '52', '54', '56', '57', '58', '591', '592', '593', '594', '595', '596', '597', '598', '599']
        const hasCountryCode = countryCodes.some(code => formattedNotificationPhone.startsWith(code))
        if (!hasCountryCode) {
          if (formattedNotificationPhone.startsWith('0')) {
            formattedNotificationPhone = formattedNotificationPhone.substring(1)
          }
          formattedNotificationPhone = `55${formattedNotificationPhone}`
        }
        
        console.log('[Z-API Webhook] 📤 Chamando sendWhatsAppMessage com:', {
          phone: formattedNotificationPhone,
          messageLength: message.substring(0, 200).length,
          instanceId: instance.instance_id
        })
        
        // Formatar mensagem de notificação de forma limpa
        const formattedMessage = `🔔 Nova mensagem WhatsApp

📱 De: ${phone}
💬 ${message.substring(0, 150)}${message.length > 150 ? '...' : ''}`

        console.log('[Z-API Webhook] 📤 Enviando notificação formatada:', {
          phone: formattedNotificationPhone,
          messageLength: formattedMessage.length,
          messagePreview: formattedMessage.substring(0, 100)
        })
        
        const result = await sendWhatsAppMessage(
          formattedNotificationPhone,
          formattedMessage,
          instance.instance_id,
          instance.token
        )
        
        console.log('[Z-API Webhook] 📤 Resultado sendWhatsAppMessage:', {
          success: result.success,
          error: result.error,
          id: result.id
        })
        
        if (result.success) {
          console.log('[Z-API Webhook] ✅ Notificação enviada com sucesso para:', formattedNotificationPhone)
        } else {
          console.error('[Z-API Webhook] ❌ Erro ao enviar notificação:', {
            error: result.error,
            phone: formattedNotificationPhone,
            instanceId: instance.instance_id
          })
        }
      } else {
        console.warn('[Z-API Webhook] ⚠️ Instância não encontrada ou sem token para enviar notificação:', {
          hasInstance: !!instance,
          hasInstanceId: !!instance?.instance_id,
          hasToken: !!instance?.token,
          instanceStatus: instance?.status
        })
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
 * 
 * Este webhook recebe eventos da Z-API:
 * - "Ao receber": Quando mensagem chega
 * - "Ao enviar": Quando mensagem é enviada (opcional)
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json()
    
    // Log completo do payload recebido para debug
    console.log('[Z-API Webhook] 📥 Payload completo recebido:', JSON.stringify(rawBody, null, 2))
    
    // Verificar tipo de evento (receber ou enviar)
    const eventType = rawBody.type || rawBody.event || 'received'
    console.log('[Z-API Webhook] 🎯 Tipo de evento:', eventType)
    
    // Verificar se é mensagem enviada por nós mesmos
    // Z-API pode enviar de várias formas quando mensagem é enviada pelo telefone
    // IMPORTANTE: Se o evento é "Ao enviar", SEMPRE é mensagem nossa
    const isFromUs = 
      // Campos diretos de "fromMe"
      rawBody.fromMe === true || 
      rawBody.from_api === true || 
      rawBody.fromApi === true ||
      rawBody.fromMe === 'true' ||
      rawBody.fromMe === 1 ||
      rawBody.isFromMe === true ||
      rawBody.is_from_me === true ||
      // Se o evento é "sent" ou "enviado", é mensagem nossa
      eventType === 'sent' ||
      eventType === 'enviado' ||
      eventType === 'message_sent' ||
      eventType === 'send' ||
      rawBody.event === 'sent' ||
      rawBody.event === 'enviado' ||
      rawBody.event === 'message_sent' ||
      rawBody.event === 'send' ||
      // Se o phone é o número da instância (mensagem enviada)
      (rawBody.phone && rawBody.phone === process.env.Z_API_PHONE_NUMBER) ||
      // Verificar se é mensagem de status (enviada)
      rawBody.status === 'sent' ||
      rawBody.status === 'delivered' ||
      // Verificar se tem campo indicando envio
      rawBody.isSent === true ||
      rawBody.is_sent === true ||
      // Verificar se o remetente é o próprio número conectado
      (rawBody.from && rawBody.from === process.env.Z_API_PHONE_NUMBER) ||
      // Verificar se é webhook "Ao enviar" (sempre mensagem nossa)
      rawBody.type === 'send' ||
      rawBody.type === 'sent' ||
      // Verificar se tem campo "to" (mensagem enviada tem "to", recebida tem "from")
      (rawBody.to && !rawBody.from)
    
    console.log('[Z-API Webhook] 🔍 Detecção de mensagem enviada:', {
      isFromUs,
      fromMe: rawBody.fromMe,
      from_api: rawBody.from_api,
      fromApi: rawBody.fromApi,
      isFromMe: rawBody.isFromMe,
      is_from_me: rawBody.is_from_me,
      eventType,
      event: rawBody.event,
      phone: rawBody.phone,
      from: rawBody.from,
      to: rawBody.to,
      status: rawBody.status,
      isSent: rawBody.isSent,
      is_sent: rawBody.is_sent,
      allKeys: Object.keys(rawBody)
    })
    
    if (isFromUs) {
      console.log('[Z-API Webhook] 📤 ✅ MENSAGEM ENVIADA POR NÓS - Salvando no banco')
    } else {
      console.log('[Z-API Webhook] 📥 Mensagem recebida do cliente')
    }

    // Normalizar payload - Z-API envia em formato específico
    // Formato Z-API: { phone, text: { message }, instance, etc. }
    const body: any = rawBody

    const pickFirstNonEmptyString = (...values: any[]): string | null => {
      for (const v of values) {
        if (typeof v === 'string') {
          const trimmed = v.trim()
          if (trimmed.length > 0) return trimmed
        }
      }
      return null
    }
    
    // Extrair phone - LÓGICA CORRIGIDA:
    // Se mensagem RECEBIDA: telefone do cliente está em 'from' ou 'phone'
    // Se mensagem ENVIADA: telefone do cliente está em 'to' ou 'phone'
    let phone: string | null = null
    
    if (isFromUs) {
      // Mensagem ENVIADA por nós - telefone do cliente está em 'to'
      phone = body.to || body.phone || body.number || null
      console.log('[Z-API Webhook] 📤 Mensagem ENVIADA - Buscando telefone do DESTINATÁRIO:', {
        to: body.to,
        phone: body.phone,
        number: body.number,
        selected: phone
      })
    } else {
      // Mensagem RECEBIDA do cliente - telefone do cliente está em 'from' ou 'phone'
      phone = body.from || body.phone || body.sender || body.number || null
      console.log('[Z-API Webhook] 📥 Mensagem RECEBIDA - Buscando telefone do REMETENTE:', {
        from: body.from,
        phone: body.phone,
        sender: body.sender,
        number: body.number,
        selected: phone
      })
    }
    
    // Log completo de todos os campos para análise
    console.log('[Z-API Webhook] 📱 TODOS os campos do payload relacionados a telefone:', {
      phone: body.phone,
      from: body.from,
      to: body.to,
      sender: body.sender,
      number: body.number,
      remoteJid: body.remoteJid,
      chatId: body.chatId,
      isFromUs,
      selected: phone
    })
    
    // Se phone contém @ (ID do WhatsApp), extrair apenas o número
    // Formato: 5519997230912@c.us ou 5519997230912@s.whatsapp.net
    if (phone && typeof phone === 'string' && phone.includes('@')) {
      const originalPhone = phone
      const beforeAt = phone.split('@')[0]
      phone = beforeAt
      console.log('[Z-API Webhook] 🔍 Extraído número de ID do WhatsApp:', { 
        original: originalPhone, 
        extracted: beforeAt 
      })
    }
    
    // IMPORTANTE: NUNCA usar remoteJid ou chatId - são IDs do WhatsApp, não números reais
    // Se phone ainda é null ou parece ser ID inválido, tentar outros campos válidos
    if (!phone || (phone.length > 20 && phone.includes('@'))) {
      // Se ainda não tem telefone válido, tentar extrair de outros campos
      const alternativeFields = [
        body.contact?.phone,
        body.contact?.number,
        body.participant, // Para grupos
      ]
      
      for (const field of alternativeFields) {
        if (field && typeof field === 'string') {
          const clean = field.replace(/\D/g, '')
          if (clean.length >= 10 && clean.length <= 15) {
            phone = field
            console.log('[Z-API Webhook] ✅ Telefone encontrado em campo alternativo:', {
              field: field,
              clean: clean
            })
            break
          }
        }
      }
    }
    
    // Garantir formato internacional (só adicionar 55 se for brasileiro)
    if (phone) {
      // Converter para string e limpar
      let cleanPhone = String(phone).replace(/\D/g, '')
      
      // VALIDAÇÃO CRÍTICA: Rejeitar números muito longos (provavelmente são IDs, não telefones)
      // Telefones válidos têm 10-15 dígitos. Números com mais de 15 dígitos são IDs do WhatsApp
      if (cleanPhone.length > 15) {
        console.error('[Z-API Webhook] ❌ Número rejeitado: muito longo (provavelmente é ID do WhatsApp):', {
          original: phone,
          clean: cleanPhone,
          length: cleanPhone.length,
          warning: 'Este não é um número de telefone válido. Rejeitando para evitar salvar IDs incorretos.'
        })
        return NextResponse.json(
          { error: 'Número de telefone inválido (muito longo, provavelmente é ID do WhatsApp)' },
          { status: 400 }
        )
      }
      
      // Validar se é um telefone válido (10-15 dígitos)
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        console.warn('[Z-API Webhook] ⚠️ Número inválido (comprimento incorreto):', {
          original: phone,
          clean: cleanPhone,
          length: cleanPhone.length
        })
        // Tentar extrair número válido do original
        const match = String(phone).match(/(\d{10,15})/)
        if (match && match[1]) {
          cleanPhone = match[1]
          console.log('[Z-API Webhook] ✅ Número extraído:', cleanPhone)
        } else {
          console.error('[Z-API Webhook] ❌ Não foi possível extrair telefone válido de:', phone)
          return NextResponse.json(
            { error: 'Número de telefone inválido: não foi possível extrair um número válido (10-15 dígitos)' },
            { status: 400 }
          )
        }
      }
      
      // Verificar se já tem código de país conhecido
      const countryCodes = ['1', '55', '52', '54', '56', '57', '58', '591', '592', '593', '594', '595', '596', '597', '598', '599']
      const hasCountryCode = countryCodes.some(code => cleanPhone.startsWith(code))
      
      // Se não tem código de país e tem 10-11 dígitos, assumir que é brasileiro
      if (!hasCountryCode && cleanPhone.length >= 10 && cleanPhone.length <= 11) {
        // Se começar com 0, remover o 0 antes de adicionar 55
        if (cleanPhone.startsWith('0')) {
          cleanPhone = cleanPhone.substring(1)
        }
        cleanPhone = `55${cleanPhone}`
      }
      
      // Validar novamente após normalização
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        console.error('[Z-API Webhook] ❌ Número ainda inválido após normalização:', {
          cleanPhone,
          length: cleanPhone.length,
          original: phone
        })
        return NextResponse.json(
          { error: 'Número de telefone inválido após normalização', received: phone, clean: cleanPhone },
          { status: 400 }
        )
      }
      
      phone = cleanPhone
      console.log('[Z-API Webhook] 📱 Número final formatado:', {
        original: body.phone || body.from || body.sender,
        formatted: phone,
        hasCountryCode,
        length: cleanPhone.length
      })
    }
    
    // IMPORTANTE: Ignorar mensagens do número de notificação ANTES de processar
    // Este número é apenas para receber avisos, não deve criar conversas
    // EXCEÇÃO: Se o número já tem uma conversa existente, processar normalmente (é um cliente legítimo)
    const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
    if (notificationPhone) {
      const notificationPhoneClean = notificationPhone.replace(/\D/g, '')
      const phoneClean = phone.replace(/\D/g, '')
      
      if (phoneClean === notificationPhoneClean) {
        // Verificar se já existe uma conversa para este número
        // Se existir, significa que é um cliente legítimo e deve ser processado
        const { data: existingConversation } = await supabase
          .from('whatsapp_conversations')
          .select('id')
          .eq('phone', phoneClean)
          .limit(1)
          .maybeSingle()
        
        if (!existingConversation) {
          // Não tem conversa = número de notificação puro, ignorar
          console.log('[Z-API Webhook] ⚠️ Mensagem do número de notificação ignorada (não cria conversa):', {
            phone: phoneClean,
            notificationPhone: notificationPhoneClean,
            messagePreview: (rawBody.text?.message || rawBody.message || '').substring(0, 50)
          })
          // Retornar sucesso mas não processar
          return NextResponse.json({ 
            success: true, 
            message: 'Mensagem do número de notificação ignorada' 
          })
        } else {
          // Tem conversa = cliente legítimo, processar normalmente
          console.log('[Z-API Webhook] ✅ Número de notificação com conversa existente, processando normalmente:', {
            phone: phoneClean,
            conversationId: existingConversation.id
          })
        }
      }
    }

    // Verificar se é clique em botão (Z-API envia buttonId quando botão é clicado)
    const buttonId = body?.buttonId || body?.button_id || body?.button?.id || body?.data?.buttonId || null
    const buttonText = body?.buttonText || body?.button_text || body?.button?.text || body?.data?.buttonText || null
    
    // Extrair message - Z-API pode enviar em múltiplos formatos (e às vezes envia eventos sem mensagem)
    // Se for clique em botão, usar o buttonId como mensagem para detecção
    let message = pickFirstNonEmptyString(
      // Se for clique em botão, priorizar buttonId
      buttonId ? buttonId : null,
      
      // Formato Z-API comum
      body?.text?.message,
      body?.text?.text,
      typeof body?.text === 'string' ? body.text : null,

      // Formatos diretos
      typeof body?.message === 'string' ? body.message : null,
      typeof body?.body === 'string' ? body.body : null,
      typeof body?.content === 'string' ? body.content : null,

      // Alguns payloads vêm com message como objeto
      body?.message?.text?.message,
      body?.message?.text,
      body?.message?.message,
      body?.message?.body,
      body?.message?.content,
      body?.message?.caption,

      // Alguns payloads vêm dentro de data
      body?.data?.text?.message,
      body?.data?.text,
      body?.data?.message,
      body?.data?.body,
      body?.data?.content,

      // Alguns payloads vêm em arrays
      body?.messages?.[0]?.text?.message,
      body?.messages?.[0]?.text,
      body?.messages?.[0]?.message,
      body?.messages?.[0]?.body,
      body?.messages?.[0]?.content,
      body?.messages?.[0]?.caption,
    )
    
    if (buttonId) {
      console.log('[Z-API Webhook] 🔘 Clique em botão detectado:', { buttonId, buttonText, message })
    }
    
    // Extrair instanceId (Z-API pode enviar como 'instance' ou 'instanceId')
    const instanceId = body.instanceId || body.instance || body.instance_id || null
    
    // Extrair name (Z-API pode enviar como 'name', 'senderName', 'contactName', etc.)
    const name = body.name || body.senderName || body.contactName || body.contact?.name || null

    // Extrair se é grupo (Z-API costuma enviar isGroup)
    const isGroup =
      body.isGroup === true ||
      body.is_group === true ||
      body?.data?.isGroup === true ||
      body?.data?.is_group === true
    
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
      isGroup,
      type,
      rawKeys: Object.keys(rawBody)
    })

    // Validar payload
    // Se não tem message, provavelmente é evento de status/presença/ack.
    // Retornar 200 evita retries da Z-API e mantém logs limpos.
    if (!message) {
      console.log('[Z-API Webhook] ⏭️ Evento sem mensagem (ignorando)', {
        eventType,
        phone: phone || null,
        hasChatId: !!body?.chatId,
        hasConnectedPhone: !!body?.connectedPhone,
        keys: Object.keys(rawBody),
      })
      return NextResponse.json({
        received: true,
        ignored: true,
        reason: 'Evento sem mensagem (status/presença/ack)',
      })
    }

    if (!phone) {
      console.error('[Z-API Webhook] ❌ Payload inválido (sem phone):', {
        phone: phone || 'FALTANDO',
        message: message.substring(0, 50),
        rawBody: JSON.stringify(rawBody).substring(0, 500)
      })
      return NextResponse.json(
        {
          error: 'phone/from é obrigatório',
          received: rawBody,
          hint: 'Z-API deve enviar: phone/from'
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
      ,
      { is_group: isGroup }
    )
    console.log('[Z-API Webhook] 💬 Conversa ID:', conversationId)

    // 2.5. Verificação adicional: Se a conversa já existe e tem mensagens nossas recentes,
    // e o webhook não detectou fromMe, pode ser mensagem enviada pelo telefone
    let finalIsFromUs = isFromUs
    if (!isFromUs && conversationId) {
      // Verificar se há mensagens recentes enviadas por nós (últimas 5 minutos)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      const { data: recentOurMessages } = await supabase
        .from('whatsapp_messages')
        .select('id')
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'agent')
        .gte('created_at', fiveMinutesAgo)
        .limit(1)
      
      // Se há mensagens nossas recentes e esta mensagem tem o mesmo conteúdo ou é muito similar,
      // provavelmente é confirmação de envio
      if (recentOurMessages && recentOurMessages.length > 0) {
        console.log('[Z-API Webhook] 🔍 Detectada possível mensagem enviada (há mensagens recentes nossas)')
        // Não marcar como fromUs automaticamente, mas adicionar log para debug
      }
    }

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
    
    try {
      await saveMessage(conversationId, finalInstanceId, normalizedPayload, finalIsFromUs)
      console.log('[Z-API Webhook] ✅ Mensagem salva no banco com sucesso', {
        conversationId,
        isFromUs: finalIsFromUs,
        senderType: finalIsFromUs ? 'agent' : 'customer',
        messagePreview: message?.substring(0, 50)
      })
    } catch (saveError: any) {
      console.error('[Z-API Webhook] ❌ ERRO ao salvar mensagem:', {
        error: saveError.message,
        stack: saveError.stack,
        conversationId,
        isFromUs: finalIsFromUs,
        payload: normalizedPayload
      })
      // Não retornar erro para Z-API, apenas logar
    }

    // 4. Processar automações com Carol (IA de atendimento)
    // IMPORTANTE: Só processar automações se NÃO for mensagem enviada por nós
    // (para evitar loops e respostas automáticas para nossas próprias mensagens)
    if (!finalIsFromUs) {
      try {
        // Verificar se é primeira mensagem da conversa
        const { data: existingMessages } = await supabase
          .from('whatsapp_messages')
          .select('id')
          .eq('conversation_id', conversationId)
          .eq('sender_type', 'customer')
          .limit(1)
        
        const isFirstMessage = !existingMessages || existingMessages.length === 0

        // 🔒 VERIFICAR SE JÁ EXISTE MENSAGEM DA CAROL RECENTE (evitar duplicação)
        // Se a automação de formulário já enviou mensagem, não enviar novamente
        const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { data: recentCarolMessages } = await supabase
          .from('whatsapp_messages')
          .select('id, created_at')
          .eq('conversation_id', conversationId)
          .eq('sender_type', 'bot')
          .eq('sender_name', 'Carol - Secretária')
          .gte('created_at', cincoMinutosAtras)
          .limit(1)
        
        const hasRecentCarolMessage = recentCarolMessages && recentCarolMessages.length > 0

        // Processar com Carol (IA de atendimento)
        // IMPORTANTE: Não processar se mensagem veio do número de notificação
        // IMPORTANTE: Não processar se já existe mensagem da Carol recente (evitar duplicação)
        const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
        const shouldProcessCarol = 
          (!notificationPhone || phone.replace(/\D/g, '') !== notificationPhone.replace(/\D/g, '')) &&
          !hasRecentCarolMessage // 🔒 Evitar duplicação
        
        if (shouldProcessCarol) {
          console.log('[Z-API Webhook] 🤖 Iniciando processamento com Carol...')
          
          const { processIncomingMessageWithCarol } = await import('@/lib/whatsapp-carol-ai')
          
          const carolResult = await processIncomingMessageWithCarol(
            conversationId,
            phone,
            message,
            area,
            finalInstanceId
          )

          if (carolResult.success) {
            console.log('[Z-API Webhook] ✅ Carol respondeu automaticamente:', {
              responsePreview: carolResult.response?.substring(0, 100)
            })
          } else {
            console.error('[Z-API Webhook] ❌ Carol não conseguiu responder:', {
              error: carolResult.error,
              conversationId,
              phone,
              messagePreview: message?.substring(0, 50),
              hasOpenAIKey: !!process.env.OPENAI_API_KEY
            })
          }
        } else {
          if (hasRecentCarolMessage) {
            console.log('[Z-API Webhook] ⏭️ Pulando Carol (já existe mensagem da Carol nos últimos 5 minutos - evitando duplicação)')
          } else {
            console.log('[Z-API Webhook] ⏭️ Pulando Carol (mensagem do número de notificação)')
          }
        }

        // Também processar automações antigas (se houver regras configuradas)
        try {
          const { processAutomations } = await import('@/lib/whatsapp-automation')
          const automationResult = await processAutomations(
            conversationId,
            phone,
            message,
            area,
            finalInstanceId,
            isFirstMessage
          )
          
          if (automationResult.messagesSent > 0) {
            console.log('[Z-API Webhook] 🤖 Automações processadas:', {
              messagesSent: automationResult.messagesSent,
              rulesExecuted: automationResult.rulesExecuted
            })
          }
        } catch (automationError: any) {
          // Ignorar erros de automações antigas
          console.warn('[Z-API Webhook] ⚠️ Erro em automações antigas:', automationError.message)
        }
      } catch (carolError: any) {
        console.error('[Z-API Webhook] ❌ Erro ao processar com Carol:', {
          error: carolError.message,
          stack: carolError.stack
        })
        // Não falhar o webhook se Carol falhar
      }
    } else {
      console.log('[Z-API Webhook] ⏭️ Pulando automações (mensagem enviada por nós)')
    }

    // 5. Notificar administradores (com regras inteligentes)
    // IMPORTANTE: Só notificar se NÃO for mensagem enviada por nós
    // (para evitar notificações de nossas próprias mensagens)
    if (!isFromUs) {
      try {
        const { shouldNotify } = await import('@/lib/whatsapp-automation')
        
        // Verificar se deve notificar baseado nas regras
        const notificationCheck = await shouldNotify(phone, message, area, conversationId)
        
        if (notificationCheck.shouldNotify) {
          await notifyAdmins(conversationId, phone, message)
          console.log('[Z-API Webhook] 🔔 Notificações processadas:', notificationCheck.reason)
        } else {
          console.log('[Z-API Webhook] ⏭️ Notificação ignorada:', notificationCheck.reason)
        }
      } catch (notifyError: any) {
        console.error('[Z-API Webhook] ❌ Erro ao processar notificações:', {
          error: notifyError.message,
          stack: notifyError.stack
        })
        // Não falhar o webhook se notificação falhar
      }
    } else {
      console.log('[Z-API Webhook] ⏭️ Pulando notificações (mensagem enviada por nós)')
    }

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
