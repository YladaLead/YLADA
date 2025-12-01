import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Salvar progresso (marcar como concluído)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      trilha_id,
      modulo_id,
      aula_id,
      checklist_item_id,
      tipo, // 'trilha', 'modulo', 'aula', 'checklist'
      concluido
    } = body

    if (!tipo) {
      return NextResponse.json(
        { error: 'Tipo é obrigatório' },
        { status: 400 }
      )
    }

    // Validar tipo
    const tiposValidos = ['trilha', 'modulo', 'aula', 'checklist']
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { error: `Tipo inválido. Use um dos seguintes: ${tiposValidos.join(', ')}` },
        { status: 400 }
      )
    }

    // Preparar dados
    const progressoData: any = {
      user_id: user.id,
      tipo,
      concluido: concluido !== undefined ? concluido : true,
      progresso_percentual: concluido ? 100 : 0,
      ultima_atualizacao: new Date().toISOString()
    }

    if (trilha_id) progressoData.trilha_id = trilha_id
    if (modulo_id) progressoData.modulo_id = modulo_id
    if (aula_id) progressoData.aula_id = aula_id
    if (checklist_item_id) progressoData.checklist_item_id = checklist_item_id

    // Usar upsert para atualizar ou criar
    const { data: progresso, error } = await supabaseAdmin
      .from('wellness_progresso')
      .upsert(progressoData, {
        onConflict: 'user_id,trilha_id,modulo_id,aula_id,checklist_item_id,tipo'
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar progresso:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar progresso' },
        { status: 500 }
      )
    }

    // Se for aula, atualizar progresso do módulo
    if (tipo === 'aula' && modulo_id) {
      await atualizarProgressoModulo(user.id, modulo_id)
    }

    // Se for módulo, atualizar progresso da trilha
    if (tipo === 'modulo' && trilha_id) {
      await atualizarProgressoTrilha(user.id, trilha_id)
    }

    return NextResponse.json({
      success: true,
      data: { progresso }
    })

  } catch (error: any) {
    console.error('Erro ao salvar progresso:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * Função auxiliar para atualizar progresso do módulo
 */
async function atualizarProgressoModulo(userId: string, moduloId: string) {
  // Contar total de aulas
  const { count: totalAulas } = await supabaseAdmin
    .from('wellness_aulas')
    .select('*', { count: 'exact', head: true })
    .eq('modulo_id', moduloId)
    .eq('is_ativo', true)

  if (!totalAulas || totalAulas === 0) return

  // Contar aulas concluídas
  const { count: aulasConcluidas } = await supabaseAdmin
    .from('wellness_progresso')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('modulo_id', moduloId)
    .eq('tipo', 'aula')
    .eq('concluido', true)

  const progressoPercentual = Math.round(((aulasConcluidas || 0) / totalAulas) * 100)
  const concluido = progressoPercentual === 100

  // Buscar trilha_id do módulo
  const { data: modulo } = await supabaseAdmin
    .from('wellness_modulos')
    .select('trilha_id')
    .eq('id', moduloId)
    .single()

  await supabaseAdmin
    .from('wellness_progresso')
    .upsert({
      user_id: userId,
      trilha_id: modulo?.trilha_id,
      modulo_id: moduloId,
      tipo: 'modulo',
      progresso_percentual: progressoPercentual,
      concluido,
      ultima_atualizacao: new Date().toISOString()
    }, {
      onConflict: 'user_id,trilha_id,modulo_id,aula_id,checklist_item_id,tipo'
    })
}

/**
 * Função auxiliar para atualizar progresso da trilha
 */
async function atualizarProgressoTrilha(userId: string, trilhaId: string) {
  // Contar total de módulos
  const { count: totalModulos } = await supabaseAdmin
    .from('wellness_modulos')
    .select('*', { count: 'exact', head: true })
    .eq('trilha_id', trilhaId)
    .eq('is_ativo', true)

  if (!totalModulos || totalModulos === 0) return

  // Contar módulos concluídos
  const { count: modulosConcluidos } = await supabaseAdmin
    .from('wellness_progresso')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('trilha_id', trilhaId)
    .eq('tipo', 'modulo')
    .eq('concluido', true)

  const progressoPercentual = Math.round(((modulosConcluidos || 0) / totalModulos) * 100)
  const concluido = progressoPercentual === 100

  await supabaseAdmin
    .from('wellness_progresso')
    .upsert({
      user_id: userId,
      trilha_id: trilhaId,
      tipo: 'trilha',
      progresso_percentual: progressoPercentual,
      concluido,
      ultima_atualizacao: new Date().toISOString()
    }, {
      onConflict: 'user_id,trilha_id,modulo_id,aula_id,checklist_item_id,tipo'
    })
}

