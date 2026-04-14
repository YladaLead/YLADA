import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  fetchProLideresPainelOverview,
  type PainelOverviewPreset,
} from '@/lib/pro-lideres-painel-overview'
import { proLideresApiDevHint } from '@/lib/pro-lideres-api-dev-hints'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

/**
 * GET /api/pro-lideres/painel-overview?preset=7d|yesterday|30d
 * ou ?from=YYYY-MM-DD&to=YYYY-MM-DD (intervalo personalizado, até 90 dias, até hoje).
 */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Servidor sem service role', ...proLideresApiDevHint('noServiceRole') },
      { status: 503 }
    )
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado', ...proLideresApiDevHint('noTenant') }, { status: 404 })
  }

  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder vê o resumo do painel.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  const sp = request.nextUrl.searchParams
  const from = sp.get('from')?.trim()
  const to = sp.get('to')?.trim()

  let data: Awaited<ReturnType<typeof fetchProLideresPainelOverview>> = null

  if (from || to) {
    if (!from || !to) {
      return NextResponse.json(
        { error: 'Informe início e fim do período (from e to, formato AAAA-MM-DD).' },
        { status: 400 }
      )
    }
    data = await fetchProLideresPainelOverview({
      tenantId: ctx.tenant.id,
      ownerUserId: user.id,
      customFrom: from,
      customTo: to,
    })
    if (!data) {
      return NextResponse.json(
        {
          error:
            'Intervalo inválido: use datas AAAA-MM-DD, início antes ou igual ao fim, até hoje, no máximo 90 dias.',
        },
        { status: 400 }
      )
    }
  } else {
    const raw = sp.get('preset')?.trim().toLowerCase()
    const preset: PainelOverviewPreset =
      raw === 'yesterday' || raw === 'ontem' ? 'yesterday' : raw === '30d' || raw === '30' ? '30d' : '7d'

    data = await fetchProLideresPainelOverview({
      tenantId: ctx.tenant.id,
      ownerUserId: user.id,
      preset,
    })
  }

  if (!data) {
    return NextResponse.json(
      { error: 'Não foi possível carregar o resumo. Tente de novo em instantes.' },
      { status: 503 }
    )
  }

  return NextResponse.json(data)
}
