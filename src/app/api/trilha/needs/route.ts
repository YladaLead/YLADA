/**
 * GET /api/trilha/needs
 * Lista necessidades (Fundamentos + Necessidades) da Trilha Empresarial.
 * Query: ?steps=1 para incluir steps de cada need (playbook).
 * Autenticação obrigatória.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request)
    if (auth instanceof NextResponse) return auth

    const { searchParams } = new URL(request.url)
    const includeSteps = searchParams.get('steps') === '1'

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: needs, error: needsError } = await supabaseAdmin
      .from('trilha_needs')
      .select('*')
      .order('order_index', { ascending: true })

    if (needsError) {
      console.error('[trilha/needs]', needsError)
      return NextResponse.json(
        { success: false, error: needsError.message },
        { status: 500 }
      )
    }

    if (!includeSteps || !needs?.length) {
      return NextResponse.json({ success: true, data: { needs: needs || [] } })
    }

    const needIds = (needs || []).map((n: { id: string }) => n.id)
    const { data: steps, error: stepsError } = await supabaseAdmin
      .from('trilha_steps')
      .select('*')
      .in('need_id', needIds)
      .order('order_index', { ascending: true })

    if (stepsError) {
      console.error('[trilha/needs] steps', stepsError)
      return NextResponse.json({ success: true, data: { needs: needs || [] } })
    }

    const stepsByNeed: Record<string, unknown[]> = {}
    for (const s of steps || []) {
      const nid = (s as { need_id: string }).need_id
      if (!stepsByNeed[nid]) stepsByNeed[nid] = []
      stepsByNeed[nid].push(s)
    }

    const needsWithSteps = (needs || []).map((n: { id: string }) => ({
      ...n,
      steps: stepsByNeed[n.id] || []
    }))

    return NextResponse.json({ success: true, data: { needs: needsWithSteps } })
  } catch (e) {
    console.error('[trilha/needs]', e)
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Erro ao listar necessidades' },
      { status: 500 }
    )
  }
}
