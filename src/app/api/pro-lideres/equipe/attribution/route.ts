/**
 * GET /api/pro-lideres/equipe/attribution?link_id=UUID&ensure=1
 * Só o dono do tenant (líder). Lista membros com URL rastreada (?pl_m=), visualizações e cliques WhatsApp.
 * ensure=1 cria tokens em falta em pro_lideres_member_link_tokens.
 */
import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'

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
  }

  const { data: tokenRows } = await supabaseAdmin
    .from('pro_lideres_member_link_tokens')
    .select('member_user_id, token')
    .eq('leader_tenant_id', tenantId)
    .eq('ylada_link_id', linkId)

  const tokenByMember = new Map<string, string>()
  for (const tr of tokenRows ?? []) {
    tokenByMember.set(tr.member_user_id as string, tr.token as string)
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

  const { data: profiles } = await supabaseAdmin.from('user_profiles').select('id, nome_completo, email').in('id', ids)

  const profileById = new Map((profiles ?? []).map((p) => [p.id as string, p]))
  const roleByUser = new Map<string, string>()
  roleByUser.set(ownerId, 'leader')
  for (const r of memberRows ?? []) {
    roleByUser.set(r.user_id as string, (r.role as string) || 'member')
  }

  const members = ids.map((uid) => {
    const p = profileById.get(uid)
    const tok = tokenByMember.get(uid)
    const st = stats.get(uid) ?? { views: 0, whatsapp: 0 }
    const path = `/l/${ylLink.slug as string}${tok ? `?pl_m=${encodeURIComponent(tok)}` : ''}`
    const shareUrl = base ? `${base.replace(/\/$/, '')}${path}` : path
    return {
      userId: uid,
      role: roleByUser.get(uid) === 'leader' ? 'leader' : 'member',
      displayName: (p?.nome_completo as string | null)?.trim() || null,
      email: (p?.email as string | null)?.trim() || null,
      token: tok ?? null,
      shareUrl: tok ? shareUrl : null,
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
