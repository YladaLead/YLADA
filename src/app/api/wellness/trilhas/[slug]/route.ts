import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar trilha específica com módulos
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

    const { slug } = await params

    // Buscar trilha
    const { data: trilha, error: trilhaError } = await supabaseAdmin
      .from('wellness_trilhas')
      .select('*')
      .eq('slug', slug)
      .eq('is_ativo', true)
      .single()

    if (trilhaError || !trilha) {
      return NextResponse.json(
        { error: 'Trilha não encontrada' },
        { status: 404 }
      )
    }

    // Buscar módulos da trilha
    const { data: modulos, error: modulosError } = await supabaseAdmin
      .from('wellness_modulos')
      .select('*')
      .eq('trilha_id', trilha.id)
      .eq('is_ativo', true)
      .order('ordem', { ascending: true })

    if (modulosError) {
      console.error('Erro ao buscar módulos:', modulosError)
    }

    // Buscar progresso do usuário
    const { data: progressoTrilha } = await supabaseAdmin
      .from('wellness_progresso')
      .select('progresso_percentual, concluido')
      .eq('user_id', user.id)
      .eq('trilha_id', trilha.id)
      .eq('tipo', 'trilha')
      .maybeSingle()

    // Buscar progresso de cada módulo
    const modulosComProgresso = await Promise.all(
      (modulos || []).map(async (modulo) => {
        const { data: progressoModulo } = await supabaseAdmin
          .from('wellness_progresso')
          .select('progresso_percentual, concluido')
          .eq('user_id', user.id)
          .eq('modulo_id', modulo.id)
          .eq('tipo', 'modulo')
          .maybeSingle()

        // Contar aulas do módulo
        const { count: totalAulas } = await supabaseAdmin
          .from('wellness_aulas')
          .select('*', { count: 'exact', head: true })
          .eq('modulo_id', modulo.id)
          .eq('is_ativo', true)

        // Contar aulas concluídas
        const { count: aulasConcluidas } = await supabaseAdmin
          .from('wellness_progresso')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('modulo_id', modulo.id)
          .eq('tipo', 'aula')
          .eq('concluido', true)

        return {
          ...modulo,
          progresso: progressoModulo?.progresso_percentual || 0,
          concluido: progressoModulo?.concluido || false,
          totalAulas: totalAulas || 0,
          aulasConcluidas: aulasConcluidas || 0
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        trilha: {
          ...trilha,
          progresso: progressoTrilha?.progresso_percentual || 0,
          concluido: progressoTrilha?.concluido || false
        },
        modulos: modulosComProgresso
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar trilha:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

