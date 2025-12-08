import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-client'

/**
 * POST /api/admin/wellness/learning-suggestions/[id]/approve
 * Aprova uma sugestão de aprendizado
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const supabase = createClient()
    const { data: { session }, error: authError } = await supabase.auth.getSession()

    if (authError || !session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Erro de configuração' }, { status: 500 })
    }

    const { id } = params
    const body = await request.json()
    const { action, category, subcategory, tags } = body

    // Buscar sugestão
    const { data: suggestion, error: fetchError } = await supabaseAdmin
      .from('wellness_learning_suggestions')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !suggestion) {
      return NextResponse.json({ error: 'Sugestão não encontrada' }, { status: 404 })
    }

    // Marcar como aprovada
    const { error: updateError } = await supabaseAdmin
      .from('wellness_learning_suggestions')
      .update({
        approved: true,
        approved_at: new Date().toISOString(),
        approved_by: session.user.id,
      })
      .eq('id', id)

    if (updateError) {
      console.error('Erro ao aprovar sugestão:', updateError)
      return NextResponse.json({ error: 'Erro ao aprovar sugestão' }, { status: 500 })
    }

    // Se action for especificado, adicionar ao banco de conhecimento
    if (action === 'add_to_scripts' || action === 'add_to_objections') {
      try {
        if (action === 'add_to_scripts') {
          await supabaseAdmin.from('wellness_scripts').insert({
            categoria: category || suggestion.suggested_category || 'interno',
            subcategoria: subcategory || null,
            nome: `Script: ${suggestion.query.substring(0, 100)}`,
            versao: 'media',
            conteudo: suggestion.suggested_response,
            tags: tags || [],
            ativo: true,
          })
        } else if (action === 'add_to_objections') {
          await supabaseAdmin.from('wellness_objecoes').insert({
            categoria: category || 'clientes',
            codigo: `AUTO.${Date.now()}`,
            objeção: suggestion.query,
            versao_media: suggestion.suggested_response,
            tags: tags || [],
            ativo: true,
          })
        }
      } catch (addError) {
        console.error('Erro ao adicionar ao banco:', addError)
        // Não falhar a aprovação se houver erro ao adicionar
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sugestão aprovada com sucesso',
    })
  } catch (error: any) {
    console.error('Erro ao aprovar sugestão:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


