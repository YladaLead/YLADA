/**
 * POST /api/ylada/usage-survey-v1 — grava pesquisa de feedback v1 (sem auth).
 * Modo triagem: has_used=false + want_to_try + know_someone (sem notas/textos longos).
 * Modo completo: has_used=true + experience_rating + recommend + textos.
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

type Body = {
  has_used?: boolean
  want_to_try?: boolean
  know_someone?: boolean
  experience_rating?: number
  liked?: string
  improve?: string
  recommend?: boolean
  future_feature?: string
  helped_situation?: string
  additional?: string
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

    if (raw.has_used === false) {
      if (typeof raw.want_to_try !== 'boolean' || typeof raw.know_someone !== 'boolean') {
        return NextResponse.json({ success: false, error: 'Respostas de triagem incompletas' }, { status: 400 })
      }
      const row = {
        has_used: false,
        want_to_try: raw.want_to_try,
        know_someone: raw.know_someone,
        experience_rating: null as number | null,
        recommend: null as boolean | null,
        liked: '',
        improve: '',
        future_feature: '',
        helped_situation: '',
        additional: '',
      }

      const { data, error } = await supabaseAdmin
        .from('ylada_usage_survey_v1_responses')
        .insert(row)
        .select('id')
        .single()

      if (error) {
        console.error('[usage-survey-v1]', error)
        return NextResponse.json({ success: false, error: 'Não foi possível salvar' }, { status: 500 })
      }

      return NextResponse.json({ success: true, id: data?.id })
    }

    if (raw.has_used !== true) {
      return NextResponse.json({ success: false, error: 'Tipo de resposta inválido' }, { status: 400 })
    }

    const rating = Number(raw.experience_rating)
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Avaliação inválida' }, { status: 400 })
    }
    if (typeof raw.recommend !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Resposta de recomendação obrigatória' }, { status: 400 })
    }

    const row = {
      has_used: true,
      want_to_try: null as boolean | null,
      know_someone: null as boolean | null,
      experience_rating: rating,
      recommend: raw.recommend,
      liked: clampStr(raw.liked, 4000),
      improve: clampStr(raw.improve, 4000),
      future_feature: clampStr(raw.future_feature, 4000),
      helped_situation: clampStr(raw.helped_situation, 4000),
      additional: clampStr(raw.additional, 4000),
    }

    const { data, error } = await supabaseAdmin
      .from('ylada_usage_survey_v1_responses')
      .insert(row)
      .select('id')
      .single()

    if (error) {
      console.error('[usage-survey-v1]', error)
      return NextResponse.json({ success: false, error: 'Não foi possível salvar' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (e) {
    console.error('[usage-survey-v1]', e)
    return NextResponse.json({ success: false, error: 'Erro ao processar' }, { status: 500 })
  }
}
