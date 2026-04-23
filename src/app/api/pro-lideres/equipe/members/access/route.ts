import { NextRequest, NextResponse } from 'next/server'

import { requireApiAuth } from '@/lib/api-auth'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { supabaseAdmin } from '@/lib/supabase'

type Body = {
  targetUserId?: string
  action?: 'pause' | 'resume' | 'remove'
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode gerir a equipe.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  let body: Body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const targetUserId = body.targetUserId?.trim()
  const action = body.action
  if (!targetUserId || !action) {
    return NextResponse.json({ error: 'targetUserId e action são obrigatórios' }, { status: 400 })
  }
  if (targetUserId === user.id) {
    return NextResponse.json({ error: 'Não é possível alterar o próprio acesso aqui.' }, { status: 400 })
  }
  if (!['pause', 'resume', 'remove'].includes(action)) {
    return NextResponse.json({ error: 'action inválida' }, { status: 400 })
  }

  const { data: row, error: fetchErr } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('id, role, team_access_state')
    .eq('leader_tenant_id', ctx.tenant.id)
    .eq('user_id', targetUserId)
    .maybeSingle()

  if (fetchErr) {
    console.error('[pro-lideres/equipe/members/access fetch]', fetchErr)
    return NextResponse.json({ error: 'Erro ao ler membro' }, { status: 500 })
  }
  if (!row || row.role !== 'member') {
    return NextResponse.json({ error: 'Membro não encontrado.' }, { status: 404 })
  }

  if (action === 'remove') {
    const { error: delErr } = await supabaseAdmin
      .from('leader_tenant_members')
      .delete()
      .eq('id', row.id as string)
      .eq('leader_tenant_id', ctx.tenant.id)
      .eq('role', 'member')

    if (delErr) {
      console.error('[pro-lideres/equipe/members/access delete]', delErr)
      return NextResponse.json({ error: 'Não foi possível remover da equipe.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  const nextState = action === 'pause' ? 'paused' : 'active'
  if (action === 'resume' && (row.team_access_state as string) !== 'paused') {
    return NextResponse.json({ error: 'Este membro já está ativo.' }, { status: 400 })
  }
  if (action === 'pause' && (row.team_access_state as string) === 'paused') {
    return NextResponse.json({ error: 'Este membro já está pausado.' }, { status: 400 })
  }

  const { error: updErr } = await supabaseAdmin
    .from('leader_tenant_members')
    .update({ team_access_state: nextState })
    .eq('id', row.id as string)
    .eq('leader_tenant_id', ctx.tenant.id)
    .eq('role', 'member')

  if (updErr) {
    console.error('[pro-lideres/equipe/members/access update]', updErr)
    return NextResponse.json({ error: 'Não foi possível atualizar o acesso.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
