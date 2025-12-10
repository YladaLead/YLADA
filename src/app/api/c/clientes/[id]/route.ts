import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar cliente específico por ID
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

    const { id } = await params
    const authenticatedUserId = user.id

    // 🚀 OTIMIZAÇÃO: Selecionar apenas campos necessários
    const { data: client, error } = await supabaseAdmin
      .from('clients')
      .select('id, name, email, phone, status, goal, converted_from_lead, lead_source, created_at, updated_at, next_appointment, last_appointment, tags')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (error || !client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { client }
    })

  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * PUT - Atualizar cliente
 * 
 * Body: Mesmos campos do POST (todos opcionais, apenas os fornecidos serão atualizados)
 */
export async function PUT(
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

    const { id } = await params
    const authenticatedUserId = user.id

    // Verificar se o cliente existe e pertence ao usuário
    const { data: existingClient, error: fetchError } = await supabaseAdmin
      .from('clients')
      .select('id, name')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (fetchError || !existingClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      birth_date,
      gender,
      cpf,
      address,
      status,
      goal,
      instagram,
      origin,
      origin_id,
      converted_from_lead,
      lead_source,
      lead_template_id,
      custom_fields
    } = body

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {}

    if (name !== undefined) updateData.name = name.trim()
    if (email !== undefined) updateData.email = email?.trim() || null
    if (phone !== undefined) updateData.phone = phone?.trim() || null
    if (birth_date !== undefined) updateData.birth_date = birth_date || null
    if (gender !== undefined) updateData.gender = gender || null
    if (cpf !== undefined) updateData.cpf = cpf?.trim() || null
    if (status !== undefined) {
      const validStatuses = ['lead', 'pre_consulta', 'ativa', 'pausa', 'finalizada']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Status inválido. Use um dos seguintes: ${validStatuses.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.status = status
    }
    if (goal !== undefined) updateData.goal = goal || null
    if (instagram !== undefined) updateData.instagram = instagram?.trim() || null
    if (origin !== undefined) updateData.origin = origin || null
    if (origin_id !== undefined) updateData.origin_id = origin_id || null
    if (converted_from_lead !== undefined) updateData.converted_from_lead = converted_from_lead
    if (lead_source !== undefined) updateData.lead_source = lead_source || null
    if (lead_template_id !== undefined) updateData.lead_template_id = lead_template_id || null
    if (custom_fields !== undefined) updateData.custom_fields = custom_fields || null

    // Adicionar endereço se fornecido
    if (address) {
      if (address.street !== undefined) updateData.address_street = address.street || null
      if (address.number !== undefined) updateData.address_number = address.number || null
      if (address.complement !== undefined) updateData.address_complement = address.complement || null
      if (address.neighborhood !== undefined) updateData.address_neighborhood = address.neighborhood || null
      if (address.city !== undefined) updateData.address_city = address.city || null
      if (address.state !== undefined) updateData.address_state = address.state || null
      if (address.zipcode !== undefined) updateData.address_zipcode = address.zipcode || null
    }

    // Atualizar cliente
    const { data: updatedClient, error } = await supabaseAdmin
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar cliente:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar cliente', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Criar evento no histórico se status mudou
    if (status && status !== existingClient.status) {
      try {
        await supabaseAdmin
          .from('client_history')
          .insert({
            client_id: id,
            user_id: authenticatedUserId,
            activity_type: 'status_alterado',
            title: 'Status alterado',
            description: `Status alterado de ${existingClient.status} para ${status}`,
            metadata: {
              status_anterior: existingClient.status,
              status_novo: status
            }
          })
      } catch (historyError) {
        console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
      }
    }

    return NextResponse.json({
      success: true,
      data: { client: updatedClient }
    })

  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Deletar cliente (soft delete)
 * 
 * Marca o cliente como deletado, mas não remove do banco
 */
export async function DELETE(
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

    const { id } = await params
    const authenticatedUserId = user.id

    // Verificar se o cliente existe e pertence ao usuário
    const { data: existingClient, error: fetchError } = await supabaseAdmin
      .from('clients')
      .select('id, name')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (fetchError || !existingClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Soft delete: marcar como deletado (ou mudar status para 'finalizada')
    // Por enquanto, vamos apenas mudar o status para 'finalizada'
    // Se quiser implementar soft delete real, adicione um campo 'deleted_at' na tabela
    const { error } = await supabaseAdmin
      .from('clients')
      .update({ status: 'finalizada' })
      .eq('id', id)
      .eq('user_id', authenticatedUserId)

    if (error) {
      console.error('Erro ao deletar cliente:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar cliente', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Criar evento no histórico
    try {
      await supabaseAdmin
        .from('client_history')
        .insert({
          client_id: id,
          user_id: authenticatedUserId,
          activity_type: 'cliente_deletado',
          title: 'Cliente deletado',
          description: `Cliente ${existingClient.name} foi deletado`,
          metadata: {
            name: existingClient.name
          }
        })
    } catch (historyError) {
      console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente deletado com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao deletar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}
