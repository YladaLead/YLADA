import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { sanitizeProLideresScriptCopy } from '@/lib/pro-lideres-script-copy-sanitize'

type Params = { params: Promise<{ scriptId: string }> }

// PATCH — edita script
export async function PATCH(request: NextRequest, { params }: Params) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (ctx.role !== 'leader') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const { scriptId } = await params
  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const VALID_PUBLICOS = ['geral', 'lista_quente', 'lista_fria', 'indicacao']
  const VALID_CANAIS   = ['geral', 'presencial', 'online']
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.title !== undefined) {
    updates.title = body.title ? sanitizeProLideresScriptCopy(String(body.title)) : null
  }
  if (body.content !== undefined) updates.content = sanitizeProLideresScriptCopy(String(body.content))
  if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active)
  if (body.contexto !== undefined && VALID_PUBLICOS.includes(String(body.contexto))) {
    updates.contexto = String(body.contexto)
  }
  if (body.canal !== undefined && VALID_CANAIS.includes(String(body.canal))) {
    updates.canal = String(body.canal)
  }

  const { data, error } = await supabaseAdmin
    .from('prolider_scripts')
    .update(updates)
    .eq('id', scriptId)
    .eq('tenant_id', ctx.tenant.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ script: data })
}

// DELETE — remove script
export async function DELETE(request: NextRequest, { params }: Params) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (ctx.role !== 'leader') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const { scriptId } = await params

  const { error } = await supabaseAdmin
    .from('prolider_scripts')
    .delete()
    .eq('id', scriptId)
    .eq('tenant_id', ctx.tenant.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
