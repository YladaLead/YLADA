import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

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
    return NextResponse.json({ error: 'Respostas só existem para formulários.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('pro_lideres_consultancy_form_responses')
    .select('*')
    .eq('material_id', materialId)
    .order('submitted_at', { ascending: false })
    .limit(500)

  if (error) {
    return NextResponse.json({ error: 'Erro ao carregar respostas' }, { status: 500 })
  }

  return NextResponse.json({ items: data ?? [] })
}
