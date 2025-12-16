/**
 * GET /api/wellness/biblioteca/scripts
 * 
 * Retorna scripts oficiais para o NOEL e usuários
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const tag = searchParams.get('tag')
    const busca = searchParams.get('busca')

    // Buscar apenas scripts de texto da tabela wellness_scripts
    // PDFs foram movidos para cartilhas, então não buscamos mais aqui
    let queryScripts = supabaseAdmin
      .from('wellness_scripts')
      .select('*')
      .eq('ativo', true)
      .order('uso_frequente', { ascending: false })
      .order('titulo', { ascending: true })

    if (categoria) {
      queryScripts = queryScripts.eq('categoria', categoria)
    }

    if (tag) {
      queryScripts = queryScripts.contains('tags', [tag])
    }

    if (busca) {
      queryScripts = queryScripts.or(`titulo.ilike.%${busca}%,descricao.ilike.%${busca}%,texto.ilike.%${busca}%`)
    }

    const { data: scriptsTexto, error: errorScripts } = await queryScripts

    if (errorScripts) {
      console.error('❌ Erro ao buscar scripts de texto:', errorScripts)
    }

    // Transformar scripts para formato unificado
    const scriptsFormatados = (scriptsTexto || []).map((script: any) => ({
      id: script.id,
      codigo: script.codigo,
      titulo: script.titulo,
      descricao: script.descricao,
      categoria: script.categoria,
      texto: script.texto,
      tags: script.tags,
      tipo: 'texto' as const,
      url: null
    }))

    return NextResponse.json({
      success: true,
      data: scriptsFormatados
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar scripts:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
