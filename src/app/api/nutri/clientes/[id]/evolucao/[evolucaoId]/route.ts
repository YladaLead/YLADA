import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar evolução específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; evolucaoId: string }> }
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

    const { id: clientId, evolucaoId } = await params
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

    // Buscar evolução
    const { data: evolution, error } = await supabaseAdmin
      .from('client_evolution')
      .select('*')
      .eq('id', evolucaoId)
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (error || !evolution) {
      return NextResponse.json(
        { error: 'Evolução não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { evolution }
    })

  } catch (error: any) {
    console.error('Erro ao buscar evolução:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * PUT - Atualizar evolução física
 * 
 * Body: Mesmos campos do POST (todos opcionais, apenas os fornecidos serão atualizados)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; evolucaoId: string }> }
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

    const { id: clientId, evolucaoId } = await params
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

    // Verificar se a evolução existe e pertence ao cliente/usuário
    const { data: existingEvolution, error: evolutionError } = await supabaseAdmin
      .from('client_evolution')
      .select('*')
      .eq('id', evolucaoId)
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (evolutionError || !existingEvolution) {
      return NextResponse.json(
        { error: 'Evolução não encontrada' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      measurement_date,
      weight,
      height,
      neck_circumference,
      chest_circumference,
      waist_circumference,
      hip_circumference,
      arm_circumference,
      thigh_circumference,
      triceps_skinfold,
      biceps_skinfold,
      subscapular_skinfold,
      iliac_skinfold,
      abdominal_skinfold,
      thigh_skinfold,
      body_fat_percentage,
      muscle_mass,
      bone_mass,
      water_percentage,
      visceral_fat,
      notes,
      photos_urls
    } = body

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: any = {}

    if (measurement_date !== undefined) updateData.measurement_date = measurement_date
    if (weight !== undefined) {
      updateData.weight = parseFloat(weight)
      // Recalcular IMC se weight ou height mudaram
      const finalHeight = height !== undefined ? parseFloat(height) : existingEvolution.height
      if (updateData.weight && finalHeight && finalHeight > 0) {
        updateData.bmi = parseFloat((updateData.weight / (finalHeight * finalHeight)).toFixed(2))
      }
    }
    if (height !== undefined) {
      updateData.height = parseFloat(height)
      // Recalcular IMC
      const finalWeight = weight !== undefined ? parseFloat(weight) : existingEvolution.weight
      if (finalWeight && updateData.height && updateData.height > 0) {
        updateData.bmi = parseFloat((finalWeight / (updateData.height * updateData.height)).toFixed(2))
      }
    }
    if (neck_circumference !== undefined) updateData.neck_circumference = neck_circumference ? parseFloat(neck_circumference) : null
    if (chest_circumference !== undefined) updateData.chest_circumference = chest_circumference ? parseFloat(chest_circumference) : null
    if (waist_circumference !== undefined) updateData.waist_circumference = waist_circumference ? parseFloat(waist_circumference) : null
    if (hip_circumference !== undefined) updateData.hip_circumference = hip_circumference ? parseFloat(hip_circumference) : null
    if (arm_circumference !== undefined) updateData.arm_circumference = arm_circumference ? parseFloat(arm_circumference) : null
    if (thigh_circumference !== undefined) updateData.thigh_circumference = thigh_circumference ? parseFloat(thigh_circumference) : null
    if (triceps_skinfold !== undefined) updateData.triceps_skinfold = triceps_skinfold ? parseFloat(triceps_skinfold) : null
    if (biceps_skinfold !== undefined) updateData.biceps_skinfold = biceps_skinfold ? parseFloat(biceps_skinfold) : null
    if (subscapular_skinfold !== undefined) updateData.subscapular_skinfold = subscapular_skinfold ? parseFloat(subscapular_skinfold) : null
    if (iliac_skinfold !== undefined) updateData.iliac_skinfold = iliac_skinfold ? parseFloat(iliac_skinfold) : null
    if (abdominal_skinfold !== undefined) updateData.abdominal_skinfold = abdominal_skinfold ? parseFloat(abdominal_skinfold) : null
    if (thigh_skinfold !== undefined) updateData.thigh_skinfold = thigh_skinfold ? parseFloat(thigh_skinfold) : null
    if (body_fat_percentage !== undefined) updateData.body_fat_percentage = body_fat_percentage ? parseFloat(body_fat_percentage) : null
    if (muscle_mass !== undefined) updateData.muscle_mass = muscle_mass ? parseFloat(muscle_mass) : null
    if (bone_mass !== undefined) updateData.bone_mass = bone_mass ? parseFloat(bone_mass) : null
    if (water_percentage !== undefined) updateData.water_percentage = water_percentage ? parseFloat(water_percentage) : null
    if (visceral_fat !== undefined) updateData.visceral_fat = visceral_fat ? parseFloat(visceral_fat) : null
    if (notes !== undefined) updateData.notes = notes || null
    if (photos_urls !== undefined) updateData.photos_urls = photos_urls && Array.isArray(photos_urls) ? photos_urls : null

    // Atualizar evolução
    const { data: updatedEvolution, error } = await supabaseAdmin
      .from('client_evolution')
      .update(updateData)
      .eq('id', evolucaoId)
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar evolução:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar evolução', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { evolution: updatedEvolution }
    })

  } catch (error: any) {
    console.error('Erro ao atualizar evolução:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Deletar evolução física
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; evolucaoId: string }> }
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

    const { id: clientId, evolucaoId } = await params
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

    // Verificar se a evolução existe e pertence ao cliente/usuário
    const { data: existingEvolution, error: evolutionError } = await supabaseAdmin
      .from('client_evolution')
      .select('id, measurement_date, weight')
      .eq('id', evolucaoId)
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (evolutionError || !existingEvolution) {
      return NextResponse.json(
        { error: 'Evolução não encontrada' },
        { status: 404 }
      )
    }

    // Deletar evolução
    const { error } = await supabaseAdmin
      .from('client_evolution')
      .delete()
      .eq('id', evolucaoId)
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)

    if (error) {
      console.error('Erro ao deletar evolução:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar evolução', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
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
          activity_type: 'evolucao_deletada',
          metadata: {
            date: existingEvolution.measurement_date,
            weight: existingEvolution.weight
          }
        })
    } catch (historyError) {
      console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
    }

    return NextResponse.json({
      success: true,
      message: 'Evolução deletada com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao deletar evolução:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

