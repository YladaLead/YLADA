import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'

/**
 * POST /api/whatsapp/conversations/[id]/send-workshop-invite
 * Envia flyer padrão + detalhes da próxima sessão ativa (Nutri) para o contato.
 */

function formatSessionPtBR(startsAtIso: string) {
  const d = new Date(startsAtIso)
  const weekday = d.toLocaleDateString('pt-BR', { weekday: 'long' })
  const date = d.toLocaleDateString('pt-BR')
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return { weekday, date, time }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth (admin)
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

    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const roleAdmin = user.user_metadata?.role === 'admin'
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (!roleAdmin && profile?.is_admin !== true) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const conversationId = params.id

    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('*')
      .eq('id', conversationId)
      .single()

    if (!conversation) {
      return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })
    }

    // Próxima sessão ativa
    const { data: session } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('*')
      .eq('area', 'nutri')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (!session) {
      return NextResponse.json(
        { error: 'Nenhuma sessão ativa encontrada. Cadastre a agenda no admin.' },
        { status: 400 }
      )
    }

    const { data: settings } = await supabaseAdmin
      .from('whatsapp_workshop_settings')
      .select('*')
      .eq('area', 'nutri')
      .maybeSingle()

    const flyerUrl = settings?.flyer_url || null
    const flyerCaption = settings?.flyer_caption || ''

    // Instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('instance_id, token')
      .eq('id', conversation.instance_id)
      .single()

    if (!instance) {
      return NextResponse.json({ error: 'Instância Z-API não encontrada' }, { status: 404 })
    }

    const client = createZApiClient(instance.instance_id, instance.token)

    const { weekday, date, time } = formatSessionPtBR(session.starts_at)
    const infoText = `🗓️ ${session.title}\n\n📅 ${weekday}, ${date}\n🕒 ${time} (Brasília)\n🔗 ${session.zoom_link}\n\n✅ Se precisar reagendar, responda REAGENDAR.`

    // 1) Enviar flyer (se configurado)
    if (flyerUrl) {
      const caption = flyerCaption?.trim()
        ? flyerCaption
        : `${session.title}\n${weekday}, ${date} • ${time}`

      const result = await client.sendImageMessage({
        phone: conversation.phone,
        image: flyerUrl,
        caption,
      })

      if (!result.success) {
        return NextResponse.json({ error: result.error || 'Erro ao enviar flyer' }, { status: 500 })
      }

      await supabaseAdmin.from('whatsapp_messages').insert({
        conversation_id: conversationId,
        instance_id: conversation.instance_id,
        z_api_message_id: result.id || null,
        sender_type: 'agent',
        sender_id: user.id,
        sender_name: user.user_metadata?.name || user.email || 'Admin',
        message: caption,
        message_type: 'image',
        media_url: flyerUrl,
        status: 'sent',
        is_bot_response: false,
      })
    }

    // 2) Enviar texto com link/data/hora
    const result2 = await client.sendTextMessage({
      phone: conversation.phone,
      message: infoText,
    })

    if (!result2.success) {
      return NextResponse.json({ error: result2.error || 'Erro ao enviar mensagem' }, { status: 500 })
    }

    await supabaseAdmin.from('whatsapp_messages').insert({
      conversation_id: conversationId,
      instance_id: conversation.instance_id,
      z_api_message_id: result2.id || null,
      sender_type: 'agent',
      sender_id: user.id,
      sender_name: user.user_metadata?.name || user.email || 'Admin',
      message: infoText,
      message_type: 'text',
      status: 'sent',
      is_bot_response: false,
    })

    // Guardar referência da sessão no context da conversa
    const prevContext =
      conversation.context && typeof conversation.context === 'object' && !Array.isArray(conversation.context)
        ? conversation.context
        : {}
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        context: { ...prevContext, workshop_session_id: session.id },
      })
      .eq('id', conversationId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[send-workshop-invite] Erro:', error)
    return NextResponse.json({ error: error.message || 'Erro ao enviar convite' }, { status: 500 })
  }
}

