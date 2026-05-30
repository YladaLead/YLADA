import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchResetMemberLinks } from '@/lib/pro-lideres-reset'
import { resolveYladaOgBaseUrlForMetadata } from '@/lib/ylada-public-link-base-url'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Serviço indisponível' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (ctx.role !== 'leader') return NextResponse.json({ error: 'Apenas o líder pode aceder' }, { status: 403 })

  const baseUrl = await resolveYladaOgBaseUrlForMetadata()
  const members = await fetchResetMemberLinks(ctx.tenant.id, ctx.tenant.slug, baseUrl)
  const leaderUrl = `${baseUrl}/pro-lideres/reset/${encodeURIComponent(ctx.tenant.slug)}/lider`

  return NextResponse.json({ members, leaderUrl })
}
