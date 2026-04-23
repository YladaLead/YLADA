import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { TEMPLATE_DIAGNOSTICO_CORPORAL_ID } from '@/lib/estetica-consultoria-form-templates'
import {
  getConsultoriaFormFields,
  isConsultoriaMaterialKind,
  normalizeConsultoriaContent,
  type ProLideresConsultoriaMaterialKind,
} from '@/lib/pro-lideres-consultoria'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { id } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: existing, error: loadErr } = await supabaseAdmin
    .from('ylada_estetica_consultancy_materials')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (loadErr || !existing) {
    return NextResponse.json({ error: 'Material não encontrado' }, { status: 404 })
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

  const templateKey = (existing as { template_key?: string | null }).template_key
  const isGlobal = Boolean(templateKey)
  if (isGlobal) {
    if (body.title !== undefined || body.material_kind !== undefined || body.sort_order !== undefined) {
      return NextResponse.json(
        { error: 'Formulário global: só podes alterar descrição, publicado e conteúdo dos campos.' },
        { status: 400 }
      )
    }
  }
  if (templateKey === TEMPLATE_DIAGNOSTICO_CORPORAL_ID) {
    if (body.content !== undefined || body.description !== undefined) {
      return NextResponse.json(
        {
          error:
            'O diagnóstico corporal YLADA é fixo no sistema (sempre o mesmo). Não é editável pelo painel — só por código.',
        },
        { status: 400 }
      )
    }
  }

  const existingKind = String(existing.material_kind)
  const kindNext: ProLideresConsultoriaMaterialKind = isConsultoriaMaterialKind(
    body.material_kind != null ? String(body.material_kind) : existingKind
  )
    ? ((body.material_kind != null ? String(body.material_kind) : existingKind) as ProLideresConsultoriaMaterialKind)
    : (existingKind as ProLideresConsultoriaMaterialKind)

  const patch: Record<string, unknown> = {}

  if (body.title !== undefined) {
    const title = String(body.title).trim().slice(0, 300)
    if (title.length < 2) {
      return NextResponse.json({ error: 'Título demasiado curto.' }, { status: 400 })
    }
    patch.title = title
  }

  if (body.material_kind !== undefined) {
    if (!isConsultoriaMaterialKind(String(body.material_kind))) {
      return NextResponse.json({ error: 'Tipo de material inválido.' }, { status: 400 })
    }
    patch.material_kind = body.material_kind
  }

  if (body.description !== undefined) {
    patch.description =
      body.description == null || body.description === ''
        ? null
        : String(body.description).trim().slice(0, 4000)
  }

  if (body.sort_order !== undefined) {
    patch.sort_order = Number.isFinite(Number(body.sort_order)) ? Math.trunc(Number(body.sort_order)) : 0
  }

  if (body.is_published !== undefined) {
    patch.is_published = Boolean(body.is_published)
  }

  if (body.content !== undefined || body.material_kind !== undefined) {
    const source = body.content !== undefined ? body.content : existing.content
    patch.content = normalizeConsultoriaContent(kindNext, source)
  }

  const contentToCheck =
    (patch.content as Record<string, unknown> | undefined) ?? (existing.content as Record<string, unknown>)
  if (kindNext === 'formulario' && getConsultoriaFormFields(contentToCheck).length === 0) {
    return NextResponse.json(
      { error: 'Formulário precisa de pelo menos um campo com id e pergunta.' },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('ylada_estetica_consultancy_materials')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}

export async function DELETE(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { id } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: row } = await supabaseAdmin
    .from('ylada_estetica_consultancy_materials')
    .select('template_key')
    .eq('id', id)
    .maybeSingle()

  if (row?.template_key) {
    return NextResponse.json({ error: 'Materiais globais do sistema não podem ser eliminados aqui.' }, { status: 403 })
  }

  const { error } = await supabaseAdmin.from('ylada_estetica_consultancy_materials').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: 'Erro ao eliminar' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
