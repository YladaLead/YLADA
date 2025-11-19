import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar avaliação específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; avaliacaoId: string }> }
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

    const { id: clientId, avaliacaoId } = await params
    const authenticatedUserId = user.id

    // Verificar se o cliente existe e pertence ao usuário
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Buscar avaliação
    const { data: assessment, error } = await supabaseAdmin
      .from('assessments')
      .select('*')
      .eq('id', avaliacaoId)
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (error || !assessment) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { assessment }
    })

  } catch (error: any) {
    console.error('Erro ao buscar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * PUT - Atualizar avaliação
 * 
 * Body: Mesmos campos do POST (todos opcionais, apenas os fornecidos serão atualizados)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; avaliacaoId: string }> }
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

    const { id: clientId, avaliacaoId } = await params
    const authenticatedUserId = user.id

    // Verificar se o cliente existe e pertence ao usuário
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se a avaliação existe e pertence ao cliente/usuário
    const { data: existingAssessment, error: assessmentError } = await supabaseAdmin
      .from('assessments')
      .select('*')
      .eq('id', avaliacaoId)
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (assessmentError || !existingAssessment) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      assessment_type,
      assessment_name,
      appointment_id,
      data,
      results,
      interpretation,
      recommendations,
      status
    } = body

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {}

    if (assessment_type !== undefined) {
      const validTypes = ['antropometrica', 'bioimpedancia', 'anamnese', 'questionario', 'reavaliacao', 'outro']
      if (!validTypes.includes(assessment_type)) {
        return NextResponse.json(
          { error: `Tipo de avaliação inválido. Use um dos seguintes: ${validTypes.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.assessment_type = assessment_type
    }

    if (assessment_name !== undefined) updateData.assessment_name = assessment_name || null
    if (appointment_id !== undefined) updateData.appointment_id = appointment_id || null
    if (data !== undefined) updateData.data = data
    if (results !== undefined) updateData.results = results || null
    if (interpretation !== undefined) updateData.interpretation = interpretation || null
    if (recommendations !== undefined) updateData.recommendations = recommendations || null
    if (status !== undefined) {
      updateData.status = status
      if (status === 'completo' && existingAssessment.status !== 'completo') {
        updateData.completed_at = new Date().toISOString()
      }
    }

    // Atualizar avaliação
    const { data: updatedAssessment, error } = await supabaseAdmin
      .from('assessments')
      .update(updateData)
      .eq('id', avaliacaoId)
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar avaliação:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar avaliação', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { assessment: updatedAssessment }
    })

  } catch (error: any) {
    console.error('Erro ao atualizar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Deletar avaliação
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; avaliacaoId: string }> }
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

    const { id: clientId, avaliacaoId } = await params
    const authenticatedUserId = user.id

    // Verificar se o cliente existe e pertence ao usuário
    const { data: client, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se a avaliação existe e pertence ao cliente/usuário
    const { data: existingAssessment, error: assessmentError } = await supabaseAdmin
      .from('assessments')
      .select('id, assessment_type, assessment_number')
      .eq('id', avaliacaoId)
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (assessmentError || !existingAssessment) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    // Deletar avaliação
    const { error } = await supabaseAdmin
      .from('assessments')
      .delete()
      .eq('id', avaliacaoId)
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)

    if (error) {
      console.error('Erro ao deletar avaliação:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar avaliação', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Criar evento no histórico
    try {
      await supabaseAdmin
        .from('client_history')
        .insert({
          client_id: clientId,
          user_id: authenticatedUserId,
          activity_type: 'avaliacao_deletada',
          metadata: {
            assessment_type: existingAssessment.assessment_type,
            assessment_number: existingAssessment.assessment_number
          }
        })
    } catch (historyError) {
      console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
    }

    return NextResponse.json({
      success: true,
      message: 'Avaliação deletada com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao deletar avaliação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

