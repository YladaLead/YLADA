/**
 * Sistema de Horários Fixos do Workshop
 * 
 * Configuração de horários e links fixos do Zoom
 */

import { supabaseAdmin } from '@/lib/supabase'

/**
 * Links fixos do Zoom (sempre os mesmos)
 */
const ZOOM_LINKS = {
  LINK_9H: 'https://us02web.zoom.us/j/84314536380?pwd=Uk22sJGQu0Z0XByd6MvwtsqNmwW94c.1',
  LINK_15H: 'https://us02web.zoom.us/j/88152277642?pwd=ejGMTUzEb5Ybjy0O77FtakWIkchQWU.1',
  LINK_20H: 'https://us02web.zoom.us/j/88212513126?pwd=8KROrQtFJacJKRaaCwSsAM2avjeWfs.1',
}

/**
 * Configuração de horários fixos
 */
export const WORKSHOP_SCHEDULE = {
  // Segunda-feira às 10:00 - usa link das 9:00
  monday_10: {
    weekday: 1, // Segunda-feira (0 = domingo, 1 = segunda)
    hour: 10,
    minute: 0,
    zoomLink: ZOOM_LINKS.LINK_9H,
  },
  // Terça a Sexta às 9:00 - link das 9:00
  tuesday_to_friday_9: {
    weekdays: [2, 3, 4, 5], // Terça a Sexta
    hour: 9,
    minute: 0,
    zoomLink: ZOOM_LINKS.LINK_9H,
  },
  // Segunda a Sexta às 15:00 - link das 15:00
  monday_to_friday_15: {
    weekdays: [1, 2, 3, 4, 5], // Segunda a Sexta
    hour: 15,
    minute: 0,
    zoomLink: ZOOM_LINKS.LINK_15H,
  },
  // Quarta-feira às 20:00 - link das 20:00
  wednesday_20: {
    weekday: 3, // Quarta-feira
    hour: 20,
    minute: 0,
    zoomLink: ZOOM_LINKS.LINK_20H,
  },
}

/**
 * Gera sessões automaticamente para as próximas N semanas
 */
