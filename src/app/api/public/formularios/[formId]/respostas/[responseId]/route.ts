import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET - Buscar resposta específica do formulário (público, sem autenticação)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string; responseId: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { formId, responseId } = await params

    // Verificar se o formulário existe e está ativo
    const { data: form, error: formError } = await supabaseAdmin
      .from('custom_forms')
      .select('id, is_active')
      .eq('id', formId)
      .eq('is_active', true)
      .single()

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Formulário não encontrado ou não está mais disponível' },
        { status: 404 }
      )
    }

    // Buscar resposta
    const { data: response, error } = await supabaseAdmin
      .from('form_responses')
      .select('*')
      .eq('id', responseId)
      .eq('form_id', formId)
      .single()

    if (error || !response) {
      return NextResponse.json(
        { error: 'Resposta não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { response }
    })

  } catch (error: any) {
    console.error('Erro ao buscar resposta do formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


