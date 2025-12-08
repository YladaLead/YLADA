import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar clientes do Wellness (NOEL)
 * Retorna clientes da tabela noel_clients para o usuário autenticado
 */
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação (perfil wellness ou admin)
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult // Retorna erro de autenticação
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 🔒 Sempre usar user_id do token (seguro)
    const authenticatedUserId = user.id

    let query = supabaseAdmin
      .from('noel_clients')
      .select('*', { count: 'exact' })
      .eq('user_id', authenticatedUserId) // 🔒 Sempre filtrar por user_id do token
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtrar por status se fornecido
    if (status && status !== 'todos') {
      query = query.eq('status', status)
    }

    const { data: clients, error, count } = await query

    if (error) {
      console.error('❌ Erro ao buscar clientes do Wellness:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar clientes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        clients: clients || [],
        total: count || 0,
        limit,
        offset
      }
    })

  } catch (error: any) {
    console.error('❌ Erro ao listar clientes do Wellness:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
