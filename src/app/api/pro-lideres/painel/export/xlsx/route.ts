import { NextRequest, NextResponse } from 'next/server'

import { requireApiAuth } from '@/lib/api-auth'
import {
  buildProLideresLeaderExportXlsx,
  parseProLideresLeaderExportRange,
} from '@/lib/pro-lideres-leader-export-xlsx'
import {
  parseProLideresLeaderExportTabulatorFilter,
  resolveCanonicalTabulatorLabelsForExport,
} from '@/lib/pro-lideres-leader-export-tabulators'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { fetchTabulatorLabelsForTenant } from '@/lib/pro-lideres-tabulators'
import { supabaseAdmin } from '@/lib/supabase'

async function requireLeaderOwnerContext(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return { error: auth }
  const { user } = auth

  if (!supabaseAdmin) {
    return { error: NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 }) }
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return { error: NextResponse.json({ error: 'Apenas o líder pode exportar.' }, { status: 403 }) }
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return { error: paid.response }

  return { user, ctx: paid.ctx }
}

/** Planilha Excel (várias abas) com equipe por tabulador, links e tarefas diárias no período. */
export async function GET(request: NextRequest) {
  const gate = await requireLeaderOwnerContext(request)
  if ('error' in gate) return gate.error

  const sp = request.nextUrl.searchParams
  const parsed = parseProLideresLeaderExportRange(sp.get('from'), sp.get('to'))
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const tabsParsed = parseProLideresLeaderExportTabulatorFilter(sp.getAll('tab'))
  if (!tabsParsed.ok) {
    return NextResponse.json({ error: tabsParsed.error }, { status: 400 })
  }

  let tabulatorFilter = tabsParsed.filter
  if (tabulatorFilter.labels?.length) {
    const registered = await fetchTabulatorLabelsForTenant(supabaseAdmin!, gate.ctx.tenant.id)
    const resolved = resolveCanonicalTabulatorLabelsForExport(tabulatorFilter.labels, registered)
    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: 400 })
    }
    tabulatorFilter = { labels: resolved.labels }
  }

  try {
    const { buffer, range } = await buildProLideresLeaderExportXlsx(supabaseAdmin!, {
      tenantId: gate.ctx.tenant.id,
      ownerUserId: gate.ctx.tenant.owner_user_id,
      range: parsed.range,
      tabulatorFilter,
    })

    const tabSuffix =
      tabulatorFilter.labels?.length === 1
        ? `-${tabulatorFilter.labels[0]!.replace(/[^\w\u00C0-\u024F-]+/gi, '-').slice(0, 40)}`
        : tabulatorFilter.labels?.length
          ? `-${tabulatorFilter.labels.length}-tabs`
          : ''
    const fn = `pro-lideres-export-${range.from}_${range.to}${tabSuffix}.xlsx`
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fn}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e) {
    console.error('[pro-lideres/painel/export/xlsx]', e)
    const msg = e instanceof Error ? e.message : 'Erro ao gerar o arquivo.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
