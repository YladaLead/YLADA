/**
 * PATCH /api/pro-lideres/equipe/member-mandatory-profile
 * Membro completa slug de divulgação + WhatsApp (obrigatórios para usar o painel).
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
    return NextResponse.json({ error: 'Apenas membros da equipe usam este formulário.' }, { status: 403 })
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const whatsappRaw = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : ''
  const slugParsed = parseProLideresMemberSharePathSlug(body.pro_lideres_share_slug)

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
    return NextResponse.json({ error: 'Escolhe o teu slug de divulgação (3 a 40 caracteres).' }, { status: 400 })
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
    console.error('[member-mandatory-profile] member update', memErr)
    return NextResponse.json({ error: 'Não foi possível guardar o slug.' }, { status: 500 })
  }

  const now = new Date().toISOString()
  const { error: profErr } = await supabaseAdmin
    .from('user_profiles')
    .update({ whatsapp: whatsappRaw, updated_at: now })
    .eq('user_id', user.id)

  if (profErr) {
    console.error('[member-mandatory-profile] profile', profErr)
    return NextResponse.json({ error: 'Não foi possível guardar o WhatsApp.' }, { status: 500 })
  }

  await syncProLideresMemberLinkTokensShareSlug(supabaseAdmin, tenantId, user.id, slugParsed.value)

  return NextResponse.json({ ok: true })
}
