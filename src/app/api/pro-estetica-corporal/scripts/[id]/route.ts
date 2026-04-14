import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveEsteticaCorporalTenantContext } from '@/lib/pro-estetica-corporal-server'
import type { LeaderTenantEsteticaScriptRow } from '@/types/leader-tenant'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const MAX_TITLE = 200
const MAX_BODY = 20000

function clipTitle(v: unknown): string | null {
  if (v === null || v === undefined) return null
  const s = String(v).trim().slice(0, MAX_TITLE)
  return s.length ? s : null
}

function clipBody(v: unknown): string {
  if (v === null || v === undefined) return ''
  return String(v).slice(0, MAX_BODY)
}

function normalizeCategory(v: unknown): 'captar' | 'retencao' | 'acompanhar' | 'geral' | undefined {
  if (v === undefined) return undefined
  const c = typeof v === 'string' ? v.trim() : ''
  if (c === 'captar' || c === 'retencao' || c === 'acompanhar' || c === 'geral') return c
  return undefined
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  const { id } = await context.params
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Sem acesso ao espaço Pro Estética Corporal.' }, { status: 403 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o profissional responsável pode editar scripts.' }, { status: 403 })
  }

  let body: { title?: unknown; body?: unknown; sort_order?: unknown; category?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const payload: Record<string, string | number> = {}
  if (body.title !== undefined) {
    const t = clipTitle(body.title)
    if (!t) return NextResponse.json({ error: 'Título inválido.' }, { status: 400 })
    payload.title = t
  }
  if (body.body !== undefined) {
    payload.body = clipBody(body.body)
  }
  if (body.sort_order !== undefined && typeof body.sort_order === 'number' && Number.isFinite(body.sort_order)) {
    payload.sort_order = Math.floor(body.sort_order)
  }
  const cat = normalizeCategory(body.category)
  if (cat !== undefined) payload.category = cat

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 })
  }

  const { data: updated, error } = await supabaseAdmin
    .from('leader_tenant_estetica_scripts')
    .update(payload)
    .eq('id', id)
    .eq('leader_tenant_id', ctx.tenant.id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('[pro-estetica-corporal/scripts PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar.' }, { status: 500 })
  }

  if (!updated) {
    return NextResponse.json({ error: 'Script não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ script: updated as LeaderTenantEsteticaScriptRow })
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  const { id } = await context.params
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Sem acesso ao espaço Pro Estética Corporal.' }, { status: 403 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o profissional responsável pode apagar scripts.' }, { status: 403 })
  }

  const { data: removed, error } = await supabaseAdmin
    .from('leader_tenant_estetica_scripts')
    .delete()
    .eq('id', id)
    .eq('leader_tenant_id', ctx.tenant.id)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('[pro-estetica-corporal/scripts DELETE]', error)
    return NextResponse.json({ error: 'Erro ao apagar.' }, { status: 500 })
  }

  if (!removed) {
    return NextResponse.json({ error: 'Script não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
