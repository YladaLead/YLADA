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
    const area = searchParams.get('area') || 'nutri' // Apenas Nutri por padrão
    const status = searchParams.get('status') || 'active'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

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
          phone_number
        )
      `,
        { count: 'exact' }
      )
      .eq('area', 'nutri') // SEMPRE apenas Nutri
      .order('last_message_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtros
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
