import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

type Ctx = { params: Promise<{ id: string }> }

// PUT — edita nome ou emoji do board
export async function PUT(request: NextRequest, ctx: Ctx) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const { id } = await ctx.params
  const body = await request.json() as { nome?: string; emoji?: string; ordem?: number }

  const { data, error } = await supabaseAdmin
    .from('ylada_boards')
    .update({ ...body, atualizado_em: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE — apaga board e todos os cards (CASCADE no banco)
export async function DELETE(request: NextRequest, ctx: Ctx) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const { id } = await ctx.params

  const { error } = await supabaseAdmin
    .from('ylada_boards')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
