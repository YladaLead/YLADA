/**
 * POST /api/wellness/diagnostico/generate
 * 
 * Gera diagnóstico completo baseado nas respostas
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { GenerateDiagnosticoRequest, Diagnostico } from '@/types/wellness-noel'

export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body: GenerateDiagnosticoRequest = await request.json()
    const { consultor_id, respostas } = body

    // Verificar se consultor pertence ao usuário
    const { data: consultor } = await supabaseAdmin
      .from('ylada_wellness_consultores')
      .select('id')
      .eq('id', consultor_id)
      .eq('user_id', user.id)
      .single()

    if (!consultor) {
      return NextResponse.json(
        { error: 'Consultor não encontrado' },
        { status: 404 }
      )
    }

    // Gerar análise do diagnóstico
    const analise = analisarDiagnostico(respostas)

    // Criar diagnóstico
    const { data: diagnostico, error: diagError } = await supabaseAdmin
      .from('ylada_wellness_diagnosticos')
      .insert({
        consultor_id: consultor_id,
        ...respostas,
        perfil_identificado: analise.perfil,
        pontos_fortes: analise.pontosFortes,
        pontos_melhoria: analise.pontosMelhoria,
        recomendacoes: analise.recomendacoes,
      })
      .select()
      .single()

    if (diagError || !diagnostico) {
      console.error('❌ Erro ao criar diagnóstico:', diagError)
      return NextResponse.json(
        { error: 'Erro ao criar diagnóstico', details: diagError?.message },
        { status: 500 }
      )
    }

    // Atualizar estágio do consultor se necessário
    if (analise.estagioSugerido) {
      await supabaseAdmin
        .from('ylada_wellness_consultores')
        .update({ estagio_negocio: analise.estagioSugerido })
        .eq('id', consultor_id)
    }

    return NextResponse.json({
      success: true,
      diagnostico,
      analise,
    })
  } catch (error: any) {
    console.error('❌ Erro ao gerar diagnóstico:', error)
    return NextResponse.json(
      {
        error: 'Erro ao processar solicitação',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * Analisa respostas e gera perfil + recomendações
 */
function analisarDiagnostico(respostas: Partial<Diagnostico>): {
  perfil: string
  pontosFortes: string[]
  pontosMelhoria: string[]
  recomendacoes: string[]
  estagioSugerido?: string
} {
  const pontosFortes: string[] = []
  const pontosMelhoria: string[] = []
  const recomendacoes: string[] = []
  let perfil = 'Consultor Wellness'
  let estagioSugerido: string | undefined

  // Analisar experiência
  if (respostas.experiencia_herbalife) {
    if (respostas.experiencia_herbalife.includes('anos') || respostas.experiencia_herbalife.includes('3+')) {
      pontosFortes.push('Experiência consolidada')
      estagioSugerido = 'produtivo'
    } else if (respostas.experiencia_herbalife.includes('ano')) {
      pontosFortes.push('Boa experiência')
      estagioSugerido = 'ativo'
    } else {
      pontosMelhoria.push('Construir experiência prática')
      estagioSugerido = 'iniciante'
    }
  }

  // Analisar objetivo
  if (respostas.objetivo_principal) {
    if (respostas.objetivo_principal.toLowerCase().includes('vender') || 
        respostas.objetivo_principal.toLowerCase().includes('vendas')) {
      perfil = 'Consultor Focado em Vendas'
      recomendacoes.push('Focar em scripts de vendas e follow-up')
    } else if (respostas.objetivo_principal.toLowerCase().includes('equipe') ||
               respostas.objetivo_principal.toLowerCase().includes('recrutar')) {
      perfil = 'Consultor Focado em Liderança'
      recomendacoes.push('Desenvolver habilidades de recrutamento e treinamento')
      estagioSugerido = 'multiplicador'
    } else {
      perfil = 'Consultor em Desenvolvimento'
    }
  }

  // Analisar dificuldade
  if (respostas.maior_dificuldade) {
    if (respostas.maior_dificuldade.toLowerCase().includes('vender') ||
        respostas.maior_dificuldade.toLowerCase().includes('vendas')) {
      pontosMelhoria.push('Desenvolver técnicas de vendas')
      recomendacoes.push('Praticar scripts de vendas diariamente')
    }
    if (respostas.maior_dificuldade.toLowerCase().includes('tempo') ||
        respostas.maior_dificuldade.toLowerCase().includes('organização')) {
      pontosMelhoria.push('Melhorar organização e planejamento')
      recomendacoes.push('Implementar Ritual 2-5-10 para consistência')
    }
  }

  // Analisar desejo de recrutar
  if (respostas.deseja_montar_equipe) {
    pontosFortes.push('Visão de crescimento')
    recomendacoes.push('Começar a identificar potenciais recrutas')
  } else {
    recomendacoes.push('Focar primeiro em vendas antes de recrutar')
  }

  return {
    perfil,
    pontosFortes: pontosFortes.length > 0 ? pontosFortes : ['Comprometimento com o negócio'],
    pontosMelhoria: pontosMelhoria.length > 0 ? pontosMelhoria : ['Desenvolvimento contínuo'],
    recomendacoes: recomendacoes.length > 0 ? recomendacoes : ['Manter consistência e foco'],
    estagioSugerido,
  }
}

