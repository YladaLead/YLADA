import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar trilhas disponíveis
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

    // Buscar trilhas ativas
    const { data: trilhas, error } = await supabaseAdmin
      .from('wellness_trilhas')
      .select('*')
      .eq('is_ativo', true)
      .order('ordem', { ascending: true })

    if (error) {
      console.error('Erro ao buscar trilhas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar trilhas' },
        { status: 500 }
      )
    }

    // Buscar progresso do usuário para cada trilha
    const trilhasComProgresso = await Promise.all(
      (trilhas || []).map(async (trilha) => {
        const { data: progresso } = await supabaseAdmin
          .from('wellness_progresso')
          .select('progresso_percentual, concluido')
          .eq('user_id', user.id)
          .eq('trilha_id', trilha.id)
          .eq('tipo', 'trilha')
          .maybeSingle()

        return {
          ...trilha,
          progresso: progresso?.progresso_percentual || 0,
          concluido: progresso?.concluido || false
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: { trilhas: trilhasComProgresso }
    })

  } catch (error: any) {
    console.error('Erro ao listar trilhas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

