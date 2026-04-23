/**
 * GET /api/pro-lideres/equipe/attribution?link_id=UUID&ensure=1
 * Só o dono do tenant (líder). Lista membros com URL rastreada (/l/[slug]/[segmento] ou ?pl_m=), views e cliques WhatsApp.
 * ensure=1 cria tokens em falta em pro_lideres_member_link_tokens.
 */
import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

const CATALOG_TYPES = new Set(['calculator', 'diagnostico', 'quiz', 'triagem'])

function genToken(): string {
  return randomBytes(16).toString('hex')
}

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder vê métricas por membro da equipe.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  const linkId = request.nextUrl.searchParams.get('link_id')?.trim()
  if (!linkId) {
    return NextResponse.json({ error: 'link_id é obrigatório' }, { status: 400 })
  }

  const ensure = request.nextUrl.searchParams.get('ensure') === '1'

  const { data: ylLink, error: linkErr } = await supabaseAdmin
    .from('ylada_links')
    .select('id, slug, title, template_id, user_id')
    .eq('id', linkId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (linkErr || !ylLink) {
    return NextResponse.json({ error: 'Link não encontrado ou não é teu.' }, { status: 404 })
  }

  if (ylLink.template_id) {
    const { data: tpl } = await supabaseAdmin
      .from('ylada_link_templates')
      .select('type')
      .eq('id', ylLink.template_id)
      .maybeSingle()
    const ty = tpl?.type as string | undefined
    if (ty && !CATALOG_TYPES.has(ty)) {
      return NextResponse.json({ error: 'Este tipo de link não entra no catálogo Pro Líderes.' }, { status: 400 })
    }
  }

  const tenantId = ctx.tenant.id
  const ownerId = ctx.tenant.owner_user_id

  const { data: memberRows } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('user_id, role')
    .eq('leader_tenant_id', tenantId)

  const memberIds = new Set<string>([ownerId])
  for (const r of memberRows ?? []) {
    memberIds.add(r.user_id as string)
  }
  const ids = [...memberIds]

  if (ensure) {
    const { data: existing } = await supabaseAdmin
      .from('pro_lideres_member_link_tokens')
      .select('member_user_id')
      .eq('leader_tenant_id', tenantId)
      .eq('ylada_link_id', linkId)

    const have = new Set((existing ?? []).map((e) => e.member_user_id as string))
    for (const mid of ids) {
      if (have.has(mid)) continue
      let inserted = false
      for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
        const token = genToken()
        const { error: insErr } = await supabaseAdmin.from('pro_lideres_member_link_tokens').insert({
          leader_tenant_id: tenantId,
          member_user_id: mid,
          ylada_link_id: linkId,
          token,
        })
        if (!insErr) inserted = true
      }
    }

    const { data: tokensForSlug } = await supabaseAdmin
      .from('pro_lideres_member_link_tokens')
      .select('id, member_user_id, share_path_slug')
      .eq('leader_tenant_id', tenantId)
      .eq('ylada_link_id', linkId)

    const { data: memSlugRows } = await supabaseAdmin
      .from('leader_tenant_members')
      .select('user_id, pro_lideres_share_slug')
      .eq('leader_tenant_id', tenantId)

    const defaultSlugByUser = new Map<string, string>()
    for (const m of memSlugRows ?? []) {
      const raw = (m as { pro_lideres_share_slug?: string | null }).pro_lideres_share_slug
      const s = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
      if (s && !/^[a-f0-9]{32}$/i.test(s)) {
        defaultSlugByUser.set(m.user_id as string, s)
      }
    }

    for (const tr of tokensForSlug ?? []) {
      if ((tr as { share_path_slug?: string | null }).share_path_slug) continue
      const mid = tr.member_user_id as string
      const s = defaultSlugByUser.get(mid)
      if (!s) continue
      const { error: slugUpdErr } = await supabaseAdmin
        .from('pro_lideres_member_link_tokens')
        .update({ share_path_slug: s })
        .eq('id', tr.id as string)
      if (slugUpdErr?.code === '23505') {
        /* colisão rara neste link — mantém null */
      }
    }
  }

  const { data: tokenRows } = await supabaseAdmin
    .from('pro_lideres_member_link_tokens')
    .select('member_user_id, token, share_path_slug')
    .eq('leader_tenant_id', tenantId)
    .eq('ylada_link_id', linkId)

  const tokenByMember = new Map<string, string>()
  const pathSlugByMember = new Map<string, string | null>()
  for (const tr of tokenRows ?? []) {
    tokenByMember.set(tr.member_user_id as string, tr.token as string)
    const ps = (tr as { share_path_slug?: string | null }).share_path_slug
    pathSlugByMember.set(tr.member_user_id as string, typeof ps === 'string' && ps.trim() ? ps.trim() : null)
  }

  const host = request.headers.get('host') || ''
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const base = host ? `${protocol}://${host}` : ''

  const { data: events } = await supabaseAdmin
    .from('ylada_link_events')
    .select('event_type, utm_json')
    .eq('link_id', linkId)
    .limit(25000)

  const stats = new Map<string, { views: number; whatsapp: number }>()
  for (const e of events ?? []) {
    const uj = e.utm_json as Record<string, unknown> | null
    const mid = typeof uj?.pl_member_user_id === 'string' ? uj.pl_member_user_id : null
    if (!mid) continue
    if (!stats.has(mid)) stats.set(mid, { views: 0, whatsapp: 0 })
    const s = stats.get(mid)!
    if (e.event_type === 'view') s.views += 1
    if (e.event_type === 'cta_click') s.whatsapp += 1
  }

  const { data: profiles } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, nome_completo, email')
    .in('user_id', ids)

  const profileById = new Map((profiles ?? []).map((p) => [p.user_id as string, p]))
  const roleByUser = new Map<string, string>()
  roleByUser.set(ownerId, 'leader')
  for (const r of memberRows ?? []) {
    roleByUser.set(r.user_id as string, (r.role as string) || 'member')
  }

  const members = ids.map((uid) => {
    const p = profileById.get(uid)
    const tok = tokenByMember.get(uid)
    const pathSlug = pathSlugByMember.get(uid) ?? null
    const st = stats.get(uid) ?? { views: 0, whatsapp: 0 }
    const pathSeg = (pathSlug && pathSlug.trim()) || tok || ''
    const linkSlug = String(ylLink.slug || '').trim()
    const pathWithMember =
      tok && pathSeg && linkSlug
        ? `/l/${encodeURIComponent(linkSlug)}/${encodeURIComponent(pathSeg)}`
        : ''
    const pathLegacy =
      tok && linkSlug ? `/l/${encodeURIComponent(linkSlug)}?pl_m=${encodeURIComponent(tok)}` : ''
    const shareUrl =
      pathWithMember && (base ? `${base.replace(/\/$/, '')}${pathWithMember}` : pathWithMember)
    const shareUrlLegacyQuery =
      pathLegacy && (base ? `${base.replace(/\/$/, '')}${pathLegacy}` : pathLegacy)
    return {
      userId: uid,
      role: roleByUser.get(uid) === 'leader' ? 'leader' : 'member',
      displayName: (p?.nome_completo as string | null)?.trim() || null,
      email: (p?.email as string | null)?.trim() || null,
      token: tok ?? null,
      sharePathSlug: pathSlug,
      shareUrl: tok ? shareUrl : null,
      shareUrlLegacyQuery: tok ? shareUrlLegacyQuery : null,
      views: st.views,
      whatsappClicks: st.whatsapp,
    }
  })

  members.sort((a, b) => {
    if (a.role !== b.role) return a.role === 'leader' ? -1 : 1
    return (a.displayName || a.email || a.userId).localeCompare(b.displayName || b.email || b.userId, 'pt')
  })

  return NextResponse.json({
    linkId: ylLink.id,
    slug: ylLink.slug,
    title: (ylLink.title as string)?.trim() || (ylLink.slug as string),
    verticalCode: (ctx.tenant.vertical_code ?? 'h-lider').trim() || 'h-lider',
    members,
  })
}
