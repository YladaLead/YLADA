import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar programas do cliente
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta.' }, { status: 500 })
    }

    const { id: clientId } = await params
    const authenticatedUserId = user.id

    // Garantir que o cliente pertence ao usuário
    const { data: client, error: clientError } = await supabaseAdmin
      .from('coach_clients')
      .select('id')
      .eq('id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const orderBy = searchParams.get('order_by') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('coach_programs')
      .select('*', { count: 'exact' })
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .order(orderBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: programs, error, count } = await query

    if (error) {
      console.error('Erro ao buscar programas:', error)
      return NextResponse.json({ error: 'Erro ao buscar programas' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        programs: programs || [],
        total: count || 0,
        limit,
        offset
      }
    })
  } catch (error: any) {
    console.error('Erro interno ao listar programas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

/**
 * POST - Criar novo programa
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta.' }, { status: 500 })
    }

    const { id: clientId } = await params
    const authenticatedUserId = user.id

    const { data: client, error: clientError } = await supabaseAdmin
      .from('coach_clients')
      .select('id')
      .eq('id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const {
      name,
      description,
      program_type = 'plano_alimentar',
      start_date,
      end_date,
      status = 'ativo',
      content,
      adherence_percentage,
      notes
    } = body

    if (!name || !start_date) {
      return NextResponse.json(
        { error: 'Nome do programa e data de início são obrigatórios' },
        { status: 400 }
      )
    }

    const programData: any = {
      client_id: clientId,
      user_id: authenticatedUserId,
      name: name.trim(),
      description: description || null,
      program_type,
      start_date,
      end_date: end_date || null,
      status,
      content: content || null,
      adherence_percentage: adherence_percentage || null,
      notes: notes || null
    }

    const { data: newProgram, error } = await supabaseAdmin
      .from('coach_programs')
      .insert(programData)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar programa:', error)
      return NextResponse.json({ error: 'Erro ao criar programa' }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        data: { program: newProgram }
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Erro interno ao criar programa:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


