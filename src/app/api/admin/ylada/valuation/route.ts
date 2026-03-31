/**
 * GET /api/admin/ylada/valuation
 * Dados agregados para narrativa de valuation (intenção, conversão, combinações).
 * Separado de eventos operacionais — ver behavioral-data.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { loadValuationPanelData } from '@/lib/admin/ylada-valuation-queries'

function clampInt(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo
  return Math.min(hi, Math.max(lo, Math.round(n)))
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['admin'])
    if (auth instanceof NextResponse) return auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const data = await loadValuationPanelData(supabaseAdmin, {
      minDiagnosesConversion: searchParams.has('min_conv')
        ? clampInt(Number(searchParams.get('min_conv')), 1, 200)
        : undefined,
      minDiagnosesCombo: searchParams.has('min_combo')
        ? clampInt(Number(searchParams.get('min_combo')), 1, 200)
        : undefined,
      minCntTop: searchParams.has('min_cnt') ? clampInt(Number(searchParams.get('min_cnt')), 1, 100) : undefined,
      topRankMax: searchParams.has('rank_max') ? clampInt(Number(searchParams.get('rank_max')), 1, 20) : undefined,
    })
    return NextResponse.json({ success: true, data })
  } catch (e) {
    console.error('[admin/ylada/valuation]', e)
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
