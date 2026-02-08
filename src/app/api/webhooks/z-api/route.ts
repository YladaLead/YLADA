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

  const contactKey = String(phone || '').replace(/\D/g, '')

  // 1. Buscar no banco de dados por telefone (chave canônica)
  const { data: conversation } = await supabase
    .from('whatsapp_conversations')
    .select('area')
    .eq('contact_key', contactKey)
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
  contactKey: string,
  name: string | undefined,
  area: string | null,
  contextPatch?: Record<string, any> | null
) {
  const isPlaceholderName = (s: any): boolean => {
    if (typeof s !== 'string') return true
    const t = s.trim()
    if (!t) return true
    const lower = t.toLowerCase()
    if (lower === 'cliente' || lower === 'sem nome' || lower === 'unknown') return true
    if (/^\d+$/.test(t)) return true
    return false
  }

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
    .select('id, area, name, context, contact_key')
    .eq('instance_id', instance.id)
    .eq('contact_key', contactKey)
    .limit(1)
    .single()

  if (existing) {
    // Atualizar área/nome/context se necessário
    const updateData: any = {}
    if (!existing.area && area) updateData.area = area
    if (name && (isPlaceholderName(existing.name) || (!existing.name && name))) updateData.name = name
    // Garantir que phone/contact_key permaneçam consistentes
    if (!existing.contact_key && contactKey) updateData.contact_key = contactKey
    if (phone) updateData.phone = phone

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
      contact_key: contactKey,
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

  // Verificar se já existe para evitar duplicatas (tanto mensagens enviadas quanto recebidas)
  if (payload.messageId) {
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
  
  // Verificação adicional: se não tem messageId, verificar por conteúdo + timestamp (últimos 30 segundos)
  if (!payload.messageId && !isFromUs) {
    const trintaSegundosAtras = new Date(Date.now() - 30 * 1000).toISOString()
    const { data: recentDuplicate } = await supabase
      .from('whatsapp_messages')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('sender_type', 'customer')
      .eq('message', payload.message)
      .gte('created_at', trintaSegundosAtras)
      .maybeSingle()
    
    if (recentDuplicate) {
      console.log('[Z-API Webhook] ⏭️ Mensagem duplicada detectada (mesmo conteúdo nos últimos 30s), ignorando')
      return // Mensagem duplicada, não salvar novamente
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

    // contact_key: chave canônica para "memória por pessoa"
    // - dígitos apenas
    // - preferir com código do país (BR -> 55 quando aplicável)
    const contactKey = String(phone || '').replace(/\D/g, '')
    
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
          .eq('contact_key', phoneClean)
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

    // Verificar se é clique em botão (Z-API envia buttonId/buttonText quando botão é clicado)
    const buttonId = body?.buttonId || body?.button_id || body?.button?.id || body?.data?.buttonId || null
    const buttonText = body?.buttonText || body?.button_text || body?.button?.text || body?.data?.buttonText || null
    // Priorizar texto do botão quando for mensagem longa (ex.: "Acabei de me inscrever...") para a Carol detectar e enviar boas-vindas
    const buttonTextAsMessage = (typeof buttonText === 'string' && buttonText.trim().length > 20) ? buttonText.trim() : null

    // Extrair message - Z-API pode enviar em múltiplos formatos (e às vezes envia eventos sem mensagem)
    // Se for clique em botão com texto longo, usar o texto (para Carol reconhecer "Acabei de me inscrever..."); senão buttonId
    let message = pickFirstNonEmptyString(
      buttonTextAsMessage,
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

    // Não usar "Ylada"/"Ylada Nutri" como nome do contato quando a mensagem é do cliente (payload às vezes traz nome do negócio)
    const nameForConv =
      !isFromUs && name && /ylada(\s*nutri)?/i.test(String(name).trim())
        ? null
        : name || null

    // 2. Criar ou buscar conversa
    const conversationId = await getOrCreateConversation(
      finalInstanceId,
      phone,
      contactKey,
      nameForConv,
      area
      ,
      { is_group: isGroup, wa_name: nameForConv }
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

    // 2.9. Verificar se é primeira mensagem do cliente ANTES de salvar
    // (depois de salvar sempre haverá ≥1 mensagem do cliente; usar isso para automações)
    const { data: existingCustomerMessages } = await supabase
      .from('whatsapp_messages')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('sender_type', 'customer')
      .limit(1)
    const isFirstMessageBeforeSave = !existingCustomerMessages || existingCustomerMessages.length === 0

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

    // 4. Cancelar mensagens agendadas se pessoa respondeu
    // IMPORTANTE: Só cancelar se NÃO for mensagem enviada por nós
    if (!finalIsFromUs && conversationId) {
      try {
        const { cancelPendingMessagesForConversation } = await import('@/lib/whatsapp-automation/scheduler')
        await cancelPendingMessagesForConversation(conversationId, 'user_responded')
      } catch (error: any) {
        // Não bloquear se falhar o cancelamento
        console.error('[Z-API Webhook] Erro ao cancelar mensagens agendadas:', error)
      }
    }

    // 5. Processar automações com Carol (IA de atendimento)
    // IMPORTANTE: Só processar automações se NÃO for mensagem enviada por nós
    // (para evitar loops e respostas automáticas para nossas próprias mensagens)
    if (!finalIsFromUs) {
      try {
        // 🛑 Kill-switch global: se Carol está desligada, não processar (evita tentativa e log de erro)
        const { getCarolAutomationDisabled } = await import('@/lib/carol-admin-settings')
        if (await getCarolAutomationDisabled()) {
          console.log('[Z-API Webhook] ⏭️ Carol desligada globalmente (CAROL_AUTOMATION_DISABLED) — automação não disparada', {
            conversationId,
            phone: phone?.slice(-4)
          })
          // Não lançar erro; seguir para notificações etc.
        } else {
        // 🛑 MODO MANUAL (por conversa): se ativado, não responder com a Carol nem rodar automações.
        // Usado quando o time quer enviar áudio/mensagem manual sem a Carol "pegar" a conversa.
        try {
          const { data: convForManual } = await supabase
            .from('whatsapp_conversations')
            .select('context')
            .eq('id', conversationId)
            .single()
          const ctx = (convForManual?.context && typeof convForManual.context === 'object' && !Array.isArray(convForManual.context))
            ? (convForManual.context as any)
            : {}
          const tags = Array.isArray(ctx.tags) ? ctx.tags : []
          const manualMode =
            ctx.manual_mode === true ||
            tags.includes('manual_mode') ||
            tags.includes('atendimento_manual')
          if (manualMode) {
            console.log('[Z-API Webhook] 🛑 Modo manual ativo para conversa — pulando Carol e automações', {
              conversationId,
            })
            // Ainda assim seguimos o fluxo (salvar msg, notificar admins, etc.)
            throw Object.assign(new Error('MANUAL_MODE_SKIP'), { code: 'MANUAL_MODE_SKIP' })
          }
        } catch (manualErr: any) {
          // Se for skip, sair do bloco de automação sem erro para o webhook
          if (manualErr?.code === 'MANUAL_MODE_SKIP' || manualErr?.message === 'MANUAL_MODE_SKIP') {
            // pular
            throw manualErr
          }
          // Se falhou a checagem, não bloquear (segue normal)
        }

        // Usar flag de primeira mensagem calculada ANTES de salvar (isFirstMessageBeforeSave)
        const isFirstMessage = isFirstMessageBeforeSave

        // 🔒 VERIFICAR SE JÁ EXISTE MENSAGEM DA CAROL RECENTE (evitar duplicação)
        // Mas permitir resposta se a última mensagem é do cliente (perguntas legítimas)
        const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        
        // Buscar última mensagem da Carol
        const { data: recentCarolMessages } = await supabase
          .from('whatsapp_messages')
          .select('id, created_at')
          .eq('conversation_id', conversationId)
          .eq('sender_type', 'bot')
          .eq('sender_name', 'Carol - Secretária')
          .gte('created_at', cincoMinutosAtras)
          .order('created_at', { ascending: false })
          .limit(1)
        
        // Buscar última mensagem do cliente (inclui a que acabamos de salvar)
        const { data: lastCustomerMessage } = await supabase
          .from('whatsapp_messages')
          .select('id, created_at, message')
          .eq('conversation_id', conversationId)
          .eq('sender_type', 'customer')
          .order('created_at', { ascending: false })
          .limit(1)
        
        // Buscar última mensagem da Carol (qualquer uma, não apenas recente)
        const { data: lastCarolMessage } = await supabase
          .from('whatsapp_messages')
          .select('id, created_at')
          .eq('conversation_id', conversationId)
          .eq('sender_type', 'bot')
          .eq('sender_name', 'Carol - Secretária')
          .order('created_at', { ascending: false })
          .limit(1)
        
        const hasRecentCarolMessage = recentCarolMessages && recentCarolMessages.length > 0
        
        // 🆕 Permitir resposta se:
        // 1. Não há mensagem recente da Carol (mais de 5 minutos), OU
        // 2. A última mensagem do cliente é mais recente que a última mensagem da Carol
        //    (ou seja, o cliente está fazendo uma pergunta após receber a mensagem da Carol)
        // 3. A última mensagem do cliente É a que estamos processando (mesmo texto, criada há poucos segundos) → sempre permitir
        let shouldAllowResponse = true
        
        const lastCustMsg = lastCustomerMessage?.[0] ?? lastCustomerMessage
        const isCurrentMessageWeJustSaved =
          lastCustMsg?.message != null &&
          String(lastCustMsg.message).trim() === String(message || '').trim() &&
          lastCustMsg.created_at &&
          Date.now() - new Date(lastCustMsg.created_at).getTime() < 25000 // 25s
        
        if (isCurrentMessageWeJustSaved) {
          shouldAllowResponse = true
          console.log('[Z-API Webhook] ✅ Permitindo Carol: mensagem atual é a que acabamos de salvar (cliente pediu resposta)')
        } else if (hasRecentCarolMessage && lastCarolMessage?.length && lastCustMsg) {
          const lastCarolRow = Array.isArray(lastCarolMessage) ? lastCarolMessage[0] : lastCarolMessage
          const lastCarolTime = new Date((lastCarolRow as any)?.created_at ?? 0).getTime()
          const lastCustomerTime = new Date((lastCustMsg as any)?.created_at ?? 0).getTime()
          
          // Se a última mensagem da Carol é mais recente que a última do cliente,
          // significa que a Carol acabou de enviar e o cliente ainda não respondeu
          // Nesse caso, bloquear para evitar duplicação
          if (lastCarolTime > lastCustomerTime) {
            shouldAllowResponse = false
            console.log('[Z-API Webhook] ⏭️ Bloqueando Carol: última mensagem da Carol é mais recente que a do cliente')
          } else {
            console.log('[Z-API Webhook] ✅ Permitindo Carol: cliente fez pergunta após mensagem da Carol')
          }
        }

        // Processar com Carol (IA de atendimento)
        // IMPORTANTE: Não processar se mensagem veio do número de notificação
        // IMPORTANTE: Não processar se já existe mensagem da Carol recente E a última mensagem é da Carol (evitar duplicação)
        // IMPORTANTE: Verificar se já processou esta mensagem específica (evitar duplicação de webhook)
        const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
        
        // Verificar se já processou esta mensagem específica (mesmo conteúdo do cliente + resposta da Carol nos últimos 2 minutos)
        const doisMinutosAtras = new Date(Date.now() - 2 * 60 * 1000).toISOString()
        const { data: recentSameMessage } = await supabase
          .from('whatsapp_messages')
          .select('id, created_at')
          .eq('conversation_id', conversationId)
          .eq('sender_type', 'customer')
          .eq('message', message)
          .gte('created_at', doisMinutosAtras)
          .order('created_at', { ascending: false })
          .limit(1)
        
        // Se encontrou mensagem idêntica recente, verificar se já há resposta da Carol
        let alreadyProcessed = false
        if (recentSameMessage && recentSameMessage.length > 0) {
          const { data: carolResponseAfter } = await supabase
            .from('whatsapp_messages')
            .select('id')
            .eq('conversation_id', conversationId)
            .eq('sender_type', 'bot')
            .eq('sender_name', 'Carol - Secretária')
            .gte('created_at', recentSameMessage[0].created_at)
            .limit(1)
          
          alreadyProcessed = carolResponseAfter && carolResponseAfter.length > 0
        }
        
        const shouldProcessCarol = 
          (!notificationPhone || phone.replace(/\D/g, '') !== notificationPhone.replace(/\D/g, '')) &&
          shouldAllowResponse && // 🆕 Usar lógica melhorada
          !alreadyProcessed // 🆕 Não processar se já respondeu recentemente

        console.log('[Z-API Webhook] 🤖 Decisão Carol:', {
          shouldProcessCarol,
          shouldAllowResponse,
          alreadyProcessed,
          hasRecentCarolMessage: !!hasRecentCarolMessage,
          isNotificationPhone: !!notificationPhone && phone.replace(/\D/g, '') === notificationPhone.replace(/\D/g, ''),
        })
        
        let carolProcessedThisMessage = false
        if (shouldProcessCarol) {
          // 🆕 Enriquecer conversa com nome do cadastro (workshop_inscricoes/contact_submissions)
          // Quando a pessoa preenche o workshop e clica no botão WhatsApp, a primeira resposta da Carol
          // deve usar o nome do cadastro — não o "name" do payload (que pode vir vazio ou errado).
          try {
            const { getRegistrationName } = await import('@/lib/whatsapp-carol-ai')
            const registrationName = await getRegistrationName(phone, area || 'nutri')
            if (registrationName) {
              const { data: conv } = await supabase
                .from('whatsapp_conversations')
                .select('id, name, context')
                .eq('id', conversationId)
                .single()
              if (conv) {
                const prevContext = (conv.context && typeof conv.context === 'object' && !Array.isArray(conv.context))
                  ? (conv.context as Record<string, unknown>)
                  : {}
                await supabase
                  .from('whatsapp_conversations')
                  .update({
                    name: conv.name || registrationName,
                    context: { ...prevContext, lead_name: registrationName },
                  })
                  .eq('id', conversationId)
                console.log('[Z-API Webhook] ✅ Conversa enriquecida com nome do cadastro:', registrationName)
              }
            }
          } catch (enrichErr: any) {
            console.warn('[Z-API Webhook] ⚠️ Erro ao enriquecer conversa com nome do cadastro:', enrichErr?.message)
          }

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
            // Mesmo que a Carol decida "não responder" (ex.: auto-resposta detectada),
            // consideramos a mensagem processada por ela para não disparar automações antigas em paralelo.
            carolProcessedThisMessage = true
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
          if (alreadyProcessed) {
            console.log('[Z-API Webhook] ⏭️ Pulando Carol (já processou mensagem recentemente - evitando duplicação)')
          } else if (hasRecentCarolMessage) {
            console.log('[Z-API Webhook] ⏭️ Pulando Carol (já existe mensagem da Carol nos últimos 5 minutos - evitando duplicação)')
          } else {
            console.log('[Z-API Webhook] ⏭️ Pulando Carol (mensagem do número de notificação)')
          }
        }

        // ⚠️ IMPORTANTÍSSIMO: não rodar automações antigas em paralelo com a Carol.
        // Primeira mensagem e escolha 1/2 são EXCLUSIVAS da Carol — a automação antiga não deve rodar
        // (evita duplicar ou enviar outro conteúdo quando foi reconfigurada).
        const msgTrim = String(message || '').trim().toLowerCase()
        const isChoice1or2 = msgTrim === '1' || msgTrim === '2' || /^(opção|opcao)\s*[12]$/i.test(msgTrim)
        const reservedForCarol = isFirstMessageBeforeSave || isChoice1or2

        if (reservedForCarol) {
          console.log('[Z-API Webhook] ⏭️ Primeira mensagem ou escolha 1/2: só Carol responde (automação antiga não roda)', {
            isFirstMessage: isFirstMessageBeforeSave,
            isChoice1or2,
          })
        }

        if (!carolProcessedThisMessage && !reservedForCarol) {
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
        } else if (carolProcessedThisMessage) {
          console.log('[Z-API Webhook] ⏭️ Pulando automações antigas (Carol já processou esta mensagem)')
        }
        } // fim do else (Carol não está desligada globalmente)
      } catch (carolError: any) {
        if (carolError?.code === 'MANUAL_MODE_SKIP' || carolError?.message === 'MANUAL_MODE_SKIP') {
          console.log('[Z-API Webhook] ⏭️ Pulando Carol/automações por modo manual', { conversationId })
        } else {
        console.error('[Z-API Webhook] ❌ Erro ao processar com Carol:', {
          error: carolError.message,
          stack: carolError.stack
        })
        }
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
