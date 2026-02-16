/**
 * GET /api/trilha/me/progress — lista progresso do usuário (todos os steps com status/confidence).
 * PUT /api/trilha/me/progress — upsert progresso de um step (status, confidence).
 * Autenticação obrigatória.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: progress, error } = await supabaseAdmin
      .from('trilha_user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('[trilha/me/progress] GET', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: { progress: progress || [] } })
  } catch (e) {
    console.error('[trilha/me/progress] GET', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao buscar progresso' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json().catch(() => ({}))
    const { step_id, status, confidence } = body as {
      step_id?: string
      status?: 'not_started' | 'in_progress' | 'stuck' | 'done'
      confidence?: number
    }

    if (!step_id) {
      return NextResponse.json({ success: false, error: 'step_id obrigatório' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const row: {
      user_id: string
      step_id: string
      status?: string
      confidence?: number
      completed_at?: string | null
    } = {
      user_id: user.id,
      step_id
    }
    if (status) row.status = status
    if (confidence !== undefined && confidence >= 1 && confidence <= 5) row.confidence = confidence
    if (status === 'done') row.completed_at = new Date().toISOString()

    const { data, error } = await supabaseAdmin
      .from('trilha_user_progress')
      .upsert(row, { onConflict: 'user_id,step_id' })
      .select()
      .single()

    if (error) {
      console.error('[trilha/me/progress] PUT', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: { progress: data } })
  } catch (e) {
    console.error('[trilha/me/progress] PUT', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao salvar progresso' },
      { status: 500 }
    )
  }
}
