/**
 * Exportar uma conversa WhatsApp (admin)
 * GET /api/whatsapp/conversations/[id]/export
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function formatPhoneForFilename(phone: string | null | undefined) {
  const clean = (phone || '').replace(/\D/g, '')
  return clean || 'contato'
}

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

    const roleAdmin = user.user_metadata?.role === 'admin'
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    const isAdmin = roleAdmin || profile?.is_admin === true
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const conversationId = params.id

    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id,phone,name,area,created_at')
      .eq('id', conversationId)
      .single()

    if (!conversation) {
      return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })
    }

    const { data: messages, error: msgError } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('sender_type,sender_name,message,message_type,created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (msgError) throw msgError

    const lines: string[] = []
    lines.push(`Conversa: ${conversation.name || conversation.phone}`)
    lines.push(`Telefone: ${conversation.phone}`)
    lines.push(`Área: ${conversation.area || '-'}`)
    lines.push(`Criada em: ${new Date(conversation.created_at).toLocaleString('pt-BR')}`)
    lines.push('---')

    ;(messages || []).forEach((m: any) => {
      const who =
        m.sender_type === 'customer'
          ? conversation.name || 'Cliente'
          : m.sender_type === 'agent'
            ? m.sender_name || 'Atendente'
            : m.sender_name || 'Bot'
      const when = new Date(m.created_at).toLocaleString('pt-BR')
      const type = m.message_type && m.message_type !== 'text' ? ` (${m.message_type})` : ''
      lines.push(`[${when}] ${who}${type}: ${m.message}`)
    })

    const content = lines.join('\n')
    const fileName = `whatsapp-${formatPhoneForFilename(conversation.phone)}-${conversationId}.txt`

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error: any) {
    console.error('[WhatsApp Export] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao exportar conversa' },
      { status: 500 }
    )
  }
}

