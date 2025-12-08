/**
 * POST /api/noel/getFluxoInfo
 * 
 * Função para NOEL buscar informações completas de um fluxo
 * Retorna título, descrição, scripts, link e quando usar
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAppUrl } from '@/lib/url-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fluxo_codigo, fluxo_id } = body

    if (!fluxo_codigo && !fluxo_id) {
      return NextResponse.json(
        { success: false, error: 'fluxo_codigo ou fluxo_id é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar fluxo
    let query = supabaseAdmin
      .from('wellness_fluxos')
      .select('*')
      .eq('ativo', true)

    if (fluxo_codigo) {
      query = query.eq('codigo', fluxo_codigo)
    } else {
      query = query.eq('id', fluxo_id)
    }

    const { data: fluxo, error: fluxoError } = await query.single()

    if (fluxoError || !fluxo) {
      return NextResponse.json(
        { success: false, error: 'Fluxo não encontrado' },
        { status: 404 }
      )
    }

    // Buscar passos
    const { data: passos } = await supabaseAdmin
      .from('wellness_fluxos_passos')
      .select('*')
      .eq('fluxo_id', fluxo.id)
      .order('numero', { ascending: true })

    // Buscar scripts do primeiro passo (script principal)
    let scriptPrincipal = ''
    if (passos && passos.length > 0) {
      const primeiroPasso = passos[0]
      const { data: scripts } = await supabaseAdmin
        .from('wellness_fluxos_scripts')
        .select('*')
        .eq('passo_id', primeiroPasso.id)
        .order('ordem', { ascending: true })
        .limit(1)

      if (scripts && scripts.length > 0) {
        scriptPrincipal = scripts[0].texto || ''
      }
    }

    // Gerar link do fluxo
    const baseUrl = getAppUrl()
    const categoria = fluxo.categoria || 'vender'
    const link = `${baseUrl}/pt/wellness/system/${categoria}/fluxos/${fluxo.codigo}`

    // Determinar quando usar baseado na categoria
    const quandoUsar = fluxo.descricao || 
      (categoria === 'vender' ? 'Use para acompanhar clientes após venda ou reativar clientes inativos.' :
       categoria === 'recrutar' ? 'Use para apresentar oportunidade de negócio e recrutar novos distribuidores.' :
       'Use quando precisar de um guia passo a passo para uma situação específica.')

    return NextResponse.json({
      success: true,
      data: {
        codigo: fluxo.codigo,
        titulo: fluxo.titulo,
        descricao: fluxo.descricao || '',
        categoria: fluxo.categoria || 'vender',
        link: link,
        script_principal: scriptPrincipal,
        quando_usar: quandoUsar,
        total_passos: passos?.length || 0
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar fluxo:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao buscar fluxo' },
      { status: 500 }
    )
  }
}
