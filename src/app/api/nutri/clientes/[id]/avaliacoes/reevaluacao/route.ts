import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Criar reavaliação vinculada a uma avaliação anterior
 * 
 * Body:
 * - parent_assessment_id: UUID (obrigatório) - ID da avaliação original
 * - assessment_type: string (opcional, padrão: mesmo tipo da avaliação original)
 * - assessment_name: string (opcional)
 * - appointment_id: UUID (opcional)
 * - data: JSONB (obrigatório) - Dados da reavaliação
 * - results: JSONB (opcional)
 * - interpretation: text (opcional)
 * - recommendations: text (opcional)
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
      parent_assessment_id,
      assessment_type,
      assessment_name,
      appointment_id,
      data,
      results,
      interpretation,
      recommendations,
      status = 'rascunho'
    } = body

    // Validações
    if (!parent_assessment_id) {
      return NextResponse.json(
        { error: 'parent_assessment_id é obrigatório para criar reavaliação' },
        { status: 400 }
      )
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Dados da avaliação são obrigatórios e devem ser um objeto' },
        { status: 400 }
      )
    }

    // Buscar avaliação original
    const { data: parentAssessment, error: parentError } = await supabaseAdmin
      .from('assessments')
      .select('*')
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

    // Calcular número sequencial da reavaliação
    const { count } = await supabaseAdmin
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .eq('parent_assessment_id', parent_assessment_id)

    const assessmentNumber = (parentAssessment.assessment_number || 1) + (count || 0) + 1

    // Preparar dados para inserção
    const assessmentData: any = {
      client_id: clientId,
      user_id: authenticatedUserId,
      assessment_type: assessment_type || parentAssessment.assessment_type,
      assessment_name: assessment_name || `Reavaliação ${assessmentNumber}`,
      appointment_id: appointment_id || null,
      is_reevaluation: true,
      parent_assessment_id: parent_assessment_id,
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

    // Inserir reavaliação
    const { data: newReevaluation, error } = await supabaseAdmin
      .from('assessments')
      .insert(assessmentData)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar reavaliação:', error)
      return NextResponse.json(
        { error: 'Erro ao criar reavaliação', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Calcular comparação automática
    try {
      const comparison = await calculateComparison(parent_assessment_id, newReevaluation.id, clientId, authenticatedUserId)
      if (comparison) {
        await supabaseAdmin
          .from('assessments')
          .update({ comparison_data: comparison })
          .eq('id', newReevaluation.id)
      }
    } catch (comparisonError) {
      console.warn('Aviso: Não foi possível calcular comparação automática:', comparisonError)
    }

    // Criar evento no histórico
    try {
      await supabaseAdmin
        .from('client_history')
        .insert({
          client_id: clientId,
          user_id: authenticatedUserId,
          activity_type: 'reavaliacao_criada',
          metadata: {
            assessment_id: newReevaluation.id,
            parent_assessment_id: parent_assessment_id,
            assessment_number: assessmentNumber
          }
        })
    } catch (historyError) {
      console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
    }

    return NextResponse.json({
      success: true,
      data: { assessment: newReevaluation },
      message: 'Reavaliação criada com sucesso'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar reavaliação:', error)
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


