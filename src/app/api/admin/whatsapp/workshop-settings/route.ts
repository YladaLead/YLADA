import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

const ALLOWED_AREAS = ['nutri', 'hom'] as const

/**
 * GET/PUT /api/admin/whatsapp/workshop-settings
 * Configurações do workshop. ?area=nutri|hom (default nutri).
 */

export async function GET(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const area = (request.nextUrl.searchParams.get('area') ?? 'nutri').toLowerCase().trim()
  const validArea = ALLOWED_AREAS.includes(area as any) ? area : 'nutri'

  const { data: settings, error } = await supabaseAdmin
    .from('whatsapp_workshop_settings')
    .select('*')
    .eq('area', validArea)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, settings: settings || null })
}

export async function PUT(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({}))
  const areaParam = (body.area ?? request.nextUrl.searchParams.get('area') ?? 'nutri').toLowerCase().trim()
  const area = ALLOWED_AREAS.includes(areaParam as any) ? areaParam : 'nutri'

  const flyer_url = typeof body.flyer_url === 'string' ? body.flyer_url.trim() : null
  const flyer_caption = typeof body.flyer_caption === 'string' ? body.flyer_caption.trim() : null
  const oferta_image_url = typeof body.oferta_image_url === 'string' ? body.oferta_image_url.trim() : null
  const flow_templates = body.flow_templates && typeof body.flow_templates === 'object' ? body.flow_templates : undefined

  const payload: Record<string, unknown> = { area }
  if (body.flyer_url !== undefined) payload.flyer_url = flyer_url
  if (body.flyer_caption !== undefined) payload.flyer_caption = flyer_caption
  if (body.oferta_image_url !== undefined) payload.oferta_image_url = oferta_image_url
  if (flow_templates !== undefined) payload.flow_templates = flow_templates

  const { data, error } = await supabaseAdmin
    .from('whatsapp_workshop_settings')
    .upsert(payload, { onConflict: 'area' })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, settings: data })
}

