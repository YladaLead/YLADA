import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await requireApiAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const trilhaId = params.id

    // Buscar trilha
    const { data: trilha, error: trilhaError } = await supabaseAdmin
      .from('courses_trails')
      .select('*')
      .eq('id', trilhaId)
      .eq('is_active', true)
      .single()

    if (trilhaError || !trilha) {
      return NextResponse.json({ error: 'Trilha não encontrada' }, { status: 404 })
    }

    // Buscar módulos
    const { data: modulos, error: modulosError } = await supabaseAdmin
      .from('trails_modules')
      .select('*')
      .eq('trail_id', trilhaId)
      .order('order_index', { ascending: true })

    if (modulosError) {
      console.error('Erro ao buscar módulos:', modulosError)
    }

    // Buscar aulas para cada módulo
    const modulosComAulas = await Promise.all(
      (modulos || []).map(async (modulo) => {
        const { data: aulas, error: aulasError } = await supabaseAdmin
          .from('trails_lessons')
          .select('*')
          .eq('trail_id', trilhaId)
          .eq('module_id', modulo.id)
          .eq('is_active', true)
          .order('order_index', { ascending: true })

        if (aulasError) {
          console.error('Erro ao buscar aulas:', aulasError)
        }

        // Buscar progresso do usuário para cada aula
        const aulasComProgresso = await Promise.all(
          (aulas || []).map(async (aula) => {
            const { data: progresso } = await supabaseAdmin
              .from('progress_user_trails')
              .select('is_completed')
              .eq('user_id', user.id)
              .eq('lesson_id', aula.id)
              .single()

            return {
              ...aula,
              is_completed: progresso?.is_completed || false
            }
          })
        )

        return {
          ...modulo,
          aulas: aulasComProgresso
        }
      })
    )

    // Buscar última aula assistida
    const { data: ultimaProgresso } = await supabaseAdmin
      .from('progress_user_trails')
      .select('lesson_id, is_completed')
      .eq('user_id', user.id)
      .eq('trail_id', trilhaId)
      .eq('is_completed', false)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    let ultimaAula = null
    if (ultimaProgresso) {
      const { data: aula } = await supabaseAdmin
        .from('trails_lessons')
        .select('*')
        .eq('id', ultimaProgresso.lesson_id)
        .single()

      if (aula) {
        ultimaAula = {
          ...aula,
          is_completed: false
        }
      }
    }

    // Calcular progresso total
    const totalAulas = modulosComAulas.reduce((acc, m) => acc + m.aulas.length, 0)
    const { count: aulasConcluidas } = await supabaseAdmin
      .from('progress_user_trails')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('trail_id', trilhaId)
      .eq('is_completed', true)

    const progress_percentage = totalAulas > 0
      ? ((aulasConcluidas || 0) / totalAulas) * 100
      : 0

    return NextResponse.json({
      success: true,
      data: {
        trilha: {
          ...trilha,
          progress_percentage
        },
        modulos: modulosComAulas,
        ultima_aula: ultimaAula
      }
    })
  } catch (error: any) {
    console.error('Erro na API de trilha:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

