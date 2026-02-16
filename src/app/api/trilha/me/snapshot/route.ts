/**
 * GET /api/trilha/me/snapshot
 * Retorna o Resumo Estratégico Atual do usuário (para o Noel injetar no prompt).
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

    const { data: snapshot, error } = await supabaseAdmin
      .from('user_strategy_snapshot')
      .select('snapshot_text, snapshot_json, updated_at')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('[trilha/me/snapshot]', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        snapshot_text: snapshot?.snapshot_text ?? null,
        snapshot_json: snapshot?.snapshot_json ?? {},
        updated_at: snapshot?.updated_at ?? null
      }
    })
  } catch (e) {
    console.error('[trilha/me/snapshot]', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao buscar snapshot' },
      { status: 500 }
    )
  }
}
