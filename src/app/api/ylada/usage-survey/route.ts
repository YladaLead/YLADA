/**
 * POST /api/ylada/usage-survey — grava pesquisa anônima (sem auth).
 * Body: { objective, objective_other?, created_diagnosis, shared_link, got_message, blocker?, expectation, pain }
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

type Body = {
  objective?: string
  objective_other?: string
  created_diagnosis?: boolean
  shared_link?: boolean
  got_message?: boolean
  blocker?: string
  expectation?: string
  pain?: string
}

export function computeUsageSurveyProfile(a: {
  created_diagnosis: boolean
  shared_link: boolean
  got_message: boolean
}): '1' | '2' | '3' | '4' {
  if (!a.created_diagnosis) return '1'
  if (!a.shared_link) return '2'
  if (!a.got_message) return '3'
  return '4'
}

function clampStr(s: unknown, max: number): string {
  if (typeof s !== 'string') return ''
  return s.trim().slice(0, max)
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const raw = (await request.json().catch(() => ({}))) as Body
    if (typeof raw.created_diagnosis !== 'boolean' || typeof raw.shared_link !== 'boolean' || typeof raw.got_message !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Respostas obrigatórias ausentes' }, { status: 400 })
    }

    const created = raw.created_diagnosis === true
    const shared = created && raw.shared_link === true
    const messaged = shared && raw.got_message === true

    const profile = computeUsageSurveyProfile({
      created_diagnosis: created,
      shared_link: shared,
      got_message: messaged,
    })

    const answers = {
      objective: clampStr(raw.objective, 80),
      objective_other: clampStr(raw.objective_other, 200),
      created_diagnosis: created,
      shared_link: shared,
      got_message: messaged,
      blocker: clampStr(raw.blocker, 500),
      expectation: clampStr(raw.expectation, 1200),
      pain: clampStr(raw.pain, 1200),
    }

    const { data, error } = await supabaseAdmin
      .from('ylada_usage_survey_responses')
      .insert({ profile, answers })
      .select('id')
      .single()

    if (error) {
      console.error('[usage-survey]', error)
      return NextResponse.json({ success: false, error: 'Não foi possível salvar' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id, profile })
  } catch (e) {
    console.error('[usage-survey]', e)
    return NextResponse.json({ success: false, error: 'Erro ao processar' }, { status: 500 })
  }
}
