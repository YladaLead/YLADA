import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  buildProLideresConsultoriaResponderUrl,
  generateConsultoriaShareToken,
} from '@/lib/pro-lideres-consultoria'
import { PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID } from '@/lib/pro-lideres-pre-diagnostico'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

/**
 * GET: link público do pré-diagnóstico do tenant (cria token na primeira vez) + contagem de respostas.
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

  const { ctx } = paid
  if (ctx.role !== 'leader') {
    return NextResponse.json({ error: 'Apenas o líder do espaço pode gerir o pré-diagnóstico.' }, { status: 403 })
  }

  const { data: mat, error: matErr } = await supabaseAdmin
    .from('pro_lideres_consultancy_materials')
    .select('id, title, description, is_published, material_kind')
    .eq('id', PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID)
    .maybeSingle()

  if (matErr || !mat || mat.material_kind !== 'formulario' || !mat.is_published) {
    return NextResponse.json(
      { error: 'Formulário de pré-diagnóstico ainda não está disponível. Execute as migrações recentes.' },
      { status: 503 }
    )
  }

  const tenantId = ctx.tenant.id

  const { data: existing } = await supabaseAdmin
    .from('pro_lideres_consultancy_share_links')
    .select('id, token, created_at')
    .eq('material_id', PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID)
    .eq('leader_tenant_id', tenantId)
    .is('expires_at', null)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  let token = existing?.token ?? null
  if (!token) {
    const newTok = generateConsultoriaShareToken()
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from('pro_lideres_consultancy_share_links')
      .insert({
        material_id: PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID,
        token: newTok,
        label: 'Pré-diagnóstico líder',
        leader_tenant_id: tenantId,
        expires_at: null,
      })
      .select('token')
      .single()
    if (insErr || !inserted?.token) {
      console.error('[pre-diagnostico] insert share link', insErr)
      return NextResponse.json({ error: 'Não foi possível criar o link público.' }, { status: 500 })
    }
    token = inserted.token
  }

  const origin = request.nextUrl.origin
  const responderUrl = buildProLideresConsultoriaResponderUrl(origin, token)

  const { count, error: cntErr } = await supabaseAdmin
    .from('pro_lideres_consultancy_form_responses')
    .select('*', { count: 'exact', head: true })
    .eq('material_id', PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID)
    .eq('leader_tenant_id', tenantId)

  if (cntErr) {
    console.error('[pre-diagnostico] count', cntErr)
  }

  return NextResponse.json({
    materialId: mat.id,
    materialTitle: mat.title,
    materialDescription: mat.description,
    responderPath: `/pro-lideres/consultoria/responder/${encodeURIComponent(token)}`,
    responderUrl,
    responseCount: count ?? 0,
  })
}
