import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode revogar convites.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  let body: { id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const id = body.id?.trim()
  if (!id) {
    return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
  }

  const { data: updated, error } = await supabaseAdmin
    .from('leader_tenant_invites')
    .update({ status: 'revoked' })
    .eq('id', id)
    .eq('leader_tenant_id', ctx.tenant.id)
    .eq('status', 'pending')
    .select()
    .maybeSingle()

  if (error) {
    console.error('[pro-lideres/invites/revoke]', error)
    return NextResponse.json({ error: 'Erro ao revogar' }, { status: 500 })
  }

  if (!updated) {
    return NextResponse.json({ error: 'Convite não encontrado ou já utilizado/revogado.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
