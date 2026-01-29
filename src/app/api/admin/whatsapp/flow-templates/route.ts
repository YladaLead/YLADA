import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/whatsapp/flow-templates
 * Retorna os templates do fluxo (flow_templates do workshop_settings).
 */
export async function GET(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const { data: settings, error } = await supabaseAdmin
    .from('whatsapp_workshop_settings')
    .select('flow_templates')
    .eq('area', 'nutri')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const flow_templates = (settings?.flow_templates && typeof settings.flow_templates === 'object')
    ? settings.flow_templates
    : {}
  return NextResponse.json({ success: true, flow_templates })
}

/**
 * PUT /api/admin/whatsapp/flow-templates
 * Atualiza apenas flow_templates (merge com valores atuais).
 */
export async function PUT(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  const body = await request.json().catch(() => ({}))
  if (!body || typeof body.flow_templates !== 'object') {
    return NextResponse.json({ error: 'flow_templates (objeto) é obrigatório' }, { status: 400 })
  }

  const { data: existing } = await supabaseAdmin
    .from('whatsapp_workshop_settings')
    .select('flow_templates')
    .eq('area', 'nutri')
    .maybeSingle()

  const prev = (existing?.flow_templates && typeof existing.flow_templates === 'object')
    ? (existing.flow_templates as Record<string, string>)
    : {}
  const flow_templates = { ...prev, ...body.flow_templates }

  const { data, error } = await supabaseAdmin
    .from('whatsapp_workshop_settings')
    .update({ flow_templates })
    .eq('area', 'nutri')
    .select('flow_templates')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, flow_templates: data?.flow_templates ?? flow_templates })
}
