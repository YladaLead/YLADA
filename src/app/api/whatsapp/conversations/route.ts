/**
 * API para gerenciar conversas WhatsApp
 * GET /api/whatsapp/conversations - Lista conversas
 * Enriquece nome e telefone a partir de workshop_inscricoes e contact_submissions.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { buildInscricoesMaps, findInscricao } from '@/lib/whatsapp-conversation-enrichment'
import { normalizePhoneBr } from '@/lib/phone-br'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/whatsapp/conversations
 * Lista todas as conversas
 */
export async function GET(request: NextRequest) {
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

    // Verificar se é admin (verificar tanto role quanto is_admin no perfil)
    const roleAdmin = user.user_metadata?.role === 'admin'
    
    // Buscar perfil para verificar is_admin
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()
    
    const isAdmin = roleAdmin || profile?.is_admin === true

    if (!isAdmin) {
      console.error('[WhatsApp Conversations] Acesso negado para:', {
        userId: user.id,
        email: user.email,
        role: user.user_metadata?.role,
        is_admin: profile?.is_admin
      })
      return NextResponse.json({ 
        error: 'Acesso negado. Você precisa ser administrador.',
        hint: 'Verifique se seu usuário tem is_admin = true no user_profiles ou role = "admin" no user_metadata'
      }, { status: 403 })
    }

    // Parâmetros de query
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'active'
    const limit = parseInt(searchParams.get('limit') || '200') // Aumentado de 50 para 200
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || '' // Busca por nome/telefone

    // Query base - SEMPRE filtrar por área Nutri
    let query = supabaseAdmin
      .from('whatsapp_conversations')
      .select(
        `
        *,
        z_api_instances:instance_id (
          id,
          name,
          area,
          phone_number,
          status
        )
      `,
        { count: 'exact' }
      )
      .eq('area', 'nutri') // SEMPRE apenas Nutri
      .order('last_message_at', { ascending: false })

    // Filtros
    if (status) {
      query = query.eq('status', status)
    }

    // Busca por nome ou telefone
    if (search.trim()) {
      const searchLower = search.trim().toLowerCase()
      query = query.or(`name.ilike.%${searchLower}%,phone.ilike.%${searchLower}%,context->>display_name.ilike.%${searchLower}%`)
    }

    // Aplicar paginação DEPOIS dos filtros
    query = query.range(offset, offset + limit - 1)

    const { data: conversations, error, count } = await query

    if (error) {
      throw error
    }

    // Incluir preview da última mensagem (para UI estilo WhatsApp)
    const conversationList = conversations || []
    
    // Agrupar conversas duplicadas por telefone (manter apenas a mais recente)
    // IMPORTANTE: Preservar códigos de país para suportar outros países
    const phoneMap = new Map<string, any>()
    const duplicatesFound: string[] = []
    
    conversationList.forEach((conv: any) => {
      // Normalizar telefone: BR 12 dígitos vira 13 (55+DDD+9+8) para agrupar com a mesma pessoa
      let digits = (conv.phone || '').replace(/\D/g, '')
      if (digits.startsWith('55') && digits.length === 12) {
        digits = normalizePhoneBr(digits)
      }
      let phoneKey: string
      if (digits.startsWith('55') && digits.length >= 13) {
        phoneKey = `BR_${digits.substring(2)}`
      } else if (digits.length >= 10 && digits.length <= 11) {
        if (digits.startsWith('0')) digits = digits.slice(1)
        phoneKey = `BR_${digits}`
      } else if (digits.length < 10) {
        const nameKey = (conv.name || '').toLowerCase().trim()
        phoneKey = nameKey && nameKey.length > 3 ? `name_${nameKey}` : `id_${conv.id}`
      } else {
        phoneKey = digits
      }

      const hasName = (c: any) => {
        const n = (c.name || '').trim()
        const d = (c.context?.display_name || '').trim()
        const cust = (c.customer_name || '').trim()
        const reject = (s: string) => !s || /^[\d\s\-\+\(\)]{8,}$/.test(s)
        return (n && !reject(n)) || (d && !reject(d)) || (cust && !reject(cust))
      }
      const mergeContext = (winner: any, other: any) => {
        const w = winner.context && typeof winner.context === 'object' ? winner.context : {}
        const o = other.context && typeof other.context === 'object' ? other.context : {}
        return { ...w, ...o }
      }

      if (!phoneMap.has(phoneKey)) {
        phoneMap.set(phoneKey, conv)
      } else {
        duplicatesFound.push(phoneKey)
        const existing = phoneMap.get(phoneKey)
        const existingDate = existing.last_message_at ? new Date(existing.last_message_at).getTime() : (existing.created_at ? new Date(existing.created_at).getTime() : 0)
        const currentDate = conv.last_message_at ? new Date(conv.last_message_at).getTime() : (conv.created_at ? new Date(conv.created_at).getTime() : 0)
        // Preferir a que tem nome (evitar mostrar número quando usuário já cadastrou nome)
        const existingHasName = hasName(existing)
        const currentHasName = hasName(conv)
        let winner = currentDate > existingDate ? conv : existing
        if (existingHasName && !currentHasName) winner = existing
        else if (currentHasName && !existingHasName) winner = conv
        else if (currentDate > existingDate) winner = conv
        else winner = existing
        const other = winner === conv ? existing : conv
        winner = { ...winner, context: mergeContext(winner, other) }
        phoneMap.set(phoneKey, winner)
      }
    })
    
    if (duplicatesFound.length > 0) {
      console.log('[WhatsApp Conversations] 🔍 Duplicatas agrupadas:', {
        total: duplicatesFound.length,
        antes: conversationList.length,
        depois: phoneMap.size,
        duplicatas: duplicatesFound.slice(0, 5) // Mostrar primeiras 5 para debug
      })
    } else {
      // Log para debug: verificar se há conversas com mesmo nome
      const nameCounts = new Map<string, number>()
      conversationList.forEach((conv: any) => {
        const name = (conv.name || '').toLowerCase().trim()
        if (name) {
          nameCounts.set(name, (nameCounts.get(name) || 0) + 1)
        }
      })
      const duplicateNames = Array.from(nameCounts.entries()).filter(([_, count]) => count > 1)
      if (duplicateNames.length > 0) {
        console.log('[WhatsApp Conversations] ⚠️ Conversas com mesmo nome (mas telefones diferentes):', duplicateNames)
      }
    }
    
    // Converter map de volta para array e reordenar por última mensagem
    let conversationsWithPreview: any[] = Array.from(phoneMap.values())
      .sort((a: any, b: any) => {
        const dateA = a.last_message_at ? new Date(a.last_message_at).getTime() : 0
        const dateB = b.last_message_at ? new Date(b.last_message_at).getTime() : 0
        return dateB - dateA // Mais recente primeiro
      })

    if (conversationsWithPreview.length > 0) {
      const conversationIds = conversationsWithPreview.map((c: any) => c.id).filter(Boolean)

      const { data: lastMessages, error: lastMsgError } = await supabaseAdmin
        .from('whatsapp_messages')
        .select('conversation_id,message,message_type,created_at,sender_type')
        .in('conversation_id', conversationIds)
        .order('created_at', { ascending: false })
        .limit(Math.max(200, conversationIds.length * 5))

      if (lastMsgError) {
        console.error('[WhatsApp Conversations] Erro ao buscar previews:', lastMsgError)
      }

      const lastByConversation = new Map<string, any>()
      ;(lastMessages || []).forEach((m: any) => {
        if (!lastByConversation.has(m.conversation_id)) {
          lastByConversation.set(m.conversation_id, m)
        }
      })

      conversationsWithPreview = conversationsWithPreview.map((conv: any) => {
        const last = lastByConversation.get(conv.id)
        
        // Preview: mostrar texto se disponível, senão mostrar tipo de mídia
        let preview = ''
        if (last) {
          if (last.message_type === 'text' || !last.message_type) {
            // Mensagem de texto: mostrar o texto
            preview = last.message || ''
          } else if (last.message && last.message.trim()) {
            // Mídia com legenda: mostrar legenda
            preview = last.message
          } else {
            // Mídia sem legenda: mostrar tipo
            preview = 
              last.message_type === 'image' ? '📷 Foto' :
              last.message_type === 'video' ? '🎥 Vídeo' :
              last.message_type === 'audio' ? '🎤 Áudio' :
              last.message_type === 'document' ? '📎 Documento' :
              '📎 Mídia'
          }
        }

        return {
          ...conv,
          last_message_preview: typeof preview === 'string' ? preview.substring(0, 80) : '',
          last_message_type: last?.message_type || null,
          last_message_created_at: last?.created_at || null,
          last_message_sender_type: last?.sender_type || null,
        }
      })
    }

    // Enriquecer com nome e telefone de workshop_inscricoes e contact_submissions (estilo WhatsApp Web)
    const maps = await buildInscricoesMaps()
    conversationsWithPreview = conversationsWithPreview.map((conv: any) => {
      const fromInscricao = findInscricao(conv.phone, conv.context || {}, maps)
      return {
        ...conv,
        display_name: fromInscricao?.nome ?? null,
        display_phone: fromInscricao?.telefone ?? null,
      }
    })

    return NextResponse.json({
      conversations: conversationsWithPreview,
      total: count || 0,
      limit,
      offset,
    })
  } catch (error: any) {
    console.error('[WhatsApp Conversations] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar conversas' },
      { status: 500 }
    )
  }
}
