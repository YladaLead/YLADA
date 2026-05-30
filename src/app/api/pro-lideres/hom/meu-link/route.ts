/**
 * GET /api/pro-lideres/hom/meu-link
 * Membro busca o próprio link HOM único, headline e estado do WhatsApp.
 */
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { fetchHOMConfig, resolveHomVideoUrl, resolveProLideresHomLinkSubject } from '@/lib/pro-lideres-hom'
import { PRO_LIDERES_TEAM_PREVIEW_COOKIE } from '@/lib/pro-lideres-team-preview'
import { resolveYladaOgBaseUrlForMetadata } from '@/lib/ylada-public-link-base-url'

export async function GET(request: NextRequest) {
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
    await resolveProLideresHomLinkSubject(ctx.tenant.id, ctx.tenant.owner_user_id, user.id, {
      leaderTeamPreview,
    })

  const cfg = await fetchHOMConfig(ctx.tenant.id)

  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('whatsapp, nome_completo')
    .eq('user_id', subjectUserId)
    .maybeSingle()

  const hasWhatsapp = !!((profile?.whatsapp as string | null)?.trim())

  let homUrl: string | null = null
  if (shareSlug) {
    const baseUrl = await resolveYladaOgBaseUrlForMetadata()
    homUrl = `${baseUrl}/pro-lideres/hom/${encodeURIComponent(ctx.tenant.slug)}/${encodeURIComponent(shareSlug)}`
  }

  return NextResponse.json({
    homUrl,
    shareSlug,
    hasWhatsapp,
    memberName: (profile?.nome_completo as string | null) ?? null,
    headline: cfg?.headline ?? null,
    videoConfigured: !!resolveHomVideoUrl(cfg?.videoUrl),
    leaderTeamPreview: previewMode,
  })
}
