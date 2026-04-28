import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { LeaderTenantRow } from '@/types/leader-tenant'
import {
  newEsteticaCorporalTenantInsertPayload,
  resolveEsteticaCorporalTenantContext,
  shouldProvisionEsteticaCorporalTenant,
} from '@/lib/pro-estetica-corporal-server'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { parseMessageTonePatchBody } from '@/lib/leader-tenant-message-tone'

const MAX_LEN = 500

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)

  if (!ctx && shouldProvisionEsteticaCorporalTenant(user.email)) {
    const { data: existingOwner } = await supabaseAdmin
      .from('leader_tenants')
      .select('id')
      .eq('owner_user_id', user.id)
      .maybeSingle()
    if (!existingOwner) {
      const ins = await supabaseAdmin
        .from('leader_tenants')
        .insert(newEsteticaCorporalTenantInsertPayload(user))
        .select()
        .single()
      if (ins.error) {
        console.error('[pro-estetica-corporal/tenant GET insert]', ins.error)
        return NextResponse.json({ error: 'Erro ao criar tenant' }, { status: 500 })
      }
      if (ins.data) {
        ctx = { tenant: ins.data as LeaderTenantRow, role: 'leader' }
      }
    }
  }

  if (!ctx) {
    ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)
  }

  if (!ctx) {
    const any = await resolveProLideresTenantContext(supabaseAdmin, user)
    if (any) {
      return NextResponse.json(
        { error: 'Esta conta está noutra edição YLADA Pro (ex.: Pro Líderes).' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }

  const canEditTenantProfile = ctx.tenant.owner_user_id === user.id

  return NextResponse.json({
    tenant: ctx.tenant,
    role: ctx.role,
    canEditTenantProfile,
  })
}

export async function PATCH(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json(
      { error: 'Apenas o profissional responsável pode editar estes dados.' },
      { status: 403 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const clip = (v: unknown, max = MAX_LEN) => {
    if (v === null || v === undefined) return null
    const s = String(v).trim()
    if (!s) return null
    return s.slice(0, max)
  }

  const payload: Record<string, string | null> = {
    display_name: clip(body.display_name),
    team_name: clip(body.team_name),
    whatsapp: clip(body.whatsapp),
    contact_email: clip(body.contact_email, 320),
    focus_notes: clip(body.focus_notes, 2000),
  }

  const tonePatch = parseMessageTonePatchBody(body)
  if (!tonePatch.ok) {
    return NextResponse.json({ error: tonePatch.error }, { status: 400 })
  }
  if (!tonePatch.empty) {
    Object.assign(payload, tonePatch.patch)
  }

  const { data: tenant, error } = await supabaseAdmin
    .from('leader_tenants')
    .update(payload)
    .eq('id', ctx.tenant.id)
    .eq('owner_user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('[pro-estetica-corporal/tenant PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }

  return NextResponse.json({
    tenant: tenant as LeaderTenantRow,
    role: 'leader' as const,
    canEditTenantProfile: true,
  })
}
