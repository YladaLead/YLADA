import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { consultoriaCsvFilenameBase, consultoriaFormResponsesToCsv } from '@/lib/consultoria-form-csv'
import { supabaseAdmin } from '@/lib/supabase'
import { getConsultoriaFormFields } from '@/lib/pro-lideres-consultoria'
import { PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID } from '@/lib/pro-lideres-pre-diagnostico'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

/**
 * GET: respostas do pré-diagnóstico do tenant (JSON) ou ?format=csv para descarregar.
 */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  if (paid.ctx.role !== 'leader') {
    return NextResponse.json({ error: 'Apenas o líder do espaço pode ver as respostas.' }, { status: 403 })
  }

  const tenantId = paid.ctx.tenant.id
  const format = request.nextUrl.searchParams.get('format')?.trim().toLowerCase()

  const { data: mat, error: matErr } = await supabaseAdmin
    .from('pro_lideres_consultancy_materials')
    .select('id, content, material_kind')
    .eq('id', PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID)
    .maybeSingle()

  if (matErr || !mat || mat.material_kind !== 'formulario') {
    return NextResponse.json({ error: 'Formulário não encontrado.' }, { status: 404 })
  }

  const content = (mat.content && typeof mat.content === 'object' ? mat.content : {}) as Record<
    string,
    unknown
  >
  const fields = getConsultoriaFormFields(content)

  const { data: rows, error: rErr } = await supabaseAdmin
    .from('pro_lideres_consultancy_form_responses')
    .select(
      'id, submitted_at, respondent_name, respondent_email, respondent_whatsapp, answers, leader_tenant_id'
    )
    .eq('material_id', PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID)
    .eq('leader_tenant_id', tenantId)
    .order('submitted_at', { ascending: false })
    .limit(500)

  if (rErr) {
    return NextResponse.json({ error: 'Erro ao carregar respostas.' }, { status: 500 })
  }

  const items = (rows ?? []).map((r) => ({
    id: r.id as string,
    submitted_at: r.submitted_at as string,
    respondent_name: r.respondent_name as string | null,
    respondent_email: r.respondent_email as string | null,
    respondent_whatsapp: (r as { respondent_whatsapp?: string | null }).respondent_whatsapp ?? null,
    answers: r.answers,
  }))

  if (format === 'csv') {
    const csv = consultoriaFormResponsesToCsv(fields, items)
    const base = consultoriaCsvFilenameBase(paid.ctx.tenant.display_name || 'pro-lideres', 'pre-diagnostico')
    const filename = base.endsWith('.csv') ? base : `${base}.csv`
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  }

  return NextResponse.json({ items, fields })
}
