import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { generateEsteticaConsultoriaShareToken } from '@/lib/estetica-consultoria'
import {
  TEMPLATE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_DIAGNOSTICO_CORPORAL_ID,
} from '@/lib/estetica-consultoria-form-templates'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { id: materialId } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: mat } = await supabaseAdmin
    .from('ylada_estetica_consultancy_materials')
    .select('id, material_kind, client_id, template_key')
    .eq('id', materialId)
    .maybeSingle()

  if (!mat) {
    return NextResponse.json({ error: 'Material não encontrado' }, { status: 404 })
  }
  if (mat.material_kind !== 'formulario') {
    return NextResponse.json({ error: 'Só formulários têm links de resposta.' }, { status: 400 })
  }

  let q = supabaseAdmin
    .from('ylada_estetica_consultancy_share_links')
    .select('*')
    .eq('material_id', materialId)
    .order('created_at', { ascending: false })

  const clientFilter = request.nextUrl.searchParams.get('estetica_consult_client_id')?.trim()
  if (clientFilter && mat.template_key) {
    q = q.eq('estetica_consult_client_id', clientFilter)
  }

  const { data, error } = await q

  if (error) {
    return NextResponse.json({ error: 'Erro ao listar links' }, { status: 500 })
  }

  return NextResponse.json({ items: data ?? [] })
}

export async function POST(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { id: materialId } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: mat } = await supabaseAdmin
    .from('ylada_estetica_consultancy_materials')
    .select('id, material_kind, is_published, client_id, template_key')
    .eq('id', materialId)
    .maybeSingle()

  if (!mat) {
    return NextResponse.json({ error: 'Material não encontrado' }, { status: 404 })
  }
  if (mat.material_kind !== 'formulario') {
    return NextResponse.json({ error: 'Só formulários podem gerar link público.' }, { status: 400 })
  }

  let body: { label?: string | null; expires_at?: string | null; estetica_consult_client_id?: string | null }
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const label =
    body.label == null || body.label === '' ? null : String(body.label).trim().slice(0, 200)
  const expiresAt =
    body.expires_at == null || body.expires_at === '' ? null : String(body.expires_at).trim()

  const isGlobal = mat.client_id == null && mat.template_key
  let targetClientId: string | null = mat.client_id as string | null
  if (isGlobal) {
    const cid =
      body.estetica_consult_client_id == null || body.estetica_consult_client_id === ''
        ? ''
        : String(body.estetica_consult_client_id).trim()
    if (!cid) {
      return NextResponse.json(
        { error: 'Para formulário global, envia estetica_consult_client_id no corpo (clínica destino).' },
        { status: 400 }
      )
    }
    const { data: cli } = await supabaseAdmin
      .from('ylada_estetica_consult_clients')
      .select('id, segment')
      .eq('id', cid)
      .maybeSingle()
    if (!cli) {
      return NextResponse.json({ error: 'Cliente inválido.' }, { status: 400 })
    }
    const seg = String(cli.segment ?? '')
    const tk = String(mat.template_key ?? '')
    if (tk === TEMPLATE_DIAGNOSTICO_CORPORAL_ID) {
      if (seg !== 'corporal' && seg !== 'ambos') {
        return NextResponse.json({ error: 'Diagnóstico corporal: cliente tem de ser Corporal ou Ambos.' }, { status: 400 })
      }
    } else if (tk === TEMPLATE_DIAGNOSTICO_CAPILAR_ID) {
      if (seg !== 'capilar' && seg !== 'ambos') {
        return NextResponse.json({ error: 'Diagnóstico capilar: cliente tem de ser Capilar ou Ambos.' }, { status: 400 })
      }
    }
    targetClientId = cid
  }

  const token = generateEsteticaConsultoriaShareToken()

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  let recipientEmail: string | null = null
  const tplKey = String(mat.template_key ?? '')
  if (isGlobal && (tplKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID || tplKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID)) {
    const { data: cliEm } = await supabaseAdmin
      .from('ylada_estetica_consult_clients')
      .select('contact_email')
      .eq('id', targetClientId as string)
      .maybeSingle()
    const em =
      cliEm && (cliEm as { contact_email?: string | null }).contact_email
        ? String((cliEm as { contact_email: string }).contact_email).trim().toLowerCase()
        : ''
    if (!em || !EMAIL_RE.test(em)) {
      const msgCap =
        tplKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID ? 'diagnóstico capilar' : 'diagnóstico corporal'
      return NextResponse.json(
        {
          error: `Para o ${msgCap}, a clínica precisa de um e-mail válido nos dados administrativos antes de gerar o link.`,
        },
        { status: 400 }
      )
    }
    recipientEmail = em
  }

  const { data, error } = await supabaseAdmin
    .from('ylada_estetica_consultancy_share_links')
    .insert({
      material_id: materialId,
      estetica_consult_client_id: targetClientId,
      token,
      label,
      expires_at: expiresAt,
      ...(recipientEmail ? { recipient_email: recipientEmail } : {}),
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Erro ao criar link' }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}
