import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar avaliações de um cliente
 * 
 * Query params:
 * - type: Filtrar por tipo de avaliação (opcional)
 * - is_reevaluation: Filtrar apenas reavaliações (true/false) (opcional)
 * - status: Filtrar por status (opcional)
 * - limit: Limite de resultados (padrão: 50)
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
    const type = searchParams.get('type')
    const isReevaluation = searchParams.get('is_reevaluation')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
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
      .from('assessments')
      .select('*', { count: 'exact' })
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .order(orderBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (type) {
      query = query.eq('assessment_type', type)
    }

    if (isReevaluation === 'true') {
      query = query.eq('is_reevaluation', true)
    } else if (isReevaluation === 'false') {
      query = query.eq('is_reevaluation', false)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: assessments, error, count } = await query

    if (error) {
      console.error('Erro ao buscar avaliações:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar avaliações', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        assessments: assessments || [],
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })

  } catch (error: any) {
    console.error('Erro ao listar avaliações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * POST - Criar nova avaliação
 * 
 * Body:
 * - assessment_type: string (obrigatório) - 'antropometrica', 'bioimpedancia', 'anamnese', etc.
 * - assessment_name: string (opcional) - Nome personalizado
 * - appointment_id: UUID (opcional) - Se vinculado a uma consulta
 * - is_reevaluation: boolean (padrão: false)
 * - parent_assessment_id: UUID (opcional) - ID da avaliação original (se reavaliação)
 * - data: JSONB (obrigatório) - Dados da avaliação
 * - results: JSONB (opcional) - Resultados calculados
 * - interpretation: text (opcional) - Interpretação
 * - recommendations: text (opcional) - Recomendações
 * - status: string (padrão: 'rascunho')
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
      assessment_type,
      assessment_name,
      appointment_id,
      is_reevaluation = false,
      parent_assessment_id,
      data,
      results,
      interpretation,
      recommendations,
      status = 'rascunho'
    } = body

    // Validações
    if (!assessment_type) {
      return NextResponse.json(
        { error: 'Tipo de avaliação é obrigatório' },
        { status: 400 }
      )
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Dados da avaliação são obrigatórios e devem ser um objeto' },
        { status: 400 }
      )
    }

    // Validar tipos de avaliação
    const validTypes = ['antropometrica', 'bioimpedancia', 'anamnese', 'questionario', 'reavaliacao', 'outro']
    if (!validTypes.includes(assessment_type)) {
      return NextResponse.json(
        { error: `Tipo de avaliação inválido. Use um dos seguintes: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Se for reavaliação, verificar se parent_assessment_id existe
    let assessmentNumber = 1
    if (is_reevaluation || parent_assessment_id) {
      if (!parent_assessment_id) {
        return NextResponse.json(
          { error: 'parent_assessment_id é obrigatório para reavaliações' },
          { status: 400 }
        )
      }

      // Verificar se a avaliação pai existe e pertence ao cliente
      const { data: parentAssessment, error: parentError } = await supabaseAdmin
        .from('assessments')
        .select('id, assessment_number')
        .eq('id', parent_assessment_id)
        .eq('client_id', clientId)
        .eq('user_id', authenticatedUserId)
        .single()

      if (parentError || !parentAssessment) {
        return NextResponse.json(
          { error: 'Avaliação original não encontrada' },
          { status: 404 }
        )
      }

      // Calcular número sequencial
      assessmentNumber = (parentAssessment.assessment_number || 1) + 1
    } else {
      // Contar avaliações iniciais para determinar o número
      const { count } = await supabaseAdmin
        .from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientId)
        .eq('user_id', authenticatedUserId)
        .eq('is_reevaluation', false)

      assessmentNumber = (count || 0) + 1
    }

    // Preparar dados para inserção
    const assessmentData: any = {
      client_id: clientId,
      user_id: authenticatedUserId,
      assessment_type: assessment_type,
      assessment_name: assessment_name || null,
      appointment_id: appointment_id || null,
      is_reevaluation: is_reevaluation || !!parent_assessment_id,
      parent_assessment_id: parent_assessment_id || null,
      assessment_number: assessmentNumber,
      data: data,
      results: results || null,
      interpretation: interpretation || null,
      recommendations: recommendations || null,
      status: status,
      created_by: authenticatedUserId
    }

    if (status === 'completo') {
      assessmentData.completed_at = new Date().toISOString()
    }

    // Inserir avaliação
    const { data: newAssessment, error } = await supabaseAdmin
      .from('assessments')
      .insert(assessmentData)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar avaliação:', error)
      return NextResponse.json(
        { error: 'Erro ao criar avaliação', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Se for reavaliação, calcular comparação automática
    if (is_reevaluation && parent_assessment_id) {
      try {
        const comparison = await calculateComparison(parent_assessment_id, newAssessment.id, clientId, authenticatedUserId)
        if (comparison) {
          await supabaseAdmin
            .from('assessments')
            .update({ comparison_data: comparison })
            .eq('id', newAssessment.id)
        }
      } catch (comparisonError) {
        console.warn('Aviso: Não foi possível calcular comparação automática:', comparisonError)
      }
    }

    // Criar evento no histórico
    try {
      await supabaseAdmin
        .from('client_history')
        .insert({
          client_id: clientId,
          user_id: authenticatedUserId,
          activity_type: is_reevaluation ? 'reavaliacao_criada' : 'avaliacao_criada',
          metadata: {
            assessment_id: newAssessment.id,
            assessment_type: assessment_type,
            assessment_number: assessmentNumber
          }
        })
    } catch (historyError) {
      console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
    }

    return NextResponse.json({
      success: true,
      data: { assessment: newAssessment }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * Função auxiliar para calcular comparação entre avaliações
 */
async function calculateComparison(
  parentAssessmentId: string,
  newAssessmentId: string,
  clientId: string,
  userId: string
): Promise<any> {
  try {
    // Buscar ambas as avaliações
    const { data: assessments, error } = await supabaseAdmin
      .from('assessments')
      .select('*')
      .in('id', [parentAssessmentId, newAssessmentId])
      .eq('client_id', clientId)
      .eq('user_id', userId)

    if (error || !assessments || assessments.length !== 2) {
      return null
    }

    const parent = assessments.find(a => a.id === parentAssessmentId)
    const current = assessments.find(a => a.id === newAssessmentId)

    if (!parent || !current) {
      return null
    }

    const parentData = parent.data || {}
    const currentData = current.data || {}

    // Calcular diferenças para campos numéricos comuns
    const comparison: any = {
      weight: calculateDifference(parentData.weight, currentData.weight),
      bmi: calculateDifference(parentData.bmi, currentData.bmi),
      body_fat_percentage: calculateDifference(parentData.body_fat_percentage, currentData.body_fat_percentage),
      muscle_mass: calculateDifference(parentData.muscle_mass, currentData.muscle_mass),
      waist_circumference: calculateDifference(parentData.waist_circumference, currentData.waist_circumference),
      hip_circumference: calculateDifference(parentData.hip_circumference, currentData.hip_circumference),
      created_at: {
        parent: parent.created_at,
        current: current.created_at,
        days_between: Math.floor((new Date(current.created_at).getTime() - new Date(parent.created_at).getTime()) / (1000 * 60 * 60 * 24))
      }
    }

    return comparison
  } catch (error) {
    console.error('Erro ao calcular comparação:', error)
    return null
  }
}

/**
 * Função auxiliar para calcular diferença entre dois valores
 */
function calculateDifference(oldValue: number | null | undefined, newValue: number | null | undefined): any {
  if (oldValue === null || oldValue === undefined || newValue === null || newValue === undefined) {
    return null
  }

  const old = parseFloat(oldValue.toString())
  const current = parseFloat(newValue.toString())

  if (isNaN(old) || isNaN(current)) {
    return null
  }

  const difference = current - old
  const percentChange = old !== 0 ? ((difference / old) * 100).toFixed(2) : null

  return {
    old: old,
    current: current,
    difference: parseFloat(difference.toFixed(2)),
    percent_change: percentChange ? parseFloat(percentChange) : null
  }
}

