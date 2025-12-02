import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { numero: string } }
) {
  try {
    const user = await requireApiAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const dayNumber = parseInt(params.numero)
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 30) {
      return NextResponse.json({ error: 'Dia inválido' }, { status: 400 })
    }

    // Buscar dia
    const { data: day, error: dayError } = await supabaseAdmin
      .from('journey_days')
      .select('*')
      .eq('day_number', dayNumber)
      .single()

    if (dayError || !day) {
      return NextResponse.json({ error: 'Dia não encontrado' }, { status: 404 })
    }

    // Buscar progresso do usuário para este dia
    const { data: progress } = await supabaseAdmin
      .from('journey_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('day_number', dayNumber)
      .single()

    // Buscar notas do checklist
    const { data: checklistNotes } = await supabaseAdmin
      .from('journey_checklist_notes')
      .select('item_index, nota')
      .eq('user_id', user.id)
      .eq('day_number', dayNumber)

    // Buscar anotação diária (reflexão)
    const { data: dailyNote } = await supabaseAdmin
      .from('journey_daily_notes')
      .select('conteudo')
      .eq('user_id', user.id)
      .eq('day_number', dayNumber)
      .single()

    // Buscar logs do checklist (para saber quais itens foram marcados)
    const { data: checklistLogs } = await supabaseAdmin
      .from('journey_checklist_log')
      .select('item_index, marcado')
      .eq('user_id', user.id)
      .eq('day_number', dayNumber)

    // Verificar se o dia anterior foi concluído (para bloquear)
    let is_locked = false
    if (dayNumber > 1) {
      const { data: prevProgress } = await supabaseAdmin
        .from('journey_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('day_number', dayNumber - 1)
        .single()
      
      is_locked = !prevProgress?.completed
    }

    // Mapear notas do checklist por índice (retornar como objeto simples para JSON)
    const notesMap: Record<number, string> = {}
    if (checklistNotes) {
      checklistNotes.forEach((n: any) => {
        notesMap[n.item_index] = n.nota
      })
    }

    // Mapear logs do checklist por índice (retornar como objeto simples para JSON)
    const logsMap: Record<number, boolean> = {}
    if (checklistLogs) {
      checklistLogs.forEach((l: any) => {
        logsMap[l.item_index] = l.marcado
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...day,
        progress: progress || null,
        is_completed: progress?.completed || false,
        is_locked,
        checklist_notes: notesMap,
        checklist_logs: logsMap,
        daily_note: dailyNote?.conteudo || ''
      }
    })
  } catch (error: any) {
    console.error('Erro na API de dia da jornada:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

