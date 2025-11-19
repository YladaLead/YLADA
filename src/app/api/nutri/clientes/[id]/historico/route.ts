import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar histórico/timeline de um cliente
 * 
 * Query params:
 * - activity_type: Filtrar por tipo de atividade (opcional)
 * - start_date: Data inicial (ISO string) (opcional)
 * - end_date: Data final (ISO string) (opcional)
 * - search: Busca no título e descrição (opcional)
 * - limit: Limite de resultados (padrão: 100)
 * - offset: Offset para paginação (padrão: 0)
 * - order_by: Campo para ordenação (padrão: created_at)
 * - order: Direção da ordenação (asc/desc, padrão: desc)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { id: clientId } = await params
    const authenticatedUserId = user.id

    const { searchParams } = new URL(request.url)
    const activityType = searchParams.get('activity_type')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const orderBy = searchParams.get('order_by') || 'created_at'
    const order = searchParams.get('order') || 'desc'

    // Verificar se o cliente existe e pertence ao usuário
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id, name')
      .eq('id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Construir query base
    let query = supabaseAdmin
      .from('client_history')
      .select('*', { count: 'exact' })
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .order(orderBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (activityType) {
      query = query.eq('activity_type', activityType)
    }

    if (startDate) {
      query = query.gte('created_at', startDate)
    }

    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    // Busca no título e descrição
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: history, error, count } = await query

    if (error) {
      console.error('Erro ao buscar histórico:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar histórico', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Buscar também registros emocionais/comportamentais se necessário
    // (opcional - pode ser filtrado por activity_type)
    let emotionalHistory: any[] = []
    if (!activityType || activityType === 'registro_emocional' || activityType === 'registro_comportamental') {
      const { data: emotional } = await supabaseAdmin
        .from('emotional_behavioral_history')
        .select('*')
        .eq('client_id', clientId)
        .eq('user_id', authenticatedUserId)
        .order('record_date', { ascending: order === 'asc' })
        .range(offset, offset + limit - 1)

      if (emotional && emotional.length > 0) {
        emotionalHistory = emotional.map(record => ({
          id: record.id,
          activity_type: record.record_type === 'emocional' ? 'registro_emocional' : 'registro_comportamental',
          title: `Registro ${record.record_type === 'emocional' ? 'Emocional' : 'Comportamental'}`,
          description: record.notes || record.emotional_notes || record.behavioral_notes || '',
          metadata: {
            emotional_state: record.emotional_state,
            stress_level: record.stress_level,
            mood_score: record.mood_score,
            sleep_quality: record.sleep_quality,
            energy_level: record.energy_level,
            adherence_score: record.adherence_score,
            patterns_identified: record.patterns_identified,
            triggers: record.triggers
          },
          created_at: record.record_date || record.created_at
        }))
      }
    }

    // Combinar histórico e registros emocionais, ordenar por data
    const allHistory = [...(history || []), ...emotionalHistory].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return order === 'desc' ? dateB - dateA : dateA - dateB
    }).slice(0, limit)

    return NextResponse.json({
      success: true,
      data: {
        history: allHistory,
        total: (count || 0) + emotionalHistory.length,
        limit,
        offset,
        hasMore: ((count || 0) + emotionalHistory.length) > offset + limit
      }
    })

  } catch (error: any) {
    console.error('Erro ao listar histórico:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * POST - Adicionar evento ao histórico
 * 
 * Body:
 * - activity_type: string (obrigatório) - Tipo de atividade
 * - title: string (obrigatório) - Título do evento
 * - description: string (opcional) - Descrição do evento
 * - metadata: JSONB (opcional) - Dados adicionais
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { id: clientId } = await params
    const authenticatedUserId = user.id

    // Verificar se o cliente existe e pertence ao usuário
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id, name')
      .eq('id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      activity_type,
      title,
      description,
      metadata
    } = body

    // Validações
    if (!activity_type) {
      return NextResponse.json(
        { error: 'Tipo de atividade é obrigatório' },
        { status: 400 }
      )
    }

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      )
    }

    // Validar tipos de atividade
    const validTypes = [
      'consulta',
      'avaliacao',
      'reavaliacao',
      'programa_criado',
      'programa_atualizado',
      'programa_concluido',
      'nota_adicionada',
      'status_alterado',
      'evolucao_registrada',
      'registro_emocional',
      'registro_comportamental',
      'cliente_criado',
      'cliente_atualizado',
      'cliente_deletado',
      'lead_convertido',
      'outro'
    ]

    if (!validTypes.includes(activity_type)) {
      return NextResponse.json(
        { error: `Tipo de atividade inválido. Use um dos seguintes: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Preparar dados para inserção
    const historyData: any = {
      client_id: clientId,
      user_id: authenticatedUserId,
      activity_type: activity_type,
      title: title.trim(),
      description: description || null,
      metadata: metadata || null,
      created_by: authenticatedUserId
    }

    // Inserir evento no histórico
    const { data: newHistory, error } = await supabaseAdmin
      .from('client_history')
      .insert(historyData)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar evento no histórico:', error)
      return NextResponse.json(
        { error: 'Erro ao criar evento no histórico', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { history: newHistory }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar evento no histórico:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

