/**
 * GET /api/admin/ylada/usage-survey — lista respostas (admin) + agregados globais e amostra para objetivo/trava.
 * Query: limit (default 200, max 500), offset (default 0)
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  aggregateUsageSurveyAnswers,
  buildUsageSurveyInsights,
  buildUsageSurveyRecommendedActions,
} from '@/lib/ylada-usage-survey-labels'

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

    const [listRes, totalRes, p1, p2, p3, p4, aggRes] = await Promise.all([
      supabaseAdmin
        .from('ylada_usage_survey_responses')
        .select('id, created_at, profile, answers', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
      supabaseAdmin.from('ylada_usage_survey_responses').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('ylada_usage_survey_responses').select('id', { count: 'exact', head: true }).eq('profile', '1'),
      supabaseAdmin.from('ylada_usage_survey_responses').select('id', { count: 'exact', head: true }).eq('profile', '2'),
      supabaseAdmin.from('ylada_usage_survey_responses').select('id', { count: 'exact', head: true }).eq('profile', '3'),
      supabaseAdmin.from('ylada_usage_survey_responses').select('id', { count: 'exact', head: true }).eq('profile', '4'),
      supabaseAdmin
        .from('ylada_usage_survey_responses')
        .select('answers')
        .order('created_at', { ascending: false })
        .limit(1500),
    ])

    if (listRes.error) {
      console.error('[admin/usage-survey]', listRes.error)
      return NextResponse.json(
        {
          success: false,
          error: listRes.error.message.includes('relation')
            ? 'Execute a migration 296 no Supabase.'
            : listRes.error.message,
        },
        { status: 500 }
      )
    }

    const totalInDb = totalRes.count ?? 0
    const profileCountsGlobal: Record<string, number> = {
      '1': p1.count ?? 0,
      '2': p2.count ?? 0,
      '3': p3.count ?? 0,
      '4': p4.count ?? 0,
    }

    if (aggRes.error) {
      console.warn('[admin/usage-survey] amostra agregada:', aggRes.error.message)
    }
    const aggRows = (aggRes.error ? [] : aggRes.data ?? []) as Array<{ answers?: Record<string, unknown> }>
    const { objectiveTop, blockerTop, sampleSize } = aggregateUsageSurveyAnswers(aggRows)

    const insights = buildUsageSurveyInsights({
      totalInDb,
      profileCounts: profileCountsGlobal,
      aggregationSampleSize: sampleSize,
      objectiveTop,
      blockerTop,
    })

    const recommendedActions = buildUsageSurveyRecommendedActions({
      totalInDb,
      profileCounts: profileCountsGlobal,
      aggregationSampleSize: sampleSize,
      objectiveTop,
      blockerTop,
    })

    return NextResponse.json({
      success: true,
      data: listRes.data ?? [],
      total: totalInDb,
      limit,
      offset,
      stats: {
        totalInDb,
        profileCountsGlobal,
        aggregationSampleSize: sampleSize,
        objectiveTop,
        blockerTop,
      },
      insights,
      recommendedActions,
    })
  } catch (e) {
    console.error('[admin/usage-survey]', e)
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 })
  }
}
