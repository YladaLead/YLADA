import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { isEmailUnlocked } from '@/config/jornada-unlocked-emails'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      console.error('❌ Supabase Admin não configurado - retornando estrutura vazia')
      console.error('❌ Verifique as variáveis de ambiente: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
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
    
    console.log('✅ Supabase Admin configurado, iniciando busca...')
    console.log('✅ User ID:', user.id)
    console.log('✅ User Email:', user.email)

    let days: any[] = []
    let progress: any[] = []

    // Buscar todos os dias da jornada
    try {
      console.log('🔍 Buscando dias da jornada na tabela journey_days...')
      
      // Primeiro, tentar contar os registros
      const { count, error: countError } = await supabaseAdmin
        .from('journey_days')
        .select('*', { count: 'exact', head: true })
      console.log('📊 Total de registros na tabela journey_days:', count)
      if (countError) {
        console.error('❌ Erro ao contar registros:', countError)
        console.error('❌ Detalhes do erro:', JSON.stringify(countError, null, 2))
      }
      
      // Buscar todos os dias
      let { data: daysData, error: daysError } = await supabaseAdmin
        .from('journey_days')
        .select('*')
        .order('day_number', { ascending: true })
      
      console.log('🔍 Resultado da query:', { 
        hasData: !!daysData, 
        dataLength: daysData?.length || 0,
        hasError: !!daysError,
        error: daysError ? JSON.stringify(daysError, null, 2) : null
      })
      
      // Se não retornou dados mas há registros, tentar sem order
      if ((!daysData || daysData.length === 0) && count && count > 0) {
        console.log('⚠️ Há registros mas query retornou vazio - tentando sem order...')
        const retry = await supabaseAdmin
          .from('journey_days')
          .select('*')
        if (retry.data && retry.data.length > 0) {
          daysData = retry.data.sort((a: any, b: any) => (a.day_number || 0) - (b.day_number || 0))
          daysError = retry.error
          console.log('✅ Dados recuperados sem order, total:', daysData.length)
        }
      }

      if (daysError) {
        console.error('❌ Erro ao buscar dias da jornada:', daysError)
        console.error('❌ Código do erro:', daysError.code)
        console.error('❌ Mensagem do erro:', daysError.message)
        console.error('❌ Detalhes completos:', JSON.stringify(daysError, null, 2))
        // Se a tabela não existe ou está vazia, usar array vazio
        if (daysError.code === 'PGRST116' || daysError.message?.includes('does not exist') || daysError.message?.includes('relation') || daysError.message?.includes('table')) {
          console.log('⚠️ Tabela journey_days não existe ainda - usando array vazio')
          days = []
        } else {
          // Para outros erros, também usar array vazio para não quebrar a UI
          console.log('⚠️ Erro desconhecido ao buscar days, usando array vazio:', daysError)
          days = []
        }
      } else {
        console.log('✅ Dias encontrados:', daysData?.length || 0)
        if (daysData && daysData.length > 0) {
          console.log('✅ Primeiros 3 dias:', daysData.slice(0, 3).map((d: any) => ({ day: d.day_number, title: d.title })))
        } else {
          console.log('⚠️ daysData está vazio ou undefined')
          console.log('⚠️ daysData:', daysData)
          console.log('⚠️ count retornado:', count)
        }
        days = daysData || []
      }
    } catch (error: any) {
      console.error('❌ Exceção ao buscar days:', error)
      console.error('❌ Stack trace:', error.stack)
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
    
    // Calcular currentDay: o maior dia concluído + 1, ou 1 se nenhum foi concluído
    const maxCompletedDay = progress.filter(p => p && p.completed).length > 0
      ? Math.max(...progress.filter(p => p && p.completed).map(p => p.day_number))
      : 0
    const calculatedCurrentDay = maxCompletedDay + 1

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
      current_day: calculatedCurrentDay || 1, // Usar o dia calculado (maior concluído + 1)
      current_week: currentDay?.week_number || 1,
      week_progress: weekProgress
    }

    // Mapear progresso por dia
    const progressMap = new Map(progress.filter(p => p).map(p => [p.day_number, p]))

    // Buscar e-mail do usuário para verificar bypass
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user.id)
    const userEmail = authUser?.user?.email || null
    const isUnlocked = isEmailUnlocked(userEmail)

    // Aplicar lógica de bloqueio inteligente
    // ATUALIZADO: Todos os dias estão desbloqueados (sem cadeado)
    const daysWithProgress = days.filter(d => d).map(day => {
      const isCompleted = progressMap.get(day.day_number)?.completed || false
      // Todos os dias desbloqueados - sem bloqueio sequencial
      const isLocked = false
      
      return {
        ...day,
        progress: progressMap.get(day.day_number) || null,
        is_completed: isCompleted,
        is_locked: isLocked
      }
    })

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

