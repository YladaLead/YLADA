/**
 * GET /api/admin/ylada/uso-wellness-v1 — lista respostas da pesquisa /uso-wellness-v1 (admin).
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
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') || '200', 10) || 200))
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10) || 0)

    const listRes = await supabaseAdmin
      .from('ylada_uso_wellness_v1_responses')
      .select('id, created_at, optional_noel, answers', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (listRes.error) {
      console.error('[admin/uso-wellness-v1]', listRes.error)
      const msg = listRes.error.message || ''
      const missingTable = /relation|does not exist|schema cache|42P01/i.test(msg)
      return NextResponse.json(
        {
          success: false,
          error: missingTable
            ? 'Execute a migration 299 no Supabase (tabela ylada_uso_wellness_v1_responses).'
            : msg,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: listRes.data ?? [],
      total: listRes.count ?? 0,
      limit,
      offset,
    })
  } catch (e) {
    console.error('[admin/uso-wellness-v1]', e)
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
