import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * PATCH/DELETE /api/admin/whatsapp/workshop-sessions/[id]
 */

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({}))
  const update: any = {}

  if (typeof body.title === 'string') update.title = body.title.trim() || 'Aula prática exclusiva para nutricionistas'
  if (typeof body.starts_at === 'string' && body.starts_at.trim()) update.starts_at = body.starts_at.trim()
  if (typeof body.zoom_link === 'string') update.zoom_link = body.zoom_link.trim()
  if (typeof body.is_active === 'boolean') update.is_active = body.is_active

  const { data, error } = await supabaseAdmin
    .from('whatsapp_workshop_sessions')
    .update(update)
    .eq('id', params.id)
    .eq('area', 'nutri')
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true, session: data })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const { error } = await supabaseAdmin
    .from('whatsapp_workshop_sessions')
    .delete()
    .eq('id', params.id)
    .eq('area', 'nutri')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

