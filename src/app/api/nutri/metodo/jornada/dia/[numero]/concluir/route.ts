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

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      console.error('Supabase Admin não configurado')
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const dayNumber = parseInt(params.numero)
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 30) {
      return NextResponse.json({ error: 'Dia inválido' }, { status: 400 })
    }

    const body = await request.json()
    const checklistCompleted = body.checklist_completed || []

    // Verificar se o dia anterior foi concluído (bloqueio sequencial)
    if (dayNumber > 1) {
      try {
        const { data: prevProgress, error: prevError } = await supabaseAdmin
          .from('journey_progress')
          .select('completed')
          .eq('user_id', user.id)
          .eq('day_number', dayNumber - 1)
          .single()
        
        // Se a tabela não existe, permitir (primeiro dia)
        if (prevError && prevError.code !== 'PGRST116' && !prevError.message?.includes('does not exist')) {
          console.error('Erro ao verificar dia anterior:', prevError)
        } else if (prevProgress && !prevProgress.completed) {
          return NextResponse.json({ 
            error: 'Conclua o dia anterior primeiro',
            requires_previous_day: true
          }, { status: 400 })
        }
      } catch (error: any) {
        console.error('Exceção ao verificar dia anterior:', error)
        // Continuar se for erro de tabela não existente
        if (!error.message?.includes('does not exist') && !error.message?.includes('relation')) {
          throw error
        }
      }
    }

    // Buscar informações do dia
    let day
    try {
      const { data: dayData, error: dayError } = await supabaseAdmin
        .from('journey_days')
        .select('week_number')
        .eq('day_number', dayNumber)
        .single()

      if (dayError) {
        console.error('Erro ao buscar dia:', dayError)
        if (dayError.code === 'PGRST116' || dayError.message?.includes('does not exist')) {
          return NextResponse.json({ error: 'Tabela journey_days não existe. Execute as migrations primeiro.' }, { status: 500 })
        }
        return NextResponse.json({ error: 'Dia não encontrado' }, { status: 404 })
      }

      day = dayData
    } catch (error: any) {
      console.error('Exceção ao buscar dia:', error)
      return NextResponse.json({ error: 'Erro ao buscar informações do dia' }, { status: 500 })
    }

    if (!day) {
      return NextResponse.json({ error: 'Dia não encontrado' }, { status: 404 })
    }

    // Verificar se já existe progresso
    let existingProgress
    try {
      const { data: existing, error: existingError } = await supabaseAdmin
        .from('journey_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('day_number', dayNumber)
        .maybeSingle()

      if (existingError && existingError.code !== 'PGRST116' && !existingError.message?.includes('does not exist')) {
        console.error('Erro ao verificar progresso existente:', existingError)
        return NextResponse.json({ error: 'Erro ao verificar progresso' }, { status: 500 })
      }

      existingProgress = existing
    } catch (error: any) {
      console.error('Exceção ao verificar progresso existente:', error)
      // Continuar se for erro de tabela não existente
      if (!error.message?.includes('does not exist') && !error.message?.includes('relation')) {
        throw error
      }
    }

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
        console.error('Detalhes do erro:', JSON.stringify(updateError, null, 2))
        return NextResponse.json({ 
          error: 'Erro ao atualizar progresso',
          details: updateError.message 
        }, { status: 500 })
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
        console.error('Detalhes do erro:', JSON.stringify(insertError, null, 2))
        return NextResponse.json({ 
          error: 'Erro ao salvar progresso',
          details: insertError.message 
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        data: newProgress,
        message: 'Dia concluído com sucesso!'
      })
    }
  } catch (error: any) {
    console.error('Erro na API de concluir dia (catch principal):', error)
    console.error('Stack trace:', error.stack)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    }, { status: 500 })
  }
}

