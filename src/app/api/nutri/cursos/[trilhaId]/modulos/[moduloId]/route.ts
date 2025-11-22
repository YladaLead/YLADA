import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { checkAnnualPlanOrCursos, checkModuleUnlocked, calculateModuleProgress } from '@/lib/cursos-helpers'

/**
 * GET /api/nutri/cursos/[trilhaId]/modulos/[moduloId]
 * Busca módulo completo com validação de liberação
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { trilhaId: string; moduloId: string } }
) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { trilhaId, moduloId } = params

    // Verificar acesso (plano anual ou feature cursos)
    const hasAccess = await checkAnnualPlanOrCursos(user.id, 'nutri')
    if (!hasAccess) {
      return NextResponse.json(
        {
          error: 'Acesso negado',
          message: 'Você precisa do plano anual ou plano com cursos para acessar este módulo.',
        },
        { status: 403 }
      )
    }

    // Verificar se módulo está liberado
    const isUnlocked = await checkModuleUnlocked(user.id, moduloId)
    if (!isUnlocked) {
      return NextResponse.json(
        {
          error: 'Módulo bloqueado',
          message: 'Complete o módulo anterior para desbloquear este módulo.',
          unlocked: false,
        },
        { status: 403 }
      )
    }

    const supabase = supabaseAdmin

    // Buscar módulo
    const { data: modulo, error: moduloError } = await supabase
      .from('cursos_modulos')
      .select('*')
      .eq('id', moduloId)
      .eq('trilha_id', trilhaId)
      .single()

    if (moduloError || !modulo) {
      return NextResponse.json(
        { error: 'Módulo não encontrado' },
        { status: 404 }
      )
    }

    // Buscar aulas do módulo
    const { data: aulas, error: aulasError } = await supabase
      .from('cursos_aulas')
      .select('*')
      .eq('modulo_id', moduloId)
      .order('ordem', { ascending: true })

    if (aulasError) {
      console.error('❌ Erro ao buscar aulas:', aulasError)
    }

    // Buscar checklist do módulo
    const { data: checklist } = await supabase
      .from('cursos_checklist')
      .select('*')
      .eq('modulo_id', moduloId)
      .order('ordem', { ascending: true })

    // Buscar progresso do checklist
    const checklistIds = checklist?.map(item => item.id) || []
    const { data: progressoChecklist } = await supabase
      .from('cursos_checklist_progresso')
      .select('checklist_id, completed')
      .eq('user_id', user.id)
      .in('checklist_id', checklistIds)

    const checklistComProgresso = checklist?.map(item => {
      const progresso = progressoChecklist?.find(p => p.checklist_id === item.id)
      return {
        ...item,
        completed: progresso?.completed || false,
      }
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

    // Buscar progresso das tarefas
    const tarefaIds = tarefas?.map(t => t.id) || []
    const { data: progressoTarefas } = await supabase
      .from('cursos_tarefas_progresso')
      .select('tarefa_id, completed')
      .eq('user_id', user.id)
      .in('tarefa_id', tarefaIds)

    const tarefasComProgresso = tarefas?.map(tarefa => {
      const progresso = progressoTarefas?.find(p => p.tarefa_id === tarefa.id)
      return {
        ...tarefa,
        completed: progresso?.completed || false,
      }
    })

    // Organizar tarefas por aula
    const tarefasPorAulaComProgresso = new Map<string, any[]>()
    tarefasComProgresso?.forEach(tarefa => {
      if (!tarefasPorAulaComProgresso.has(tarefa.aula_id)) {
        tarefasPorAulaComProgresso.set(tarefa.aula_id, [])
      }
      tarefasPorAulaComProgresso.get(tarefa.aula_id)?.push(tarefa)
    })

    // Buscar progresso do módulo
    const { data: progressoModulo } = await supabase
      .from('cursos_progresso')
      .select('progress_percentage, completed_at')
      .eq('user_id', user.id)
      .eq('item_type', 'modulo')
      .eq('item_id', moduloId)
      .maybeSingle()

    // Calcular progresso atual
    const progressoCalculado = await calculateModuleProgress(user.id, moduloId)

    // Montar resposta
    const aulasCompletas = aulas?.map(aula => ({
      ...aula,
      tarefas: tarefasPorAulaComProgresso.get(aula.id) || [],
    }))

    return NextResponse.json({
      success: true,
      data: {
        modulo: {
          ...modulo,
          aulas: aulasCompletas,
          checklist: checklistComProgresso || [],
          progress_percentage: progressoCalculado,
          progresso_salvo: progressoModulo?.progress_percentage || 0,
          completed_at: progressoModulo?.completed_at || null,
          unlocked: true,
        },
      },
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar módulo:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar módulo', details: error.message },
      { status: 500 }
    )
  }
}

