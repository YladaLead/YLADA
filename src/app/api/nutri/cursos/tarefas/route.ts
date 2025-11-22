import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/nutri/cursos/tarefas?aula_id=xxx
 * Busca tarefas de uma aula e progresso do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const aulaId = searchParams.get('aula_id')

    if (!aulaId) {
      return NextResponse.json(
        { error: 'aula_id é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // Buscar tarefas da aula
    const { data: tarefas, error: tarefasError } = await supabase
      .from('cursos_tarefas')
      .select('*')
      .eq('aula_id', aulaId)
      .order('ordem', { ascending: true })

    if (tarefasError) {
      console.error('❌ Erro ao buscar tarefas:', tarefasError)
      return NextResponse.json(
        { error: 'Erro ao buscar tarefas' },
        { status: 500 }
      )
    }

    // Buscar progresso do usuário
    const tarefaIds = tarefas?.map(t => t.id) || []
    const { data: progresso } = await supabase
      .from('cursos_tarefas_progresso')
      .select('tarefa_id, completed, resposta')
      .eq('user_id', user.id)
      .in('tarefa_id', tarefaIds)

    const progressoMap = new Map(
      progresso?.map(p => [p.tarefa_id, { completed: p.completed, resposta: p.resposta }]) || []
    )

    // Adicionar status de conclusão a cada tarefa
    const tarefasComProgresso = tarefas?.map(tarefa => ({
      ...tarefa,
      completed: progressoMap.get(tarefa.id)?.completed || false,
      resposta: progressoMap.get(tarefa.id)?.resposta || null,
    }))

    // Calcular estatísticas
    const total = tarefasComProgresso?.length || 0
    const concluidas = tarefasComProgresso?.filter(t => t.completed).length || 0
    const obrigatorias = tarefasComProgresso?.filter(t => t.obrigatoria).length || 0
    const obrigatoriasConcluidas = tarefasComProgresso?.filter(
      t => t.obrigatoria && t.completed
    ).length || 0

    return NextResponse.json({
      success: true,
      data: {
        tarefas: tarefasComProgresso,
        estatisticas: {
          total,
          concluidas,
          obrigatorias,
          obrigatoriasConcluidas,
        },
      },
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar tarefas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tarefas', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/nutri/cursos/tarefas
 * Marcar tarefa como concluída (com resposta opcional)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { tarefa_id, completed, resposta } = body

    if (!tarefa_id || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'tarefa_id e completed são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // Atualizar ou criar progresso
    const { data, error } = await supabase
      .from('cursos_tarefas_progresso')
      .upsert(
        {
          user_id: user.id,
          tarefa_id,
          completed,
          resposta: resposta || null,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,tarefa_id',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar tarefa:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar tarefa', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { progresso: data },
    })
  } catch (error: any) {
    console.error('❌ Erro ao atualizar tarefa:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar tarefa', details: error.message },
      { status: 500 }
    )
  }
}

