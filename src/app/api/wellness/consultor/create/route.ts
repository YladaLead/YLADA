/**
 * POST /api/wellness/consultor/create
 * 
 * Cria consultor + diagnóstico inicial
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { CreateConsultorRequest } from '@/types/wellness-noel'

export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body: CreateConsultorRequest = await request.json()
    const { diagnostico, ...dadosConsultor } = body

    // Verificar se consultor já existe
    const { data: consultorExistente } = await supabaseAdmin
      .from('ylada_wellness_consultores')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (consultorExistente) {
      return NextResponse.json(
        { error: 'Consultor já existe para este usuário' },
        { status: 400 }
      )
    }

    // Criar consultor
    const { data: consultor, error: consultorError } = await supabaseAdmin
      .from('ylada_wellness_consultores')
      .insert({
        user_id: user.id,
        nome: dadosConsultor.nome,
        email: dadosConsultor.email,
        telefone: dadosConsultor.telefone,
        tempo_disponivel_diario: dadosConsultor.tempo_disponivel_diario,
        tempo_disponivel_semanal: dadosConsultor.tempo_disponivel_semanal,
        experiencia: dadosConsultor.experiencia,
        objetivo_financeiro: dadosConsultor.objetivo_financeiro,
        objetivo_pv: dadosConsultor.objetivo_pv,
        deseja_recrutar: dadosConsultor.deseja_recrutar || false,
        estilo_trabalho: dadosConsultor.estilo_trabalho,
        opera_com_bebidas_prontas: dadosConsultor.opera_com_bebidas_prontas || false,
        estagio_negocio: 'iniciante',
      })
      .select()
      .single()

    if (consultorError || !consultor) {
      console.error('❌ Erro ao criar consultor:', consultorError)
      return NextResponse.json(
        { error: 'Erro ao criar consultor', details: consultorError?.message },
        { status: 500 }
      )
    }

    // Criar diagnóstico inicial se fornecido
    let diagnosticoCriado = null
    if (diagnostico) {
      const { data: diag, error: diagError } = await supabaseAdmin
        .from('ylada_wellness_diagnosticos')
        .insert({
          consultor_id: consultor.id,
          ...diagnostico,
        })
        .select()
        .single()

      if (!diagError && diag) {
        diagnosticoCriado = diag
      }
    }

    return NextResponse.json({
      success: true,
      consultor,
      diagnostico: diagnosticoCriado,
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar consultor:', error)
    return NextResponse.json(
      {
        error: 'Erro ao processar solicitação',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

