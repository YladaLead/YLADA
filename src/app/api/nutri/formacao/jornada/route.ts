import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      console.error('Supabase Admin não configurado - retornando estrutura vazia')
      return NextResponse.json({
        success: true,
        data: {
          days: [],
          stats: {
            total_days: 0,
            completed_days: 0,
            progress_percentage: 0,
            current_day: null,
            current_week: 1,
            week_progress: [
              { week: 1, completed: 0, total: 0, percentage: 0 },
              { week: 2, completed: 0, total: 0, percentage: 0 },
              { week: 3, completed: 0, total: 0, percentage: 0 },
              { week: 4, completed: 0, total: 0, percentage: 0 }
            ]
          }
        }
      })
    }

    let days: any[] = []
    let progress: any[] = []

    // Buscar todos os dias da jornada
    try {
      const { data: daysData, error: daysError } = await supabaseAdmin
        .from('journey_days')
        .select('*')
        .order('order_index', { ascending: true })

      if (daysError) {
        console.error('Erro ao buscar dias da jornada:', daysError)
        // Se a tabela não existe ou está vazia, usar array vazio
        if (daysError.code === 'PGRST116' || daysError.message?.includes('does not exist') || daysError.message?.includes('relation') || daysError.message?.includes('table')) {
          console.log('Tabela journey_days não existe ainda - usando array vazio')
          days = []
        } else {
          // Para outros erros, também usar array vazio para não quebrar a UI
          console.log('Erro desconhecido ao buscar days, usando array vazio:', daysError)
          days = []
        }
      } else {
        days = daysData || []
      }
    } catch (error: any) {
      console.error('Exceção ao buscar days:', error)
      days = []
    }

    // Buscar progresso do usuário
    try {
      const { data: progressData, error: progressError } = await supabaseAdmin
        .from('journey_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('day_number', { ascending: true })

      if (progressError) {
        console.error('Erro ao buscar progresso:', progressError)
        // Se a tabela não existe, usar array vazio
        if (progressError.code === 'PGRST116' || progressError.message?.includes('does not exist') || progressError.message?.includes('relation') || progressError.message?.includes('table')) {
          console.log('Tabela journey_progress não existe ainda - usando array vazio')
          progress = []
        } else {
          // Para outros erros, também usar array vazio
          console.log('Erro desconhecido ao buscar progress, usando array vazio:', progressError)
          progress = []
        }
      } else {
        progress = progressData || []
      }
    } catch (error: any) {
      console.error('Exceção ao buscar progress:', error)
      progress = []
    }

    // Garantir que days e progress são arrays
    if (!Array.isArray(days)) {
      console.warn('days não é um array, convertendo para array vazio')
      days = []
    }
    if (!Array.isArray(progress)) {
      console.warn('progress não é um array, convertendo para array vazio')
      progress = []
    }

    // Calcular estatísticas
    const totalDays = days.length || 0
    const completedDays = progress.filter(p => p && p.completed).length || 0
    const progressPercentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0

    // Encontrar dia atual (primeiro não concluído)
    const completedDayNumbers = new Set(progress.filter(p => p && p.completed).map(p => p.day_number) || [])
    const currentDay = days.find(d => d && !completedDayNumbers.has(d.day_number))

    // Calcular progresso por semana
    const weekProgress = [1, 2, 3, 4].map(week => {
      const weekDays = days.filter(d => d && d.week_number === week) || []
      const completedWeekDays = progress.filter(p => p && p.week_number === week && p.completed).length || 0
      return {
        week,
        completed: completedWeekDays,
        total: weekDays.length,
        percentage: weekDays.length > 0 ? Math.round((completedWeekDays / weekDays.length) * 100) : 0
      }
    })

    const stats: any = {
      total_days: totalDays,
      completed_days: completedDays,
      progress_percentage: progressPercentage,
      current_day: currentDay?.day_number || null,
      current_week: currentDay?.week_number || 1,
      week_progress: weekProgress
    }

    // Mapear progresso por dia
    const progressMap = new Map(progress.filter(p => p).map(p => [p.day_number, p]))

    const daysWithProgress = days.filter(d => d).map(day => ({
      ...day,
      progress: progressMap.get(day.day_number) || null,
      is_completed: progressMap.get(day.day_number)?.completed || false,
      is_locked: day.day_number > 1 && !progressMap.get(day.day_number - 1)?.completed
    }))

    return NextResponse.json({
      success: true,
      data: {
        days: daysWithProgress,
        stats
      }
    })
  } catch (error: any) {
    console.error('Erro na API de jornada (catch principal):', error)
    console.error('Stack trace:', error.stack)
    // Retornar estrutura vazia em vez de erro para não quebrar a UI
    return NextResponse.json({
      success: true,
      data: {
        days: [],
        stats: {
          total_days: 0,
          completed_days: 0,
          progress_percentage: 0,
          current_day: null,
          current_week: 1,
          week_progress: [
            { week: 1, completed: 0, total: 0, percentage: 0 },
            { week: 2, completed: 0, total: 0, percentage: 0 },
            { week: 3, completed: 0, total: 0, percentage: 0 },
            { week: 4, completed: 0, total: 0, percentage: 0 }
          ]
        }
      }
    })
  }
}

