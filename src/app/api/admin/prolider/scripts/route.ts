import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET — lista scripts de uma ferramenta (?tool_id=xxx)
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const { searchParams } = new URL(request.url)
  const tool_id = searchParams.get('tool_id')

  let query = supabaseAdmin
    .from('prolider_scripts')
    .select('*')
    .order('stage')
    .order('display_order', { ascending: true })

  if (tool_id) query = query.eq('tool_id', tool_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ scripts: data })
}

// POST — cria novo script
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  let body: { tool_id?: string; stage?: string; title?: string; content?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const tool_id = String(body.tool_id ?? '').trim()
  const stage = String(body.stage ?? '').trim()
  const content = String(body.content ?? '').trim()
  const title = String(body.title ?? '').trim()

  if (!tool_id) return NextResponse.json({ error: 'tool_id obrigatório' }, { status: 400 })
  if (!['gerar_contato', 'abordagem', 'followup', 'objecoes'].includes(stage)) {
    return NextResponse.json({ error: 'stage inválido' }, { status: 400 })
  }
  if (!content) return NextResponse.json({ error: 'Conteúdo do script obrigatório' }, { status: 400 })

  // Maior display_order dentro deste tool+stage
  const { data: last } = await supabaseAdmin
    .from('prolider_scripts')
    .select('display_order')
    .eq('tool_id', tool_id)
    .eq('stage', stage)
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const display_order = (last?.display_order ?? 0) + 1

  const { data, error } = await supabaseAdmin
    .from('prolider_scripts')
    .insert({ tool_id, stage, title: title || null, content, display_order, is_active: true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ script: data })
}
