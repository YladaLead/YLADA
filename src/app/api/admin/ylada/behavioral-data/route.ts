/**
 * GET /api/admin/ylada/behavioral-data
 * Dados comportamentais e de intenção para área admin.
 * Eventos, respostas por pergunta, top intenções por segmento.
 * Apenas admin.
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
      intentTop: { segment: string; intent_category: string; answer_display: string; cnt: number; rank: number }[]
      trends: { month_ref: string; segment: string; intent_category: string; answer_count: number; diagnosis_count: number }[]
      error?: string
    } = {
      events: [],
      eventsTotal: 0,
      answersTotal: 0,
      intentTop: [],
      trends: [],
    }

    // 1. Eventos comportamentais (ylada_behavioral_events)
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

    // 2. Total de respostas (ylada_diagnosis_answers)
    try {
      const { count } = await supabaseAdmin
        .from('ylada_diagnosis_answers')
        .select('*', { count: 'exact', head: true })
      result.answersTotal = count ?? 0
    } catch {
      // Tabela pode não existir
    }

    // 3. Top intenções (v_intent_top_by_segment)
    try {
      const { data: top } = await supabaseAdmin
        .from('v_intent_top_by_segment')
        .select('segment, intent_category, answer_display, cnt, rank')
        .lte('rank', 5)
        .gte('cnt', 5)
        .order('segment')
        .order('intent_category')
        .order('rank')
        .limit(50)
      result.intentTop = (top ?? []) as typeof result.intentTop
    } catch {
      // View pode não existir
    }

    // 4. Tendências mensais (v_intent_trends_monthly)
    try {
      const { data: trends } = await supabaseAdmin
        .from('v_intent_trends_monthly')
        .select('month_ref, segment, intent_category, answer_count, diagnosis_count')
        .order('month_ref', { ascending: false })
        .limit(60)
      result.trends = (trends ?? []) as typeof result.trends
    } catch {
      // View pode não existir
    }

    return NextResponse.json({ success: true, data: result })
  } catch (e) {
    console.error('[admin/ylada/behavioral-data]', e)
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
