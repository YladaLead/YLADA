import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/wellness/clientes/[id]/compras
 * Lista todas as compras de um cliente
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

    // Verificar se o cliente pertence ao consultor
    const { data: cliente } = await supabaseAdmin
      .from('wellness_client_profiles')
      .select('id')
      .eq('id', id)
      .eq('consultant_id', user.id)
      .single()

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Buscar compras
    const { data: compras, error } = await supabaseAdmin
      .from('wellness_client_purchases')
      .select(`
        *,
        produto:wellness_produtos(id, nome, tipo, pv, categoria)
      `)
      .eq('client_id', id)
      .order('data_compra', { ascending: false })

    if (error) {
      console.error('❌ Erro ao buscar compras:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar compras', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      compras: compras || []
    })
  } catch (error: any) {
    console.error('❌ Erro no GET /api/wellness/clientes/[id]/compras:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/wellness/clientes/[id]/compras
 * Registra uma nova compra para o cliente
 */
export async function POST(
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
    const {
      produto_id,
      quantidade = 1,
      data_compra,
      observacoes
    } = body

    // Validações
    if (!produto_id) {
      return NextResponse.json(
        { error: 'Produto é obrigatório' },
        { status: 400 }
      )
    }
    if (!data_compra) {
      return NextResponse.json(
        { error: 'Data da compra é obrigatória' },
        { status: 400 }
      )
    }

    // Verificar se o cliente pertence ao consultor
    const { data: cliente } = await supabaseAdmin
      .from('wellness_client_profiles')
      .select('id')
      .eq('id', id)
      .eq('consultant_id', user.id)
      .single()

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Buscar produto para calcular PV
    const { data: produto } = await supabaseAdmin
      .from('wellness_produtos')
      .select('id, pv')
      .eq('id', produto_id)
      .single()

    if (!produto) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Calcular PV total
    const pv_total = produto.pv * quantidade

    // Calcular previsão de recompra (30 dias após a compra)
    const dataCompra = new Date(data_compra)
    const previsaoRecompra = new Date(dataCompra)
    previsaoRecompra.setDate(previsaoRecompra.getDate() + 30)

    // Criar compra
    const { data: compra, error: compraError } = await supabaseAdmin
      .from('wellness_client_purchases')
      .insert({
        client_id: id,
        produto_id,
        quantidade,
        pv_total,
        data_compra: data_compra,
        previsao_recompra: previsaoRecompra.toISOString().split('T')[0],
        observacoes: observacoes || null
      })
      .select(`
        *,
        produto:wellness_produtos(id, nome, tipo, pv, categoria)
      `)
      .single()

    if (compraError) {
      console.error('❌ Erro ao criar compra:', compraError)
      return NextResponse.json(
        { error: 'Erro ao criar compra', details: compraError.message },
        { status: 500 }
      )
    }

    // Atualizar cliente: PV total, última compra, produto atual
    const pvTotalCliente = await supabaseAdmin.rpc('calcular_pv_total_cliente', {
      client_uuid: id
    })

    const { error: updateError } = await supabaseAdmin
      .from('wellness_client_profiles')
      .update({
        ultima_compra_id: compra.id,
        produto_atual_id: produto_id,
        pv_total_cliente: pvTotalCliente.data || 0,
        ultima_interacao: new Date().toISOString(),
        status: 'cliente_recorrente' // Atualizar status se necessário
      })
      .eq('id', id)

    if (updateError) {
      console.error('⚠️ Erro ao atualizar cliente (não crítico):', updateError)
    }

    // Atualizar PV mensal do consultor
    const mesAno = new Date(data_compra).toISOString().slice(0, 7) // '2025-01'
    const pvMensalConsultor = await supabaseAdmin.rpc('calcular_pv_mensal_consultor', {
      consultant_uuid: user.id,
      mes_ano_param: mesAno
    })

    await supabaseAdmin
      .from('wellness_consultant_pv_monthly')
      .upsert({
        consultant_id: user.id,
        mes_ano: mesAno,
        pv_total: pvMensalConsultor.data || 0,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'consultant_id,mes_ano'
      })

    return NextResponse.json({
      success: true,
      compra
    }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Erro no POST /api/wellness/clientes/[id]/compras:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

