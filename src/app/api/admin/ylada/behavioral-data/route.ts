/**
 * GET /api/admin/ylada/behavioral-data
 * Query: date_from, date_to (YYYY-MM-DD) — filtra eventos e respostas por created_at.
 * Default: últimos 7 dias (mesma ideia do Funil / Tracking).
 * Telemetria operacional: eventos e volume de respostas gravadas.
 * Intenção, conversão e combinações: GET /api/admin/ylada/valuation
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

const ROW_CAP = 40000

function parseDateParam(s: string | null, fallback: Date): Date {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return fallback
  const d = new Date(`${s}T12:00:00.000Z`)
  return Number.isNaN(d.getTime()) ? fallback : d
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

    const result: {
      events: { event_type: string; count: number }[]
      eventsTotal: number
      answersTotal: number
      period: { from: string; to: string }
      truncated: boolean
      error?: string
    } = {
      events: [],
      eventsTotal: 0,
      answersTotal: 0,
      period: { from: fromIso, to: toIso },
      truncated: false,
    }

    try {
      const { data: eventsRaw, error: evErr } = await supabaseAdmin
        .from('ylada_behavioral_events')
        .select('event_type')
        .gte('created_at', fromIso)
        .lte('created_at', toIso)
        .limit(ROW_CAP + 1)

      if (evErr) throw evErr

      const rows = eventsRaw ?? []
      result.truncated = rows.length > ROW_CAP
      const capped = result.truncated ? rows.slice(0, ROW_CAP) : rows

      const countByType: Record<string, number> = {}
      for (const r of capped) {
        const t = (r.event_type as string) || 'outro'
        countByType[t] = (countByType[t] ?? 0) + 1
      }
      result.events = Object.entries(countByType).map(([event_type, count]) => ({ event_type, count }))
      result.eventsTotal = capped.length
    } catch (e) {
      result.error = (e as Error).message
    }

    try {
      const { count } = await supabaseAdmin
        .from('ylada_diagnosis_answers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', fromIso)
        .lte('created_at', toIso)
      result.answersTotal = count ?? 0
    } catch {
      // tabela pode não existir
    }

    return NextResponse.json({ success: true, data: result })
  } catch (e) {
    console.error('[admin/ylada/behavioral-data]', e)
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
