import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import {
  buildProLideresInviteUrl,
  generateProLideresInviteToken,
  inviteExpiresAtDefault,
  isValidInviteEmail,
  normalizeInviteEmail,
} from '@/lib/pro-lideres-invite-helpers'
import {
  loadProLideresInviteSlotsStatus,
  proLideresInviteSlotsBlockedMessage,
} from '@/lib/pro-lideres-invite-slots'
import type { LeaderTenantInviteListItem, LeaderTenantInviteRow } from '@/types/leader-tenant'

function requestOrigin(request: NextRequest): string {
  try {
    return new URL(request.url).origin
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://www.ylada.com'
  }
}

function normalizeSearch(s: string): string {
  return s.trim().toLowerCase()
}

/** Lista convites do tenant (só o dono), com perfil do membro quando já aceitou, busca e filtro de estado. */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode gerir convites.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  const tenantId = ctx.tenant.id
  const qRaw = request.nextUrl.searchParams.get('q') ?? ''
  const statusParam = (request.nextUrl.searchParams.get('status') ?? 'all').toLowerCase()
  const q = normalizeSearch(qRaw)

  const { data: tenantRow } = await supabaseAdmin
    .from('leader_tenants')
    .select('team_invite_pending_quota')
    .eq('id', tenantId)
    .maybeSingle()

  const slotStatus = await loadProLideresInviteSlotsStatus(
    supabaseAdmin,
    tenantId,
    tenantRow?.team_invite_pending_quota
  )

  const { data: rows, error } = await supabaseAdmin
    .from('leader_tenant_invites')
    .select('*')
    .eq('leader_tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[pro-lideres/invites GET]', error)
    return NextResponse.json({ error: 'Erro ao listar convites' }, { status: 500 })
  }

  const now = Date.now()
  const nowIso = new Date().toISOString()
  const baseRows = (rows ?? []) as LeaderTenantInviteRow[]

  const usedIds = [
    ...new Set(baseRows.map((r) => r.used_by_user_id).filter((id): id is string => Boolean(id))),
  ]

  const profileByUserId = new Map<string, { nome_completo: string | null; whatsapp: string | null; email: string | null }>()
  if (usedIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, nome_completo, whatsapp, email')
      .in('user_id', usedIds)

    for (const p of profiles ?? []) {
      profileByUserId.set(p.user_id as string, {
        nome_completo: (p.nome_completo as string | null) ?? null,
        whatsapp: (p.whatsapp as string | null) ?? null,
        email: (p.email as string | null) ?? null,
      })
    }
  }

  let engagedSet = new Set<string>()
  if (usedIds.length > 0) {
    const { data: engagedRows, error: rpcErr } = await supabaseAdmin.rpc('pro_lideres_user_ids_with_pl_link_views', {
      p_ids: usedIds,
    })
    if (!rpcErr && Array.isArray(engagedRows)) {
      engagedSet = new Set(
        engagedRows.map((x: unknown) => (typeof x === 'string' ? x : String(x))).filter(Boolean)
      )
    }
  }

  let invites: LeaderTenantInviteListItem[] = baseRows.map((row) => {
    const expiredByDate = new Date(row.expires_at).getTime() < now
    const effectiveStatus =
      row.status === 'pending' && expiredByDate ? 'expired' : row.status

    const prof = row.used_by_user_id ? profileByUserId.get(row.used_by_user_id) : undefined
    return {
      ...row,
      effectiveStatus,
      memberNome: prof?.nome_completo ?? null,
      memberWhatsapp: prof?.whatsapp ?? null,
      linksEngaged: row.used_by_user_id ? engagedSet.has(row.used_by_user_id) : false,
    }
  })

  if (statusParam !== 'all') {
    invites = invites.filter((inv) => inv.effectiveStatus === statusParam)
  }

  if (q.length > 0) {
    invites = invites.filter((inv) => {
      const email = inv.invited_email.toLowerCase()
      const prof = inv.used_by_user_id ? profileByUserId.get(inv.used_by_user_id) : undefined
      const nome = prof?.nome_completo?.toLowerCase() ?? ''
      const wa = prof?.whatsapp?.toLowerCase().replace(/\s/g, '') ?? ''
      const qCompact = q.replace(/\s/g, '')
      return (
        email.includes(q) ||
        nome.includes(q) ||
        wa.includes(qCompact) ||
        (prof?.email?.toLowerCase().includes(q) ?? false)
      )
    })
  }

  const pendingValidCount = baseRows.filter(
    (r) => r.status === 'pending' && new Date(r.expires_at).getTime() >= now
  ).length

  const { data: receiptRows } = await supabaseAdmin
    .from('pro_lideres_invite_quota_mp_receipts')
    .select(
      'mercado_pago_payment_id, amount_brl, slots_added, created_at, checkout_account_email, mp_payer_email, mp_payer_name, mp_cardholder_name, mp_card_last_four'
    )
    .eq('leader_tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(12)

  const mpQuotaReceipts = (receiptRows ?? []).map((row) => {
    const checkout = (row.checkout_account_email as string | null)?.trim().toLowerCase() || null
    const mpLogin = (row.mp_payer_email as string | null)?.trim().toLowerCase() || null
    const cardholder = (row.mp_cardholder_name as string | null)?.trim() || null
    const cardLastFour = (row.mp_card_last_four as string | null)?.trim() || null
    return {
      paymentId: String(row.mercado_pago_payment_id),
      amountBrl: Number(row.amount_brl),
      slotsAdded: Number(row.slots_added) || 50,
      createdAt: String(row.created_at),
      checkoutAccountEmail: checkout,
      mpLoginEmail: mpLogin,
      mpPayerName: (row.mp_payer_name as string | null)?.trim() || null,
      cardholderName: cardholder,
      cardLastFour,
      mpLoginDiffersFromCheckout: Boolean(checkout && mpLogin && checkout !== mpLogin),
    }
  })

  return NextResponse.json({
    invites,
    quota: {
      ...slotStatus,
      pendingUsed: pendingValidCount,
      totalListed: baseRows.length,
    },
    mpQuotaReceipts,
  })
}

