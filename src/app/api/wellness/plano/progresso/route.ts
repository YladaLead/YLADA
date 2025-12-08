import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/wellness/plano/progresso
 * 
 * Retorna o progresso do plano de 90 dias do consultor
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Buscar progresso do plano
    const { data: progress, error: progressError } = await supabaseAdmin
      .from('noel_plan_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (progressError && progressError.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar progresso do plano:', progressError)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar progresso do plano' },
        { status: 500 }
      )
    }

    // Se não encontrou, retornar dia 1 (início)
    if (!progress) {
      return NextResponse.json({
        success: true,
        data: {
          current_day: 1,
          plan_id: null,
          started_at: null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        current_day: progress.current_day || 1,
        plan_id: progress.plan_id,
        started_at: progress.created_at,
      },
    })

  } catch (error: any) {
    console.error('❌ Erro ao buscar progresso do plano:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
