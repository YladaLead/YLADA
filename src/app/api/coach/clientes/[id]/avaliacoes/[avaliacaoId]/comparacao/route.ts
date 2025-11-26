import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Comparar avaliação com a anterior
 * 
 * Retorna comparação detalhada entre a avaliação atual e a anterior
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; avaliacaoId: string }> }
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

    // Buscar avaliação atual
    const { data: currentAssessment, error: currentError } = await supabaseAdmin
      .from('coach_assessments')
      .select('*')
      .eq('id', avaliacaoId)
      .eq('client_id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (currentError || !currentAssessment) {
      return NextResponse.json(
        { error: 'Avaliação não encontrada' },
        { status: 404 }
      )
    }

    // Buscar avaliação anterior
    let previousAssessment = null

    // Se for reavaliação, buscar a avaliação pai
    if (currentAssessment.parent_assessment_id) {
      const { data: parent, error: parentError } = await supabaseAdmin
        .from('coach_assessments')
        .select('*')
        .eq('id', currentAssessment.parent_assessment_id)
        .eq('client_id', clientId)
        .eq('user_id', authenticatedUserId)
        .single()

      if (!parentError && parent) {
        previousAssessment = parent
      }
    } else {
      // Se não for reavaliação, buscar a última avaliação anterior
      const { data: previous, error: previousError } = await supabaseAdmin
        .from('coach_assessments')
        .select('*')
        .eq('client_id', clientId)
        .eq('user_id', authenticatedUserId)
        .eq('assessment_type', currentAssessment.assessment_type)
        .lt('created_at', currentAssessment.created_at)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!previousError && previous) {
        previousAssessment = previous
      }
    }

    if (!previousAssessment) {
      return NextResponse.json({
        success: true,
        data: {
          current: currentAssessment,
          previous: null,
          comparison: null,
          message: 'Não há avaliação anterior para comparar'
        }
      })
    }

    // Calcular comparação detalhada
    const currentData = currentAssessment.data || {}
    const previousData = previousAssessment.data || {}

    const comparison: any = {
      // Informações gerais
      dates: {
        previous: previousAssessment.created_at,
        current: currentAssessment.created_at,
        days_between: Math.floor((new Date(currentAssessment.created_at).getTime() - new Date(previousAssessment.created_at).getTime()) / (1000 * 60 * 60 * 24))
      },
      // Medidas antropométricas
      weight: calculateDifference(previousData.weight, currentData.weight),
      height: calculateDifference(previousData.height, currentData.height),
      bmi: calculateDifference(previousData.bmi, currentData.bmi),
      // Circunferências
      neck_circumference: calculateDifference(previousData.neck_circumference, currentData.neck_circumference),
      chest_circumference: calculateDifference(previousData.chest_circumference, currentData.chest_circumference),
      waist_circumference: calculateDifference(previousData.waist_circumference, currentData.waist_circumference),
      hip_circumference: calculateDifference(previousData.hip_circumference, currentData.hip_circumference),
      arm_circumference: calculateDifference(previousData.arm_circumference, currentData.arm_circumference),
      thigh_circumference: calculateDifference(previousData.thigh_circumference, currentData.thigh_circumference),
      // Composição corporal
      body_fat_percentage: calculateDifference(previousData.body_fat_percentage, currentData.body_fat_percentage),
      muscle_mass: calculateDifference(previousData.muscle_mass, currentData.muscle_mass),
      bone_mass: calculateDifference(previousData.bone_mass, currentData.bone_mass),
      water_percentage: calculateDifference(previousData.water_percentage, currentData.water_percentage),
      visceral_fat: calculateDifference(previousData.visceral_fat, currentData.visceral_fat),
      // Dobras cutâneas
      triceps_skinfold: calculateDifference(previousData.triceps_skinfold, currentData.triceps_skinfold),
      biceps_skinfold: calculateDifference(previousData.biceps_skinfold, currentData.biceps_skinfold),
      subscapular_skinfold: calculateDifference(previousData.subscapular_skinfold, currentData.subscapular_skinfold),
      iliac_skinfold: calculateDifference(previousData.iliac_skinfold, currentData.iliac_skinfold),
      abdominal_skinfold: calculateDifference(previousData.abdominal_skinfold, currentData.abdominal_skinfold),
      thigh_skinfold: calculateDifference(previousData.thigh_skinfold, currentData.thigh_skinfold)
    }

    // Resumo de melhorias
    const improvements: string[] = []
    const regressions: string[] = []

    Object.keys(comparison).forEach(key => {
      if (key === 'dates') return
      const diff = comparison[key]
      if (diff && diff.difference !== null) {
        // Para % gordura e circunferências, redução é melhoria
        if (key.includes('fat') || key.includes('circumference') || key.includes('skinfold')) {
          if (diff.difference < 0) {
            improvements.push(key)
          } else if (diff.difference > 0) {
            regressions.push(key)
          }
        } else {
          // Para peso, massa muscular, etc., depende do objetivo
          // Por enquanto, vamos considerar que redução de peso e aumento de massa muscular são melhorias
          if (key === 'weight' && diff.difference < 0) {
            improvements.push(key)
          } else if (key === 'muscle_mass' && diff.difference > 0) {
            improvements.push(key)
          }
        }
      }
    })

    comparison.summary = {
      improvements_count: improvements.length,
      regressions_count: regressions.length,
      improvements: improvements,
      regressions: regressions
    }

    return NextResponse.json({
      success: true,
      data: {
        current: currentAssessment,
        previous: previousAssessment,
        comparison: comparison
      }
    })

  } catch (error: any) {
    console.error('Erro ao comparar avaliações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
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


