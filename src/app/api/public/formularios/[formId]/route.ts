import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET - Buscar formulário público (sem autenticação)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { formId } = await params

    // Buscar formulário (apenas se estiver ativo)
    const { data: form, error } = await supabaseAdmin
      .from('custom_forms')
      .select('id, name, description, form_type, structure, is_active')
      .eq('id', formId)
      .eq('is_active', true)
      .single()

    if (error || !form) {
      return NextResponse.json(
        { error: 'Formulário não encontrado ou não está mais disponível' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { form }
    })

  } catch (error: any) {
    console.error('Erro ao buscar formulário público:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

