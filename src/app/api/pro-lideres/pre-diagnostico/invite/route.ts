import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { buildProLideresConsultoriaResponderUrl, generateConsultoriaShareToken } from '@/lib/pro-lideres-consultoria'
import { PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID } from '@/lib/pro-lideres-pre-diagnostico'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

/**
 * POST: cria um novo token de convite (URL única) para o pré-diagnóstico do tenant.
 * Cada pessoa convidada deve receber o seu próprio link.
 */
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  if (paid.ctx.role !== 'leader') {
    return NextResponse.json({ error: 'Apenas o líder do espaço pode gerar convites.' }, { status: 403 })
  }

  const { data: mat, error: matErr } = await supabaseAdmin
    .from('pro_lideres_consultancy_materials')
    .select('id, material_kind, is_published')
    .eq('id', PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID)
    .maybeSingle()

  if (matErr || !mat || mat.material_kind !== 'formulario' || !mat.is_published) {
    return NextResponse.json({ error: 'Formulário de pré-diagnóstico indisponível.' }, { status: 503 })
  }

  let label = `Convite — ${new Date().toISOString().slice(0, 10)}`
  try {
    const body = (await request.json().catch(() => null)) as { label?: unknown } | null
    const raw = body?.label
    if (typeof raw === 'string') {
      const t = raw.trim().slice(0, 120)
      if (t) label = t
    }
  } catch {
    /* ignore */
  }

  const newTok = generateConsultoriaShareToken()
  const tenantId = paid.ctx.tenant.id

  const { data: inserted, error: insErr } = await supabaseAdmin
    .from('pro_lideres_consultancy_share_links')
    .insert({
      material_id: PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID,
      token: newTok,
      label,
      leader_tenant_id: tenantId,
      expires_at: null,
    })
    .select('id, token, created_at, label')
    .single()

  if (insErr || !inserted?.token) {
    console.error('[pre-diagnostico/invite] insert', insErr)
    return NextResponse.json({ error: 'Não foi possível criar o convite.' }, { status: 500 })
  }

  const origin = request.nextUrl.origin
  const responderUrl = buildProLideresConsultoriaResponderUrl(origin, inserted.token)

  return NextResponse.json({
    responderPath: `/pro-lideres/consultoria/responder/${encodeURIComponent(inserted.token)}`,
    responderUrl,
    invite: {
      id: inserted.id,
      token: inserted.token,
      createdAt: inserted.created_at,
      label: inserted.label,
    },
  })
}
