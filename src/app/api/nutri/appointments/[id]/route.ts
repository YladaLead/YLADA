import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar consulta específica
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

    const { id } = await params
    const authenticatedUserId = user.id

    // Buscar consulta
    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (error || !appointment) {
      return NextResponse.json(
        { error: 'Consulta não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { appointment }
    })

  } catch (error: any) {
    console.error('Erro ao buscar consulta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * PUT - Atualizar consulta
 * 
 * Body: Mesmos campos do POST (todos opcionais, apenas os fornecidos serão atualizados)
 */
export async function PUT(
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

    const { id } = await params
    const authenticatedUserId = user.id

    // Verificar se a consulta existe e pertence ao usuário
    const { data: existingAppointment, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('id, client_id, title, status, start_time')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (fetchError || !existingAppointment) {
      return NextResponse.json(
        { error: 'Consulta não encontrada' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      appointment_type,
      start_time,
      end_time,
      duration_minutes,
      location_type,
      location_address,
      location_url,
      reminder_enabled,
      notes,
      status,
      follow_up_required,
      next_appointment_suggested
    } = body

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {}

    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description || null
    if (appointment_type !== undefined) {
      const validTypes = ['consulta', 'retorno', 'avaliacao', 'acompanhamento', 'outro']
      if (!validTypes.includes(appointment_type)) {
        return NextResponse.json(
          { error: `Tipo de consulta inválido. Use um dos seguintes: ${validTypes.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.appointment_type = appointment_type
    }
    if (start_time !== undefined) updateData.start_time = start_time
    if (end_time !== undefined) updateData.end_time = end_time
    if (location_type !== undefined) {
      const validLocationTypes = ['presencial', 'online', 'domicilio']
      if (!validLocationTypes.includes(location_type)) {
        return NextResponse.json(
          { error: `Tipo de localização inválido. Use um dos seguintes: ${validLocationTypes.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.location_type = location_type
    }
    if (location_address !== undefined) updateData.location_address = location_address || null
    if (location_url !== undefined) updateData.location_url = location_url || null
    if (reminder_enabled !== undefined) updateData.reminder_sent = reminder_enabled
    if (notes !== undefined) updateData.notes = notes || null
    if (status !== undefined) {
      const validStatuses = ['agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado', 'falta']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Status inválido. Use um dos seguintes: ${validStatuses.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.status = status
      
      // Se mudou para concluído, registrar data de conclusão
      if (status === 'concluido' && existingAppointment.status !== 'concluido') {
        updateData.completed_at = new Date().toISOString()
      }
    }
    if (follow_up_required !== undefined) updateData.follow_up_required = follow_up_required
    if (next_appointment_suggested !== undefined) updateData.next_appointment_suggested = next_appointment_suggested || null

    // Recalcular duração se start_time ou end_time mudaram
    if (start_time !== undefined || end_time !== undefined) {
      const finalStartTime = start_time || existingAppointment.start_time
      const finalEndTime = end_time || (await supabaseAdmin
        .from('appointments')
        .select('end_time')
        .eq('id', id)
        .single()).data?.end_time

      if (finalStartTime && finalEndTime) {
        const start = new Date(finalStartTime)
        const end = new Date(finalEndTime)
        updateData.duration_minutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
      }
    } else if (duration_minutes !== undefined) {
      updateData.duration_minutes = duration_minutes
    }

    // Atualizar consulta
    const { data: updatedAppointment, error } = await supabaseAdmin
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .select(`
        *,
        clients:client_id (
          id,
          name,
          email,
          phone
        )
      `)
      .single()

    if (error) {
      console.error('Erro ao atualizar consulta:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar consulta', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Criar evento no histórico se status mudou
    if (status && status !== existingAppointment.status) {
      try {
        await supabaseAdmin
          .from('client_history')
          .insert({
            client_id: existingAppointment.client_id,
            user_id: authenticatedUserId,
            activity_type: 'consulta_atualizada',
            metadata: {
              appointment_id: id,
              status_anterior: existingAppointment.status,
              status_novo: status
            }
          })
      } catch (historyError) {
        console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
      }
    }

    return NextResponse.json({
      success: true,
      data: { appointment: updatedAppointment }
    })

  } catch (error: any) {
    console.error('Erro ao atualizar consulta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Cancelar/deletar consulta
 */
export async function DELETE(
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

    const { id } = await params
    const authenticatedUserId = user.id

    // Verificar se a consulta existe e pertence ao usuário
    const { data: existingAppointment, error: fetchError } = await supabaseAdmin
      .from('appointments')
      .select('id, client_id, title, start_time')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (fetchError || !existingAppointment) {
      return NextResponse.json(
        { error: 'Consulta não encontrada' },
        { status: 404 }
      )
    }

    // Deletar consulta
    const { error } = await supabaseAdmin
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('user_id', authenticatedUserId)

    if (error) {
      console.error('Erro ao deletar consulta:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar consulta', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Criar evento no histórico
    try {
      await supabaseAdmin
        .from('client_history')
        .insert({
          client_id: existingAppointment.client_id,
          user_id: authenticatedUserId,
          activity_type: 'consulta_cancelada',
          metadata: {
            appointment_id: id,
            title: existingAppointment.title,
            start_time: existingAppointment.start_time
          }
        })
    } catch (historyError) {
      console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
    }

    return NextResponse.json({
      success: true,
      message: 'Consulta cancelada com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao deletar consulta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

