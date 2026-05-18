/**
 * GET /api/pro-lideres/hom/meu-link
 * Membro busca o próprio link HOM único, headline e estado do WhatsApp.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { fetchHOMConfig } from '@/lib/pro-lideres-hom'
import { resolveYladaOgBaseUrlForMetadata } from '@/lib/ylada-public-link-base-url'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) return NextResponse.json({ error: 'Serviço indisponível' }, { status: 503 })

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response
  const { ctx } = paid

  // Busca share_slug do membro
  const { data: member } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('pro_lideres_share_slug')
    .eq('leader_tenant_id', ctx.tenant.id)
    .eq('user_id', user.id)
    .maybeSingle()

  const shareSlug = (member?.pro_lideres_share_slug as string | null) ?? null

  // Busca config HOM do tenant
  const cfg = await fetchHOMConfig(ctx.tenant.id)

  // Busca WhatsApp do membro
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('whatsapp, nome_completo')
    .eq('user_id', user.id)
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
    videoConfigured: !!(cfg?.videoUrl),
  })
}
