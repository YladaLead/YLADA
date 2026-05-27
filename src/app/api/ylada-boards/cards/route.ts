import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET — lista cards de um board
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const { searchParams } = new URL(request.url)
  const board_id = searchParams.get('board_id')
  if (!board_id) return NextResponse.json({ error: 'board_id obrigatório' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('yscripts_cards')
    .select('*')
    .eq('board_id', board_id)
    .order('ordem', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ cards: data ?? [] })
}

// POST — cria card detectando variáveis {{nome}} automaticamente
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const body = await request.json() as {
    board_id: string
    tenant_id: string
    titulo: string
    conteudo: string
    categoria?: string
    canal?: string
    ordem?: number
  }

  const variaveis = [...body.conteudo.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1])

  const { data, error } = await supabaseAdmin
    .from('yscripts_cards')
    .insert({
      board_id: body.board_id,
      tenant_id: body.tenant_id,
      titulo: body.titulo,
      conteudo: body.conteudo,
      categoria: body.categoria ?? 'geral',
      canal: body.canal ?? 'whatsapp',
      ordem: body.ordem ?? 0,
      variaveis,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
