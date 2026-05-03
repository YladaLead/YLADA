import { NextRequest, NextResponse } from 'next/server'

import { requireApiAuth } from '@/lib/api-auth'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { supabaseAdmin } from '@/lib/supabase'

type Body = {
  targetUserId?: string
  action?: 'pause' | 'resume' | 'remove' | 'activate'
  /** Dias a partir da ativação; omitir ou `null` = sem data de fim. */
  accessDays?: number | null
}

function publicAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION?.replace(/\/$/, '') ||
    'https://www.ylada.com'
  )
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
  if (!['pause', 'resume', 'remove', 'activate'].includes(action)) {
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

  const state = (row.team_access_state as string) ?? 'active'

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

  if (action === 'activate') {
    if (state !== 'pending_activation') {
      return NextResponse.json(
        { error: 'Só é possível usar «Ativar» quando o membro ainda aguarda a primeira liberação do acesso.' },
        { status: 400 }
      )
    }

    let expiresAt: string | null = null
    const rawDays = body.accessDays
    if (rawDays !== undefined && rawDays !== null) {
      if (typeof rawDays !== 'number' || !Number.isFinite(rawDays)) {
        return NextResponse.json({ error: 'accessDays inválido.' }, { status: 400 })
      }
      const d = Math.floor(rawDays)
      if (d < 1 || d > 3660) {
        return NextResponse.json(
          { error: 'Indique entre 1 e 3660 dias de validade, ou deixe em branco para acesso sem data de fim.' },
          { status: 400 }
        )
      }
      const until = new Date()
      until.setDate(until.getDate() + d)
      expiresAt = until.toISOString()
    }

    const { error: updErr } = await supabaseAdmin
      .from('leader_tenant_members')
      .update({ team_access_state: 'active', team_access_expires_at: expiresAt })
      .eq('id', row.id as string)
      .eq('leader_tenant_id', ctx.tenant.id)
      .eq('role', 'member')

    if (updErr) {
      console.error('[pro-lideres/equipe/members/access activate]', updErr)
      return NextResponse.json({ error: 'Não foi possível ativar o acesso.' }, { status: 500 })
    }

    const { data: prof } = await supabaseAdmin
      .from('user_profiles')
      .select('nome_completo, email')
      .eq('user_id', targetUserId)
      .maybeSingle()

    const nome = (prof?.nome_completo as string | undefined)?.trim()
    const email = (prof?.email as string | undefined)?.trim()
    const saudacao = nome || email || 'Olá'
    const base = publicAppBaseUrl()
    const validadeTexto = expiresAt
      ? `Acesso válido até ${new Date(expiresAt).toLocaleDateString('pt-BR', { dateStyle: 'long' })}.`
      : 'Sem data de término definida para este acesso (podes combinar renovação depois).'

    const copyMessage =
      `${saudacao}, o teu acesso ao Pro Líderes deste espaço foi ativado.\n\n` +
      `Entra em ${base}/pro-lideres/entrar com o teu e-mail e a tua palavra-passe.\n\n` +
      `${validadeTexto}`

    return NextResponse.json({ ok: true, copyMessage, accessExpiresAt: expiresAt })
  }

  if (action === 'pause') {
    if (state === 'pending_activation') {
      return NextResponse.json(
        { error: 'Este membro ainda não entrou no espaço. Podes remover o convite ou ativar após confirmares o pagamento.' },
        { status: 400 }
      )
    }
    if (state === 'paused') {
      return NextResponse.json({ error: 'Este membro já está pausado.' }, { status: 400 })
    }
    if (state !== 'active') {
      return NextResponse.json({ error: 'Estado inválido para pausar.' }, { status: 400 })
    }

    const { error: updErr } = await supabaseAdmin
      .from('leader_tenant_members')
      .update({ team_access_state: 'paused' })
      .eq('id', row.id as string)
      .eq('leader_tenant_id', ctx.tenant.id)
      .eq('role', 'member')

    if (updErr) {
      console.error('[pro-lideres/equipe/members/access pause]', updErr)
      return NextResponse.json({ error: 'Não foi possível atualizar o acesso.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  if (action === 'resume') {
    if (state !== 'paused') {
      return NextResponse.json({ error: 'Só é possível retomar quem está pausado.' }, { status: 400 })
    }

    const { error: updErr } = await supabaseAdmin
      .from('leader_tenant_members')
      .update({ team_access_state: 'active' })
      .eq('id', row.id as string)
      .eq('leader_tenant_id', ctx.tenant.id)
      .eq('role', 'member')

    if (updErr) {
      console.error('[pro-lideres/equipe/members/access resume]', updErr)
      return NextResponse.json({ error: 'Não foi possível atualizar o acesso.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Ação não suportada.' }, { status: 400 })
}
