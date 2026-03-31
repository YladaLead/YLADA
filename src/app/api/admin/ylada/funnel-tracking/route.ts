/**
 * GET /api/admin/ylada/funnel-tracking
 * Query: date_from (YYYY-MM-DD), date_to (YYYY-MM-DD), segment (id), nicho (slug)
 * Agrega funil com filtros e quebras por segmento / nicho.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchFunnelRowsInRange } from '@/lib/funnel-tracking-server'
import {
  filterFunnelRows,
  totalsFromRows,
  breakdownBySegment,
  breakdownNichoPorSegmento,
  conversionCadastroToConta,
} from '@/lib/funnel-tracking-aggregate'

const ALLOWED_SEGMENT_IDS = new Set([
  'nutri',
  'coach',
  'med',
  'estetica',
  'fitness',
  'perfumaria',
  'nutra',
  'seller',
  'psi',
  'psicanalise',
  'odonto',
  'profissional-liberal',
])

function parseDateParam(s: string | null, fallback: Date): Date {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return fallback
  const d = new Date(`${s}T12:00:00.000Z`)
  return Number.isNaN(d.getTime()) ? fallback : d
}

function sanitizeNicho(s: string | null): string | null {
  if (!s?.trim()) return null
  return s.trim().toLowerCase().slice(0, 80)
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['admin'])
    if (auth instanceof NextResponse) return auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const now = new Date()
    const defaultFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const dateFromParam = searchParams.get('date_from')
    const dateToParam = searchParams.get('date_to')

    const fromDate = parseDateParam(dateFromParam, defaultFrom)
    const toDate = parseDateParam(dateToParam, now)
    let fromDay = new Date(fromDate)
    let toDay = new Date(toDate)
    if (fromDay > toDay) {
      const t = fromDay
      fromDay = toDay
      toDay = t
    }

    const fromIso = new Date(
      Date.UTC(fromDay.getUTCFullYear(), fromDay.getUTCMonth(), fromDay.getUTCDate(), 0, 0, 0, 0)
    ).toISOString()
    const toIso = new Date(
      Date.UTC(toDay.getUTCFullYear(), toDay.getUTCMonth(), toDay.getUTCDate(), 23, 59, 59, 999)
    ).toISOString()

    const segmentRaw = searchParams.get('segment')?.trim().toLowerCase() || null
    const segment =
      segmentRaw && ALLOWED_SEGMENT_IDS.has(segmentRaw) ? segmentRaw : null

    const nicho = sanitizeNicho(searchParams.get('nicho'))

    const { rows, truncated } = await fetchFunnelRowsInRange(fromIso, toIso)

    const filtered = filterFunnelRows(rows, { segment, nicho })
    const totals = totalsFromRows(filtered)
    const bySegment = breakdownBySegment(rows)
    const nichoBySegment = breakdownNichoPorSegmento(rows)

    const convPct = conversionCadastroToConta(totals)

    return NextResponse.json({
      success: true,
      data: {
        totals,
        bySegment,
        nichoBySegment,
        conversionCadastroContaPct: convPct,
        conversionLabel:
          'Contas criadas ÷ escolher área no cadastro (aprox.; mesmo filtro de data e segmento/nicho)',
        rowCount: rows.length,
        filteredRowCount: filtered.length,
        period: { from: fromIso, to: toIso },
        filtersApplied: { segment, nicho },
        truncated,
      },
    })
  } catch (e) {
    console.error('[admin/ylada/funnel-tracking]', e)
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
