import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchHOMConfig, upsertHOMConfig } from '@/lib/pro-lideres-hom'
import { parseOpportunityVideoUrl } from '@/lib/pro-lideres-opportunity-video'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Serviço indisponível' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (ctx.role !== 'leader') return NextResponse.json({ error: 'Apenas o líder pode aceder' }, { status: 403 })

  const config = await fetchHOMConfig(ctx.tenant.id)
  return NextResponse.json({ config })
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Serviço indisponível' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (ctx.role !== 'leader') return NextResponse.json({ error: 'Apenas o líder pode editar' }, { status: 403 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const patch: { videoUrl?: string | null; headline?: string; subheadline?: string } = {}

  if ('video_url' in body) {
    const raw = body.video_url
    if (raw === null || raw === '' || raw === undefined) {
      patch.videoUrl = null
    } else {
      const parsed = parseOpportunityVideoUrl(String(raw).trim())
      if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 422 })
      patch.videoUrl = String(raw).trim()
    }
  }

  if ('headline' in body) {
    const h = String(body.headline ?? '').trim()
    if (h.length > 200) return NextResponse.json({ error: 'Headline muito longa (máx 200 chars)' }, { status: 422 })
    patch.headline = h || undefined
  }

  if ('subheadline' in body) {
    const s = String(body.subheadline ?? '').trim()
    if (s.length > 300) return NextResponse.json({ error: 'Subtítulo muito longo (máx 300 chars)' }, { status: 422 })
    patch.subheadline = s || undefined
  }

  const result = await upsertHOMConfig(ctx.tenant.id, patch)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 })

  const updated = await fetchHOMConfig(ctx.tenant.id)
  return NextResponse.json({ config: updated })
}
