import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  shouldProvisionProLideresTenant,
  newLeaderTenantInsertPayload,
  resolveProLideresTenantContext,
  fetchProLideresViewerTenantOverlayForNonOwner,
} from '@/lib/pro-lideres-server'
import {
  proLideresTeamSubscriptionAllowsAccess,
  requireProLideresPaidContext,
} from '@/lib/pro-lideres-subscription-access'
import type { LeaderTenantRow } from '@/types/leader-tenant'
import { parseTeamBankPaymentUrlField } from '@/lib/pro-lideres-team-bank-payment-url'

const MAX_LEN = 500

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let ctx = await resolveProLideresTenantContext(supabaseAdmin, user)

  if (!ctx && shouldProvisionProLideresTenant(user)) {
    const ins = await supabaseAdmin
      .from('leader_tenants')
      .insert(newLeaderTenantInsertPayload(user))
      .select()
      .single()
    if (ins.error) {
      console.error('[pro-lideres/tenant GET insert]', ins.error)
      return NextResponse.json({ error: 'Erro ao criar tenant' }, { status: 500 })
    }
    if (ins.data) {
      ctx = { tenant: ins.data as LeaderTenantRow, role: 'leader' }
    }
  }

  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }

  const canEditTenantProfile = ctx.tenant.owner_user_id === user.id
  const teamSubscriptionActive = await proLideresTeamSubscriptionAllowsAccess(user, ctx)

  let viewerDisplayName: string
  let viewerContactEmail: string
  let viewerWhatsapp: string
  if (canEditTenantProfile) {
    viewerDisplayName = (ctx.tenant.display_name ?? '').trim()
    viewerContactEmail = (ctx.tenant.contact_email ?? '').trim()
    viewerWhatsapp = (ctx.tenant.whatsapp ?? '').trim()
  } else {
    const o = await fetchProLideresViewerTenantOverlayForNonOwner(supabaseAdmin, user, ctx.tenant.id)
    viewerDisplayName = o.displayName
    viewerContactEmail = o.contactEmail
    viewerWhatsapp = o.whatsapp
  }

  return NextResponse.json({
    tenant: ctx.tenant,
    role: ctx.role,
    canEditTenantProfile,
    teamSubscriptionActive,
    viewerDisplayName,
    viewerContactEmail,
    viewerWhatsapp,
  })
}

export async function PATCH(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json(
      { error: 'Apenas o líder responsável pode editar estes dados.' },
      { status: 403 }
    )
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

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

  const payload: Record<string, string | null | boolean | number> = {}
  if (Object.prototype.hasOwnProperty.call(body, 'display_name')) {
    payload.display_name = clip(body.display_name)
  }
  if (Object.prototype.hasOwnProperty.call(body, 'team_name')) {
    payload.team_name = clip(body.team_name)
  }
  if (Object.prototype.hasOwnProperty.call(body, 'whatsapp')) {
    payload.whatsapp = clip(body.whatsapp)
  }
  if (Object.prototype.hasOwnProperty.call(body, 'contact_email')) {
    payload.contact_email = clip(body.contact_email, 320)
  }
  if (Object.prototype.hasOwnProperty.call(body, 'focus_notes')) {
    payload.focus_notes = clip(body.focus_notes, 2000)
  }
  if (body.daily_tasks_visible_to_team !== undefined) {
    payload.daily_tasks_visible_to_team = Boolean(body.daily_tasks_visible_to_team)
  }
  if (body.daily_tasks_full_day_bonus_points !== undefined) {
    const n = Number(body.daily_tasks_full_day_bonus_points)
    if (!Number.isFinite(n) || n < 0 || n > 100000) {
      return NextResponse.json({ error: 'Bónus de dia completo inválido (0–100000).' }, { status: 400 })
    }
    payload.daily_tasks_full_day_bonus_points = Math.floor(n)
  }

  if (Object.prototype.hasOwnProperty.call(body, 'team_bank_payment_url')) {
    const parsed = parseTeamBankPaymentUrlField(body.team_bank_payment_url)
    if (parsed.action === 'error') {
      return NextResponse.json({ error: parsed.message }, { status: 400 })
    }
    if (parsed.action === 'clear') {
      payload.team_bank_payment_url = null
    } else if (parsed.action === 'set') {
      payload.team_bank_payment_url = parsed.url
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, 'team_bank_pix_payment_url')) {
    const parsed = parseTeamBankPaymentUrlField(body.team_bank_pix_payment_url)
    if (parsed.action === 'error') {
      return NextResponse.json({ error: parsed.message }, { status: 400 })
    }
    if (parsed.action === 'clear') {
      payload.team_bank_pix_payment_url = null
    } else if (parsed.action === 'set') {
      payload.team_bank_pix_payment_url = parsed.url
    }
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: 'Nenhum campo para atualizar.' }, { status: 400 })
  }

  const { data: tenant, error } = await supabaseAdmin
    .from('leader_tenants')
    .update(payload)
    .eq('owner_user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('[pro-lideres/tenant PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }

  const updated = tenant as LeaderTenantRow
  return NextResponse.json({
    tenant: updated,
    role: 'leader' as const,
    canEditTenantProfile: true,
    viewerDisplayName: (updated.display_name ?? '').trim(),
    viewerContactEmail: (updated.contact_email ?? '').trim(),
    viewerWhatsapp: (updated.whatsapp ?? '').trim(),
  })
}
