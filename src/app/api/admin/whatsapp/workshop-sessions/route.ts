import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET/POST /api/admin/whatsapp/workshop-sessions
 * CRUD de sessões do workshop (Nutri).
 */

export async function GET(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const { searchParams } = new URL(request.url)
  const onlyActive = searchParams.get('onlyActive') === 'true'

  let q = supabaseAdmin
    .from('whatsapp_workshop_sessions')
    .select('*')
    .eq('area', 'nutri')
    .order('starts_at', { ascending: true })

  if (onlyActive) q = q.eq('is_active', true)

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, sessions: data || [] })
}

export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({}))
  const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim() : 'Aula Prática ao Vivo (Agenda Instável)'
  const starts_at = typeof body.starts_at === 'string' ? body.starts_at : null
  const zoom_link = typeof body.zoom_link === 'string' ? body.zoom_link.trim() : ''
  const is_active = body.is_active !== false

  if (!starts_at || !zoom_link) {
    return NextResponse.json({ error: 'starts_at e zoom_link são obrigatórios' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('whatsapp_workshop_sessions')
    .insert({
      area: 'nutri',
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

