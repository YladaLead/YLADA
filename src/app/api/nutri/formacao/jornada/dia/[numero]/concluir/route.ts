import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function POST(
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

    const body = await request.json()
    const checklistCompleted = body.checklist_completed || []

    // Verificar se o dia anterior foi concluído (bloqueio sequencial)
    if (dayNumber > 1) {
      const { data: prevProgress } = await supabaseAdmin
        .from('journey_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('day_number', dayNumber - 1)
        .single()
      
      if (!prevProgress?.completed) {
        return NextResponse.json({ 
          error: 'Conclua o dia anterior primeiro',
          requires_previous_day: true
        }, { status: 400 })
      }
    }

    // Buscar informações do dia
    const { data: day } = await supabaseAdmin
      .from('journey_days')
      .select('week_number')
      .eq('day_number', dayNumber)
      .single()

    if (!day) {
      return NextResponse.json({ error: 'Dia não encontrado' }, { status: 404 })
    }

    // Verificar se já existe progresso
    const { data: existingProgress } = await supabaseAdmin
      .from('journey_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('day_number', dayNumber)
      .single()

    if (existingProgress) {
      // Atualizar progresso existente
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('journey_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          checklist_completed: checklistCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id)
        .select()
        .single()

      if (updateError) {
        console.error('Erro ao atualizar progresso:', updateError)
        return NextResponse.json({ error: 'Erro ao atualizar progresso' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        data: updated,
        message: 'Dia concluído com sucesso!'
      })
    } else {
      // Criar novo progresso
      const { data: newProgress, error: insertError } = await supabaseAdmin
        .from('journey_progress')
        .insert({
          user_id: user.id,
          day_number: dayNumber,
          week_number: day.week_number,
          completed: true,
          completed_at: new Date().toISOString(),
          checklist_completed: checklistCompleted
        })
        .select()
        .single()

      if (insertError) {
        console.error('Erro ao criar progresso:', insertError)
        return NextResponse.json({ error: 'Erro ao salvar progresso' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        data: newProgress,
        message: 'Dia concluído com sucesso!'
      })
    }
  } catch (error: any) {
    console.error('Erro na API de concluir dia:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

