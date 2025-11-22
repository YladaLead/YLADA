import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/nutri/cursos/checklist?modulo_id=xxx
 * Busca checklist de um módulo e progresso do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const moduloId = searchParams.get('modulo_id')

    if (!moduloId) {
      return NextResponse.json(
        { error: 'modulo_id é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // Buscar itens do checklist
    const { data: checklist, error: checklistError } = await supabase
      .from('cursos_checklist')
      .select('*')
      .eq('modulo_id', moduloId)
      .order('ordem', { ascending: true })

    if (checklistError) {
      console.error('❌ Erro ao buscar checklist:', checklistError)
      return NextResponse.json(
        { error: 'Erro ao buscar checklist' },
        { status: 500 }
      )
    }

    // Buscar progresso do usuário
    const checklistIds = checklist?.map(item => item.id) || []
    const { data: progresso } = await supabase
      .from('cursos_checklist_progresso')
      .select('checklist_id, completed')
      .eq('user_id', user.id)
      .in('checklist_id', checklistIds)

    const progressoMap = new Map(
      progresso?.map(p => [p.checklist_id, p.completed]) || []
    )

    // Adicionar status de conclusão a cada item
    const checklistComProgresso = checklist?.map(item => ({
      ...item,
      completed: progressoMap.get(item.id) || false,
    }))

    // Calcular porcentagem de conclusão
    const total = checklistComProgresso?.length || 0
    const concluidos =
      checklistComProgresso?.filter(item => item.completed).length || 0
    const porcentagem = total > 0 ? Math.round((concluidos / total) * 100) : 0

    return NextResponse.json({
      success: true,
      data: {
        checklist: checklistComProgresso,
        progresso: {
          total,
          concluidos,
          porcentagem,
        },
      },
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar checklist:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar checklist', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/nutri/cursos/checklist
 * Marcar item do checklist como concluído/não concluído
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { checklist_id, completed } = body

    if (!checklist_id || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'checklist_id e completed são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // Atualizar ou criar progresso
    const { data, error } = await supabase
      .from('cursos_checklist_progresso')
      .upsert(
        {
          user_id: user.id,
          checklist_id,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,checklist_id',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar checklist:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar checklist', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { progresso: data },
    })
  } catch (error: any) {
    console.error('❌ Erro ao atualizar checklist:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar checklist', details: error.message },
      { status: 500 }
    )
  }
}

