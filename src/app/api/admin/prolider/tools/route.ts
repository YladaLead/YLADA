import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET — lista todas as ferramentas (admin vê todas, ativas e inativas)
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const { data, error } = await supabaseAdmin
    .from('prolider_tools')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tools: data })
}

// POST — cria nova ferramenta
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  let body: { name?: string; emoji?: string; description?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const name = String(body.name ?? '').trim()
  const emoji = String(body.emoji ?? '🔧').trim()
  const description = String(body.description ?? '').trim()

  if (!name) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })

  // Pega o maior display_order atual para colocar a nova no final
  const { data: last } = await supabaseAdmin
    .from('prolider_tools')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const display_order = (last?.display_order ?? 0) + 1

  const { data, error } = await supabaseAdmin
    .from('prolider_tools')
    .insert({ name, emoji, description, is_active: false, display_order })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tool: data })
}
