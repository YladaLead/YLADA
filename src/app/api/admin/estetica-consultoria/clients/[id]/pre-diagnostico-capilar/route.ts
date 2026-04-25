import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  buildEsteticaConsultoriaResponderUrl,
  generateEsteticaConsultoriaShareToken,
} from '@/lib/estetica-consultoria'
import { ensurePreDiagnosticoCapilarGlobalMaterialId } from '@/lib/estetica-consultoria-global-forms'

type Ctx = { params: Promise<{ id: string }> }

/** Painel: material global pré-capilar + links + respostas desta clínica (sem gate de e-mail). */
export async function GET(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { id: clientId } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: cli, error: cErr } = await supabaseAdmin
    .from('ylada_estetica_consult_clients')
    .select('id, business_name, segment')
    .eq('id', clientId)
    .maybeSingle()

  if (cErr || !cli) {
    return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
  }

  const seg = String(cli.segment ?? '')
  if (seg !== 'capilar' && seg !== 'ambos') {
    return NextResponse.json({ error: 'Pré-diagnóstico capilar só para segmento Capilar ou Ambos.' }, { status: 400 })
  }

  let materialId: string
  try {
    materialId = await ensurePreDiagnosticoCapilarGlobalMaterialId(supabaseAdmin)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const { data: material, error: mErr } = await supabaseAdmin
    .from('ylada_estetica_consultancy_materials')
    .select('*')
    .eq('id', materialId)
    .maybeSingle()

  if (mErr || !material) {
    return NextResponse.json({ error: 'Material global não encontrado' }, { status: 500 })
  }

  const { data: links, error: lErr } = await supabaseAdmin
    .from('ylada_estetica_consultancy_share_links')
    .select('*')
    .eq('material_id', materialId)
    .eq('estetica_consult_client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (lErr) {
    return NextResponse.json({ error: 'Erro ao listar links' }, { status: 500 })
  }

  const { data: responses, error: rErr } = await supabaseAdmin
    .from('ylada_estetica_consultancy_form_responses')
    .select('*')
    .eq('material_id', materialId)
    .eq('estetica_consult_client_id', clientId)
    .order('submitted_at', { ascending: false })
    .limit(500)

  if (rErr) {
    return NextResponse.json({ error: 'Erro ao listar respostas' }, { status: 500 })
  }

  const origin = request.nextUrl.origin

  return NextResponse.json({
    client: { id: cli.id, business_name: cli.business_name, segment: cli.segment },
    material,
    links: (links ?? []).map((lk: { token: string; id: string; label: string | null; created_at: string }) => ({
      ...lk,
      responder_url: buildEsteticaConsultoriaResponderUrl(origin, lk.token),
    })),
    responses: responses ?? [],
  })
}

export async function POST(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { id: clientId } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: cli, error: cErr } = await supabaseAdmin
    .from('ylada_estetica_consult_clients')
    .select('id, segment')
    .eq('id', clientId)
    .maybeSingle()

  if (cErr || !cli) {
    return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
  }

  const seg = String(cli.segment ?? '')
  if (seg !== 'capilar' && seg !== 'ambos') {
    return NextResponse.json({ error: 'Segmento inválido para este pré-diagnóstico.' }, { status: 400 })
  }

  let body: { label?: string | null; expires_at?: string | null }
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const label =
    body.label == null || body.label === '' ? null : String(body.label).trim().slice(0, 200)
  const expiresAt =
    body.expires_at == null || body.expires_at === '' ? null : String(body.expires_at).trim()

  let materialId: string
  try {
    materialId = await ensurePreDiagnosticoCapilarGlobalMaterialId(supabaseAdmin)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  const token = generateEsteticaConsultoriaShareToken()

  const { data, error } = await supabaseAdmin
    .from('ylada_estetica_consultancy_share_links')
    .insert({
      material_id: materialId,
      estetica_consult_client_id: clientId,
      token,
      label,
      expires_at: expiresAt,
      recipient_email: null,
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Erro ao criar link' }, { status: 500 })
  }

  const origin = request.nextUrl.origin
  return NextResponse.json({
    item: {
      ...data,
      responder_url: buildEsteticaConsultoriaResponderUrl(origin, token),
    },
  })
}
