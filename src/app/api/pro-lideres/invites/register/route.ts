import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { loadValidPendingProLideresInvite } from '@/lib/pro-lideres-invite-server'
import { normalizeInviteEmail } from '@/lib/pro-lideres-invite-helpers'
import { generateAvailableUserSlug } from '@/lib/user-slug-generator'
import { ownerHasProLideresTeamSubscription } from '@/lib/pro-lideres-subscription-access'
import type { LeaderTenantInviteRow } from '@/types/leader-tenant'
import { parseProLideresMemberSharePathSlug } from '@/lib/pro-lideres-member-link-tokens-resolve'
import {
  isProLideresShareSlugTakenInTenant,
  syncProLideresMemberLinkTokensShareSlug,
  whatsappMeetsProLideresMandatory,
} from '@/lib/pro-lideres-member-mandatory-profile'
import { resolveCanonicalTabulatorLabelForTenant } from '@/lib/pro-lideres-tabulators'

/**
 * Público: cria conta com o e-mail do convite, grava nome/WhatsApp no perfil, entra na equipe e marca o convite como usado.
 */
export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: {
    token?: string
    nome_completo?: string
    whatsapp?: string
    password?: string
    pro_lideres_share_slug?: string
    pro_lideres_tabulator_name?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const token = body.token?.trim()
  const nomeCompleto = body.nome_completo?.trim() ?? ''
  const whatsapp = body.whatsapp?.trim() ?? ''
  const password = body.password ?? ''

  if (!token) {
    return NextResponse.json({ error: 'Token é obrigatório' }, { status: 400 })
  }
  if (nomeCompleto.length < 2) {
    return NextResponse.json({ error: 'Informe o nome completo.' }, { status: 400 })
  }
  if (!whatsappMeetsProLideresMandatory(whatsapp)) {
    return NextResponse.json(
      { error: 'Informe o WhatsApp com DDI e número completo (mínimo 10 dígitos no total).' },
      { status: 400 }
    )
  }

  const tabulatorRaw = body.pro_lideres_tabulator_name?.trim() ?? ''

  const slugRes = parseProLideresMemberSharePathSlug(body.pro_lideres_share_slug)
  if (!slugRes.ok) {
    return NextResponse.json({ error: slugRes.error }, { status: 400 })
  }
  if (!slugRes.value) {
    return NextResponse.json({ error: 'Escolha o slug de divulgação (obrigatório).' }, { status: 400 })
  }
  if (/^[a-f0-9]{32}$/i.test(slugRes.value)) {
    return NextResponse.json(
      { error: 'Esse formato é reservado ao sistema. Escolha outro slug (ex.: seu-nome).' },
      { status: 400 }
    )
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 })
  }

  const loaded = await loadValidPendingProLideresInvite(supabaseAdmin, token)
  if (!loaded.ok) {
    const msg =
      loaded.reason === 'used'
        ? 'Este convite já foi utilizado.'
        : loaded.reason === 'expired'
          ? 'Este convite expirou.'
          : loaded.reason === 'revoked'
            ? 'Este convite foi revogado.'
            : 'Convite inválido.'
    return NextResponse.json({ error: msg }, { status: loaded.status === 404 ? 404 : 400 })
  }

  const inv = loaded.invite as LeaderTenantInviteRow
  const email = normalizeInviteEmail(inv.invited_email)

  const { data: tenant } = await supabaseAdmin
    .from('leader_tenants')
    .select('id, owner_user_id, team_bank_payment_url, team_bank_pix_payment_url')
    .eq('id', inv.leader_tenant_id)
    .maybeSingle()

  if (!tenant) {
    return NextResponse.json({ error: 'Espaço não encontrado.' }, { status: 404 })
  }

  if (!(await ownerHasProLideresTeamSubscription(tenant.owner_user_id as string))) {
    return NextResponse.json(
      {
        error: 'A assinatura YLADA deste espaço está inativa. Não é possível concluir o cadastro neste momento.',
        code: 'pro_lideres_team_subscription_required',
      },
      { status: 402 }
    )
  }

  const slugTaken = await isProLideresShareSlugTakenInTenant(
    supabaseAdmin,
    inv.leader_tenant_id as string,
    slugRes.value,
    null
  )
  if (slugTaken) {
    return NextResponse.json(
      { error: 'Já existe alguém nesta equipe com este slug. Escolha outro.' },
      { status: 409 }
    )
  }

  if (!tabulatorRaw) {
    return NextResponse.json({ error: 'Selecione o nome do tabulador na lista.' }, { status: 400 })
  }
  const canonicalTabulator = await resolveCanonicalTabulatorLabelForTenant(
    supabaseAdmin,
    inv.leader_tenant_id as string,
    tabulatorRaw
  )
  if (!canonicalTabulator) {
    return NextResponse.json({ error: 'Selecione um tabulador válido da lista.' }, { status: 400 })
  }

  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name: nomeCompleto,
      full_name: nomeCompleto,
      perfil: 'ylada',
    },
  })

  if (createError || !newUser.user) {
    console.error('[pro-lideres/invites/register createUser]', createError)
    const em = (createError?.message ?? '').toLowerCase()
    const dup =
      em.includes('already') ||
      em.includes('registered') ||
      em.includes('exists') ||
      createError?.status === 422
    if (dup) {
      return NextResponse.json(
        {
          error:
            'Já existe uma conta com este e-mail. Use "Entrar para aceitar" e depois confirme o convite com sua senha.',
        },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Não foi possível criar a conta. Tente novamente.' }, { status: 500 })
  }

  const userId = newUser.user.id
  const userSlug = await generateAvailableUserSlug(nomeCompleto)

  const { error: profileError } = await supabaseAdmin.from('user_profiles').upsert(
    {
      user_id: userId,
      email,
      nome_completo: nomeCompleto,
      whatsapp: whatsapp || null,
      perfil: 'ylada',
      user_slug: userSlug || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (profileError) {
    console.error('[pro-lideres/invites/register profile]', profileError)
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: 'Não foi possível concluir o perfil. Tente novamente.' }, { status: 500 })
  }

  const { error: insErr } = await supabaseAdmin.from('leader_tenant_members').insert({
    leader_tenant_id: inv.leader_tenant_id,
    user_id: userId,
    role: 'member',
    pro_lideres_share_slug: slugRes.value,
    pro_lideres_tabulator_name: canonicalTabulator,
  })

  if (insErr) {
    console.error('[pro-lideres/invites/register member]', insErr)
    await supabaseAdmin.auth.admin.deleteUser(userId)
    if (insErr.code === '23505') {
      return NextResponse.json(
        {
          error:
            'Este slug já está em uso nesta equipe ou não foi possível concluir o cadastro. Escolha outro slug e tente novamente.',
        },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Não foi possível adicionar à equipe.' }, { status: 500 })
  }

  const now = new Date().toISOString()
  const { error: updErr } = await supabaseAdmin
    .from('leader_tenant_invites')
    .update({
      status: 'used',
      used_at: now,
      used_by_user_id: userId,
    })
    .eq('id', inv.id)
    .eq('status', 'pending')

  if (updErr) {
    console.error('[pro-lideres/invites/register mark used]', updErr)
  }

  await syncProLideresMemberLinkTokensShareSlug(
    supabaseAdmin,
    inv.leader_tenant_id as string,
    userId,
    slugRes.value
  )

  const teamBankPaymentUrl =
    typeof tenant?.team_bank_payment_url === 'string' && tenant.team_bank_payment_url.trim()
      ? tenant.team_bank_payment_url.trim()
      : null
  const teamBankPixPaymentUrl =
    typeof tenant?.team_bank_pix_payment_url === 'string' && tenant.team_bank_pix_payment_url.trim()
      ? tenant.team_bank_pix_payment_url.trim()
      : null

  return NextResponse.json({ ok: true, email, teamBankPaymentUrl, teamBankPixPaymentUrl })
}
