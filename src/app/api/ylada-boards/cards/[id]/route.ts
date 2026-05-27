import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

type Ctx = { params: Promise<{ id: string }> }

// PUT — edita título, conteúdo, categoria, canal ou ordem do card
export async function PUT(request: NextRequest, ctx: Ctx) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const { id } = await ctx.params
  const body = await request.json() as {
    titulo?: string
    conteudo?: string
    categoria?: string
    canal?: string
    ordem?: number
  }

  // Re-detecta variáveis se o conteúdo foi alterado
  const updates: Record<string, unknown> = { ...body, atualizado_em: new Date().toISOString() }
  if (body.conteudo) {
    updates.variaveis = [...body.conteudo.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1])
  }

  const { data, error } = await supabaseAdmin
    .from('ylada_board_cards')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE — apaga card
export async function DELETE(request: NextRequest, ctx: Ctx) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const { id } = await ctx.params

  const { error } = await supabaseAdmin
    .from('ylada_board_cards')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
