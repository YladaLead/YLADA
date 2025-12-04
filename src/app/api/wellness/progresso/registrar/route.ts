/**
 * POST /api/wellness/progresso/registrar
 * 
 * Salva execuções diárias e progresso
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { RegistrarProgressoRequest } from '@/types/wellness-noel'

export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body: RegistrarProgressoRequest = await request.json()
    const { consultor_id, data, ...dadosProgresso } = body

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

    // Buscar progresso existente ou criar novo
    const dataProgresso = data || new Date().toISOString().split('T')[0]
    
    const { data: progressoExistente } = await supabaseAdmin
      .from('ylada_wellness_progresso')
      .select('*')
      .eq('consultor_id', consultor_id)
      .eq('data', dataProgresso)
      .maybeSingle()

    let progresso

    if (progressoExistente) {
      // Atualizar progresso existente
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('ylada_wellness_progresso')
        .update({
          ...dadosProgresso,
          updated_at: new Date().toISOString(),
        })
        .eq('id', progressoExistente.id)
        .select()
        .single()

      if (updateError || !updated) {
        console.error('❌ Erro ao atualizar progresso:', updateError)
        return NextResponse.json(
          { error: 'Erro ao atualizar progresso', details: updateError?.message },
          { status: 500 }
        )
      }

      progresso = updated
    } else {
      // Criar novo progresso
      const { data: created, error: createError } = await supabaseAdmin
        .from('ylada_wellness_progresso')
        .insert({
          consultor_id: consultor_id,
          data: dataProgresso,
          ...dadosProgresso,
        })
        .select()
        .single()

      if (createError || !created) {
        console.error('❌ Erro ao criar progresso:', createError)
        return NextResponse.json(
          { error: 'Erro ao criar progresso', details: createError?.message },
          { status: 500 }
        )
      }

      progresso = created
    }

    // Atualizar ritual se aplicável
    if (dadosProgresso.ritual_2_executado !== undefined ||
        dadosProgresso.ritual_5_executado !== undefined ||
        dadosProgresso.ritual_10_executado !== undefined) {
      await atualizarRitualDia(consultor_id, dataProgresso, dadosProgresso)
    }

    return NextResponse.json({
      success: true,
      progresso,
    })
  } catch (error: any) {
    console.error('❌ Erro ao registrar progresso:', error)
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
 * Atualiza registro do ritual 2-5-10
 */
async function atualizarRitualDia(
  consultorId: string,
  data: string,
  dadosProgresso: Partial<RegistrarProgressoRequest>
) {
  const { data: ritualExistente } = await supabaseAdmin
    .from('ylada_wellness_ritual_dias')
    .select('*')
    .eq('consultor_id', consultorId)
    .eq('dia', data)
    .maybeSingle()

  const agora = new Date()
  const horario = agora.toTimeString().split(' ')[0].substring(0, 5) // HH:MM

  const dadosRitual: any = {}

  if (dadosProgresso.ritual_2_executado !== undefined) {
    dadosRitual.ritual_2_completado = dadosProgresso.ritual_2_executado
    if (dadosProgresso.ritual_2_executado) {
      dadosRitual.ritual_2_horario = horario
    }
  }

  if (dadosProgresso.ritual_5_executado !== undefined) {
    dadosRitual.ritual_5_completado = dadosProgresso.ritual_5_executado
    if (dadosProgresso.ritual_5_executado) {
      dadosRitual.ritual_5_horario = horario
    }
  }

  if (dadosProgresso.ritual_10_executado !== undefined) {
    dadosRitual.ritual_10_completado = dadosProgresso.ritual_10_executado
    if (dadosProgresso.ritual_10_executado) {
      dadosRitual.ritual_10_horario = horario
    }
  }

  if (Object.keys(dadosRitual).length === 0) {
    return
  }

  if (ritualExistente) {
    await supabaseAdmin
      .from('ylada_wellness_ritual_dias')
      .update(dadosRitual)
      .eq('id', ritualExistente.id)
  } else {
    await supabaseAdmin
      .from('ylada_wellness_ritual_dias')
      .insert({
        consultor_id: consultorId,
        dia: data,
        ...dadosRitual,
      })
  }
}

