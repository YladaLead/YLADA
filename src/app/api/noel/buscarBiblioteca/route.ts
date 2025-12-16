/**
 * POST /api/noel/buscarBiblioteca
 * 
 * Function do NOEL para buscar fluxos, scripts e materiais na biblioteca
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateNoelFunctionAuth } from '@/lib/noel-functions-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authError = validateNoelFunctionAuth(request)
    if (authError) {
      return authError
    }

    const body = await request.json()
    const { busca, tipo } = body

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
        .limit(5)

      resultados.fluxos = fluxos || []
    }

    // Buscar scripts
    if (!tipo || tipo === 'script' || tipo === 'todos') {
      const { data: scripts } = await supabaseAdmin
        .from('wellness_scripts')
        .select('codigo, titulo, descricao, categoria, texto')
        .eq('ativo', true)
        .or(`titulo.ilike.%${busca}%,descricao.ilike.%${busca}%,texto.ilike.%${busca}%`)
        .limit(5)

      resultados.scripts = scripts || []
    }

    // Buscar materiais
    if (!tipo || tipo === 'material' || tipo === 'todos') {
      const { data: materiais } = await supabaseAdmin
        .from('wellness_materiais')
        .select('codigo, titulo, descricao, categoria, tipo, url')
        .eq('ativo', true)
        .or(`titulo.ilike.%${busca}%,descricao.ilike.%${busca}%`)
        .limit(5)

      resultados.materiais = materiais || []
    }

    return NextResponse.json({
      success: true,
      data: resultados
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar biblioteca:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar biblioteca', details: error.message },
      { status: 500 }
    )
  }
}
