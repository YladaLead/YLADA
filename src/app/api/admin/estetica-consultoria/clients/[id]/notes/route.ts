import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

const NOTE_KINDS = ['observacao', 'recomendacao', 'evolucao', 'acompanhamento'] as const

type Ctx = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { id: clientId } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: client } = await supabaseAdmin
    .from('ylada_estetica_consult_clients')
    .select('id')
    .eq('id', clientId)
    .maybeSingle()
  if (!client) {
    return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
  }

  const { data, error } = await supabaseAdmin
    .from('ylada_estetica_consult_coaching_notes')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    return NextResponse.json({ error: 'Erro ao listar notas' }, { status: 500 })
  }

  return NextResponse.json({ items: data ?? [] })
}

export async function POST(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { user } = auth
  const { id: clientId } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: client } = await supabaseAdmin
    .from('ylada_estetica_consult_clients')
    .select('id')
    .eq('id', clientId)
    .maybeSingle()
  if (!client) {
    return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
  }

  let body: { body?: string; note_kind?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const text = String(body.body ?? '').trim().slice(0, 50000)
  if (text.length < 2) {
    return NextResponse.json({ error: 'Escreve a nota (mínimo 2 caracteres).' }, { status: 400 })
  }

  const rawKind = String(body.note_kind ?? 'acompanhamento').trim().toLowerCase()
  const noteKind = (NOTE_KINDS as readonly string[]).includes(rawKind) ? rawKind : 'acompanhamento'

  const { data, error } = await supabaseAdmin
    .from('ylada_estetica_consult_coaching_notes')
    .insert({
      client_id: clientId,
      body: text,
      note_kind: noteKind,
      created_by_user_id: user.id,
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Erro ao guardar nota' }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}
