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

    return NextResponse.json({
      success: true,
      data: {
        ...day,
        progress: progress || null,
        is_completed: progress?.completed || false,
        is_locked
      }
    })
  } catch (error: any) {
    console.error('Erro na API de dia da jornada:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

