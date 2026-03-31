/**
 * GET /api/admin/ylada/valuation/drilldown
 * Amostra de diagnósticos que têm uma resposta específica (sem PII do lead).
 * Query: segment, intent_category, answer_display (obrigatórios); question_id (recomendado).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

function answerDisplayFromRow(r: {
  answer_text: string | null
  answer_value: unknown
}): string {
  const t = r.answer_text?.trim()
  if (t) return t
  if (r.answer_value == null) return ''
  if (typeof r.answer_value === 'string') return r.answer_value.trim()
  try {
    return JSON.stringify(r.answer_value)
  } catch {
    return String(r.answer_value)
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['admin'])
    if (auth instanceof NextResponse) return auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const segment = searchParams.get('segment')?.trim() ?? ''
    const intent_category = searchParams.get('intent_category')?.trim() ?? ''
    const answer_display = searchParams.get('answer_display')?.trim() ?? ''
    const question_id = searchParams.get('question_id')?.trim() ?? ''

    if (!segment || !intent_category || !answer_display) {
      return NextResponse.json(
        { success: false, error: 'segment, intent_category e answer_display são obrigatórios' },
        { status: 400 }
      )
    }

    let q = supabaseAdmin
      .from('ylada_diagnosis_answers')
      .select('id, metrics_id, created_at, question_id, question_label, answer_text, answer_value')
      .eq('segment', segment)
      .eq('intent_category', intent_category)
      .order('created_at', { ascending: false })
      .limit(200)

    if (question_id) {
      q = q.eq('question_id', question_id)
    }

    const { data: raw, error } = await q
    if (error) {
      console.error('[valuation/drilldown]', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const target = answer_display.toLowerCase()
    const rows = (raw ?? []).filter((r) => answerDisplayFromRow(r).toLowerCase() === target).slice(0, 30)

    const metricIds = [...new Set(rows.map((r) => r.metrics_id).filter(Boolean))] as string[]
    const metricsMap = new Map<string, { link_id: string | null; clicked_whatsapp: boolean }>()
    if (metricIds.length > 0) {
      const { data: met } = await supabaseAdmin
        .from('ylada_diagnosis_metrics')
        .select('id, link_id, clicked_whatsapp')
        .in('id', metricIds)
      for (const m of met ?? []) {
        metricsMap.set(m.id as string, {
          link_id: (m.link_id as string) ?? null,
          clicked_whatsapp: Boolean(m.clicked_whatsapp),
        })
      }
    }

    const samples = rows.map((r) => {
      const m = metricsMap.get(r.metrics_id as string)
      return {
        answer_row_id: r.id,
        metrics_id: r.metrics_id,
        created_at: r.created_at,
        question_id: r.question_id,
        question_label: r.question_label,
        link_id: m?.link_id ?? null,
        clicked_whatsapp: m?.clicked_whatsapp ?? false,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        count: samples.length,
        samples,
        note:
          'Amostra anonimizada: ids internos para cruzar com links/diagnósticos — sem dados pessoais do visitante.',
      },
    })
  } catch (e) {
    console.error('[valuation/drilldown]', e)
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
