/**
 * GET /api/admin/ylada/usage-survey — lista respostas (admin).
 * Query: limit (default 100, max 500), offset (default 0)
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

    const { searchParams } = new URL(request.url)
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '100', 10) || 100))
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10) || 0)

    const { data: rows, error, count } = await supabaseAdmin
      .from('ylada_usage_survey_responses')
      .select('id, created_at, profile, answers', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[admin/usage-survey]', error)
      return NextResponse.json(
        { success: false, error: error.message.includes('relation') ? 'Execute a migration 296 no Supabase.' : error.message },
        { status: 500 }
      )
    }

    const byProfile = { '1': 0, '2': 0, '3': 0, '4': 0 } as Record<string, number>
    for (const r of rows ?? []) {
      const p = (r as { profile?: string }).profile
      if (p && p in byProfile) byProfile[p] += 1
    }

    return NextResponse.json({
      success: true,
      data: rows ?? [],
      total: count ?? rows?.length ?? 0,
      limit,
      offset,
      profileCountsInPage: byProfile,
    })
  } catch (e) {
    console.error('[admin/usage-survey]', e)
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
