/**
 * API para gerenciar conversas WhatsApp
 * GET /api/whatsapp/conversations - Lista conversas
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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

    // Verificar se é admin
    const isAdmin = user.user_metadata?.role === 'admin'

    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Parâmetros de query
    const searchParams = request.nextUrl.searchParams
    const area = searchParams.get('area')
    const status = searchParams.get('status') || 'active'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Query base
    let query = supabaseAdmin
      .from('whatsapp_conversations')
      .select(
        `
        *,
        z_api_instances:instance_id (
          id,
          name,
          area,
          phone_number
        )
      `,
        { count: 'exact' }
      )
      .order('last_message_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtros
    if (area) {
      query = query.eq('area', area)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: conversations, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      conversations: conversations || [],
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
