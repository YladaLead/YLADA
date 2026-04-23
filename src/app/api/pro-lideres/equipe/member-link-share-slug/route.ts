/**
 * PATCH /api/pro-lideres/equipe/member-link-share-slug
 * Body: { ylada_link_id: string, share_path_slug: string | null }
 * O membro define o segmento opcional em /l/[slug]/[share_path_slug] (único por link).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import {
  parseProLideresMemberSharePathSlug,
  resolveProLideresMemberLinkAttribution,
} from '@/lib/pro-lideres-member-link-tokens-resolve'

export async function PATCH(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
  const linkId = typeof body.ylada_link_id === 'string' ? body.ylada_link_id.trim() : ''
  if (!linkId) {
    return NextResponse.json({ error: 'ylada_link_id é obrigatório' }, { status: 400 })
  }

  const parsed = parseProLideresMemberSharePathSlug(body.share_path_slug)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  if (parsed.value && /^[a-f0-9]{32}$/i.test(parsed.value)) {
    return NextResponse.json(
      { error: 'Esse formato é reservado ao token interno. Escolhe outro slug (ex.: o-teu-nome).' },
      { status: 400 }
    )
  }

  const { tenant } = paid.ctx
  const ownerId = tenant.owner_user_id

  const { data: ylLink, error: linkErr } = await supabaseAdmin
    .from('ylada_links')
    .select('id, slug, user_id, status')
    .eq('id', linkId)
    .maybeSingle()

  if (linkErr || !ylLink || ylLink.user_id !== ownerId || ylLink.status !== 'active') {
    return NextResponse.json({ error: 'Link não encontrado ou não pertence ao líder deste espaço.' }, { status: 404 })
  }

  const { data: row, error: rowErr } = await supabaseAdmin
    .from('pro_lideres_member_link_tokens')
    .select('id, token')
    .eq('leader_tenant_id', tenant.id)
    .eq('ylada_link_id', linkId)
    .eq('member_user_id', user.id)
    .maybeSingle()

  if (rowErr || !row) {
    return NextResponse.json(
      { error: 'Ainda não tens token neste link — pede ao líder para gerar em Análise da equipe.' },
      { status: 404 }
    )
  }

  if (parsed.value) {
    const collision = await resolveProLideresMemberLinkAttribution(supabaseAdmin, linkId, parsed.value)
    if (collision && collision.token !== (row.token as string)) {
      return NextResponse.json({ error: 'Este slug já está a ser usado neste link.' }, { status: 409 })
    }
  }

  const { error: updErr } = await supabaseAdmin
    .from('pro_lideres_member_link_tokens')
    .update({ share_path_slug: parsed.value })
    .eq('id', row.id as string)

  if (updErr) {
    if (updErr.code === '23505') {
      return NextResponse.json({ error: 'Este slug já está a ser usado neste link.' }, { status: 409 })
    }
    console.error('[member-link-share-slug]', updErr)
    return NextResponse.json({ error: 'Não foi possível guardar.' }, { status: 500 })
  }

  const slug = (ylLink.slug as string)?.trim() || ''
  const pathSeg = parsed.value || (row.token as string)
  const host = request.headers.get('host') || ''
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const base = host ? `${protocol}://${host}`.replace(/\/$/, '') : ''
  const shareUrl = base && slug ? `${base}/l/${encodeURIComponent(slug)}/${encodeURIComponent(pathSeg)}` : null

  return NextResponse.json({
    success: true,
    sharePathSlug: parsed.value,
    shareUrl,
  })
}
