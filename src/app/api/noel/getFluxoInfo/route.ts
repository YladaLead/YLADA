/**
 * POST /api/noel/getFluxoInfo
 * 
 * Função para NOEL buscar informações completas de um fluxo
 * Retorna título, descrição, scripts, link e quando usar
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAppUrl } from '@/lib/url-utils'
import { validateNoelFunctionAuth } from '@/lib/noel-functions-auth'

export async function POST(request: NextRequest) {
  try {
    // Validar autenticação
    const authError = validateNoelFunctionAuth(request)
    if (authError) {
      return authError
    }

    const body = await request.json()
    let { fluxo_codigo, fluxo_id } = body

    console.log('🔍 [getFluxoInfo] Parâmetros recebidos:', { fluxo_codigo, fluxo_id })

    if (!fluxo_codigo && !fluxo_id) {
      console.warn('⚠️ [getFluxoInfo] Parâmetros faltando, tentando inferir do contexto...')
      
      // Tentar inferir fluxo_codigo comum baseado em palavras-chave
      // Se não conseguir, retornar erro mais útil
      return NextResponse.json(
        { 
          success: false, 
          error: 'fluxo_codigo ou fluxo_id é obrigatório',
          message: 'Por favor, especifique qual fluxo você precisa. Exemplos: "reativacao", "pos-venda", "convite-leve", "2-5-10"'
        },
        { status: 400 }
      )
    }

    // Mapear códigos esperados para códigos reais no banco
    const codigoMap: Record<string, string> = {
      'reativacao': 'fluxo-retencao-cliente',
      'retencao': 'fluxo-retencao-cliente',
      'pos-venda': 'fluxo-onboarding-cliente', // Aproximação - pode precisar ajuste
      'pós-venda': 'fluxo-onboarding-cliente',
      'convite-leve': 'fluxo-convite-leve',
      'convite': 'fluxo-convite-leve',
      '2-5-10': 'fluxo-2-5-10',
      'recrutamento': 'fluxo-recrutamento-inicial',
      'venda': 'fluxo-venda-energia',
      'energia': 'fluxo-venda-energia'
    }

    // Se o código recebido está no mapa, usar o código real
    if (fluxo_codigo && codigoMap[fluxo_codigo.toLowerCase()]) {
      const codigoReal = codigoMap[fluxo_codigo.toLowerCase()]
      console.log(`🔄 [getFluxoInfo] Mapeando "${fluxo_codigo}" → "${codigoReal}"`)
      fluxo_codigo = codigoReal
    }

    // Buscar fluxo
    let query = supabaseAdmin
      .from('wellness_fluxos')
      .select('*')
      .eq('ativo', true)

    if (fluxo_codigo) {
      // Primeiro tentar busca exata
      query = query.eq('codigo', fluxo_codigo)
    } else {
      query = query.eq('id', fluxo_id)
    }

    let { data: fluxo, error: fluxoError } = await query.maybeSingle()

    // Se não encontrou com código exato, tentar busca flexível por palavras-chave
    if ((fluxoError || !fluxo) && fluxo_codigo) {
      console.log('⚠️ [getFluxoInfo] Código exato não encontrado, tentando busca flexível...')
      
      // Mapeamento de códigos esperados para palavras-chave (usando códigos reais)
      const keywordMap: Record<string, string[]> = {
        'reativacao': ['retenc', 'cliente', 'reativ'],
        'retencao': ['retenc', 'cliente'],
        'pos-venda': ['onboarding', 'cliente', 'acompanhamento'],
        'pós-venda': ['onboarding', 'cliente', 'acompanhamento'],
        'convite-leve': ['convite', 'leve'],
        'convite': ['convite'],
        '2-5-10': ['2-5-10', 'rotina'],
        'recrutamento': ['recrutamento', 'inicial'],
        'venda': ['venda', 'energia']
      }

      const keywords = keywordMap[fluxo_codigo.toLowerCase()] || [fluxo_codigo]
      
      // Tentar buscar por título ou código que contenha as palavras-chave
      const { data: fluxosPossiveis } = await supabaseAdmin
        .from('wellness_fluxos')
        .select('*')
        .eq('ativo', true)
        .or(keywords.map(k => `codigo.ilike.%${k}%,titulo.ilike.%${k}%`).join(','))
        .limit(5)

      if (fluxosPossiveis && fluxosPossiveis.length > 0) {
        // Usar o primeiro resultado encontrado
        fluxo = fluxosPossiveis[0]
        console.log(`✅ [getFluxoInfo] Fluxo encontrado via busca flexível: ${fluxo.codigo}`)
        fluxoError = null
      }
    }

    if (fluxoError || !fluxo) {
      // Se ainda não encontrou, listar fluxos disponíveis para ajudar
      const { data: fluxosDisponiveis } = await supabaseAdmin
        .from('wellness_fluxos')
        .select('codigo, titulo')
        .eq('ativo', true)
        .limit(10)

      const codigosDisponiveis = fluxosDisponiveis?.map(f => f.codigo).join(', ') || 'nenhum'

      return NextResponse.json(
        { 
          success: false, 
          error: 'Fluxo não encontrado',
          message: `Fluxo com código "${fluxo_codigo}" não foi encontrado. Fluxos disponíveis: ${codigosDisponiveis}`,
          fluxos_disponiveis: fluxosDisponiveis?.map(f => ({ codigo: f.codigo, titulo: f.titulo })) || []
        },
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
    
    // Mapear categoria para rota válida (vender ou recrutar)
    // As rotas disponíveis são: /pt/wellness/system/vender/fluxos/[id] e /pt/wellness/system/recrutar/fluxos/[id]
    let categoriaRota = 'vender' // padrão
    if (fluxo.categoria === 'recrutamento' || fluxo.categoria === 'apresentacao') {
      categoriaRota = 'recrutar'
    } else if (fluxo.categoria === 'vendas' || fluxo.categoria === 'acompanhamento' || fluxo.categoria === 'acao-diaria') {
      categoriaRota = 'vender'
    }
    
    // Usar ID do fluxo (UUID) ao invés de código, pois a rota espera ID
    const link = `${baseUrl}/pt/wellness/system/${categoriaRota}/fluxos/${fluxo.id}`
    
    console.log('🔗 [getFluxoInfo] Link gerado:', {
      categoria_original: fluxo.categoria,
      categoria_rota: categoriaRota,
      fluxo_id: fluxo.id,
      fluxo_codigo: fluxo.codigo,
      link
    })

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