export async function generateWorkshopSessions(weeksAhead: number = 4): Promise<{
  created: number
  errors: number
  error?: string
}> {
  try {
    const now = new Date()
    const area = 'nutri'
    let created = 0
    let errors = 0

    // Buscar links do banco (por horário específico)
    let zoomLink9h = process.env.ZOOM_LINK_9H || ''
    let zoomLink15h = process.env.ZOOM_LINK_15H || ''

    // Se não estiver em variável de ambiente, buscar do banco
    // Buscar sessões ativas e identificar links por horário
    if (!zoomLink9h || !zoomLink15h) {
      const { data: existingSessions } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('starts_at, zoom_link')
        .eq('area', area)
        .eq('is_active', true)
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
        .limit(50)

      if (existingSessions && existingSessions.length > 0) {
        // Identificar links por horário (em BRT)
        for (const session of existingSessions) {
          const sessionDate = new Date(session.starts_at)
          // Converter para BRT para verificar horário
          const brtDate = new Date(sessionDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
          const hour = brtDate.getHours()

          if (hour === 9 && !zoomLink9h) {
            zoomLink9h = session.zoom_link
          } else if (hour === 15 && !zoomLink15h) {
            zoomLink15h = session.zoom_link
          }

          // Se já encontrou ambos, pode parar
          if (zoomLink9h && zoomLink15h) break
        }
      }
    }

    // Se ainda não tiver, avisar
    if (!zoomLink9h) {
      console.warn('⚠️ ZOOM_LINK_9H não encontrado. Adicione uma sessão às 9:00 primeiro ou configure ZOOM_LINK_9H no .env')
    }
    if (!zoomLink15h) {
      console.warn('⚠️ ZOOM_LINK_15H não encontrado. Adicione uma sessão às 15:00 primeiro ou configure ZOOM_LINK_15H no .env')
    }

    const sessionsToCreate: Array<{
      title: string
      starts_at: string
      zoom_link: string
    }> = []

    // Gerar sessões para as próximas N semanas
    for (let week = 0; week < weeksAhead; week++) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() + (week * 7))
      weekStart.setHours(0, 0, 0, 0)

      // Segunda-feira às 10:00 (usa link das 9:00)
      const monday = new Date(weekStart)
      const daysUntilMonday = (1 - monday.getDay() + 7) % 7
      monday.setDate(monday.getDate() + daysUntilMonday)
      const mondayStr = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}T10:00:00`
      const mondayDate = new Date(mondayStr + '-03:00') // BRT é UTC-3
      
      if (mondayDate > now && zoomLink9h) {
        sessionsToCreate.push({
          title: 'Aula Prática ao Vivo (Agenda Instável)',
          starts_at: mondayDate.toISOString(),
          zoom_link: zoomLink9h,
        })
      }

      // Terça a Sexta às 9:00
      for (const weekday of [2, 3, 4, 5]) { // Terça (2) a Sexta (5)
        const day = new Date(weekStart)
        const daysUntilWeekday = (weekday - day.getDay() + 7) % 7
        day.setDate(day.getDate() + daysUntilWeekday)
        const dayStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}T09:00:00`
        const dayDate = new Date(dayStr + '-03:00') // BRT é UTC-3
        
        if (dayDate > now && zoomLink9h) {
          sessionsToCreate.push({
            title: 'Aula Prática ao Vivo (Agenda Instável)',
            starts_at: dayDate.toISOString(),
            zoom_link: zoomLink9h,
          })
        }
      }

      // Segunda a Sexta às 15:00
      for (const weekday of [1, 2, 3, 4, 5]) { // Segunda (1) a Sexta (5)
        const day = new Date(weekStart)
        const daysUntilWeekday = (weekday - day.getDay() + 7) % 7
        day.setDate(day.getDate() + daysUntilWeekday)
        const dayStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}T15:00:00`
        const dayDate = new Date(dayStr + '-03:00') // BRT é UTC-3
        
        if (dayDate > now && zoomLink15h) {
          sessionsToCreate.push({
            title: 'Aula Prática ao Vivo (Agenda Instável)',
            starts_at: dayDate.toISOString(),
            zoom_link: zoomLink15h,
          })
        }
      }

      // Quarta-feira às 20:00
      const wednesday = new Date(weekStart)
      const daysUntilWednesday = (3 - wednesday.getDay() + 7) % 7
      wednesday.setDate(wednesday.getDate() + daysUntilWednesday)
      const wednesdayStr = `${wednesday.getFullYear()}-${String(wednesday.getMonth() + 1).padStart(2, '0')}-${String(wednesday.getDate()).padStart(2, '0')}T20:00:00`
      const wednesdayDate = new Date(wednesdayStr + '-03:00') // BRT é UTC-3
      
      if (wednesdayDate > now) {
        sessionsToCreate.push({
          title: 'Aula Prática ao Vivo (Agenda Instável)',
          starts_at: wednesdayDate.toISOString(),
          zoom_link: zoomLink20h,
        })
      }
    }

    // Remover duplicatas (mesma data/hora)
    const uniqueSessions = sessionsToCreate.filter((session, index, self) =>
      index === self.findIndex((s) => s.starts_at === session.starts_at)
    )

    // Verificar quais já existem no banco
    const existingDates = new Set<string>()
    if (uniqueSessions.length > 0) {
      const minDate = uniqueSessions[0].starts_at
      const maxDate = uniqueSessions[uniqueSessions.length - 1].starts_at

      const { data: existing } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('starts_at')
        .eq('area', area)
        .gte('starts_at', minDate)
        .lte('starts_at', maxDate)

      if (existing) {
        existing.forEach((s) => {
          const date = new Date(s.starts_at)
          date.setSeconds(0, 0)
          existingDates.add(date.toISOString())
        })
      }
    }

    // Criar apenas as que não existem
    const toCreate = uniqueSessions.filter((session) => {
      const date = new Date(session.starts_at)
      date.setSeconds(0, 0)
      return !existingDates.has(date.toISOString())
    })

    if (toCreate.length === 0) {
      return { created: 0, errors: 0 }
    }

    // Inserir em lote
    for (const session of toCreate) {
      try {
        const { error } = await supabaseAdmin
          .from('whatsapp_workshop_sessions')
          .insert({
            area,
            title: session.title,
            starts_at: session.starts_at,
            zoom_link: session.zoom_link,
            is_active: true,
          })

        if (error) {
          console.error(`[Workshop Schedule] Erro ao criar sessão ${session.starts_at}:`, error)
          errors++
        } else {
          created++
        }
      } catch (error: any) {
        console.error(`[Workshop Schedule] Erro ao criar sessão ${session.starts_at}:`, error)
        errors++
      }
    }

    return { created, errors }
  } catch (error: any) {
    console.error('[Workshop Schedule] Erro ao gerar sessões:', error)
    return { 
      created: 0, 
      errors: 1,
      error: error.message || 'Erro ao gerar sessões'
    }
  }
}
