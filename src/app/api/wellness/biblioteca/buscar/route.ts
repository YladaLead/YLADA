/**
 * GET /api/wellness/biblioteca/buscar
 * 
 * Busca unificada para o NOEL encontrar fluxos, scripts e materiais
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateNoelFunctionAuth } from '@/lib/noel-functions-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Autenticação especial para NOEL (Bearer token)
    const authError = validateNoelFunctionAuth(request)
    if (authError) {
      return authError
    }

    const { searchParams } = new URL(request.url)
    const busca = searchParams.get('q') || ''
    const tipo = searchParams.get('tipo') // 'fluxo', 'script', 'material', 'todos'

    const resultados: any = {
      fluxos: [],
      scripts: [],
      materiais: []
    }

    // Buscar fluxos
    if (!tipo || tipo === 'fluxo' || tipo === 'todos') {
      const { data: fluxos } = await supabaseAdmin
        .from('wellness_fluxos')
        .select('codigo, titulo, descricao, categoria')
        .eq('ativo', true)
        .or(`titulo.ilike.%${busca}%,descricao.ilike.%${busca}%`)
        .limit(10)

      resultados.fluxos = fluxos || []
    }

    // Buscar scripts
    if (!tipo || tipo === 'script' || tipo === 'todos') {
      const { data: scripts } = await supabaseAdmin
        .from('wellness_scripts')
        .select('codigo, titulo, descricao, categoria, texto')
        .eq('ativo', true)
        .or(`titulo.ilike.%${busca}%,descricao.ilike.%${busca}%,texto.ilike.%${busca}%`)
        .limit(10)

      resultados.scripts = scripts || []
    }

    // Buscar materiais
    if (!tipo || tipo === 'material' || tipo === 'todos') {
      const { data: materiais } = await supabaseAdmin
        .from('wellness_materiais')
        .select('codigo, titulo, descricao, categoria, tipo, url')
        .eq('ativo', true)
        .or(`titulo.ilike.%${busca}%,descricao.ilike.%${busca}%`)
        .limit(10)

      resultados.materiais = materiais || []
    }

    return NextResponse.json({
      success: true,
      data: resultados
    })
  } catch (error: any) {
    console.error('❌ Erro na busca:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
