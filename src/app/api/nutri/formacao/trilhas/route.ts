import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await requireApiAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar todas as trilhas ativas
    const { data: trilhas, error: trilhasError } = await supabaseAdmin
      .from('courses_trails')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (trilhasError) {
      console.error('Erro ao buscar trilhas:', trilhasError)
      return NextResponse.json({ error: 'Erro ao buscar trilhas' }, { status: 500 })
    }

    // Buscar progresso do usuário
    const { data: progressos, error: progressosError } = await supabaseAdmin
      .from('progress_user_trails')
      .select('trail_id, lesson_id, is_completed')
      .eq('user_id', user.id)

    if (progressosError) {
      console.error('Erro ao buscar progressos:', progressosError)
    }

    // Calcular progresso por trilha
    const trilhasComProgresso = await Promise.all(
      (trilhas || []).map(async (trilha) => {
        // Contar total de aulas da trilha
        const { count: totalAulas } = await supabaseAdmin
          .from('trails_lessons')
          .select('*', { count: 'exact', head: true })
          .eq('trail_id', trilha.id)
          .eq('is_active', true)

        // Contar aulas concluídas
        const aulasConcluidas = progressos?.filter(
          p => p.trail_id === trilha.id && p.is_completed
        ).length || 0

        const progress_percentage = totalAulas && totalAulas > 0
          ? (aulasConcluidas / totalAulas) * 100
          : 0

        // Contar módulos
        const { count: modulosCount } = await supabaseAdmin
          .from('trails_modules')
          .select('*', { count: 'exact', head: true })
          .eq('trail_id', trilha.id)

        return {
          ...trilha,
          progress_percentage,
          modulos_count: modulosCount || 0
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: trilhasComProgresso
    })
  } catch (error: any) {
    console.error('Erro na API de trilhas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

