/**
 * GET /api/pro-lideres/equipe/my-share-link?ylada_link_id=UUID
 * Membro (ou líder) no tenant: estado do link pessoal público + URL com slug/token.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { isProLideresYladaLinkVisibleToTeamInCatalog } from '@/lib/pro-lideres-ylada-catalog-team-visibility'
import { fetchWhatsappE164ForUserId } from '@/lib/ylada-public-link-whatsapp'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  const linkId = request.nextUrl.searchParams.get('ylada_link_id')?.trim()
  if (!linkId) {
    return NextResponse.json({ error: 'ylada_link_id é obrigatório' }, { status: 400 })
  }

  const { tenant, role } = paid.ctx
  const tenantId = tenant.id
  const ownerId = tenant.owner_user_id

  const { data: ylLink, error: linkErr } = await supabaseAdmin
    .from('ylada_links')
    .select('id, slug, title, user_id, status')
    .eq('id', linkId)
    .maybeSingle()

  if (linkErr || !ylLink || ylLink.user_id !== ownerId || ylLink.status !== 'active') {
    return NextResponse.json({ error: 'Link não encontrado ou não disponível neste espaço.' }, { status: 404 })
  }

  const visibleInCatalog = await isProLideresYladaLinkVisibleToTeamInCatalog(supabaseAdmin, tenantId, linkId)

  const { data: tokRow } = await supabaseAdmin
    .from('pro_lideres_member_link_tokens')
    .select('token, share_path_slug')
    .eq('leader_tenant_id', tenantId)
    .eq('ylada_link_id', linkId)
    .eq('member_user_id', user.id)
    .maybeSingle()

  const tokenReady = Boolean(tokRow?.token)
  const sharePathSlug = (tokRow?.share_path_slug as string | null)?.trim() || null
  const pathSeg = sharePathSlug || (tokRow?.token as string | undefined) || null

  const host = request.headers.get('host') || ''
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const base = host ? `${protocol}://${host}`.replace(/\/$/, '') : ''
  const slug = (ylLink.slug as string)?.trim() || ''
  const shareUrl =
    base && pathSeg && slug ? `${base}/l/${encodeURIComponent(slug)}/${encodeURIComponent(pathSeg)}` : null

  const whatsappReady = Boolean(await fetchWhatsappE164ForUserId(supabaseAdmin, user.id))

  return NextResponse.json({
    role,
    linkId: ylLink.id,
    leaderSlug: slug,
    visibleInCatalog,
    tokenReady,
    sharePathSlug,
    shareUrl,
    whatsappReady,
    hint: !tokenReady
      ? 'O teu link pessoal ainda não está pronto — pede à equipa para concluírem a configuração em Análise da equipe → Atribuição por membro (Gerar tokens).'
      : !visibleInCatalog && role !== 'leader'
        ? 'Esta ferramenta está oculta no catálogo da equipa — confirma com a operação.'
        : !whatsappReady
          ? 'Completa o teu WhatsApp no perfil YLADA para o botão de conversa usar o teu número.'
          : null,
  })
}
