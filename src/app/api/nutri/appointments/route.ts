import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar consultas do usuário autenticado
 * 
 * Query params:
 * - client_id: Filtrar por cliente específico (opcional)
 * - start_date: Data inicial (ISO string) (opcional)
 * - end_date: Data final (ISO string) (opcional)
 * - appointment_type: Filtrar por tipo (opcional)
 * - status: Filtrar por status (opcional)
 * - limit: Limite de resultados (padrão: 50)
 * - offset: Offset para paginação (padrão: 0)
 * - order_by: Campo para ordenação (padrão: start_time)
 * - order: Direção da ordenação (asc/desc, padrão: asc)
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const appointmentType = searchParams.get('appointment_type')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const orderBy = searchParams.get('order_by') || 'start_time'
    const order = searchParams.get('order') || 'asc'

    const authenticatedUserId = user.id

    // Construir query base
    let query = supabaseAdmin
      .from('appointments')
      .select(`
        *,
        clients:clients!client_id (
          id,
          name,
          email,
          phone
        )
      `, { count: 'exact' })
      .eq('user_id', authenticatedUserId)
      .order(orderBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    if (startDate) {
      query = query.gte('start_time', startDate)
    }

    if (endDate) {
      query = query.lte('start_time', endDate)
    }

    if (appointmentType) {
      query = query.eq('appointment_type', appointmentType)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: appointments, error, count } = await query

    if (error) {
      console.error('Erro ao buscar consultas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar consultas', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        appointments: appointments || [],
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })

  } catch (error: any) {
    console.error('Erro ao listar consultas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * POST - Criar nova consulta
 * 
 * Body:
 * - client_id: UUID (obrigatório)
 * - title: string (obrigatório)
 * - description: string (opcional)
 * - appointment_type: string (padrão: 'consulta') - 'consulta', 'retorno', 'avaliacao', 'acompanhamento', 'outro'
 * - start_time: timestamp (obrigatório)
 * - end_time: timestamp (obrigatório)
 * - duration_minutes: integer (opcional, calculado automaticamente se não fornecido)
 * - location_type: string (padrão: 'presencial') - 'presencial', 'online', 'domicilio'
 * - location_address: string (opcional)
 * - location_url: string (opcional, para consultas online)
 * - reminder_enabled: boolean (padrão: false) - Se lembrete foi enviado
 * - notes: text (opcional)
 * - follow_up_required: boolean (padrão: false)
 * - next_appointment_suggested: timestamp (opcional)
 */
export async function POST(request: NextRequest) {
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

    const authenticatedUserId = user.id
    const body = await request.json()
    const {
      client_id,
      title,
      description,
      appointment_type = 'consulta',
      start_time,
      end_time,
      duration_minutes,
      location_type = 'presencial',
      location_address,
      location_url,
      reminder_enabled = false,
      notes,
      follow_up_required = false,
      next_appointment_suggested
    } = body

    // Validações
    if (!client_id) {
      return NextResponse.json(
        { error: 'client_id é obrigatório' },
        { status: 400 }
      )
    }

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { error: 'Título é obrigatório' },
        { status: 400 }
      )
    }

    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: 'Data e hora de início e fim são obrigatórias' },
        { status: 400 }
      )
    }

    // Validar que end_time é depois de start_time
    if (new Date(end_time) <= new Date(start_time)) {
      return NextResponse.json(
        { error: 'Data/hora de fim deve ser posterior à data/hora de início' },
        { status: 400 }
      )
    }

    // Verificar se o cliente existe e pertence ao usuário
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id, name')
      .eq('id', client_id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Validar tipos
    const validTypes = ['consulta', 'retorno', 'avaliacao', 'acompanhamento', 'outro']
    if (!validTypes.includes(appointment_type)) {
      return NextResponse.json(
        { error: `Tipo de consulta inválido. Use um dos seguintes: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    const validLocationTypes = ['presencial', 'online', 'domicilio']
    if (!validLocationTypes.includes(location_type)) {
      return NextResponse.json(
        { error: `Tipo de localização inválido. Use um dos seguintes: ${validLocationTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Calcular duração se não fornecida
    let calculatedDuration = duration_minutes
    if (!calculatedDuration) {
      const start = new Date(start_time)
      const end = new Date(end_time)
      calculatedDuration = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
    }

    // Preparar dados para inserção
    const appointmentData: any = {
      client_id: client_id,
      user_id: authenticatedUserId,
      title: title.trim(),
      description: description || null,
      appointment_type: appointment_type,
      start_time: start_time,
      end_time: end_time,
      duration_minutes: calculatedDuration,
      location_type: location_type,
      location_address: location_address || null,
      location_url: location_url || null,
      reminder_sent: false,
      notes: notes || null,
      follow_up_required: follow_up_required,
      next_appointment_suggested: next_appointment_suggested || null,
      status: 'agendado',
      created_by: authenticatedUserId
    }

    // Inserir consulta
    const { data: newAppointment, error } = await supabaseAdmin
      .from('appointments')
      .insert(appointmentData)
      .select(`
        *,
        clients:clients!client_id (
          id,
          name,
          email,
          phone
        )
      `)
      .single()

    if (error) {
      console.error('Erro ao criar consulta:', error)
      return NextResponse.json(
        { error: 'Erro ao criar consulta', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Criar evento no histórico
    try {
      await supabaseAdmin
        .from('client_history')
        .insert({
          client_id: client_id,
          user_id: authenticatedUserId,
          activity_type: 'consulta_agendada',
          metadata: {
            appointment_id: newAppointment.id,
            title: newAppointment.title,
            start_time: newAppointment.start_time
          }
        })
    } catch (historyError) {
      console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
    }

    return NextResponse.json({
      success: true,
      data: { appointment: newAppointment }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar consulta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

