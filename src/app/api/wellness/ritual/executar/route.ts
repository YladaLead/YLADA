/**
 * POST /api/wellness/ritual/executar
 * 
 * Marca execução do Ritual 2-5-10
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

interface ExecutarRitualRequest {
  consultor_id: string
  tipo: 'ritual_2' | 'ritual_5' | 'ritual_10'
  dia?: string // DATE, padrão: hoje
  observacoes?: string
}

export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body: ExecutarRitualRequest = await request.json()
    const { consultor_id, tipo, dia, observacoes } = body

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

    // Data do ritual (hoje se não especificado)
    const dataRitual = dia || new Date().toISOString().split('T')[0]
    const agora = new Date()
    const horario = agora.toTimeString().split(' ')[0].substring(0, 5) // HH:MM

    // Buscar ou criar registro do ritual
    const { data: ritualExistente } = await supabaseAdmin
      .from('ylada_wellness_ritual_dias')
      .select('*')
      .eq('consultor_id', consultor_id)
      .eq('dia', dataRitual)
      .maybeSingle()

    const dadosAtualizacao: any = {
      [`${tipo}_completado`]: true,
      [`${tipo}_horario`]: horario,
    }

    if (observacoes) {
      dadosAtualizacao[`${tipo}_observacoes`] = observacoes
    }

    let ritual

    if (ritualExistente) {
      // Atualizar ritual existente
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('ylada_wellness_ritual_dias')
        .update(dadosAtualizacao)
        .eq('id', ritualExistente.id)
        .select()
        .single()

      if (updateError || !updated) {
        console.error('❌ Erro ao atualizar ritual:', updateError)
        return NextResponse.json(
          { error: 'Erro ao atualizar ritual', details: updateError?.message },
          { status: 500 }
        )
      }

      ritual = updated
    } else {
      // Criar novo registro
      const { data: created, error: createError } = await supabaseAdmin
        .from('ylada_wellness_ritual_dias')
        .insert({
          consultor_id: consultor_id,
          dia: dataRitual,
          ...dadosAtualizacao,
        })
        .select()
        .single()

      if (createError || !created) {
        console.error('❌ Erro ao criar ritual:', createError)
        return NextResponse.json(
          { error: 'Erro ao criar ritual', details: createError?.message },
          { status: 500 }
        )
      }

      ritual = created
    }

    // Atualizar progresso do dia
    await atualizarProgressoRitual(consultor_id, dataRitual, tipo)

    // Verificar se todos os rituais foram completados
    const todosCompletos = 
      ritual.ritual_2_completado &&
      ritual.ritual_5_completado &&
      ritual.ritual_10_completado

    // Criar notificação de conquista se todos completos
    if (todosCompletos && !ritualExistente?.ritual_10_completado) {
      await criarNotificacaoConquista(consultor_id, dataRitual)
    }

    return NextResponse.json({
      success: true,
      ritual,
      todos_rituais_completos: todosCompletos,
    })
  } catch (error: any) {
    console.error('❌ Erro ao executar ritual:', error)
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
 * Atualiza progresso do dia com o ritual executado
 */
async function atualizarProgressoRitual(
  consultorId: string,
  data: string,
  tipo: 'ritual_2' | 'ritual_5' | 'ritual_10'
) {
  const campoProgresso = tipo === 'ritual_2' ? 'ritual_2_executado' :
                         tipo === 'ritual_5' ? 'ritual_5_executado' :
                         'ritual_10_executado'

  const { data: progressoExistente } = await supabaseAdmin
    .from('ylada_wellness_progresso')
    .select('*')
    .eq('consultor_id', consultorId)
    .eq('data', data)
    .maybeSingle()

  if (progressoExistente) {
    await supabaseAdmin
      .from('ylada_wellness_progresso')
      .update({
        [campoProgresso]: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', progressoExistente.id)
  } else {
    await supabaseAdmin
      .from('ylada_wellness_progresso')
      .insert({
        consultor_id: consultorId,
        data: data,
        [campoProgresso]: true,
      })
  }
}

/**
 * Cria notificação de conquista quando todos os rituais são completados
 */
async function criarNotificacaoConquista(consultorId: string, data: string) {
  try {
    await supabaseAdmin
      .from('ylada_wellness_notificacoes')
      .insert({
        consultor_id: consultorId,
        tipo: 'conquista',
        titulo: '🎉 Ritual Completo!',
        mensagem: `Parabéns! Você completou todos os rituais do dia ${data}. Continue assim!`,
        acao_url: '/pt/wellness/ritual',
        acao_texto: 'Ver Ritual',
        data_envio: new Date().toISOString(),
      })
  } catch (error) {
    console.error('⚠️ Erro ao criar notificação de conquista (não crítico):', error)
  }
}

