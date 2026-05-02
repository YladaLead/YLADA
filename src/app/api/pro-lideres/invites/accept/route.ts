import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { normalizeInviteEmail } from '@/lib/pro-lideres-invite-helpers'
import { ownerHasProLideresTeamSubscription } from '@/lib/pro-lideres-subscription-access'
import { loadValidPendingProLideresInvite } from '@/lib/pro-lideres-invite-server'
import type { LeaderTenantInviteRow } from '@/types/leader-tenant'
import { parseProLideresMemberSharePathSlug } from '@/lib/pro-lideres-member-link-tokens-resolve'
import {
  isProLideresShareSlugTakenInTenant,
  syncProLideresMemberLinkTokensShareSlug,
  whatsappMeetsProLideresMandatory,
} from '@/lib/pro-lideres-member-mandatory-profile'
import { isProLideresTabulatorNameOption } from '@/config/pro-lideres-tabulator-names'

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: {
    token?: string
    nome_completo?: string
    whatsapp?: string
    pro_lideres_share_slug?: string
    pro_lideres_tabulator_name?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const token = body.token?.trim()
  if (!token) {
    return NextResponse.json({ error: 'Token é obrigatório' }, { status: 400 })
  }

  const nomeOpt = body.nome_completo?.trim()
  const whatsappOpt = body.whatsapp?.trim()
  const slugInput = body.pro_lideres_share_slug

  const sessionEmail = normalizeInviteEmail(user.email ?? '')
  if (!sessionEmail) {
    return NextResponse.json({ error: 'Sessão sem e-mail.' }, { status: 400 })
  }

  const { data: invite, error: fetchErr } = await supabaseAdmin
    .from('leader_tenant_invites')
    .select('*')
    .eq('token', token)
    .maybeSingle()

  if (fetchErr || !invite) {
    return NextResponse.json({ error: 'Convite inválido.' }, { status: 404 })
  }

  const inv = invite as LeaderTenantInviteRow

  if (inv.status === 'used' && inv.used_by_user_id === user.id) {
    if (nomeOpt || whatsappOpt) {
      const patch: Record<string, string> = {}
      if (nomeOpt && nomeOpt.length >= 2) patch.nome_completo = nomeOpt
      if (whatsappOpt && whatsappMeetsProLideresMandatory(whatsappOpt)) patch.whatsapp = whatsappOpt
      if (Object.keys(patch).length > 0) {
        patch.updated_at = new Date().toISOString()
        await supabaseAdmin.from('user_profiles').update(patch).eq('user_id', user.id)
      }
    }
    return NextResponse.json({ ok: true, alreadyAccepted: true })
  }
  if (inv.status === 'used' || inv.used_at) {
    return NextResponse.json({ error: 'Este convite já foi utilizado.' }, { status: 400 })
  }

  const loaded = await loadValidPendingProLideresInvite(supabaseAdmin, token)
  if (!loaded.ok) {
    const msg =
      loaded.reason === 'revoked'
        ? 'Este convite foi revogado.'
        : loaded.reason === 'expired'
          ? 'Este convite expirou.'
          : 'Convite indisponível.'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  if (normalizeInviteEmail(loaded.invite.invited_email) !== sessionEmail) {
    return NextResponse.json(
      {
        error: 'Entre com a conta do e-mail convidado. O convite foi enviado para outro endereço.',
      },
      { status: 403 }
    )
  }

  const { data: tenant } = await supabaseAdmin
    .from('leader_tenants')
    .select('id, owner_user_id, team_bank_payment_url')
    .eq('id', inv.leader_tenant_id)
    .maybeSingle()

  if (!tenant) {
    return NextResponse.json({ error: 'Espaço não encontrado.' }, { status: 404 })
  }

  if (!(await ownerHasProLideresTeamSubscription(tenant.owner_user_id as string))) {
    return NextResponse.json(
      {
        error: 'A assinatura YLADA deste espaço está inativa. Não é possível aceitar o convite neste momento.',
        code: 'pro_lideres_team_subscription_required',
      },
      { status: 402 }
    )
  }

  if (tenant.owner_user_id === user.id) {
    return NextResponse.json({ error: 'Você já é o líder deste espaço.' }, { status: 400 })
  }

  const { data: existingMember } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('id')
    .eq('leader_tenant_id', inv.leader_tenant_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingMember) {
    return NextResponse.json({ ok: true, alreadyMember: true })
  }

  if (!nomeOpt || nomeOpt.length < 2) {
    return NextResponse.json({ error: 'Indica o nome completo.' }, { status: 400 })
  }
  if (!whatsappOpt || !whatsappMeetsProLideresMandatory(whatsappOpt)) {
    return NextResponse.json(
      { error: 'Indica o WhatsApp com DDI e número completo (mínimo 10 dígitos no total).' },
      { status: 400 }
    )
  }
  const tabulator = body.pro_lideres_tabulator_name?.trim() ?? ''
  if (!tabulator || !isProLideresTabulatorNameOption(tabulator)) {
    return NextResponse.json({ error: 'Seleciona o nome do tabulador na lista.' }, { status: 400 })
  }

  const slugRes = parseProLideresMemberSharePathSlug(slugInput)
  if (!slugRes.ok) {
    return NextResponse.json({ error: slugRes.error }, { status: 400 })
  }
  if (!slugRes.value) {
    return NextResponse.json({ error: 'Escolhe o teu slug de divulgação (obrigatório).' }, { status: 400 })
  }
  if (/^[a-f0-9]{32}$/i.test(slugRes.value)) {
    return NextResponse.json(
      { error: 'Esse formato é reservado ao sistema. Escolhe outro slug (ex.: o-teu-nome).' },
      { status: 400 }
    )
  }

  const slugTaken = await isProLideresShareSlugTakenInTenant(
    supabaseAdmin,
    inv.leader_tenant_id as string,
    slugRes.value,
    user.id
  )
  if (slugTaken) {
    return NextResponse.json(
      { error: 'Já existe alguém nesta equipe com este slug. Escolhe outro.' },
      { status: 409 }
    )
  }

  const { error: insErr } = await supabaseAdmin.from('leader_tenant_members').insert({
    leader_tenant_id: inv.leader_tenant_id,
    user_id: user.id,
    role: 'member',
    pro_lideres_share_slug: slugRes.value,
    pro_lideres_tabulator_name: tabulator,
  })

  if (insErr) {
    if (insErr.code === '23505') {
      return NextResponse.json(
        { error: 'Já existe alguém nesta equipe com este slug. Volte atrás e escolha outro.' },
        { status: 409 }
      )
    }
    console.error('[pro-lideres/invites/accept insert member]', insErr)
    return NextResponse.json({ error: 'Não foi possível adicionar à equipe.' }, { status: 500 })
  }

  const now = new Date()
  const { error: updErr } = await supabaseAdmin
    .from('leader_tenant_invites')
    .update({
      status: 'used',
      used_at: now.toISOString(),
      used_by_user_id: user.id,
    })
    .eq('id', inv.id)
    .eq('status', 'pending')

  if (updErr) {
    console.error('[pro-lideres/invites/accept mark used]', updErr)
  }

  const patch: Record<string, string | null> = { updated_at: now.toISOString() }
  if (nomeOpt && nomeOpt.length >= 2) patch.nome_completo = nomeOpt
  if (whatsappOpt && whatsappMeetsProLideresMandatory(whatsappOpt)) patch.whatsapp = whatsappOpt
  if (Object.keys(patch).length > 1) {
    await supabaseAdmin.from('user_profiles').update(patch).eq('user_id', user.id)
  }

  await syncProLideresMemberLinkTokensShareSlug(
    supabaseAdmin,
    inv.leader_tenant_id as string,
    user.id,
    slugRes.value
  )

  const teamBankPaymentUrl =
    typeof tenant?.team_bank_payment_url === 'string' && tenant.team_bank_payment_url.trim()
      ? tenant.team_bank_payment_url.trim()
      : null

  return NextResponse.json({ ok: true, teamBankPaymentUrl })
}
