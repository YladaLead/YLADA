/**
 * POST /api/noel/recomendarFluxo
 * 
 * Function do NOEL para recomendar fluxos baseado no contexto da conversa
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateNoelFunctionAuth } from '@/lib/noel-assistant-handler'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const isValid = await validateNoelFunctionAuth(token)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { contexto, situacao } = body

    // Lógica de recomendação baseada em palavras-chave
    let categoriaRecomendada: string | null = null
    const contextoLower = (contexto || '').toLowerCase()
    const situacaoLower = (situacao || '').toLowerCase()

    // Mapear contexto para categoria
    if (contextoLower.includes('convite') || contextoLower.includes('convidar') || situacaoLower.includes('medo')) {
      categoriaRecomendada = 'acao-diaria'
    } else if (contextoLower.includes('vender') || contextoLower.includes('produto') || contextoLower.includes('bebida')) {
      categoriaRecomendada = 'vendas'
    } else if (contextoLower.includes('recrutar') || contextoLower.includes('distribuidor') || contextoLower.includes('oportunidade')) {
      categoriaRecomendada = 'recrutamento'
    } else if (contextoLower.includes('objeção') || contextoLower.includes('dúvida') || contextoLower.includes('preocupação')) {
      categoriaRecomendada = 'objecoes'
    } else if (contextoLower.includes('acompanhar') || contextoLower.includes('cliente') || contextoLower.includes('follow-up')) {
      categoriaRecomendada = 'acompanhamento'
    }

    // Buscar fluxos recomendados
    let query = supabaseAdmin
      .from('wellness_fluxos')
      .select('codigo, titulo, descricao, categoria')
      .eq('ativo', true)
      .order('ordem', { ascending: true })

    if (categoriaRecomendada) {
      query = query.eq('categoria', categoriaRecomendada)
    }

    const { data: fluxos, error } = await query.limit(3)

    if (error) {
      console.error('❌ Erro ao buscar fluxos recomendados:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar fluxos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        fluxos: fluxos || [],
        categoria: categoriaRecomendada,
        razao: categoriaRecomendada 
          ? `Recomendado baseado no contexto: ${contexto || situacao}`
          : 'Recomendação geral'
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao recomendar fluxo:', error)
    return NextResponse.json(
      { error: 'Erro ao recomendar fluxo', details: error.message },
      { status: 500 }
    )
  }
}
