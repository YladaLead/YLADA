import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar tarefas do passo a passo diário
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const trilha_id = searchParams.get('trilha_id')
    const dia = searchParams.get('dia')

    if (!trilha_id) {
      return NextResponse.json(
        { error: 'trilha_id é obrigatório' },
        { status: 400 }
      )
    }

    // Se dia não foi fornecido, calcular baseado no progresso do usuário
    let diaAtual = dia ? parseInt(dia) : null

    if (!diaAtual) {
      // Buscar progresso do usuário na trilha
      const { data: progresso } = await supabaseAdmin
        .from('wellness_progresso')
        .select('ultima_atualizacao')
        .eq('user_id', user.id)
        .eq('trilha_id', trilha_id)
        .eq('tipo', 'trilha')
        .maybeSingle()

      if (progresso?.ultima_atualizacao) {
        // Calcular dias desde o início (simplificado - pode ser melhorado)
        const inicio = new Date(progresso.ultima_atualizacao)
        const hoje = new Date()
        const diffTime = Math.abs(hoje.getTime() - inicio.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        diaAtual = Math.min(diffDays + 1, 30) // Máximo 30 dias
      } else {
        diaAtual = 1 // Primeiro dia
      }
    }

    // Buscar tarefas do dia
    const { data: tarefas, error } = await supabaseAdmin
      .from('wellness_passo_a_passo_diario')
      .select(`
        *,
        wellness_modulos(id, nome, icone),
        wellness_aulas(id, titulo)
      `)
      .eq('trilha_id', trilha_id)
      .eq('dia', diaAtual)
      .eq('is_ativo', true)
      .order('ordem', { ascending: true })

    if (error) {
      console.error('Erro ao buscar tarefas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar tarefas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        dia: diaAtual,
        tarefas: tarefas || []
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar passo a passo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

