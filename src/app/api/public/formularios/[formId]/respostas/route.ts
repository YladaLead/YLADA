import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST - Salvar respostas do formulário (público, sem autenticação)
 */
export async function POST(
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
    const body = await request.json()
    const { responses } = body

    if (!responses || typeof responses !== 'object') {
      return NextResponse.json(
        { error: 'Respostas inválidas' },
        { status: 400 }
      )
    }

    // Verificar se o formulário existe e está ativo
    const { data: form, error: formError } = await supabaseAdmin
      .from('custom_forms')
      .select('id, user_id, is_active')
      .eq('id', formId)
      .eq('is_active', true)
      .single()

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Formulário não encontrado ou não está mais disponível' },
        { status: 404 }
      )
    }

    // Capturar IP e User Agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''

    // Salvar resposta
    const { data: newResponse, error } = await supabaseAdmin
      .from('form_responses')
      .insert({
        form_id: formId,
        user_id: form.user_id, // user_id do criador do formulário
        client_id: null, // Pode ser vinculado depois
        responses: responses,
        ip_address: ip,
        user_agent: userAgent
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar resposta:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar resposta', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { response: newResponse }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao salvar resposta do formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

