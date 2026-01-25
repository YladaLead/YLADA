/**
 * API para atualizar uma conversa WhatsApp (admin)
 * PATCH /api/whatsapp/conversations/[id]
 *
 * Usado para recursos estilo WhatsApp:
 * - favoritar, pinar, silenciar
 * - editar nome, avatar, tags, notas (via context JSONB)
 * - arquivar / bloquear (via status)
 * - marcar como não lida (unread_count)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { sendRegistrationLinkAfterClass } from '@/lib/whatsapp-carol-ai'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function normalizeContext(input: any): Record<string, any> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {}
  return input as Record<string, any>
}

export async function PATCH(
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

    // Admin check (role ou is_admin no perfil)
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
    const body = await request.json().catch(() => ({}))

    // Campos suportados
    const {
      status, // 'active' | 'archived' | 'blocked'
      unread_count, // number (marcar como não lida)
      name, // string (nome do contato)
      context, // partial merge
    } = body || {}

    // Buscar conversa atual
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id,status,unread_count,name,context')
      .eq('id', conversationId)
      .single()

    if (existingError || !existing) {
      return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })
    }

    const updateData: any = {}

    if (typeof status === 'string' && ['active', 'archived', 'blocked'].includes(status)) {
      updateData.status = status
    }

    if (typeof unread_count === 'number' && Number.isFinite(unread_count) && unread_count >= 0) {
      updateData.unread_count = Math.floor(unread_count)
    }

    if (typeof name === 'string') {
      updateData.name = name.trim() || null
    }

    if (context && typeof context === 'object') {
      const prevContext = normalizeContext(existing.context)
      const prevTags = Array.isArray(prevContext.tags) ? prevContext.tags : []
      const nextContext = { ...prevContext, ...normalizeContext(context) }
      const nextTags = Array.isArray(nextContext.tags) ? nextContext.tags : []
      updateData.context = nextContext
      
      // 🆕 Detectar se tag "participou_aula" foi adicionada
      const hadParticipatedTag = prevTags.includes('participou_aula')
      const hasParticipatedTag = nextTags.includes('participou_aula')
      
      if (!hadParticipatedTag && hasParticipatedTag) {
        // Tag foi adicionada agora - enviar link de cadastro imediatamente
        console.log('[WhatsApp Conversation] 🎉 Tag participou_aula adicionada - enviando link de cadastro')
        try {
          // Não bloquear a atualização se houver erro no envio
          sendRegistrationLinkAfterClass(conversationId).catch((error: any) => {
            console.error('[WhatsApp Conversation] ❌ Erro ao enviar link de cadastro:', error)
          })
        } catch (error: any) {
          console.error('[WhatsApp Conversation] ❌ Erro ao enviar link de cadastro:', error)
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: true, conversation: existing })
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .update(updateData)
      .eq('id', conversationId)
      .select('*')
      .single()

    if (updateError) {
      console.error('[WhatsApp Conversation PATCH] Erro ao atualizar:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, conversation: updated })
  } catch (error: any) {
    console.error('[WhatsApp Conversation PATCH] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar conversa' },
      { status: 500 }
    )
  }
}

