import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { trilhaId: string } }
) {
  try {
    const user = await requireApiAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = supabaseAdmin

    // Buscar trilha
    const { data: trilha, error: trilhaError } = await supabase
      .from('coach_cursos_trilhas')
      .select('*')
      .eq('id', params.trilhaId)
      .eq('status', 'published')
      .single()

    if (trilhaError || !trilha) {
      return NextResponse.json({ error: 'Trilha não encontrada' }, { status: 404 })
    }

    // Buscar módulos
    const { data: modulos, error: modulosError } = await supabase
      .from('coach_cursos_modulos')
      .select(`
        *,
        aulas:coach_cursos_aulas(
          *,
          materiais:coach_cursos_materiais(*)
        )
      `)
      .eq('trilha_id', params.trilhaId)
      .order('ordem', { ascending: true })

    if (modulosError) {
      console.error('Erro ao buscar módulos:', modulosError)
      return NextResponse.json({ error: 'Erro ao buscar módulos' }, { status: 500 })
    }

    // Buscar progresso da trilha
    const { data: progressoTrilha } = await supabase
      .from('coach_cursos_progresso')
      .select('progress_percentage, last_position')
      .eq('user_id', user.id)
      .eq('item_type', 'trilha')
      .eq('item_id', params.trilhaId)
      .single()

    // Buscar progresso das aulas
    const aulaIds = modulos?.flatMap(mod => 
      mod.aulas?.map((aula: any) => aula.id) || []
    ) || []

    const { data: progressoAulas } = await supabase
      .from('coach_cursos_progresso')
      .select('item_id, progress_percentage, last_position, completed_at')
      .eq('user_id', user.id)
      .eq('item_type', 'aula')
      .in('item_id', aulaIds)

    const progressoAulasMap = new Map(
      progressoAulas?.map(p => [
        p.item_id,
        {
          progress_percentage: p.progress_percentage,
          last_position: p.last_position,
          completed: !!p.completed_at
        }
      ]) || []
    )

    // Adicionar progresso aos módulos e aulas
    const modulosComProgresso = modulos?.map(modulo => {
      const aulasComProgresso = modulo.aulas?.map((aula: any) => ({
        ...aula,
        progress_percentage: progressoAulasMap.get(aula.id)?.progress_percentage || 0,
        last_position: progressoAulasMap.get(aula.id)?.last_position || 0,
        completed: progressoAulasMap.get(aula.id)?.completed || false
      })) || []

      const aulasCompletas = aulasComProgresso.filter(a => a.completed).length
      const totalAulas = aulasComProgresso.length
      const progressoModulo = totalAulas > 0 ? (aulasCompletas / totalAulas) * 100 : 0

      return {
        ...modulo,
        aulas: aulasComProgresso,
        aulas_count: totalAulas,
        progress_percentage: progressoModulo
      }
    }) || []

    return NextResponse.json({
      success: true,
      data: {
        trilha: {
          ...trilha,
          progress_percentage: progressoTrilha?.progress_percentage || 0,
          modulos_count: modulosComProgresso.length
        },
        modulos: modulosComProgresso
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

