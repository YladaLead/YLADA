import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar anotações do usuário
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
    const modulo_id = searchParams.get('modulo_id')
    const aula_id = searchParams.get('aula_id')

    let query = supabaseAdmin
      .from('wellness_anotacoes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (trilha_id) query = query.eq('trilha_id', trilha_id)
    if (modulo_id) query = query.eq('modulo_id', modulo_id)
    if (aula_id) query = query.eq('aula_id', aula_id)

    const { data: anotacoes, error } = await query

    if (error) {
      console.error('Erro ao buscar anotações:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar anotações' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { anotacoes: anotacoes || [] }
    })

  } catch (error: any) {
    console.error('Erro ao buscar anotações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST - Criar nova anotação
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { trilha_id, modulo_id, aula_id, titulo, conteudo } = body

    if (!conteudo || conteudo.trim() === '') {
      return NextResponse.json(
        { error: 'Conteúdo da anotação é obrigatório' },
        { status: 400 }
      )
    }

    const { data: anotacao, error } = await supabaseAdmin
      .from('wellness_anotacoes')
      .insert({
        user_id: user.id,
        trilha_id: trilha_id || null,
        modulo_id: modulo_id || null,
        aula_id: aula_id || null,
        titulo: titulo || null,
        conteudo: conteudo.trim()
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar anotação:', error)
      return NextResponse.json(
        { error: 'Erro ao criar anotação' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { anotacao }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar anotação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * PUT - Atualizar anotação
 */
export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { id, titulo, conteudo } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID da anotação é obrigatório' },
        { status: 400 }
      )
    }

    if (!conteudo || conteudo.trim() === '') {
      return NextResponse.json(
        { error: 'Conteúdo da anotação é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a anotação pertence ao usuário
    const { data: anotacaoExistente } = await supabaseAdmin
      .from('wellness_anotacoes')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!anotacaoExistente) {
      return NextResponse.json(
        { error: 'Anotação não encontrada' },
        { status: 404 }
      )
    }

    const { data: anotacao, error } = await supabaseAdmin
      .from('wellness_anotacoes')
      .update({
        titulo: titulo || null,
        conteudo: conteudo.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar anotação:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar anotação' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { anotacao }
    })

  } catch (error: any) {
    console.error('Erro ao atualizar anotação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Deletar anotação
 */
export async function DELETE(request: NextRequest) {
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
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID da anotação é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a anotação pertence ao usuário
    const { data: anotacaoExistente } = await supabaseAdmin
      .from('wellness_anotacoes')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (!anotacaoExistente) {
      return NextResponse.json(
        { error: 'Anotação não encontrada' },
        { status: 404 }
      )
    }

    const { error } = await supabaseAdmin
      .from('wellness_anotacoes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Erro ao deletar anotação:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar anotação' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Anotação deletada com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao deletar anotação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

