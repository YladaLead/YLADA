import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'

type Params = { params: Promise<{ toolId: string }> }

// PATCH — atualiza ferramenta
export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (ctx.role !== 'leader') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const { toolId } = await params
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.name !== undefined) updates.name = String(body.name).trim()
  if (body.emoji !== undefined) updates.emoji = String(body.emoji).trim()
  if (body.description !== undefined) updates.description = String(body.description).trim() || null
  if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active)
  if (body.telegram_link !== undefined) updates.telegram_link = String(body.telegram_link).trim() || null

  const { data, error } = await supabaseAdmin
    .from('prolider_tools')
    .update(updates)
    .eq('id', toolId)
    .eq('tenant_id', ctx.tenant.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tool: data })
}

// DELETE — remove ferramenta e seus scripts (cascata)
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (ctx.role !== 'leader') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const { toolId } = await params

  const { error } = await supabaseAdmin
    .from('prolider_tools')
    .delete()
    .eq('id', toolId)
    .eq('tenant_id', ctx.tenant.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
