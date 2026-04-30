import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isEsteticaConsultFunnelStage } from '@/lib/estetica-consultoria-funnel'

type Ctx = { params: Promise<{ id: string }> }

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Atualiza só o estágio do funil admin (Kanban). */
export async function PATCH(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { id: raw } = await context.params
  const id = (raw ?? '').trim()
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const rawStage = body.funnel_stage == null || body.funnel_stage === '' ? 'entrada' : String(body.funnel_stage).trim()
  const admin_funnel_stage = isEsteticaConsultFunnelStage(rawStage) ? rawStage : 'entrada'

  const { data, error } = await supabaseAdmin
    .from('pro_lideres_leader_onboarding_links')
    .update({ admin_funnel_stage })
    .eq('id', id)
    .select('*')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'Erro ao atualizar estágio.' }, { status: 500 })
  }
  if (!data) {
    return NextResponse.json({ error: 'Link não encontrado.' }, { status: 404 })
  }

  return NextResponse.json({ item: data })
}

/** Remove um registo de link de onboarding (duplicados, testes, etc.). */
export async function DELETE(_request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(_request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { id: raw } = await context.params
  const id = (raw ?? '').trim()
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('pro_lideres_leader_onboarding_links')
    .delete()
    .eq('id', id)
    .select('id')

  if (error) {
    return NextResponse.json({ error: 'Não foi possível excluir o link.' }, { status: 500 })
  }
  if (!data?.length) {
    return NextResponse.json({ error: 'Link não encontrado.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
