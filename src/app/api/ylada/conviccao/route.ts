/**
 * ETAPA 1 — CONVICÇÃO. Autodiagnóstico do próprio negócio (Sujeito A).
 *
 * GET  /api/ylada/conviccao?segment=ylada  → { concluido, diagnostico|null }
 * POST /api/ylada/conviccao                → salva respostas, calcula perfil + devolutiva, upsert.
 *      body: { segment, respostas: { [perguntaId]: label } }
 *
 * Tabela: ylada_conviccao_diagnostico (unique user_id+segment). Ver Etapa1_Conviccao_Spec.md.
 * @see src/lib/conviccao/conviccao-autodiagnostico.ts
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  CONVICCAO_PERGUNTAS,
  calcularConviccaoPerfil,
  getConviccaoDevolutiva,
} from '@/lib/conviccao/conviccao-autodiagnostico'

const VALID_SEGMENTS = [
  'ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach',
  'seller', 'perfumaria', 'estetica', 'fitness', 'joias', 'coach-bem-estar',
] as const

function normalizeSegment(raw: unknown): string {
  const s = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
  return VALID_SEGMENTS.includes(s as (typeof VALID_SEGMENTS)[number]) ? s : 'ylada'
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const segment = normalizeSegment(new URL(request.url).searchParams.get('segment'))

    const { data, error } = await supabaseAdmin
      .from('ylada_conviccao_diagnostico')
      .select('*')
      .eq('user_id', user.id)
      .eq('segment', segment)
      .maybeSingle()

    if (error) {
      console.error('[ylada/conviccao] GET', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      concluido: !!data,
      diagnostico: data ?? null,
    })
  } catch (e) {
    console.error('[ylada/conviccao] GET', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao buscar diagnóstico' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const body = await request.json().catch(() => ({}))
    const segment = normalizeSegment((body as Record<string, unknown>).segment)
    const respostasRaw = (body as Record<string, unknown>).respostas

    if (!respostasRaw || typeof respostasRaw !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Body deve conter respostas: { [perguntaId]: label }.' },
        { status: 400 }
      )
    }

    // Aceita apenas perguntas conhecidas (evita lixo no banco)
    const respostas: Record<string, string> = {}
    for (const pergunta of CONVICCAO_PERGUNTAS) {
      const v = (respostasRaw as Record<string, unknown>)[pergunta.id]
      if (typeof v === 'string' && v.trim()) respostas[pergunta.id] = v.trim()
    }

    if (Object.keys(respostas).length < CONVICCAO_PERGUNTAS.length) {
      return NextResponse.json(
        { success: false, error: 'Responda todas as perguntas antes de concluir.' },
        { status: 400 }
      )
    }

    const { perfil, pct, score, max } = calcularConviccaoPerfil(respostas)
    const devolutiva = getConviccaoDevolutiva(perfil)

    const row = {
      user_id: user.id,
      segment,
      respostas,
      perfil,
      score,
      pct: Math.round(pct * 100) / 100,
      devolutiva,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabaseAdmin
      .from('ylada_conviccao_diagnostico')
      .upsert(row, { onConflict: 'user_id,segment' })
      .select()
      .single()

    if (error) {
      console.error('[ylada/conviccao] POST', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      diagnostico: data,
      perfil,
      score,
      max,
      devolutiva,
    })
  } catch (e) {
    console.error('[ylada/conviccao] POST', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao salvar diagnóstico' },
      { status: 500 }
    )
  }
}
