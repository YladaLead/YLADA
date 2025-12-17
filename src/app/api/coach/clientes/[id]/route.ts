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

    // Buscar cliente com todos os campos e dados relacionados
    const { data: client, error } = await supabaseAdmin
      .from('coach_clients')
      .select('*')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (error || !client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Buscar dados relacionados
    const [professionalData, healthData, foodHabitsData] = await Promise.all([
      supabaseAdmin
        .from('coach_client_professional')
        .select('*')
        .eq('client_id', id)
        .eq('user_id', authenticatedUserId)
        .maybeSingle(),
      supabaseAdmin
        .from('coach_client_health')
        .select('*')
        .eq('client_id', id)
        .eq('user_id', authenticatedUserId)
        .maybeSingle(),
      supabaseAdmin
        .from('coach_client_food_habits')
        .select('*')
        .eq('client_id', id)
        .eq('user_id', authenticatedUserId)
        .maybeSingle()
    ])

    // Adicionar dados relacionados ao cliente
    const clientWithRelations = {
      ...client,
      professional: professionalData.data || null,
      health: healthData.data || null,
      food_habits: foodHabitsData.data || null
    }

    if (error || !client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { client: clientWithRelations }
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
      .from('coach_clients')
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
      custom_fields,
      // Novos campos
      current_weight,
      current_height,
      goal_weight,
      goal_deadline,
      goal_type,
      professional,
      health,
      digestion,
      food_habits
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
      const validStatuses = ['lead', 'pre_consulta', 'ativa', 'pausa', 'encerrado']
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
    // Novos campos de objetivo
    if (current_weight !== undefined) updateData.current_weight = current_weight || null
    if (current_height !== undefined) updateData.current_height = current_height || null
    if (goal_weight !== undefined) updateData.goal_weight = goal_weight || null
    if (goal_deadline !== undefined) updateData.goal_deadline = goal_deadline || null
    if (goal_type !== undefined) updateData.goal_type = goal_type || null
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
      .from('coach_clients')
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

    // Atualizar ou criar dados profissionais
    if (professional !== undefined) {
      try {
        const professionalUpdate = {
          client_id: id,
          user_id: authenticatedUserId,
          occupation: professional.occupation?.trim() || null,
          work_start_time: professional.work_start_time || null,
          work_end_time: professional.work_end_time || null,
          wake_time: professional.wake_time || null,
          sleep_time: professional.sleep_time || null,
          who_cooks: professional.who_cooks?.trim() || null,
          household_members: professional.household_members || null,
          takes_lunchbox: professional.takes_lunchbox === true || professional.takes_lunchbox === 'true' || professional.takes_lunchbox === 1
        }

        const { error: professionalError } = await supabaseAdmin
          .from('coach_client_professional')
          .upsert(professionalUpdate, { onConflict: 'client_id' })

        if (professionalError) {
          console.error('Erro ao atualizar dados profissionais:', professionalError)
        }
      } catch (professionalError: any) {
        console.error('Erro ao processar dados profissionais:', professionalError)
      }
    }

    // Atualizar ou criar dados de saúde e digestão (mesma tabela)
    if (health !== undefined || digestion !== undefined) {
      try {
        // Buscar dados existentes para mesclar
        const { data: existingHealth } = await supabaseAdmin
          .from('coach_client_health')
          .select('*')
          .eq('client_id', id)
          .eq('user_id', authenticatedUserId)
          .maybeSingle()

        const mergedHealth = {
          client_id: id,
          user_id: authenticatedUserId,
          // Campos de saúde (usar novos se fornecidos, senão manter existentes)
          health_problems: health?.health_problems !== undefined ? (health.health_problems?.trim() || null) : (existingHealth?.health_problems || null),
          medications: health?.medications !== undefined ? (Array.isArray(health.medications) ? health.medications : []) : (existingHealth?.medications || []),
          dietary_restrictions: health?.dietary_restrictions !== undefined ? (health.dietary_restrictions?.trim() || null) : (existingHealth?.dietary_restrictions || null),
          supplements_current: health?.supplements_current !== undefined ? (health.supplements_current?.trim() || null) : (existingHealth?.supplements_current || null),
          supplements_recommended: health?.supplements_recommended !== undefined ? (health.supplements_recommended?.trim() || null) : (existingHealth?.supplements_recommended || null),
          // Campos de digestão (usar novos se fornecidos, senão manter existentes)
          bowel_function: digestion?.bowel_function !== undefined ? (digestion.bowel_function?.trim() || null) : (existingHealth?.bowel_function || null),
          digestive_complaints: digestion?.digestive_complaints !== undefined ? (digestion.digestive_complaints?.trim() || null) : (existingHealth?.digestive_complaints || null)
        }

        const { error: healthError } = await supabaseAdmin
          .from('coach_client_health')
          .upsert(mergedHealth, { onConflict: 'client_id' })

        if (healthError) {
          console.error('Erro ao atualizar dados de saúde:', healthError)
        }
      } catch (healthError: any) {
        console.error('Erro ao processar dados de saúde:', healthError)
      }
    }

    // Atualizar ou criar hábitos alimentares
    if (food_habits !== undefined) {
      try {
        const foodHabitsUpdate = {
          client_id: id,
          user_id: authenticatedUserId,
          water_intake_liters: food_habits.water_intake_liters ? parseFloat(String(food_habits.water_intake_liters)) || null : null,
          breakfast: food_habits.breakfast?.trim() || null,
          morning_snack: food_habits.morning_snack?.trim() || null,
          lunch: food_habits.lunch?.trim() || null,
          afternoon_snack: food_habits.afternoon_snack?.trim() || null,
          dinner: food_habits.dinner?.trim() || null,
          supper: food_habits.supper?.trim() || null,
          snacks_between_meals: food_habits.snacks_between_meals === true || food_habits.snacks_between_meals === 'true' || food_habits.snacks_between_meals === 1,
          snacks_description: food_habits.snacks_description?.trim() || null,
          alcohol_consumption: food_habits.alcohol_consumption?.trim() || null,
          soda_consumption: food_habits.soda_consumption?.trim() || null
        }

        const { error: foodHabitsError } = await supabaseAdmin
          .from('coach_client_food_habits')
          .upsert(foodHabitsUpdate, { onConflict: 'client_id' })

        if (foodHabitsError) {
          console.error('Erro ao atualizar hábitos alimentares:', foodHabitsError)
          // Não falhar a requisição inteira se apenas os hábitos alimentares falharem
          // Mas logar o erro para debug
        }
      } catch (foodHabitsError: any) {
        console.error('Erro ao processar hábitos alimentares:', foodHabitsError)
        // Continuar mesmo se houver erro nos hábitos alimentares
      }
    }

    // Criar evento no histórico se status mudou
    if (status && status !== existingClient.status) {
      try {
        await supabaseAdmin
          .from('coach_client_history')
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
    console.error('Stack trace:', error.stack)
    console.error('Request body:', JSON.stringify(body, null, 2))
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor', 
        technical: process.env.NODE_ENV === 'development' ? error.message : undefined,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
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
      .from('coach_clients')
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

    // Soft delete: marcar como deletado (ou mudar status para 'encerrado')
    // Por enquanto, vamos apenas mudar o status para 'encerrado'
    // Se quiser implementar soft delete real, adicione um campo 'deleted_at' na tabela
    const { error } = await supabaseAdmin
      .from('coach_clients')
      .update({ status: 'encerrado' })
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
        .from('coach_client_history')
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


