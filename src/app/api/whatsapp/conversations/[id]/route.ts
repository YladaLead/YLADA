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
import { isCarolAutomationDisabled } from '@/config/whatsapp-automation'
import { sendRegistrationLinkAfterClass } from '@/lib/whatsapp-carol-ai'
import { buildInscricoesMaps, findInscricaoByName } from '@/lib/whatsapp-conversation-enrichment'
import { normalizePhoneBr } from '@/lib/phone-br'

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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = typeof (params as any)?.then === 'function' ? await (params as Promise<{ id: string }>) : (params as { id: string })
    const conversationId = resolvedParams.id

    if (!conversationId) {
      return NextResponse.json({ error: 'ID da conversa é obrigatório' }, { status: 400 })
    }

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
    const body = await request.json().catch(() => ({}))

    // Campos suportados
    const {
      status, // 'active' | 'archived' | 'blocked'
      unread_count, // number (marcar como não lida)
      name, // string (nome do contato)
      context, // partial merge
    } = body || {}

    // Buscar conversa atual (phone e area para sincronizar duplicatas)
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id,status,unread_count,name,context,phone,area')
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
      // Garantir substituição explícita do array de tags (remover tag = persistir a lista sem ela)
      if (context.tags !== undefined) {
        nextContext.tags = Array.isArray(context.tags) ? [...context.tags] : []
      }
      const nextTags = Array.isArray(nextContext.tags) ? nextContext.tags : []
      // Ao salvar nome/display_name: buscar telefone no cadastro e preencher display_phone
      const nomeParaBusca = (nextContext.display_name as string) || updateData.name || (existing.name as string)
      if (nomeParaBusca && typeof nomeParaBusca === 'string' && nomeParaBusca.trim()) {
        try {
          const maps = await buildInscricoesMaps()
          const inscricao = findInscricaoByName(nomeParaBusca.trim(), maps)
          if (inscricao?.telefone) {
            nextContext.display_phone = inscricao.telefone
          }
        } catch (_) {
          // ignora falha na busca
        }
      }
      updateData.context = nextContext
      
      // Detectar se tag "participou_aula" foi adicionada (desligado quando isCarolAutomationDisabled)
      const hadParticipatedTag = prevTags.includes('participou_aula')
      const hasParticipatedTag = nextTags.includes('participou_aula')
      if (!hadParticipatedTag && hasParticipatedTag && !isCarolAutomationDisabled()) {
        console.log('[WhatsApp Conversation] 🎉 Tag participou_aula adicionada - enviando link de cadastro')
        try {
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

    // Quando atualizamos context (ex.: tags), atualizar TODAS as conversas com o mesmo telefone e área.
    // A listagem agrupa duplicatas e faz merge do context; se só atualizarmos uma linha, a outra continua
    // com as tags antigas e o merge faz a tag "voltar" (ex.: não conseguir tirar "Link Workshop").
    // Usar normalizePhoneBr para cobrir 12 dígitos (55+DDD+8) → 13 (55+DDD+9+8) e todas as variantes.
    let idsToUpdate: string[] = [conversationId]
    if (updateData.context && existing.phone) {
      const area = (existing as any).area || 'nutri'
      const digits = String(existing.phone).replace(/\D/g, '')
      if (digits.length >= 10) {
        const canonical = normalizePhoneBr(digits)
        const phone13 = digits.startsWith('55') && digits.length >= 13 ? digits : (canonical.startsWith('55') && canonical.length >= 13 ? canonical : '55' + (digits.startsWith('0') ? digits.slice(1) : digits))
        const phone12 = phone13.startsWith('55') && phone13.length === 13 ? phone13.slice(0, 4) + phone13.slice(5) : (canonical.startsWith('55') && canonical.length === 12 ? canonical : '')
        const variants = [phone13, canonical, existing.phone, digits].filter(Boolean) as string[]
        if (phone12) variants.push(phone12)
        const { data: samePhone } = await supabaseAdmin
          .from('whatsapp_conversations')
          .select('id')
          .eq('area', area)
          .in('phone', [...new Set(variants)])
        if (samePhone?.length) {
          idsToUpdate = samePhone.map((r: { id: string }) => r.id)
        }
      }
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .update(updateData)
      .in('id', idsToUpdate)
      .select('*')
      .eq('id', conversationId)
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

