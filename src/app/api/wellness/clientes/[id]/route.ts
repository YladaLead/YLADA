import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/wellness/clientes/[id]
 * Busca detalhes de um cliente específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request, ['wellness'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { id } = params

    // Buscar cliente com todas as relações
    const { data: cliente, error } = await supabaseAdmin
      .from('wellness_client_profiles')
      .select(`
        *,
        produto_atual:wellness_produtos!produto_atual_id(id, nome, tipo, pv, categoria),
        ultima_compra:wellness_client_purchases!ultima_compra_id(
          id,
          data_compra,
          previsao_recompra,
          pv_total,
          produto:wellness_produtos(id, nome, tipo, pv)
        )
      `)
      .eq('id', id)
      .eq('consultant_id', user.id)
      .single()

    if (error || !cliente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Buscar histórico de compras
    const { data: compras } = await supabaseAdmin
      .from('wellness_client_purchases')
      .select(`
        *,
        produto:wellness_produtos(id, nome, tipo, pv, categoria)
      `)
      .eq('client_id', id)
      .order('data_compra', { ascending: false })

    return NextResponse.json({
      success: true,
      cliente: {
        ...cliente,
        compras: compras || []
      }
    })
  } catch (error: any) {
    console.error('❌ Erro no GET /api/wellness/clientes/[id]:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/wellness/clientes/[id]
 * Atualiza um cliente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request, ['wellness'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { id } = params
    const body = await request.json()

    // Verificar se o cliente pertence ao consultor
    const { data: clienteExistente } = await supabaseAdmin
      .from('wellness_client_profiles')
      .select('id')
      .eq('id', id)
      .eq('consultant_id', user.id)
      .single()

    if (!clienteExistente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar cliente
    const { data: cliente, error } = await supabaseAdmin
      .from('wellness_client_profiles')
      .update({
        cliente_nome: body.cliente_nome,
        cliente_contato: body.cliente_contato,
        tipo_pessoa: body.tipo_pessoa,
        objetivo_principal: body.objetivo_principal,
        status: body.status,
        produto_atual_id: body.produto_atual_id,
        proxima_acao: body.proxima_acao
      })
      .eq('id', id)
      .select(`
        *,
        produto_atual:wellness_produtos!produto_atual_id(id, nome, tipo, pv)
      `)
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar cliente:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar cliente', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      cliente
    })
  } catch (error: any) {
    console.error('❌ Erro no PUT /api/wellness/clientes/[id]:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/wellness/clientes/[id]
 * Deleta um cliente
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request, ['wellness'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { id } = params

    // Verificar se o cliente pertence ao consultor
    const { data: clienteExistente } = await supabaseAdmin
      .from('wellness_client_profiles')
      .select('id')
      .eq('id', id)
      .eq('consultant_id', user.id)
      .single()

    if (!clienteExistente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Deletar cliente (cascade deleta compras)
    const { error } = await supabaseAdmin
      .from('wellness_client_profiles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Erro ao deletar cliente:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar cliente', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente deletado com sucesso'
    })
  } catch (error: any) {
    console.error('❌ Erro no DELETE /api/wellness/clientes/[id]:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

