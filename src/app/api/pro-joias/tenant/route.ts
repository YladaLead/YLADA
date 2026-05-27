import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveJoiasTenantContext, newJoiasTenantInsertPayload, shouldProvisionJoiasTenant } from '@/lib/pro-joias-server'
import { createProLideresServerClient } from '@/lib/pro-lideres-server'
import { parseMessageTonePatchBody } from '@/lib/leader-tenant-message-tone'

const MAX_LEN = 500

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let ctx = await resolveJoiasTenantContext(supabaseAdmin, user)

  if (!ctx && shouldProvisionJoiasTenant(user.email)) {
    const { data: existingOwner } = await supabaseAdmin
      .from('leader_tenants')
      .select('id')
      .eq('owner_user_id', user.id)
      .maybeSingle()
    if (!existingOwner) {
      const ins = await supabaseAdmin
        .from('leader_tenants')
        .insert(newJoiasTenantInsertPayload(user))
        .select()
        .single()
      if (!ins.error && ins.data) {
        ctx = { tenant: ins.data as never, role: 'leader' }
      }
    }
  }

  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ tenant: ctx.tenant, role: ctx.role })
}

export async function PATCH(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveJoiasTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }
  if (ctx.role !== 'leader') {
    return NextResponse.json({ error: 'Apenas o líder pode editar o perfil' }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const tonePatch = parseMessageTonePatchBody(body)

  const allowed: Record<string, unknown> = {}
  if (typeof body.display_name === 'string') {
    allowed.display_name = body.display_name.trim().slice(0, MAX_LEN)
  }
  if (typeof body.team_name === 'string') {
    allowed.team_name = body.team_name.trim().slice(0, MAX_LEN)
  }
  if (typeof body.whatsapp === 'string') {
    allowed.whatsapp = body.whatsapp.trim().slice(0, 20)
  }
  if (typeof body.contact_email === 'string') {
    allowed.contact_email = body.contact_email.trim().slice(0, MAX_LEN)
  }
  if (typeof body.focus_notes === 'string') {
    allowed.focus_notes = body.focus_notes.trim().slice(0, 2000)
  }
  if (tonePatch) {
    Object.assign(allowed, tonePatch)
  }

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: 'Nenhum campo válido para atualizar' }, { status: 400 })
  }

  allowed.updated_at = new Date().toISOString()

  const { data: updated, error } = await supabaseAdmin
    .from('leader_tenants')
    .update(allowed)
    .eq('id', ctx.tenant.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ tenant: updated })
}
