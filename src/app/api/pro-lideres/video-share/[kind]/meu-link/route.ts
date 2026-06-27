/**
 * GET /api/pro-lideres/video-share/[kind]/meu-link
 * Membro busca o próprio link único (HOM Herbalife / Início Rápido), headline e estado do WhatsApp.
 */
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import {
  fetchVideoShareConfig,
  getVideoShareDescriptor,
  isVideoShareKind,
  resolveProLideresVideoShareLinkSubject,
  buildVideoShareMemberUrl,
} from '@/lib/pro-lideres-video-share'
import { PRO_LIDERES_TEAM_PREVIEW_COOKIE } from '@/lib/pro-lideres-team-preview'
import { resolveYladaOgBaseUrlForMetadata } from '@/lib/ylada-public-link-base-url'

type RouteCtx = { params: Promise<{ kind: string }> }

export async function GET(request: NextRequest, { params }: RouteCtx) {
  const { kind } = await params
  if (!isVideoShareKind(kind)) return NextResponse.json({ error: 'Tipo inválido' }, { status: 404 })

  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) return NextResponse.json({ error: 'Serviço indisponível' }, { status: 503 })

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response
  const { ctx } = paid

  const cookieStore = await cookies()
  const leaderTeamPreview =
    ctx.role === 'leader' && cookieStore.get(PRO_LIDERES_TEAM_PREVIEW_COOKIE)?.value === '1'

  const { shareSlug, subjectUserId, leaderTeamPreview: previewMode } =
    await resolveProLideresVideoShareLinkSubject(ctx.tenant.id, ctx.tenant.owner_user_id, user.id, {
      leaderTeamPreview,
    })

  const cfg = await fetchVideoShareConfig(kind, ctx.tenant.id)
  const d = getVideoShareDescriptor(kind)

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('whatsapp, nome_completo')
    .eq('user_id', subjectUserId)
    .maybeSingle()

  const hasWhatsapp = !!((profile?.whatsapp as string | null)?.trim())

  let shareUrl: string | null = null
  if (shareSlug) {
    const baseUrl = await resolveYladaOgBaseUrlForMetadata()
    shareUrl = buildVideoShareMemberUrl(kind, baseUrl, ctx.tenant.slug, shareSlug)
  }

  return NextResponse.json({
    shareUrl,
    shareSlug,
    hasWhatsapp,
    memberName: (profile?.nome_completo as string | null) ?? null,
    headline: cfg?.headline ?? d.defaultHeadline,
    videoConfigured: true,
    leaderTeamPreview: previewMode,
  })
}
