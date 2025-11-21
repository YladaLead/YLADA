import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = supabaseAdmin
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo') || 'trilhas' // trilhas, microcursos, biblioteca, tutoriais

    // Buscar trilhas publicadas
    if (tipo === 'trilhas') {
      const { data: trilhas, error } = await supabase
        .from('coach_cursos_trilhas')
        .select(`
          *,
          modulos:coach_cursos_modulos(count),
          aulas:coach_cursos_modulos(
            aulas:coach_cursos_aulas(count)
          )
        `)
        .eq('status', 'published')
        .order('ordem', { ascending: true })

      if (error) {
        console.error('Erro ao buscar trilhas:', error)
        return NextResponse.json({ error: 'Erro ao buscar trilhas' }, { status: 500 })
      }

      // Buscar progresso do usuário para cada trilha
      const trilhaIds = trilhas?.map(t => t.id) || []
      const { data: progresso } = await supabase
        .from('coach_cursos_progresso')
        .select('item_id, progress_percentage')
        .eq('user_id', user.id)
        .eq('item_type', 'trilha')
        .in('item_id', trilhaIds)

      const progressoMap = new Map(progresso?.map(p => [p.item_id, p.progress_percentage]) || [])

      // Adicionar progresso e contadores
      const trilhasComProgresso = trilhas?.map(trilha => {
        const modulosCount = Array.isArray(trilha.modulos) ? trilha.modulos.length : 0
        const aulasCount = trilha.aulas?.reduce((acc: number, mod: any) => {
          return acc + (Array.isArray(mod.aulas) ? mod.aulas.length : 0)
        }, 0) || 0

        return {
          ...trilha,
          progress_percentage: progressoMap.get(trilha.id) || 0,
          modulos_count: modulosCount,
          aulas_count: aulasCount,
          modulos: undefined,
          aulas: undefined
        }
      }) || []

      return NextResponse.json({
        success: true,
        data: {
          trilhas: trilhasComProgresso
        }
      })
    }

    // Buscar microcursos
    if (tipo === 'microcursos') {
      const { data: microcursos, error } = await supabase
        .from('coach_cursos_microcursos')
        .select('*')
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar microcursos:', error)
        return NextResponse.json({ error: 'Erro ao buscar microcursos' }, { status: 500 })
      }

      // Buscar progresso
      const microcursoIds = microcursos?.map(m => m.id) || []
      const { data: progresso } = await supabase
        .from('coach_cursos_progresso')
        .select('item_id, progress_percentage')
        .eq('user_id', user.id)
        .eq('item_type', 'microcurso')
        .in('item_id', microcursoIds)

      const progressoMap = new Map(progresso?.map(p => [p.item_id, p.progress_percentage]) || [])

      const microcursosComProgresso = microcursos?.map(microcurso => ({
        ...microcurso,
        progress_percentage: progressoMap.get(microcurso.id) || 0
      })) || []

      return NextResponse.json({
        success: true,
        data: {
          microcursos: microcursosComProgresso
        }
      })
    }

    // Buscar biblioteca
    if (tipo === 'biblioteca') {
      const categoria = searchParams.get('categoria')
      
      let query = supabase
        .from('coach_cursos_biblioteca')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (categoria) {
        query = query.eq('category', categoria)
      }

      const { data: biblioteca, error } = await query

      if (error) {
        console.error('Erro ao buscar biblioteca:', error)
        return NextResponse.json({ error: 'Erro ao buscar biblioteca' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        data: {
          biblioteca: biblioteca || []
        }
      })
    }

    // Buscar tutoriais
    if (tipo === 'tutoriais') {
      const { data: tutoriais, error } = await supabase
        .from('coach_cursos_tutoriais')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar tutoriais:', error)
        return NextResponse.json({ error: 'Erro ao buscar tutoriais' }, { status: 500 })
      }

      // Buscar progresso
      const tutorialIds = tutoriais?.map(t => t.id) || []
      const { data: progresso } = await supabase
        .from('coach_cursos_progresso')
        .select('item_id, progress_percentage')
        .eq('user_id', user.id)
        .eq('item_type', 'tutorial')
        .in('item_id', tutorialIds)

      const progressoMap = new Map(progresso?.map(p => [p.item_id, p.progress_percentage]) || [])

      const tutoriaisComProgresso = tutoriais?.map(tutorial => ({
        ...tutorial,
        progress_percentage: progressoMap.get(tutorial.id) || 0
      })) || []

      return NextResponse.json({
        success: true,
        data: {
          tutoriais: tutoriaisComProgresso
        }
      })
    }

    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })

  } catch (error: any) {
    console.error('Erro na API de cursos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

