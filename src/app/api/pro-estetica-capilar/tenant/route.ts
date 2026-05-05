import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { LeaderTenantRow } from '@/types/leader-tenant'
import {
  newEsteticaCapilarTenantInsertPayload,
  proEsteticaCapilarAutoProvisionEnabled,
  resolveEsteticaCapilarTenantContext,
} from '@/lib/pro-estetica-capilar-server'
import {
  fetchProLideresViewerTenantOverlayForNonOwner,
  resolveProLideresTenantContext,
} from '@/lib/pro-lideres-server'

const MAX_LEN = 500

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  let ctx = await resolveEsteticaCapilarTenantContext(supabaseAdmin, user)
  if (!ctx && proEsteticaCapilarAutoProvisionEnabled()) {
    const { data: existingOwner } = await supabaseAdmin.from('leader_tenants').select('id').eq('owner_user_id', user.id).maybeSingle()
    if (!existingOwner) {
      const ins = await supabaseAdmin
        .from('leader_tenants')
        .insert(newEsteticaCapilarTenantInsertPayload(user))
        .select()
        .single()
      if (ins.data) ctx = { tenant: ins.data as LeaderTenantRow, role: 'leader' }
    }
  }
  if (!ctx) ctx = await resolveEsteticaCapilarTenantContext(supabaseAdmin, user)
  if (!ctx) {
    const any = await resolveProLideresTenantContext(supabaseAdmin, user)
    if (any) return NextResponse.json({ error: 'Esta conta esta noutra edicao YLADA Pro.' }, { status: 409 })
    return NextResponse.json({ error: 'Tenant nao encontrado' }, { status: 404 })
  }

  const canEditTenantProfile = ctx.tenant.owner_user_id === user.id
  let viewerDisplayName: string
  let viewerContactEmail: string
  let viewerWhatsapp: string
  let memberShareSlug: string
  if (canEditTenantProfile) {
    viewerDisplayName = (ctx.tenant.display_name ?? '').trim()
    viewerContactEmail = (ctx.tenant.contact_email ?? '').trim()
    viewerWhatsapp = (ctx.tenant.whatsapp ?? '').trim()
    memberShareSlug = ''
  } else {
    const o = await fetchProLideresViewerTenantOverlayForNonOwner(supabaseAdmin, user, ctx.tenant.id)
    viewerDisplayName = o.displayName
    viewerContactEmail = o.contactEmail
    viewerWhatsapp = o.whatsapp
    memberShareSlug = o.memberShareSlug
  }

  return NextResponse.json({
    tenant: ctx.tenant,
    role: ctx.role,
    canEditTenantProfile,
    viewerDisplayName,
    viewerContactEmail,
    viewerWhatsapp,
    memberShareSlug,
  })
}

export async function PATCH(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveEsteticaCapilarTenantContext(supabaseAdmin, user)
  if (!ctx) return NextResponse.json({ error: 'Tenant nao encontrado' }, { status: 404 })
  if (ctx.tenant.owner_user_id !== user.id) return NextResponse.json({ error: 'Apenas o responsavel pode editar.' }, { status: 403 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 })
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

  const { data: tenant, error } = await supabaseAdmin
    .from('leader_tenants')
    .update(payload)
    .eq('id', ctx.tenant.id)
    .eq('owner_user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  const updated = tenant as LeaderTenantRow
  return NextResponse.json({
    tenant: updated,
    role: 'leader' as const,
    canEditTenantProfile: true,
    viewerDisplayName: (updated.display_name ?? '').trim(),
    viewerContactEmail: (updated.contact_email ?? '').trim(),
    viewerWhatsapp: (updated.whatsapp ?? '').trim(),
    memberShareSlug: '',
  })
}
