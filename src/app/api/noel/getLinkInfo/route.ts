/**
 * POST /api/noel/getLinkInfo
 * 
 * Função para NOEL buscar informações de links Wellness
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
    const { link_codigo } = body

    if (!link_codigo) {
      return NextResponse.json(
        { success: false, error: 'link_codigo é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar link wellness
    const { data: link, error: linkError } = await supabaseAdmin
      .from('wellness_links')
      .select('*')
      .eq('codigo', link_codigo)
      .eq('ativo', true)
      .single()

    if (linkError || !link) {
      return NextResponse.json(
        { success: false, error: 'Link wellness não encontrado' },
        { status: 404 }
      )
    }

    // Gerar link completo
    const baseUrl = getAppUrl()
    const linkCompleto = link.url || `${baseUrl}/pt/wellness/links/${link.codigo}`

    // Script de apresentação baseado no tipo
    let scriptApresentacao = link.script_apresentacao || ''
    if (!scriptApresentacao) {
      scriptApresentacao = link.tipo === 'calculadora'
        ? `Tenho uma ${link.titulo} que pode te ajudar! Quer testar?`
        : link.tipo === 'quiz'
        ? `Tenho um quiz sobre ${link.titulo} que pode te ajudar a descobrir suas necessidades! Quer fazer?`
        : `Tenho um link interessante sobre ${link.titulo} que pode te ajudar! Quer ver?`
    }

    // Quando usar baseado no objetivo
    const quandoUsar = link.objetivo === 'captacao'
      ? 'Use para iniciar conversas e captar leads novos.'
      : link.objetivo === 'diagnostico'
      ? 'Use para aprofundar o conhecimento sobre as necessidades do lead.'
      : link.objetivo === 'engajamento'
      ? 'Use para manter o interesse e engajamento do lead.'
      : link.objetivo === 'recrutamento'
      ? 'Use para apresentar oportunidade de negócio e recrutar novos distribuidores.'
      : 'Use quando fizer sentido no contexto da conversa.'

    return NextResponse.json({
      success: true,
      data: {
        codigo: link.codigo,
        titulo: link.titulo,
        descricao: link.descricao || '',
        tipo: link.tipo || 'link',
        objetivo: link.objetivo || 'engajamento',
        link: linkCompleto,
        script_apresentacao: scriptApresentacao,
        quando_usar: quandoUsar
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar link wellness:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao buscar link' },
      { status: 500 }
    )
  }
}
