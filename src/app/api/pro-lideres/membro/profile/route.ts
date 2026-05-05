/**
 * PATCH /api/pro-lideres/membro/profile
 * Membro edita nome, e-mail, WhatsApp e slug de divulgação (cadastro próprio).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { parseProLideresMemberSharePathSlug } from '@/lib/pro-lideres-member-link-tokens-resolve'
import {
  isProLideresShareSlugTakenInTenant,
  syncProLideresMemberLinkTokensShareSlug,
  whatsappMeetsProLideresMandatory,
} from '@/lib/pro-lideres-member-mandatory-profile'
import { isValidInviteEmail, normalizeInviteEmail } from '@/lib/pro-lideres-invite-helpers'
import { fetchProLideresViewerTenantOverlayForNonOwner } from '@/lib/pro-lideres-server'

const MAX_NOME = 500

export async function PATCH(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  if (paid.ctx.role !== 'member') {
    return NextResponse.json({ error: 'Apenas membros da equipe podem usar esta rota.' }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const nomeRaw =
    (typeof body.nome_completo === 'string'
      ? body.nome_completo
      : typeof body.display_name === 'string'
        ? body.display_name
        : ''
    ).trim()
  const nomeCompleto = nomeRaw.slice(0, MAX_NOME)

  const emailRaw = normalizeInviteEmail(typeof body.contact_email === 'string' ? body.contact_email : '')
  const whatsappRaw = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : ''
  const slugParsed = parseProLideresMemberSharePathSlug(body.pro_lideres_share_slug)

  if (!nomeCompleto) {
    return NextResponse.json({ error: 'Indica o nome para exibição.' }, { status: 400 })
  }
  if (!emailRaw || !isValidInviteEmail(emailRaw)) {
    return NextResponse.json({ error: 'Indica um e-mail de contacto válido.' }, { status: 400 })
  }
  if (!whatsappMeetsProLideresMandatory(whatsappRaw)) {
    return NextResponse.json(
      { error: 'Indica um WhatsApp com DDI e número completo (mínimo 10 dígitos no total).' },
      { status: 400 }
    )
  }
  if (!slugParsed.ok) {
    return NextResponse.json({ error: slugParsed.error }, { status: 400 })
  }
  if (!slugParsed.value) {
    return NextResponse.json({ error: 'Indica o slug de divulgação (3 a 40 caracteres).' }, { status: 400 })
  }
  if (/^[a-f0-9]{32}$/i.test(slugParsed.value)) {
    return NextResponse.json(
      { error: 'Esse formato é reservado ao sistema. Escolhe outro slug (ex.: o-teu-nome).' },
      { status: 400 }
    )
  }

  const tenantId = paid.ctx.tenant.id
  const taken = await isProLideresShareSlugTakenInTenant(supabaseAdmin, tenantId, slugParsed.value, user.id)
  if (taken) {
    return NextResponse.json({ error: 'Já existe alguém na equipe com este slug. Escolhe outro.' }, { status: 409 })
  }

  const now = new Date().toISOString()

  const { error: profErr } = await supabaseAdmin
    .from('user_profiles')
    .update({
      nome_completo: nomeCompleto,
      email: emailRaw,
      whatsapp: whatsappRaw,
      updated_at: now,
    })
    .eq('user_id', user.id)

  if (profErr) {
    console.error('[membro/profile] user_profiles', profErr)
    return NextResponse.json({ error: 'Não foi possível guardar o perfil.' }, { status: 500 })
  }

  const { error: memErr } = await supabaseAdmin
    .from('leader_tenant_members')
    .update({ pro_lideres_share_slug: slugParsed.value })
    .eq('leader_tenant_id', tenantId)
    .eq('user_id', user.id)
    .eq('role', 'member')

  if (memErr) {
    if (memErr.code === '23505') {
      return NextResponse.json({ error: 'Já existe alguém na equipe com este slug. Escolhe outro.' }, { status: 409 })
    }
    console.error('[membro/profile] leader_tenant_members', memErr)
    return NextResponse.json({ error: 'Não foi possível guardar o slug.' }, { status: 500 })
  }

  await syncProLideresMemberLinkTokensShareSlug(supabaseAdmin, tenantId, user.id, slugParsed.value)

  const overlay = await fetchProLideresViewerTenantOverlayForNonOwner(supabaseAdmin, user, tenantId)
  return NextResponse.json({
    ok: true,
    viewerDisplayName: overlay.displayName,
    viewerContactEmail: overlay.contactEmail,
    viewerWhatsapp: overlay.whatsapp,
    memberShareSlug: overlay.memberShareSlug,
  })
}
