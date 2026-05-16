import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET — retorna configurações globais (link do Telegram)
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const { data, error } = await supabaseAdmin
    .from('prolider_settings')
    .select('*')
    .limit(1)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ settings: data })
}

// PATCH — atualiza link do Telegram
export async function PATCH(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  let body: { telegram_link?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  // Pega o id da linha existente
  const { data: existing } = await supabaseAdmin
    .from('prolider_settings')
    .select('id')
    .limit(1)
    .single()

  if (!existing?.id) return NextResponse.json({ error: 'Settings não encontrado' }, { status: 404 })

  const { data, error } = await supabaseAdmin
    .from('prolider_settings')
    .update({ telegram_link: body.telegram_link ?? null, updated_at: new Date().toISOString() })
    .eq('id', existing.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ settings: data })
}