/** Cria convite (e-mail + link). */
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode criar convites.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  const tenantId = ctx.tenant.id

  const { data: tenantRow } = await supabaseAdmin
    .from('leader_tenants')
    .select('team_invite_pending_quota')
    .eq('id', tenantId)
    .maybeSingle()

  const slotStatus = await loadProLideresInviteSlotsStatus(
    supabaseAdmin,
    tenantId,
    tenantRow?.team_invite_pending_quota
  )

  if (slotStatus.invitesBlocked) {
    return NextResponse.json(
      {
        error: proLideresInviteSlotsBlockedMessage(slotStatus),
        code: 'pro_lideres_invite_slots_exhausted',
        quota: slotStatus,
      },
      { status: 402 }
    )
  }

  let body: { email?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const email = normalizeInviteEmail(body.email ?? '')
  if (!isValidInviteEmail(email)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }

  if (email === user.email?.toLowerCase().trim()) {
    return NextResponse.json({ error: 'Use outro e-mail (não o do líder).' }, { status: 400 })
  }

  const token = generateProLideresInviteToken()
  const expiresAt = inviteExpiresAtDefault().toISOString()

  const { data: inserted, error } = await supabaseAdmin
    .from('leader_tenant_invites')
    .insert({
      leader_tenant_id: tenantId,
      token,
      invited_email: email,
      created_by_user_id: user.id,
      expires_at: expiresAt,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('[pro-lideres/invites POST]', error)
    return NextResponse.json({ error: 'Erro ao criar convite' }, { status: 500 })
  }

  const invite = inserted as LeaderTenantInviteRow
  const invite_url = buildProLideresInviteUrl(requestOrigin(request), invite.token)
  const team_bank_payment_url =
    typeof paid.ctx.tenant.team_bank_payment_url === 'string' && paid.ctx.tenant.team_bank_payment_url.trim()
      ? paid.ctx.tenant.team_bank_payment_url.trim()
      : null
  const team_bank_pix_payment_url =
    typeof paid.ctx.tenant.team_bank_pix_payment_url === 'string' && paid.ctx.tenant.team_bank_pix_payment_url.trim()
      ? paid.ctx.tenant.team_bank_pix_payment_url.trim()
      : null

  return NextResponse.json({ invite, invite_url, team_bank_payment_url, team_bank_pix_payment_url })
}
