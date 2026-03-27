/**
 * GET /api/admin/ylada/behavioral-data
 * Telemetria operacional: eventos e volume de respostas gravadas.
 * Intenção, conversão e combinações: GET /api/admin/ylada/valuation
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['admin'])
    if (auth instanceof NextResponse) return auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const result: {
      events: { event_type: string; count: number }[]
      eventsTotal: number
      answersTotal: number
      error?: string
    } = {
      events: [],
      eventsTotal: 0,
      answersTotal: 0,
    }

    try {
      const { data: eventsRaw } = await supabaseAdmin
        .from('ylada_behavioral_events')
        .select('event_type')
      const countByType: Record<string, number> = {}
      for (const r of eventsRaw ?? []) {
        const t = (r.event_type as string) || 'outro'
        countByType[t] = (countByType[t] ?? 0) + 1
      }
      result.events = Object.entries(countByType).map(([event_type, count]) => ({ event_type, count }))
      result.eventsTotal = eventsRaw?.length ?? 0
    } catch (e) {
      result.error = (e as Error).message
    }

    try {
      const { count } = await supabaseAdmin
        .from('ylada_diagnosis_answers')
        .select('*', { count: 'exact', head: true })
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
