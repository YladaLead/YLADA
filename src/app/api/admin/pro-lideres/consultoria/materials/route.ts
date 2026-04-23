import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  defaultContentForKind,
  getConsultoriaFormFields,
  isConsultoriaMaterialKind,
  normalizeConsultoriaContent,
} from '@/lib/pro-lideres-consultoria'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const kind = request.nextUrl.searchParams.get('kind')?.trim()
  let q = supabaseAdmin
    .from('pro_lideres_consultancy_materials')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (kind && isConsultoriaMaterialKind(kind)) {
    q = q.eq('material_kind', kind)
  }

  const { data, error } = await q
  if (error) {
    return NextResponse.json({ error: 'Erro ao listar materiais' }, { status: 500 })
  }

  return NextResponse.json({ items: data ?? [] })
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: {
    title?: string
    material_kind?: string
    description?: string | null
    content?: unknown
    sort_order?: number
    is_published?: boolean
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const title = String(body.title ?? '').trim().slice(0, 300)
  const materialKind = String(body.material_kind ?? '').trim()
  if (title.length < 2) {
    return NextResponse.json({ error: 'Título demasiado curto.' }, { status: 400 })
  }
  if (!isConsultoriaMaterialKind(materialKind)) {
    return NextResponse.json({ error: 'Tipo de material inválido.' }, { status: 400 })
  }

  const description =
    body.description == null || body.description === ''
      ? null
      : String(body.description).trim().slice(0, 4000)

  const content = normalizeConsultoriaContent(
    materialKind,
    body.content ?? defaultContentForKind(materialKind)
  )

  if (materialKind === 'formulario' && getConsultoriaFormFields(content).length === 0) {
    return NextResponse.json(
      { error: 'Formulário precisa de pelo menos um campo com id e pergunta.' },
      { status: 400 }
    )
  }

  const sortOrder = Number.isFinite(Number(body.sort_order)) ? Math.trunc(Number(body.sort_order)) : 0
  const isPublished = Boolean(body.is_published)

  const { data, error } = await supabaseAdmin
    .from('pro_lideres_consultancy_materials')
    .insert({
      title,
      material_kind: materialKind,
      description,
      content,
      sort_order: sortOrder,
      is_published: isPublished,
      created_by_user_id: user.id,
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Erro ao criar material' }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}
