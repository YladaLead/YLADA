import { type NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import type { ProLideresScriptTemplateEntry, ProLideresScriptTemplateRow } from '@/types/leader-tenant'

function parseEntries(raw: unknown): ProLideresScriptTemplateEntry[] {
  if (!Array.isArray(raw)) return []
  const out: ProLideresScriptTemplateEntry[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const title = typeof o.title === 'string' ? o.title.trim() : ''
    const body = typeof o.body === 'string' ? o.body : ''
    if (!title || !body.trim()) continue
    const subtitle = o.subtitle === null || o.subtitle === undefined ? null : String(o.subtitle).trim() || null
    const how =
      o.how_to_use === null || o.how_to_use === undefined ? null : String(o.how_to_use).trim() || null
    out.push({ title, subtitle, body, how_to_use: how })
  }
  return out
}

/**
 * GET /api/pro-lideres/script-templates
 * Biblioteca YLADA (somente leitura). Filtros opcionais: focus_main, intention_key, tool_preset_key.
 */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  const { searchParams } = new URL(request.url)
  const focus = searchParams.get('focus_main')?.trim().toLowerCase()
  const intention = searchParams.get('intention_key')?.trim().toLowerCase()
  const tool = searchParams.get('tool_preset_key')?.trim().toLowerCase()

  let q = supabaseAdmin
    .from('pro_lideres_script_templates')
    .select(
      'id, focus_main, intention_key, tool_preset_key, title, subtitle, entries, sort_order, vertical_code, created_at, updated_at'
    )
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (focus === 'vendas' || focus === 'recrutamento') {
    q = q.eq('focus_main', focus)
  }
  if (intention && intention.length <= 64) {
    q = q.eq('intention_key', intention)
  }
  if (tool && tool.length <= 80) {
    q = q.eq('tool_preset_key', tool)
  }

  const { data, error } = await q

  if (error) {
    console.error('[pro-lideres/script-templates GET]', error)
    return NextResponse.json({ error: 'Erro ao carregar templates.' }, { status: 500 })
  }

  const vertical = (ctx.tenant.vertical_code ?? '').trim().toLowerCase() || 'h-lider'
  const rows = (data ?? []) as Record<string, unknown>[]
  const out: ProLideresScriptTemplateRow[] = []
  for (const r of rows) {
    const vcRaw = r.vertical_code
    if (vcRaw != null && String(vcRaw).trim() !== '') {
      const vcn = String(vcRaw).trim().toLowerCase()
      if (vcn !== vertical) continue
    }
    const id = typeof r.id === 'string' ? r.id : ''
    const fm = r.focus_main === 'recrutamento' ? 'recrutamento' : 'vendas'
    const ik = typeof r.intention_key === 'string' ? r.intention_key : 'geral'
    const tk = r.tool_preset_key == null ? null : String(r.tool_preset_key)
    const title = typeof r.title === 'string' ? r.title : ''
    const subtitle = r.subtitle == null ? null : String(r.subtitle)
    const entries = parseEntries(r.entries)
    if (!id || !title || entries.length < 1) continue
    out.push({
      id,
      focus_main: fm,
      intention_key: ik,
      tool_preset_key: tk,
      title,
      subtitle,
      entries,
      sort_order: typeof r.sort_order === 'number' ? r.sort_order : 0,
      vertical_code: vcRaw == null ? null : String(vcRaw),
      created_at: String(r.created_at ?? ''),
      updated_at: String(r.updated_at ?? ''),
    })
  }

  return NextResponse.json({ templates: out })
}
