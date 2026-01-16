/**
 * API para mensagens de uma conversa
 * GET /api/whatsapp/conversations/[id]/messages - Lista mensagens
 * POST /api/whatsapp/conversations/[id]/messages - Envia mensagem
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { sendWhatsAppMessage } from '@/lib/z-api'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/whatsapp/conversations/[id]/messages
 * Lista mensagens de uma conversa
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Autenticação
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const isAdmin = user.user_metadata?.role === 'admin'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const conversationId = params.id

    // Buscar mensagens
    const { data: messages, error } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    // Marcar mensagens como lidas
    await supabaseAdmin
      .from('whatsapp_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('sender_type', 'customer')
      .is('read_at', null)

    // Atualizar unread_count da conversa
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({ unread_count: 0 })
      .eq('id', conversationId)

    return NextResponse.json({ messages: messages || [] })
  } catch (error: any) {
    console.error('[WhatsApp Messages] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar mensagens' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/whatsapp/conversations/[id]/messages
 * Envia mensagem
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Autenticação
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const isAdmin = user.user_metadata?.role === 'admin'
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const conversationId = params.id
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 })
    }

    // Buscar conversa
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('*')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      console.error('[WhatsApp Messages] Erro ao buscar conversa:', convError)
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // Buscar instância Z-API
    const { data: instance, error: instanceError } = await supabaseAdmin
      .from('z_api_instances')
      .select('instance_id, token')
      .eq('id', conversation.instance_id)
      .single()

    if (instanceError || !instance) {
      console.error('[WhatsApp Messages] Erro ao buscar instância:', instanceError)
      return NextResponse.json(
        { error: 'Instância Z-API não encontrada' },
        { status: 404 }
      )
    }

    console.log('[WhatsApp Messages] 📤 Enviando mensagem:', {
      to: conversation.phone,
      message: message.substring(0, 50),
      instanceId: instance.instance_id,
      tokenLength: instance.token?.length || 0,
      tokenPreview: instance.token ? `${instance.token.substring(0, 4)}...${instance.token.substring(instance.token.length - 4)}` : 'NULL'
    })

    // Enviar mensagem via Z-API
    const result = await sendWhatsAppMessage(
      conversation.phone,
      message,
      instance.instance_id,
      instance.token
    )

    console.log('[WhatsApp Messages] 📤 Resultado Z-API:', {
      success: result.success,
      error: result.error,
      id: result.id
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao enviar mensagem' },
        { status: 500 }
      )
    }

    // Salvar mensagem no banco
    const { data: savedMessage, error: msgError } = await supabaseAdmin
      .from('whatsapp_messages')
      .insert({
        conversation_id: conversationId,
        instance_id: conversation.instance_id,
        z_api_message_id: result.id || null,
        sender_type: 'agent',
        sender_id: user.id,
        sender_name: user.user_metadata?.name || user.email || 'Admin',
        message,
        message_type: 'text',
        status: 'sent',
        is_bot_response: false,
      })
      .select()
      .single()

    if (msgError) {
      console.error('[WhatsApp Messages] Erro ao salvar:', msgError)
    }

    // Enviar notificação para número configurado (quando admin envia mensagem)
    console.log('[WhatsApp Messages] 🔔 INÍCIO: Verificando notificação após envio de mensagem')
    
    const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
    console.log('[WhatsApp Messages] 🔔 Verificando notificação:', {
      notificationPhone: notificationPhone || 'NÃO CONFIGURADO',
      phoneLength: notificationPhone?.length || 0,
      hasNotificationPhone: !!notificationPhone,
      envKeys: Object.keys(process.env).filter(k => k.includes('NOTIFICATION') || k.includes('Z_API')).join(', ')
    })
    
    if (notificationPhone) {
      try {
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
        
        console.log('[WhatsApp Messages] 📱 Enviando notificação de mensagem enviada para:', formattedNotificationPhone)
        const notificationResult = await sendWhatsAppMessage(
          formattedNotificationPhone,
          `✅ Mensagem enviada\n\n📱 Para: ${conversation.phone}\n💬 ${message.substring(0, 200)}`,
          instance.instance_id,
          instance.token
        )
        
        if (notificationResult.success) {
          console.log('[WhatsApp Messages] ✅ Notificação enviada com sucesso')
        } else {
          console.error('[WhatsApp Messages] ❌ Erro ao enviar notificação:', notificationResult.error)
        }
      } catch (error: any) {
        console.error('[WhatsApp Messages] ❌ Erro ao enviar notificação:', error)
        // Não falhar a requisição se notificação falhar
      }
    } else {
      console.log('[WhatsApp Messages] ℹ️ Z_API_NOTIFICATION_PHONE não configurado')
    }

    return NextResponse.json({
      success: true,
      message: savedMessage,
    })
  } catch (error: any) {
    console.error('[WhatsApp Messages] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}
