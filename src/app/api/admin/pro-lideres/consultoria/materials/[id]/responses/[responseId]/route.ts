import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isEsteticaConsultFunnelStage } from '@/lib/estetica-consultoria-funnel'

type Ctx = { params: Promise<{ id: string; responseId: string }> }

/** PATCH: estágio no funil admin (Kanban vista Pro líder). Corpo: { funnel_stage }. */
export async function PATCH(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  const { id: materialId, responseId } = await context.params
  const mid = typeof materialId === 'string' ? materialId.trim() : ''
  const rid = typeof responseId === 'string' ? responseId.trim() : ''
  if (!mid || !rid) {
    return NextResponse.json({ error: 'Parâmetros em falta.' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const rawStage = body.funnel_stage == null || body.funnel_stage === '' ? 'entrada' : String(body.funnel_stage).trim()
  const admin_funnel_stage = isEsteticaConsultFunnelStage(rawStage) ? rawStage : 'entrada'

  const { data: mat } = await supabaseAdmin
    .from('pro_lideres_consultancy_materials')
    .select('id, material_kind')
    .eq('id', mid)
    .maybeSingle()

  if (!mat || mat.material_kind !== 'formulario') {
    return NextResponse.json({ error: 'Material não encontrado ou não é formulário.' }, { status: 404 })
  }

  const { data: row } = await supabaseAdmin
    .from('pro_lideres_consultancy_form_responses')
    .select('id, material_id')
    .eq('id', rid)
    .maybeSingle()

  if (!row || row.material_id !== mid) {
    return NextResponse.json({ error: 'Resposta não encontrada neste material.' }, { status: 404 })
  }

  const { data, error } = await supabaseAdmin
    .from('pro_lideres_consultancy_form_responses')
    .update({ admin_funnel_stage })
    .eq('id', rid)
    .select('*')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'Erro ao atualizar estágio.' }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}

/** DELETE: remove uma resposta de formulário deste material (admin). */
export async function DELETE(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  const { id: materialId, responseId } = await context.params
  const mid = typeof materialId === 'string' ? materialId.trim() : ''
  const rid = typeof responseId === 'string' ? responseId.trim() : ''
  if (!mid || !rid) {
    return NextResponse.json({ error: 'Parâmetros em falta.' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: mat } = await supabaseAdmin
    .from('pro_lideres_consultancy_materials')
    .select('id, material_kind')
    .eq('id', mid)
    .maybeSingle()

  if (!mat || mat.material_kind !== 'formulario') {
    return NextResponse.json({ error: 'Material não encontrado ou não é formulário.' }, { status: 404 })
  }

  const { data: row } = await supabaseAdmin
    .from('pro_lideres_consultancy_form_responses')
    .select('id, material_id')
    .eq('id', rid)
    .maybeSingle()

  if (!row || row.material_id !== mid) {
    return NextResponse.json({ error: 'Resposta não encontrada neste material.' }, { status: 404 })
  }

  const { error: delErr } = await supabaseAdmin.from('pro_lideres_consultancy_form_responses').delete().eq('id', rid)

  if (delErr) {
    console.error('[admin form-responses delete]', delErr)
    return NextResponse.json({ error: 'Erro ao eliminar a resposta.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
