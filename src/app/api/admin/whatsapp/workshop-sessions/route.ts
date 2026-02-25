import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

const ALLOWED_AREAS = ['nutri', 'hom'] as const
type WorkshopArea = (typeof ALLOWED_AREAS)[number]

function getArea(searchParams: URLSearchParams, body?: { area?: string }): WorkshopArea {
  const area = (body?.area ?? searchParams.get('area') ?? 'nutri').toLowerCase().trim()
  if (ALLOWED_AREAS.includes(area as WorkshopArea)) return area as WorkshopArea
  return 'nutri'
}

/**
 * GET/POST /api/admin/whatsapp/workshop-sessions
 * CRUD de sessões do workshop. ?area=nutri|hom (default nutri).
 */

export async function GET(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const { searchParams } = new URL(request.url)
  const area = getArea(searchParams)
  const onlyActive = searchParams.get('onlyActive') === 'true'
  const onlyConfirmed = searchParams.get('onlyConfirmed') === 'true' // Filtrar apenas com participantes confirmados

  let q = supabaseAdmin
    .from('whatsapp_workshop_sessions')
    .select('*')
    .eq('area', area)
    .order('starts_at', { ascending: true })

  if (onlyActive) q = q.eq('is_active', true)

  const { data: sessions, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Buscar contagem de participantes confirmados para cada sessão
  const sessionIds = (sessions || []).map(s => s.id)
  const participantsCount: Record<string, number> = {}

  if (sessionIds.length > 0) {
    // Buscar conversas que têm workshop_session_id (mesma área das sessões)
    const { data: conversations } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('context')
      .eq('area', area)
      .eq('status', 'active')

    // Contar participantes por sessão
    conversations?.forEach((conv: any) => {
      const context = conv.context || {}
      const sessionId = context.workshop_session_id
      if (sessionId && sessionIds.includes(sessionId)) {
        participantsCount[sessionId] = (participantsCount[sessionId] || 0) + 1
      }
    })
  }

  // Adicionar contagem de participantes às sessões
  let sessionsWithCount = (sessions || []).map(session => ({
    ...session,
    confirmed_participants: participantsCount[session.id] || 0
  }))

  // Filtrar apenas sessões com participantes confirmados (se solicitado)
  if (onlyConfirmed) {
    sessionsWithCount = sessionsWithCount.filter(s => s.confirmed_participants > 0)
  }

  return NextResponse.json({ success: true, sessions: sessionsWithCount })
}

export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({}))
  const area = getArea(new URL(request.url).searchParams, body)
  const defaultTitle = area === 'hom' ? 'HOM – Bebidas funcionais Herbalife' : 'Aula prática exclusiva para nutricionistas'
  const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim() : defaultTitle
  const starts_at = typeof body.starts_at === 'string' ? body.starts_at : null
  const zoom_link = typeof body.zoom_link === 'string' ? body.zoom_link.trim() : ''
  const is_active = body.is_active !== false

  if (!starts_at || !zoom_link) {
    return NextResponse.json({ error: 'starts_at e zoom_link são obrigatórios' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('whatsapp_workshop_sessions')
    .insert({
      area,
      title,
      starts_at,
      zoom_link,
      is_active,
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, session: data })
}

