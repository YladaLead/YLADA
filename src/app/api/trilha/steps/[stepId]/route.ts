/**
 * GET /api/trilha/steps/[stepId]
 * Detalhe de um step da Trilha Empresarial.
 * Autenticação obrigatória.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stepId: string }> }
) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth

    const { stepId } = await params
    if (!stepId) {
      return NextResponse.json({ success: false, error: 'stepId obrigatório' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: step, error } = await supabaseAdmin
      .from('trilha_steps')
      .select('*')
      .eq('id', stepId)
      .single()

    if (error || !step) {
      return NextResponse.json(
        { success: false, error: error?.message || 'Step não encontrado' },
        { status: error?.code === 'PGRST116' ? 404 : 500 }
      )
    }

    const need = step.need_id
      ? await supabaseAdmin.from('trilha_needs').select('id, code, type, title').eq('id', step.need_id).single().then((r) => r.data)
      : null

    return NextResponse.json({ success: true, data: { step: { ...step, need } } })
  } catch (e) {
    console.error('[trilha/steps]', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao buscar step' },
      { status: 500 }
    )
  }
}
