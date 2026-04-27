import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveEsteticaCapilarTenantContext } from '@/lib/pro-estetica-capilar-server'
import type { LeaderTenantEsteticaScriptRow } from '@/types/leader-tenant'

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

function normalizeCategory(v: unknown): 'captar' | 'retencao' | 'acompanhar' | 'geral' {
  const c = typeof v === 'string' ? v.trim() : ''
  if (c === 'captar' || c === 'retencao' || c === 'acompanhar' || c === 'geral') return c
  return 'geral'
}

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCapilarTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Sem acesso ao espaço Pro Estética Capilar.' }, { status: 403 })
  }

  const { data, error } = await supabaseAdmin
    .from('leader_tenant_estetica_scripts')
    .select('id, leader_tenant_id, title, body, sort_order, category, created_at, updated_at')
    .eq('leader_tenant_id', ctx.tenant.id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[pro-estetica-capilar/scripts GET]', error)
    return NextResponse.json({ error: 'Erro ao carregar scripts.' }, { status: 500 })
  }

  return NextResponse.json({
    scripts: (data ?? []) as LeaderTenantEsteticaScriptRow[],
    canEdit: ctx.tenant.owner_user_id === user.id,
  })
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCapilarTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Sem acesso ao espaço Pro Estética Capilar.' }, { status: 403 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o profissional responsável pode criar scripts.' }, { status: 403 })
  }

  let body: { title?: unknown; body?: unknown; sort_order?: unknown; category?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const title = clipTitle(body.title)
  if (!title) {
    return NextResponse.json({ error: 'Título é obrigatório.' }, { status: 400 })
  }

  const text = clipBody(body.body)
  const sort_order =
    typeof body.sort_order === 'number' && Number.isFinite(body.sort_order) ? Math.floor(body.sort_order) : 0
  const category = normalizeCategory(body.category)

  const { data: inserted, error } = await supabaseAdmin
    .from('leader_tenant_estetica_scripts')
    .insert({
      leader_tenant_id: ctx.tenant.id,
      title,
      body: text,
      sort_order,
      category,
    })
    .select()
    .single()

  if (error) {
    console.error('[pro-estetica-capilar/scripts POST]', error)
    return NextResponse.json({ error: 'Erro ao criar script.' }, { status: 500 })
  }

  return NextResponse.json({ script: inserted as LeaderTenantEsteticaScriptRow })
}
