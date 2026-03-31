/**
 * GET /api/admin/inteligencia-ylada
 * Resumo para a home “Inteligência YLADA”: funil (7d), valuation, WhatsApp, insights.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchFunnelRowsInRange } from '@/lib/funnel-tracking-server'
import {
  totalsFromRows,
  breakdownBySegment,
  breakdownNichoPorSegmento,
  conversionCadastroToConta,
} from '@/lib/funnel-tracking-aggregate'
import { loadValuationPanelData } from '@/lib/admin/ylada-valuation-queries'
import { fetchFreemiumConversionStats } from '@/lib/freemium-inteligencia-aggregate'
import { buildInteligenciaInsights, buildFreemiumInsightCards } from '@/lib/inteligencia-ylada-insights'

function rangeLast7Days(): { fromIso: string; toIso: string } {
  const now = new Date()
  const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const fromIso = new Date(
    Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), 0, 0, 0, 0)
  ).toISOString()
  const toIso = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999)
  ).toISOString()
  return { fromIso, toIso }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['admin'])
    if (auth instanceof NextResponse) return auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { fromIso, toIso } = rangeLast7Days()

    const [{ rows, truncated }, valuation, freemiumConversion] = await Promise.all([
      fetchFunnelRowsInRange(fromIso, toIso),
      loadValuationPanelData(supabaseAdmin),
      fetchFreemiumConversionStats(supabaseAdmin, fromIso, toIso),
    ])

    const totals = totalsFromRows(rows)
    const bySegment = breakdownBySegment(rows)
    const nichoBySegment = breakdownNichoPorSegmento(rows)
    const conversionCadastroPct = conversionCadastroToConta(totals)

    let whatsappClicks = 0
    try {
      const { count } = await supabaseAdmin
        .from('ylada_behavioral_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'lead_contact_clicked')
        .gte('created_at', fromIso)
        .lte('created_at', toIso)
      whatsappClicks = count ?? 0
    } catch {
      // ignore
    }

    const freemiumCards = buildFreemiumInsightCards(freemiumConversion)
    const insightResult = buildInteligenciaInsights(
      totals,
      bySegment,
      nichoBySegment,
      conversionCadastroPct,
      valuation
    )
    const cards = [...freemiumCards, ...insightResult.cards].slice(0, 5)
    const { maiorPerda } = insightResult
    const acoesSugeridas = [
      ...insightResult.acoesSugeridas,
      ...(freemiumConversion.totals.freemium_limit_hit >= 3
        ? ['Comparar gatilhos Free → Pro (Noel, WhatsApp, diagnóstico ativo) na tabela abaixo.']
        : []),
    ]

    const intentTopPreview = (valuation.intentTop ?? []).slice(0, 8)
    const intentConversionPreview = (valuation.intentConversion ?? []).slice(0, 8)

    return NextResponse.json({
      success: true,
      data: {
        period: { from: fromIso, to: toIso, label: 'Últimos 7 dias' },
        funnel: {
          totals,
          bySegment,
          nichoBySegment,
          conversionCadastroContaPct: conversionCadastroPct,
          truncated,
        },
        valuation: {
          answersTotal: valuation.answersTotal,
          intentTop: intentTopPreview,
          intentConversion: intentConversionPreview,
        },
        whatsappClicks,
        freemiumConversion,
        insights: cards,
        maiorPerda,
        acoesSugeridas: [...new Set(acoesSugeridas)].slice(0, 8),
      },
    })
  } catch (e) {
    console.error('[admin/inteligencia-ylada]', e)
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
