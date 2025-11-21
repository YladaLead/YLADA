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

    // Buscar progresso geral
    const { data: progresso, error } = await supabase
      .from('coach_cursos_progresso')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar progresso:', error)
      return NextResponse.json({ error: 'Erro ao buscar progresso' }, { status: 500 })
    }

    // Calcular estatísticas
    const trilhasCompletas = progresso?.filter(p => 
      p.item_type === 'trilha' && p.progress_percentage >= 100
    ).length || 0

    const trilhasEmAndamento = progresso?.filter(p => 
      p.item_type === 'trilha' && p.progress_percentage > 0 && p.progress_percentage < 100
    ).length || 0

    const microcursosAssistidos = progresso?.filter(p => 
      p.item_type === 'microcurso' && p.progress_percentage >= 100
    ).length || 0

    // Buscar certificados
    const { data: certificados } = await supabase
      .from('coach_cursos_certificados')
      .select('trilha_id')
      .eq('user_id', user.id)

    // Buscar trilhas com progresso
    const trilhasProgresso = progresso?.filter(p => p.item_type === 'trilha') || []
    const trilhaIds = trilhasProgresso.map(p => p.item_id)
    
    const { data: trilhas } = await supabase
      .from('coach_cursos_trilhas')
      .select('id, title')
      .in('id', trilhaIds)

    const trilhasComProgresso = trilhas?.map(trilha => {
      const prog = trilhasProgresso.find(p => p.item_id === trilha.id)
      return {
        trilha_id: trilha.id,
        trilha_title: trilha.title,
        progress_percentage: prog?.progress_percentage || 0
      }
    }) || []

    // Calcular horas estudadas (estimativa baseada em progresso)
    // Isso seria mais preciso com dados reais de tempo assistido
    const horasEstudadas = 0 // TODO: Calcular baseado em tempo real assistido

    return NextResponse.json({
      success: true,
      data: {
        trilhas_completas: trilhasCompletas,
        trilhas_em_andamento: trilhasEmAndamento,
        microcursos_assistidos: microcursosAssistidos,
        horas_estudadas: horasEstudadas,
        certificados_obtidos: certificados?.length || 0,
        trilhas_progresso: trilhasComProgresso
      }
    })

  } catch (error: any) {
    console.error('Erro na API de progresso:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { item_type, item_id, progress_percentage, last_position } = body

    if (!item_type || !item_id || progress_percentage === undefined) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: item_type, item_id, progress_percentage' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    // Verificar se já existe progresso
    const { data: existing } = await supabase
      .from('coach_cursos_progresso')
      .select('id')
      .eq('user_id', user.id)
      .eq('item_type', item_type)
      .eq('item_id', item_id)
      .single()

    const progressoData: any = {
      user_id: user.id,
      item_type,
      item_id,
      progress_percentage: Math.min(100, Math.max(0, progress_percentage)),
      updated_at: new Date().toISOString()
    }

    if (last_position !== undefined) {
      progressoData.last_position = last_position
    }

    if (progress_percentage >= 100) {
      progressoData.completed_at = new Date().toISOString()
    }

    let result
    if (existing) {
      // Atualizar
      const { data, error } = await supabase
        .from('coach_cursos_progresso')
        .update(progressoData)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Criar novo
      progressoData.started_at = new Date().toISOString()
      const { data, error } = await supabase
        .from('coach_cursos_progresso')
        .insert(progressoData)
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error: any) {
    console.error('Erro ao salvar progresso:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar progresso' },
      { status: 500 }
    )
  }
}

