/**
 * POST /api/ylada/uso-wellness-v1 — pesquisa wellness (sem auth).
 * Núcleo: resultado percebido + hábitos do método + barreira + texto aberto.
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const CORE_KEYS = [
  'result_conversations',
  'result_organized',
  'weekly_usage',
  'links_count',
  'share_link_doubts',
  'asked_noel_before',
  'shared_link_week',
  'followup_after_reply',
  'uses_noel_weekly',
  'main_barrier',
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
    out.open_suggestion = clampStr(ans.open_suggestion, 4000)
    out.survey_version = 'wellness_v3_method'

    for (const k of NOEL_KEYS) {
      if (!isNonEmptyStr(ans[k])) {
        return NextResponse.json({ success: false, error: 'Respostas sobre o Noel incompletas' }, { status: 400 })
      }
      out[k] = clampStr(ans[k], 120)
    }
    const barrier = String(ans.noel_barrier)
    const other = clampStr(ans.noel_barrier_other, 500)
    if (barrier === 'outro' && other.length < 2) {
      return NextResponse.json({ success: false, error: 'Descreva brevemente a opção "Outro"' }, { status: 400 })
    }
    if (other) out.noel_barrier_other = other
    out.noel_improve = clampStr(ans.noel_improve, 4000)
    out.noel_one_line = clampStr(ans.noel_one_line, 500)

    const { data, error } = await supabaseAdmin
      .from('ylada_uso_wellness_v1_responses')
      .insert({ optional_noel: true, answers: out })
      .select('id')
      .single()

    if (error) {
      console.error('[uso-wellness-v1]', error)
      const msg = String(error.message || '')
      const code = String((error as { code?: string }).code || '')
      const hint = String((error as { hint?: string }).hint || '')
      const blob = `${msg} ${code} ${hint}`

      const missingTable = /relation|does not exist|schema cache|42P01/i.test(blob)
      const rlsOrDenied =
        /row-level security|violates row-level|permission denied|42501|PGRST301|not allowed/i.test(blob)
      const networkFetchFailed =
        /fetch failed|ECONNREFUSED|ENOTFOUND|getaddrinfo|ECONNRESET|certificate|SSL|UNABLE_TO_VERIFY_LEAF_SIGNATURE/i.test(
          msg
        )

      let errorText = 'Não foi possível salvar'
      if (networkFetchFailed) {
        errorText =
          'Não foi possível salvar: o servidor Next não conseguiu conectar ao Supabase pela rede (não chegou nem a validar login no banco). Confira NEXT_PUBLIC_SUPABASE_URL no .env.local, internet, VPN/firewall e DNS; reinicie o next dev após alterar o .env.'
      } else if (missingTable) {
        errorText =
          'Não foi possível salvar: a tabela não existe neste projeto Supabase (rode o SQL da migration 299 no mesmo projeto do .env.local).'
      } else if (rlsOrDenied) {
        errorText =
          'Não foi possível salvar: o banco recusou o insert (RLS/permissão). No servidor, use SUPABASE_SERVICE_ROLE_KEY (chave “service_role”, longa, do painel Project Settings → API) — não a anon “public”. Ela precisa ser do mesmo projeto que NEXT_PUBLIC_SUPABASE_URL.'
      }

      if (process.env.NODE_ENV === 'development' && msg.trim()) {
        errorText = `${errorText} [técnico: ${msg}]`
      }

      const payload: Record<string, unknown> = { success: false, error: errorText }
      if (process.env.NODE_ENV === 'development') {
        payload.debug = { supabaseMessage: msg, code: code || null, hint: hint || null }
      }
      return NextResponse.json(payload, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (e) {
    console.error('[uso-wellness-v1]', e)
    return NextResponse.json({ success: false, error: 'Erro ao processar' }, { status: 500 })
  }
}
