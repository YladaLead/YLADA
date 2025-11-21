import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar registros emocionais/comportamentais de um cliente
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
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { id: clientId } = await params
    const authenticatedUserId = user.id

    const { searchParams } = new URL(request.url)
    const recordType = searchParams.get('record_type')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const order = searchParams.get('order') || 'desc'

    // Verificar se o cliente existe e pertence ao usuário
    const { data: client, error: clientError } = await supabaseAdmin
      .from('coach_clients')
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

    // Construir query
    let query = supabaseAdmin
      .from('coach_emotional_behavioral_history')
      .select('*', { count: 'exact' })
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .order('record_date', { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    if (recordType) {
      query = query.eq('record_type', recordType)
    }

    const { data: records, error, count } = await query

    if (error) {
      console.error('Erro ao buscar registros emocionais/comportamentais:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar registros', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        records: records || [],
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })

  } catch (error: any) {
    console.error('Erro ao listar registros emocionais/comportamentais:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * POST - Criar novo registro emocional/comportamental
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
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { id: clientId } = await params
    const authenticatedUserId = user.id

    // Verificar se o cliente existe
    const { data: client, error: clientError } = await supabaseAdmin
      .from('coach_clients')
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
      record_date,
      record_type,
      emotional_state,
      emotional_notes,
      stress_level,
      mood_score,
      sleep_quality,
      energy_level,
      adherence_score,
      meal_following_percentage,
      exercise_frequency,
      water_intake_liters,
      behavioral_notes,
      patterns_identified,
      triggers,
      notes,
      appointment_id
    } = body

    // Validações
    if (!record_type) {
      return NextResponse.json(
        { error: 'Tipo de registro é obrigatório' },
        { status: 400 }
      )
    }

    if (!['emocional', 'comportamental', 'ambos'].includes(record_type)) {
      return NextResponse.json(
        { error: 'Tipo de registro inválido. Use: emocional, comportamental ou ambos' },
        { status: 400 }
      )
    }

    // Preparar dados
    const recordData: any = {
      client_id: clientId,
      user_id: authenticatedUserId,
      record_date: record_date || new Date().toISOString(),
      record_type: record_type,
      emotional_state: emotional_state || null,
      emotional_notes: emotional_notes || null,
      stress_level: stress_level ? parseInt(stress_level) : null,
      mood_score: mood_score ? parseInt(mood_score) : null,
      sleep_quality: sleep_quality || null,
      energy_level: energy_level || null,
      adherence_score: adherence_score ? parseInt(adherence_score) : null,
      meal_following_percentage: meal_following_percentage ? parseFloat(meal_following_percentage) : null,
      exercise_frequency: exercise_frequency || null,
      water_intake_liters: water_intake_liters ? parseFloat(water_intake_liters) : null,
      behavioral_notes: behavioral_notes || null,
      patterns_identified: patterns_identified || [],
      triggers: triggers || [],
      notes: notes || null,
      appointment_id: appointment_id || null,
      created_by: authenticatedUserId
    }

    // Inserir registro
    const { data: newRecord, error } = await supabaseAdmin
      .from('coach_emotional_behavioral_history')
      .insert(recordData)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar registro emocional/comportamental:', error)
      return NextResponse.json(
        { error: 'Erro ao criar registro', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Criar evento no histórico
    await supabaseAdmin
      .from('coach_client_history')
      .insert({
        client_id: clientId,
        user_id: authenticatedUserId,
        activity_type: record_type === 'emocional' ? 'registro_emocional' : record_type === 'comportamental' ? 'registro_comportamental' : 'registro_emocional',
        title: `Registro ${record_type === 'emocional' ? 'Emocional' : record_type === 'comportamental' ? 'Comportamental' : 'Emocional/Comportamental'}`,
        description: notes || emotional_notes || behavioral_notes || '',
        metadata: {
          stress_level,
          mood_score,
          adherence_score
        },
        created_by: authenticatedUserId
      })

    return NextResponse.json({
      success: true,
      data: { record: newRecord }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar registro emocional/comportamental:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


