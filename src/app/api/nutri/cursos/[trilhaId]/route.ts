import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { checkAnnualPlanOrCursos } from '@/lib/cursos-helpers'

/**
 * GET /api/nutri/cursos/[trilhaId]
 * Busca trilha completa com módulos, aulas, checklist e tarefas
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { trilhaId: string } }
) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const trilhaId = params.trilhaId

    // Verificar acesso (plano anual ou feature cursos)
    const hasAccess = await checkAnnualPlanOrCursos(user.id, 'nutri')
    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Acesso negado',
          message: 'Você precisa do plano anual ou plano com cursos para acessar esta trilha.',
        },
        { status: 403 }
      )
    }

    const supabase = supabaseAdmin

    // Buscar trilha
    const { data: trilha, error: trilhaError } = await supabase
      .from('cursos_trilhas')
      .select('*')
      .eq('id', trilhaId)
      .eq('status', 'published')
      .single()

    if (trilhaError || !trilha) {
      return NextResponse.json(
        { error: 'Trilha não encontrada' },
        { status: 404 }
      )
    }

    // Buscar módulos da trilha
    const { data: modulos, error: modulosError } = await supabase
      .from('cursos_modulos')
      .select('*')
      .eq('trilha_id', trilhaId)
      .order('ordem', { ascending: true })

    if (modulosError) {
      console.error('❌ Erro ao buscar módulos:', modulosError)
    }

    // Buscar aulas de cada módulo
    const moduloIds = modulos?.map(m => m.id) || []
    const { data: aulas } = await supabase
      .from('cursos_aulas')
      .select('*')
      .in('modulo_id', moduloIds)
      .order('ordem', { ascending: true })

    // Organizar aulas por módulo
    const aulasPorModulo = new Map<string, any[]>()
    aulas?.forEach(aula => {
      if (!aulasPorModulo.has(aula.modulo_id)) {
        aulasPorModulo.set(aula.modulo_id, [])
      }
      aulasPorModulo.get(aula.modulo_id)?.push(aula)
    })

    // Buscar checklist de cada módulo
    const { data: checklist } = await supabase
      .from('cursos_checklist')
      .select('*')
      .in('modulo_id', moduloIds)
      .order('ordem', { ascending: true })

    const checklistPorModulo = new Map<string, any[]>()
    checklist?.forEach(item => {
      if (!checklistPorModulo.has(item.modulo_id)) {
        checklistPorModulo.set(item.modulo_id, [])
      }
      checklistPorModulo.get(item.modulo_id)?.push(item)
    })

    // Buscar tarefas de cada aula
    const aulaIds = aulas?.map(a => a.id) || []
    const { data: tarefas } = await supabase
      .from('cursos_tarefas')
      .select('*')
      .in('aula_id', aulaIds)
      .order('ordem', { ascending: true })

    const tarefasPorAula = new Map<string, any[]>()
    tarefas?.forEach(tarefa => {
      if (!tarefasPorAula.has(tarefa.aula_id)) {
        tarefasPorAula.set(tarefa.aula_id, [])
      }
      tarefasPorAula.get(tarefa.aula_id)?.push(tarefa)
    })

    // Buscar progresso do usuário
    const { data: progressoTrilha } = await supabase
      .from('cursos_progresso')
      .select('item_id, progress_percentage')
      .eq('user_id', user.id)
      .eq('item_type', 'trilha')
      .eq('item_id', trilhaId)
      .maybeSingle()

    const { data: progressoModulos } = await supabase
      .from('cursos_progresso')
      .select('item_id, progress_percentage')
      .eq('user_id', user.id)
      .eq('item_type', 'modulo')
      .in('item_id', moduloIds)

    const progressoModulosMap = new Map(
      progressoModulos?.map(p => [p.item_id, p.progress_percentage]) || []
    )

    // Montar estrutura completa
    const modulosCompletos = modulos?.map(modulo => ({
      ...modulo,
      aulas: (aulasPorModulo.get(modulo.id) || []).map(aula => ({
        ...aula,
        tarefas: tarefasPorAula.get(aula.id) || [],
      })),
      checklist: checklistPorModulo.get(modulo.id) || [],
      progress_percentage: progressoModulosMap.get(modulo.id) || 0,
    }))

    return NextResponse.json({
      success: true,
      data: {
        trilha: {
          ...trilha,
          modulos: modulosCompletos,
          progress_percentage: progressoTrilha?.progress_percentage || 0,
        },
      },
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar trilha:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar trilha', details: error.message },
      { status: 500 }
    )
  }
}
