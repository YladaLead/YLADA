/**
 * GET /api/trilha/me/reflections — lista reflexões do usuário (por step).
 * PUT /api/trilha/me/reflections — upsert reflexão de um step; ao salvar, atualiza user_strategy_snapshot.
 * Autenticação obrigatória.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

function buildSnapshotText(step: { code?: string; title?: string } | null, reflection: {
  answer_perceived?: string | null
  answer_stuck?: string | null
  answer_next?: string | null
  situation_text?: string | null
}): string {
  const parts: string[] = []
  if (step?.code) parts.push(`Etapa atual: ${step.code} – ${step.title || ''}`)
  if (reflection.answer_perceived) parts.push(`O que percebeu: ${reflection.answer_perceived}`)
  if (reflection.answer_stuck) parts.push(`O que está travando: ${reflection.answer_stuck}`)
  if (reflection.answer_next) parts.push(`Próximo passo: ${reflection.answer_next}`)
  if (reflection.situation_text) parts.push(`Situação atual: ${reflection.situation_text}`)
  return parts.join('\n\n')
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: reflections, error } = await supabaseAdmin
      .from('trilha_reflections')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('[trilha/me/reflections] GET', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: { reflections: reflections || [] } })
  } catch (e) {
    console.error('[trilha/me/reflections] GET', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao buscar reflexões' },
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
    const {
      step_id,
      answer_perceived,
      answer_stuck,
      answer_next,
      situation_text
    } = body as {
      step_id?: string
      answer_perceived?: string
      answer_stuck?: string
      answer_next?: string
      situation_text?: string
    }

    if (!step_id) {
      return NextResponse.json({ success: false, error: 'step_id obrigatório' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const row = {
      user_id: user.id,
      step_id,
      ...(answer_perceived !== undefined && { answer_perceived: answer_perceived || null }),
      ...(answer_stuck !== undefined && { answer_stuck: answer_stuck || null }),
      ...(answer_next !== undefined && { answer_next: answer_next || null }),
      ...(situation_text !== undefined && { situation_text: situation_text || null })
    }

    const { data: reflection, error: refError } = await supabaseAdmin
      .from('trilha_reflections')
      .upsert(row, { onConflict: 'user_id,step_id' })
      .select()
      .single()

    if (refError) {
      console.error('[trilha/me/reflections] PUT', refError)
      return NextResponse.json({ success: false, error: refError.message }, { status: 500 })
    }

    const { data: step } = await supabaseAdmin
      .from('trilha_steps')
      .select('code, title')
      .eq('id', step_id)
      .single()

    const snapshot_text = buildSnapshotText(step, {
      answer_perceived: row.answer_perceived,
      answer_stuck: row.answer_stuck,
      answer_next: row.answer_next,
      situation_text: row.situation_text
    })
    const snapshot_json = {
      current_step_id: step_id,
      step_code: step?.code,
      step_title: step?.title,
      answer_perceived: row.answer_perceived,
      answer_stuck: row.answer_stuck,
      answer_next: row.answer_next,
      situation_text: row.situation_text,
      updated_at: new Date().toISOString()
    }

    await supabaseAdmin
      .from('user_strategy_snapshot')
      .upsert(
        {
          user_id: user.id,
          snapshot_text,
          snapshot_json,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      )

    return NextResponse.json({ success: true, data: { reflection } })
  } catch (e) {
    console.error('[trilha/me/reflections] PUT', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao salvar reflexão' },
      { status: 500 }
    )
  }
}
