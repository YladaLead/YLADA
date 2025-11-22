import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { calculateModuleProgress } from '@/lib/cursos-helpers'

/**
 * GET /api/nutri/cursos/progresso
 * Busca progresso geral do usuário em todas as trilhas
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = supabaseAdmin

    // Buscar todas as trilhas publicadas
    const { data: trilhas } = await supabase
      .from('cursos_trilhas')
      .select('id, title')
      .eq('status', 'published')
      .order('ordem', { ascending: true })

    if (!trilhas) {
      return NextResponse.json({
        success: true,
        data: {
          trilhas: [],
          progressoGeral: 0,
          trilhasConcluidas: 0,
          totalTrilhas: 0,
        },
      })
    }

    // Buscar progresso de cada trilha
    const trilhaIds = trilhas.map(t => t.id)
    const { data: progressoTrilhas } = await supabase
      .from('cursos_progresso')
      .select('item_id, progress_percentage')
      .eq('user_id', user.id)
      .eq('item_type', 'trilha')
      .in('item_id', trilhaIds)

    const progressoMap = new Map(
      progressoTrilhas?.map(p => [p.item_id, p.progress_percentage]) || []
    )

    // Calcular estatísticas
    const trilhasComProgresso = trilhas.map(trilha => ({
      id: trilha.id,
      title: trilha.title,
      progress_percentage: progressoMap.get(trilha.id) || 0,
    }))

    const trilhasConcluidas = trilhasComProgresso.filter(
      t => t.progress_percentage === 100
    ).length

    const progressoGeral =
      trilhasComProgresso.length > 0
        ? Math.round(
            trilhasComProgresso.reduce(
              (acc, t) => acc + t.progress_percentage,
              0
            ) / trilhasComProgresso.length
          )
        : 0

    return NextResponse.json({
      success: true,
      data: {
        trilhas: trilhasComProgresso,
        progressoGeral,
        trilhasConcluidas,
        totalTrilhas: trilhas.length,
      },
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar progresso:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar progresso', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/nutri/cursos/progresso
 * Atualiza progresso (vídeo, checklist, tarefa)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { tipo, item_id, item_type, progress_percentage, completed } = body

    if (!tipo || !item_id || !item_type) {
      return NextResponse.json(
        { error: 'tipo, item_id e item_type são obrigatórios' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // Atualizar progresso na tabela cursos_progresso
    if (tipo === 'video' || tipo === 'modulo') {
      const { data, error } = await supabase
        .from('cursos_progresso')
        .upsert(
          {
            user_id: user.id,
            item_type: item_type, // 'modulo' ou 'trilha'
            item_id: item_id,
            progress_percentage: progress_percentage || (completed ? 100 : 0),
            completed_at: completed ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,item_type,item_id',
          }
        )
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao atualizar progresso:', error)
        return NextResponse.json(
          { error: 'Erro ao atualizar progresso', details: error.message },
          { status: 500 }
        )
      }

      // Se módulo foi concluído, recalcular progresso da trilha
      if (item_type === 'modulo' && completed) {
        // Buscar trilha do módulo
        const { data: modulo } = await supabase
          .from('cursos_modulos')
          .select('trilha_id')
          .eq('id', item_id)
          .single()

        if (modulo) {
          // Recalcular progresso da trilha
          // (implementar lógica de cálculo)
        }
      }

      return NextResponse.json({
        success: true,
        data: { progresso: data },
      })
    }

    return NextResponse.json(
      { error: 'Tipo de progresso não suportado' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('❌ Erro ao atualizar progresso:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar progresso', details: error.message },
      { status: 500 }
    )
  }
}
