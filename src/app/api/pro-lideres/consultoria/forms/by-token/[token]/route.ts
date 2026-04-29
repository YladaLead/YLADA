import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getConsultoriaFormFields, getConsultoriaFormUIHints } from '@/lib/pro-lideres-consultoria'

type Ctx = { params: Promise<{ token: string }> }

export async function GET(_request: NextRequest, context: Ctx) {
  const { token: raw } = await context.params
  const token = decodeURIComponent(raw || '').trim()
  if (!token) {
    return NextResponse.json({ error: 'Token em falta' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Indisponível' }, { status: 503 })
  }

  const { data: link, error: linkErr } = await supabaseAdmin
    .from('pro_lideres_consultancy_share_links')
    .select('id, material_id, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (linkErr || !link) {
    return NextResponse.json({ error: 'Link inválido ou expirado.' }, { status: 404 })
  }

  if (link.expires_at) {
    const exp = new Date(link.expires_at).getTime()
    if (Number.isFinite(exp) && exp < Date.now()) {
      return NextResponse.json({ error: 'Este link expirou.' }, { status: 410 })
    }
  }

  const { data: mat, error: matErr } = await supabaseAdmin
    .from('pro_lideres_consultancy_materials')
    .select('id, title, description, material_kind, content, is_published')
    .eq('id', link.material_id)
    .maybeSingle()

  if (matErr || !mat || mat.material_kind !== 'formulario') {
    return NextResponse.json({ error: 'Formulário não disponível.' }, { status: 404 })
  }

  if (!mat.is_published) {
    return NextResponse.json({ error: 'Este formulário ainda não está publicado.' }, { status: 403 })
  }

  const content = (mat.content && typeof mat.content === 'object' ? mat.content : {}) as Record<
    string,
    unknown
  >
  const fields = getConsultoriaFormFields(content)
  const ui = getConsultoriaFormUIHints(content)

  return NextResponse.json({
    title: mat.title,
    description: mat.description,
    fields,
    ui,
    shareLinkId: link.id,
  })
}
