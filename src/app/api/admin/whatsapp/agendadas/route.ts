import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/whatsapp/agendadas
 * Lista conversas agendadas com filtros por data/hora
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const searchParams = request.nextUrl.searchParams
    const data = searchParams.get('data') // YYYY-MM-DD
    const hora = searchParams.get('hora') // HH:MM
    const sessionId = searchParams.get('session_id') // ID da sessão específica

    // Buscar todas as conversas com tag "recebeu_link_workshop" ou que têm workshop_session_id
    let query = supabaseAdmin
      .from('whatsapp_conversations')
      .select(`
        *,
        z_api_instances:instance_id (
          id,
          name,
          area,
          phone_number,
          status
        )
      `)
      .eq('area', 'nutri')
      .eq('status', 'active')

    // Filtrar por sessão específica
    if (sessionId) {
      query = query.contains('context', { workshop_session_id: sessionId })
    }

    const { data: conversations, error } = await query

    if (error) {
      throw error
    }

    // Filtrar conversas que têm workshop_session_id ou tag recebeu_link_workshop
    const agendadas = (conversations || []).filter((conv: any) => {
      const context = conv.context || {}
      const tags = Array.isArray(context.tags) ? context.tags : []
      const hasWorkshopTag = tags.includes('recebeu_link_workshop')
      const hasSessionId = !!context.workshop_session_id
      
      return hasWorkshopTag || hasSessionId
    })

    // Buscar informações das sessões
    const sessionIds = agendadas
      .map((conv: any) => (conv.context || {}).workshop_session_id)
      .filter(Boolean)

    let sessionsMap: Record<string, any> = {}
    if (sessionIds.length > 0) {
      const { data: sessions } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('id, title, starts_at, zoom_link')
        .in('id', sessionIds)

      sessions?.forEach((session) => {
        sessionsMap[session.id] = session
      })
    }

    // Enriquecer conversas com dados da sessão
    const agendadasEnriquecidas = agendadas.map((conv: any) => {
      const context = conv.context || {}
      const sessionId = context.workshop_session_id
      const session = sessionId ? sessionsMap[sessionId] : null

      return {
        ...conv,
        session: session ? {
          id: session.id,
          title: session.title,
          starts_at: session.starts_at,
          zoom_link: session.zoom_link,
          date: new Date(session.starts_at).toLocaleDateString('pt-BR'),
          time: new Date(session.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          weekday: new Date(session.starts_at).toLocaleDateString('pt-BR', { weekday: 'long' }),
        } : null,
      }
    })

    // Aplicar filtros de data/hora
    let filtradas = agendadasEnriquecidas

    if (data) {
      filtradas = filtradas.filter((conv: any) => {
        if (!conv.session) return false
        const convDate = new Date(conv.session.starts_at).toISOString().split('T')[0]
        return convDate === data
      })
    }

    if (hora) {
      filtradas = filtradas.filter((conv: any) => {
        if (!conv.session) return false
        const convTime = new Date(conv.session.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        return convTime === hora
      })
    }

    // Ordenar por data/hora da sessão
    filtradas.sort((a: any, b: any) => {
      if (!a.session || !b.session) return 0
      return new Date(a.session.starts_at).getTime() - new Date(b.session.starts_at).getTime()
    })

    return NextResponse.json({
      success: true,
      total: filtradas.length,
      agendadas: filtradas,
    })
  } catch (error: any) {
    console.error('[Agendadas] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar agendadas', details: error.message },
      { status: 500 }
    )
  }
}
