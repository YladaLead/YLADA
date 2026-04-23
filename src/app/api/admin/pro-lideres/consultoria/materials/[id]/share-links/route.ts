import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { generateConsultoriaShareToken } from '@/lib/pro-lideres-consultoria'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { id: materialId } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: mat } = await supabaseAdmin
    .from('pro_lideres_consultancy_materials')
    .select('id, material_kind')
    .eq('id', materialId)
    .maybeSingle()

  if (!mat) {
    return NextResponse.json({ error: 'Material não encontrado' }, { status: 404 })
  }
  if (mat.material_kind !== 'formulario') {
    return NextResponse.json({ error: 'Só formulários têm links de resposta.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('pro_lideres_consultancy_share_links')
    .select('*')
    .eq('material_id', materialId)
    .order('created_at', { ascending: false })

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
    .from('pro_lideres_consultancy_materials')
    .select('id, material_kind, is_published')
    .eq('id', materialId)
    .maybeSingle()

  if (!mat) {
    return NextResponse.json({ error: 'Material não encontrado' }, { status: 404 })
  }
  if (mat.material_kind !== 'formulario') {
    return NextResponse.json({ error: 'Só formulários podem gerar link público.' }, { status: 400 })
  }

  let body: { label?: string | null; leader_tenant_id?: string | null; expires_at?: string | null }
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const label =
    body.label == null || body.label === '' ? null : String(body.label).trim().slice(0, 200)
  const leaderTenantId =
    body.leader_tenant_id == null || body.leader_tenant_id === ''
      ? null
      : String(body.leader_tenant_id).trim()
  const expiresAt =
    body.expires_at == null || body.expires_at === '' ? null : String(body.expires_at).trim()

  if (leaderTenantId) {
    const { data: lt } = await supabaseAdmin
      .from('leader_tenants')
      .select('id')
      .eq('id', leaderTenantId)
      .maybeSingle()
    if (!lt) {
      return NextResponse.json({ error: 'Tenant de líder inválido.' }, { status: 400 })
    }
  }

  const token = generateConsultoriaShareToken()

  const { data, error } = await supabaseAdmin
    .from('pro_lideres_consultancy_share_links')
    .insert({
      material_id: materialId,
      token,
      label,
      leader_tenant_id: leaderTenantId,
      expires_at: expiresAt,
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Erro ao criar link' }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}
