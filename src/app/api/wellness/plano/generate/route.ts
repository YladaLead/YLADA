/**
 * POST /api/wellness/plano/generate
 * 
 * Gera plano personalizado (7/14/30/90 dias)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { generatePlano } from '@/lib/noel-wellness/plano-generator'
import type { GeneratePlanoRequest } from '@/types/wellness-noel'

export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body: GeneratePlanoRequest = await request.json()
    const { consultor_id, tipo_plano } = body

    // Verificar se consultor pertence ao usuário
    const { data: consultor, error: consultorError } = await supabaseAdmin
      .from('ylada_wellness_consultores')
      .select('*')
      .eq('id', consultor_id)
      .eq('user_id', user.id)
      .single()

    if (consultorError || !consultor) {
      return NextResponse.json(
        { error: 'Consultor não encontrado' },
        { status: 404 }
      )
    }

    // Pausar planos ativos anteriores
    await supabaseAdmin
      .from('ylada_wellness_planos')
      .update({ status: 'pausado' })
      .eq('consultor_id', consultor_id)
      .eq('status', 'ativo')

    // Gerar plano
    const planoEstrutura = generatePlano(consultor, tipo_plano)

    // Calcular datas
    const dataInicio = new Date().toISOString().split('T')[0]
    const dias = tipo_plano === '7d' ? 7 : tipo_plano === '14d' ? 14 : tipo_plano === '30d' ? 30 : 90
    const dataFim = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Criar plano no banco
    const { data: plano, error: planoError } = await supabaseAdmin
      .from('ylada_wellness_planos')
      .insert({
        consultor_id: consultor_id,
        tipo_plano: tipo_plano,
        plano_json: planoEstrutura,
        status: 'ativo',
        data_inicio: dataInicio,
        data_fim: dataFim,
      })
      .select()
      .single()

    if (planoError || !plano) {
      console.error('❌ Erro ao criar plano:', planoError)
      return NextResponse.json(
        { error: 'Erro ao criar plano', details: planoError?.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      plano,
    })
  } catch (error: any) {
    console.error('❌ Erro ao gerar plano:', error)
    return NextResponse.json(
      {
        error: 'Erro ao processar solicitação',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

