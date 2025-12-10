import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar evoluções físicas de um cliente
 * 
 * Query params:
 * - limit: Limite de resultados (padrão: 50)
 * - offset: Offset para paginação (padrão: 0)
 * - order_by: Campo para ordenação (padrão: measurement_date)
 * - order: Direção da ordenação (asc/desc, padrão: desc)
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
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const orderBy = searchParams.get('order_by') || 'measurement_date'
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

    // Buscar evoluções
    const { data: evolutions, error, count } = await supabaseAdmin
      .from('client_evolution')
      .select('*', { count: 'exact' })
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .order(orderBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Erro ao buscar evoluções:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar evoluções', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        evolutions: evolutions || [],
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })

  } catch (error: any) {
    console.error('Erro ao listar evoluções:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * POST - Registrar nova evolução física
 * 
 * Body:
 * - measurement_date: timestamp (opcional, padrão: agora)
 * - weight: decimal (kg)
 * - height: decimal (m) - opcional, pode vir do cliente
 * - bmi: decimal - calculado automaticamente se weight e height fornecidos
 * - neck_circumference: decimal (cm)
 * - chest_circumference: decimal (cm)
 * - waist_circumference: decimal (cm)
 * - hip_circumference: decimal (cm)
 * - arm_circumference: decimal (cm)
 * - thigh_circumference: decimal (cm)
 * - triceps_skinfold: decimal (mm)
 * - biceps_skinfold: decimal (mm)
 * - subscapular_skinfold: decimal (mm)
 * - iliac_skinfold: decimal (mm)
 * - abdominal_skinfold: decimal (mm)
 * - thigh_skinfold: decimal (mm)
 * - body_fat_percentage: decimal (%)
 * - muscle_mass: decimal (kg)
 * - bone_mass: decimal (kg)
 * - water_percentage: decimal (%)
 * - visceral_fat: decimal
 * - notes: text
 * - photos_urls: string[] - URLs das fotos
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

    // Validações - peso não é mais obrigatório, mas se fornecido deve ser válido
    if (weight !== null && weight !== undefined) {
      const weightValue = typeof weight === 'string' ? parseFloat(weight.replace(',', '.')) : parseFloat(weight)
      if (isNaN(weightValue) || weightValue <= 0) {
        return NextResponse.json(
          { error: 'Peso deve ser um número maior que zero' },
          { status: 400 }
        )
      }
    }

    // Processar altura - converter de cm para m se necessário
    let clientHeight = height
    if (clientHeight) {
      const heightValue = typeof clientHeight === 'string' ? parseFloat(clientHeight.replace(',', '.')) : parseFloat(clientHeight)
      // Se altura > 3, provavelmente está em cm, converter para m
      if (heightValue > 3) {
        clientHeight = heightValue / 100
        console.log(`⚠️ Altura convertida de ${heightValue}cm para ${clientHeight}m`)
      } else {
        clientHeight = heightValue
      }
    }

    // Calcular IMC se weight e height disponíveis
    let calculatedBMI: number | null = null
    if (weight && clientHeight && clientHeight > 0) {
      const weightValue = typeof weight === 'string' ? parseFloat(weight.replace(',', '.')) : parseFloat(weight)
      calculatedBMI = parseFloat((weightValue / (clientHeight * clientHeight)).toFixed(2))
    }

    // Preparar dados para inserção
    const weightValue = weight !== null && weight !== undefined 
      ? (typeof weight === 'string' ? parseFloat(weight.replace(',', '.')) : parseFloat(weight))
      : null

    const evolutionData: any = {
      client_id: clientId,
      user_id: authenticatedUserId,
      measurement_date: measurement_date || new Date().toISOString(),
      weight: weightValue,
      height: clientHeight || null,
      bmi: calculatedBMI,
      neck_circumference: neck_circumference ? parseFloat(neck_circumference) : null,
      chest_circumference: chest_circumference ? parseFloat(chest_circumference) : null,
      waist_circumference: waist_circumference ? parseFloat(waist_circumference) : null,
      hip_circumference: hip_circumference ? parseFloat(hip_circumference) : null,
      arm_circumference: arm_circumference ? parseFloat(arm_circumference) : null,
      thigh_circumference: thigh_circumference ? parseFloat(thigh_circumference) : null,
      triceps_skinfold: triceps_skinfold ? parseFloat(triceps_skinfold) : null,
      biceps_skinfold: biceps_skinfold ? parseFloat(biceps_skinfold) : null,
      subscapular_skinfold: subscapular_skinfold ? parseFloat(subscapular_skinfold) : null,
      iliac_skinfold: iliac_skinfold ? parseFloat(iliac_skinfold) : null,
      abdominal_skinfold: abdominal_skinfold ? parseFloat(abdominal_skinfold) : null,
      thigh_skinfold: thigh_skinfold ? parseFloat(thigh_skinfold) : null,
      body_fat_percentage: body_fat_percentage ? parseFloat(body_fat_percentage) : null,
      muscle_mass: muscle_mass ? parseFloat(muscle_mass) : null,
      bone_mass: bone_mass ? parseFloat(bone_mass) : null,
      water_percentage: water_percentage ? parseFloat(water_percentage) : null,
      visceral_fat: visceral_fat ? parseFloat(visceral_fat) : null,
      notes: notes || null,
      photos_urls: photos_urls && Array.isArray(photos_urls) ? photos_urls : null,
      created_by: authenticatedUserId
    }

    // Inserir evolução
    const { data: newEvolution, error } = await supabaseAdmin
      .from('client_evolution')
      .insert(evolutionData)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar evolução:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        data: evolutionData
      })
      return NextResponse.json(
        { 
          error: 'Erro ao criar evolução', 
          technical: process.env.NODE_ENV === 'development' ? error.message : undefined,
          code: error.code,
          details: process.env.NODE_ENV === 'development' ? error.details : undefined
        },
        { status: 500 }
      )
    }

    // Criar evento no histórico
    try {
      await supabaseAdmin
        .from('coach_client_history')
        .insert({
          client_id: clientId,
          user_id: authenticatedUserId,
          activity_type: 'evolucao_registrada',
          metadata: {
            weight: newEvolution.weight,
            bmi: newEvolution.bmi,
            date: newEvolution.measurement_date
          }
        })
    } catch (historyError) {
      console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
    }

    return NextResponse.json({
      success: true,
      data: { evolution: newEvolution }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar evolução:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


