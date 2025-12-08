import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Contar respostas não visualizadas do coach
 * Retorna contagem total e detalhes por formulário
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
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

    const authenticatedUserId = user.id

    // Contar total de respostas não visualizadas
    const { count: totalNovas, error: countError } = await supabaseAdmin
      .from('form_responses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authenticatedUserId)
      .eq('viewed', false)

    if (countError) {
      console.error('Erro ao contar respostas não visualizadas:', countError)
      return NextResponse.json(
        { error: 'Erro ao contar respostas', technical: process.env.NODE_ENV === 'development' ? countError.message : undefined },
        { status: 500 }
      )
    }

    // Buscar respostas não visualizadas com informações do formulário
    const { data: respostasNovas, error: respostasError } = await supabaseAdmin
      .from('form_responses')
      .select(`
        id,
        form_id,
        created_at,
        custom_forms (
          id,
          name
        )
      `)
      .eq('user_id', authenticatedUserId)
      .eq('viewed', false)
      .order('created_at', { ascending: false })
      .limit(10)

    if (respostasError) {
      console.error('Erro ao buscar respostas não visualizadas:', respostasError)
    }

    // Agrupar por formulário
    const porFormulario: Record<string, { form_id: string; form_name: string; count: number }> = {}
    
    if (respostasNovas) {
      respostasNovas.forEach((resposta: any) => {
        const formId = resposta.form_id
        if (!porFormulario[formId]) {
          porFormulario[formId] = {
            form_id: formId,
            form_name: resposta.custom_forms?.name || 'Formulário sem nome',
            count: 0
          }
        }
        porFormulario[formId].count++
      })
    }

    // Contar por formulário (query separada para precisão)
    const formulariosComContagem = await Promise.all(
      Object.keys(porFormulario).map(async (formId) => {
        const { count, error: countError } = await supabaseAdmin
          .from('form_responses')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', authenticatedUserId)
          .eq('form_id', formId)
          .eq('viewed', false)
        
        if (countError) {
          console.error(`Erro ao contar respostas do formulário ${formId}:`, countError)
        }
        
        return {
          form_id: formId,
          form_name: porFormulario[formId].form_name,
          count: count || 0
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        total: totalNovas || 0,
        por_formulario: formulariosComContagem,
        ultimas_respostas: respostasNovas?.slice(0, 5) || []
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar respostas não visualizadas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


