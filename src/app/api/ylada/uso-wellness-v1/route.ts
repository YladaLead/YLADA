/**
 * POST /api/ylada/uso-wellness-v1 — pesquisa wellness (sem auth).
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const CORE_KEYS = [
  'usage_description',
  'last_week',
  'shared_link',
  'diagnosis_replies',
  'works_best',
  'level_using',
  'more_frequency_effect',
  'help_use_more',
] as const

const NOEL_KEYS = [
  'noel_frequency',
  'noel_purpose',
  'noel_helped',
  'noel_easier',
  'noel_potential',
  'noel_barrier',
] as const

type Body = {
  optional_noel?: boolean
  answers?: Record<string, unknown>
}

function clampStr(s: unknown, max: number): string {
  if (typeof s !== 'string') return ''
  return s.trim().slice(0, max)
}

function isNonEmptyStr(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const raw = (await request.json().catch(() => ({}))) as Body
    const optionalNoel = raw.optional_noel === true
    const ans = raw.answers && typeof raw.answers === 'object' ? raw.answers : {}

    for (const k of CORE_KEYS) {
      if (!isNonEmptyStr(ans[k])) {
        return NextResponse.json({ success: false, error: 'Respostas principais incompletas' }, { status: 400 })
      }
    }

    const out: Record<string, string | number> = {}
    for (const k of CORE_KEYS) {
      out[k] = clampStr(ans[k], 120)
    }

    if (optionalNoel) {
      for (const k of NOEL_KEYS) {
        if (!isNonEmptyStr(ans[k])) {
          return NextResponse.json({ success: false, error: 'Bloco Noel incompleto' }, { status: 400 })
        }
        out[k] = clampStr(ans[k], 120)
      }
      const rating = Number(ans.noel_rating)
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return NextResponse.json({ success: false, error: 'Avaliação do Noel inválida' }, { status: 400 })
      }
      out.noel_rating = rating
      const barrier = String(ans.noel_barrier)
      const other = clampStr(ans.noel_barrier_other, 500)
      if (barrier === 'outro' && other.length < 2) {
        return NextResponse.json({ success: false, error: 'Descreva brevemente a opção "Outro"' }, { status: 400 })
      }
      if (other) out.noel_barrier_other = other
      out.noel_improve = clampStr(ans.noel_improve, 4000)
      out.noel_one_line = clampStr(ans.noel_one_line, 500)
    }

    const { data, error } = await supabaseAdmin
      .from('ylada_uso_wellness_v1_responses')
      .insert({ optional_noel: optionalNoel, answers: out })
      .select('id')
      .single()

    if (error) {
      console.error('[uso-wellness-v1]', error)
      return NextResponse.json({ success: false, error: 'Não foi possível salvar' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (e) {
    console.error('[uso-wellness-v1]', e)
    return NextResponse.json({ success: false, error: 'Erro ao processar' }, { status: 500 })
  }
}
