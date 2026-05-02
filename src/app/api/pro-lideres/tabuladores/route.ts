import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import {
  fetchTabulatorsForTenant,
  normalizeTabulatorLabelInput,
  type LeaderTenantTabulatorRow,
} from '@/lib/pro-lideres-tabulators'

async function requireLeaderOwnerContext(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return { error: auth }
  const { user } = auth

  if (!supabaseAdmin) {
    return { error: NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 }) }
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return { error: NextResponse.json({ error: 'Apenas o líder pode gerir tabuladores.' }, { status: 403 }) }
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return { error: paid.response }

  return { user, ctx: paid.ctx }
}

/** Lista tabuladores do espaço (líder). */
export async function GET(request: NextRequest) {
  const gate = await requireLeaderOwnerContext(request)
  if ('error' in gate) return gate.error

  const items = await fetchTabulatorsForTenant(supabaseAdmin!, gate.ctx.tenant.id)
  return NextResponse.json({ items })
}

/** Adiciona tabulador ao espaço. */
export async function POST(request: NextRequest) {
  const gate = await requireLeaderOwnerContext(request)
  if ('error' in gate) return gate.error

  let body: { label?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const label = normalizeTabulatorLabelInput(body.label ?? '')
  if (label.length < 1) {
    return NextResponse.json({ error: 'Indique o nome do tabulador.' }, { status: 400 })
  }

  const tenantId = gate.ctx.tenant.id

  const { data: last } = await supabaseAdmin!
    .from('leader_tenant_tabulators')
    .select('sort_order')
    .eq('leader_tenant_id', tenantId)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const sortOrder = typeof last?.sort_order === 'number' ? last.sort_order + 1 : 0

  const { data: inserted, error } = await supabaseAdmin!
    .from('leader_tenant_tabulators')
    .insert({
      leader_tenant_id: tenantId,
      label,
      sort_order: sortOrder,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Já existe um tabulador com este nome.' }, { status: 409 })
    }
    console.error('[pro-lideres/tabuladores POST]', error)
    return NextResponse.json({ error: 'Não foi possível adicionar.' }, { status: 500 })
  }

  return NextResponse.json({ item: inserted as LeaderTenantTabulatorRow })
}
