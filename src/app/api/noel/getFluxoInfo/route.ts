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
      'reativar': 'fluxo-retencao-cliente',
      'reativar cliente': 'fluxo-retencao-cliente',
      'cliente sumiu': 'fluxo-retencao-cliente',
      'cliente que sumiu': 'fluxo-retencao-cliente',
      'retencao': 'fluxo-retencao-cliente',
      'retenção': 'fluxo-retencao-cliente',
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
    // Também tentar buscar por palavras-chave na string
    if (fluxo_codigo) {
      const codigoLower = fluxo_codigo.toLowerCase().trim()
      
      // Tentar match exato primeiro
      if (codigoMap[codigoLower]) {
        const codigoReal = codigoMap[codigoLower]
        console.log(`🔄 [getFluxoInfo] Mapeando "${fluxo_codigo}" → "${codigoReal}"`)
        fluxo_codigo = codigoReal
      } else {
        // Tentar buscar por palavras-chave na string
        for (const [key, value] of Object.entries(codigoMap)) {
          if (codigoLower.includes(key) || key.includes(codigoLower)) {
            console.log(`🔄 [getFluxoInfo] Mapeando por palavra-chave "${fluxo_codigo}" (contém "${key}") → "${value}"`)
            fluxo_codigo = value
            break
          }
        }
      }
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
    
    // IMPORTANTE: As rotas /pt/wellness/system/vender/fluxos e /pt/wellness/system/recrutar/fluxos
    // não devem ser mencionadas porque não funcionam corretamente com fluxos do banco.
    // Solução: Retornar null e deixar o NOEL apresentar o conteúdo completo diretamente.
    // O NOEL deve apresentar o conteúdo completo do fluxo (título, descrição, passos, scripts)
    // sem mencionar links genéricos.
    
    // Retornar null para que o NOEL apresente apenas o conteúdo completo
    let link: string | null = null
    
    console.log('🔗 [getFluxoInfo] Link gerado:', {
      categoria_original: fluxo.categoria,
      fluxo_id: fluxo.id,
      fluxo_codigo: fluxo.codigo,
      link: link || 'null (conteúdo completo será apresentado pelo NOEL)',
      nota: 'Link genérico não retornado - NOEL deve apresentar conteúdo completo diretamente'
    })

    // Determinar quando usar baseado na categoria
    const categoria = fluxo.categoria || 'vender'
    const quandoUsar = fluxo.descricao || 
      (categoria === 'vender' || categoria === 'vendas' || categoria === 'acompanhamento' || categoria === 'acao-diaria'
        ? 'Use para acompanhar clientes após venda ou reativar clientes inativos.' :
       categoria === 'recrutar' || categoria === 'recrutamento' || categoria === 'apresentacao'
        ? 'Use para apresentar oportunidade de negócio e recrutar novos distribuidores.' :
       'Use quando precisar de um guia passo a passo para uma situação específica.')

    // Montar informações completas dos passos para o NOEL apresentar
    const passosCompletos = (passos || []).map((passo, index) => ({
      numero: passo.numero || index + 1,
      titulo: passo.titulo || '',
      descricao: passo.descricao || ''
    }))

      const responseData = {
        success: true,
        data: {
          codigo: fluxo.codigo,
          titulo: fluxo.titulo,
          descricao: fluxo.descricao || '',
          categoria: fluxo.categoria || 'vender',
          link: link,
          script_principal: scriptPrincipal,
          quando_usar: quandoUsar,
          total_passos: passos?.length || 0,
          passos: passosCompletos,
          // Informação adicional para o NOEL
          nota_link: 'Link genérico não retornado. Apresente o conteúdo completo do fluxo (título, descrição, passos, scripts) diretamente na resposta. NÃO mencione links genéricos como "system/vender/fluxos" - esses links não existem mais.'
        }
      }
      
      const responseJson = JSON.stringify(responseData)
      const responseSize = responseJson.length
      
      console.log('✅ [getFluxoInfo] Resposta gerada:', {
        codigo: fluxo.codigo,
        titulo: fluxo.titulo,
        total_passos: passos?.length || 0,
        tamanho_resposta: responseSize,
        tamanho_passos: JSON.stringify(passosCompletos).length,
        aviso: responseSize > 50000 ? '⚠️ Resposta muito grande (>50KB)' : '✅ Tamanho OK'
      })
      
      // Se a resposta for muito grande, limitar passos
      if (responseSize > 50000) {
        console.warn('⚠️ [getFluxoInfo] Resposta muito grande, limitando passos...')
        responseData.data.passos = passosCompletos.slice(0, 5) // Limitar a 5 primeiros passos
        responseData.data.nota_link = 'Este fluxo tem muitos passos. Acesse o link para ver todos os passos completos.'
      }
      
      return NextResponse.json(responseData)
  } catch (error: any) {
    console.error('❌ [getFluxoInfo] Erro geral:', error)
    console.error('❌ [getFluxoInfo] Stack:', error?.stack)
    console.error('❌ [getFluxoInfo] Erro completo:', JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar fluxo',
        message: 'Desculpe, tive um problema técnico ao buscar esse fluxo. Tente novamente em alguns instantes.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
