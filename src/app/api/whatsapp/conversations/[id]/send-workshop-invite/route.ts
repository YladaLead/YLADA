import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'

/**
 * POST /api/whatsapp/conversations/[id]/send-workshop-invite
 * Envia flyer padrão + detalhes da próxima sessão ativa (Nutri) para o contato.
 */

const TZ_BRASILIA = 'America/Sao_Paulo'

function formatSessionPtBR(startsAtIso: string) {
  const d = new Date(startsAtIso)
  const opts = { timeZone: TZ_BRASILIA } as const
  const weekday = d.toLocaleDateString('pt-BR', { ...opts, weekday: 'long' })
  const date = d.toLocaleDateString('pt-BR', opts)
  const time = d.toLocaleTimeString('pt-BR', { ...opts, hour: '2-digit', minute: '2-digit' })
  return { weekday, date, time }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = typeof (params as any)?.then === 'function' ? await (params as Promise<{ id: string }>) : (params as { id: string })
    const conversationId = resolvedParams.id
    if (!conversationId) {
      return NextResponse.json({ error: 'ID da conversa é obrigatório' }, { status: 400 })
    }

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

    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('*')
      .eq('id', conversationId)
      .single()

    if (!conversation) {
      return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })
    }

    const ctx = conversation.context && typeof conversation.context === 'object' && !Array.isArray(conversation.context)
      ? conversation.context
      : {}
    const existingSessionId = (ctx as any).workshop_session_id as string | undefined

    // Usar sessão já definida na conversa (ex.: admin colocou manualmente "amanhã 15h") ou próxima ativa
    let session: { id: string; title: string; starts_at: string; zoom_link: string } | null = null
    if (existingSessionId) {
      const { data: existingSession } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('id, title, starts_at, zoom_link, is_active')
        .eq('id', existingSessionId)
        .single()
      if (existingSession && existingSession.zoom_link) {
        session = existingSession
      }
    }
    if (!session) {
      const { data: nextSession } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('*')
        .eq('area', 'nutri')
        .eq('is_active', true)
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
        .limit(1)
        .maybeSingle()
      session = nextSession
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Nenhuma sessão ativa encontrada. Cadastre a agenda no admin ou defina uma sessão na conversa.' },
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

    // Mesmo texto do envio automático (Carol) para manter consistência e melhor promoção
    const { weekday, date, time } = formatSessionPtBR(session.starts_at)
    const infoText = `✅ *Perfeito! Você vai adorar essa aula!* 🎉\n\n🗓️ ${weekday}, ${date}\n🕒 ${time} (horário de Brasília)\n\n🔗 ${session.zoom_link}\n\n💡 *Dica importante:* A sala do Zoom será aberta 10 minutos antes do horário da aula. Chegue com antecedência para garantir sua vaga! 😊\n\nQualquer dúvida, é só me chamar! 💚`

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

    // Guardar sessão e tags (recebeu_link_workshop, agendou_aula) no context da conversa
    const prevContext =
      conversation.context && typeof conversation.context === 'object' && !Array.isArray(conversation.context)
        ? conversation.context
        : {}
    const prevTags = Array.isArray((prevContext as any).tags) ? (prevContext as any).tags : []
    const newTags = [...new Set([...prevTags, 'recebeu_link_workshop', 'agendou_aula'])]
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        context: {
          ...prevContext,
          workshop_session_id: session.id,
          scheduled_date: session.starts_at,
          tags: newTags,
        },
        last_message_at: new Date().toISOString(),
        last_message_from: 'agent',
      })
      .eq('id', conversationId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[send-workshop-invite] Erro:', error)
    return NextResponse.json({ error: error.message || 'Erro ao enviar convite' }, { status: 500 })
  }
}

