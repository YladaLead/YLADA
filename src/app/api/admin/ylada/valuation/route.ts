/**
 * GET /api/admin/ylada/valuation
 * Dados agregados para narrativa de valuation (intenção, conversão, combinações).
 * Separado de eventos operacionais — ver behavioral-data.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { loadValuationPanelData } from '@/lib/admin/ylada-valuation-queries'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['admin'])
    if (auth instanceof NextResponse) return auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const data = await loadValuationPanelData(supabaseAdmin)
    return NextResponse.json({ success: true, data })
  } catch (e) {
    console.error('[admin/ylada/valuation]', e)
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
