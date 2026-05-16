import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'

// GET — lista ferramentas do tenant (líder vê todas; membro vê só ativas)
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })

  const isOwner = ctx.role === 'leader'
  let query = supabaseAdmin
    .from('prolider_tools')
    .select('*')
    .eq('tenant_id', ctx.tenant.id)
    .order('display_order', { ascending: true })

  // Membros só veem ferramentas ativas
  if (!isOwner) query = query.eq('is_active', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tools: data, canEdit: isOwner })
}

// POST — cria nova ferramenta (só owner/líder)
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (ctx.role !== 'leader') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  let body: { name?: string; emoji?: string; description?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const name = String(body.name ?? '').trim()
  const emoji = String(body.emoji ?? '🔧').trim()
  const description = String(body.description ?? '').trim()
  if (!name) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })

  const { data: last } = await supabaseAdmin
    .from('prolider_tools')
    .select('display_order')
    .eq('tenant_id', ctx.tenant.id)
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const { data, error } = await supabaseAdmin
    .from('prolider_tools')
    .insert({
      tenant_id: ctx.tenant.id,
      name,
      emoji,
      description: description || null,
      is_active: false,
      display_order: (last?.display_order ?? 0) + 1,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tool: data })
}
