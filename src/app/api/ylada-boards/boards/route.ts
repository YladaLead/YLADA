import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET — lista os boards do usuário autenticado
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const { searchParams } = new URL(request.url)
  const area = searchParams.get('area') ?? 'geral'

  const { data, error } = await supabaseAdmin
    .from('yscripts_boards')
    .select('*, yscripts_cards(count)')
    .eq('tenant_id', `${auth.user.id}:${area}`)
    .order('ordem', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ boards: data ?? [] })
}

// POST — cria um novo board
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const body = await request.json() as { nome: string; emoji?: string; ordem?: number; area?: string }
  const area = body.area ?? 'geral'

  const { data, error } = await supabaseAdmin
    .from('yscripts_boards')
    .insert({
      tenant_id: `${auth.user.id}:${area}`,
      nome: body.nome,
      emoji: body.emoji ?? '📁',
      ordem: body.ordem ?? 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
