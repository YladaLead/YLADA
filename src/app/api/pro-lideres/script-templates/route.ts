import { type NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { clipToolPresetKey } from '@/lib/pro-lideres-script-section-meta'
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

const TEMPLATE_SELECT_325 =
  'id, focus_main, intention_key, tool_preset_key, title, subtitle, usage_hint, sequence_label, conversation_stage, entries, sort_order, vertical_code, created_at, updated_at'

const TEMPLATE_SELECT_322 =
  'id, focus_main, intention_key, tool_preset_key, title, subtitle, entries, sort_order, vertical_code, created_at, updated_at'

function isMissingColumnOrSchemaError(err: { message?: string; code?: string } | null): boolean {
  if (!err?.message) return false
  const m = err.message.toLowerCase()
  return (
    m.includes('column') ||
    m.includes('does not exist') ||
    m.includes('schema cache') ||
    err.code === '42703'
  )
}

/**
 * GET /api/pro-lideres/script-templates
 * Biblioteca YLADA. Filtros: focus_main, intention_key, tool_preset_key, conversation_stage (325).
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

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  const { searchParams } = new URL(request.url)
  const focus = searchParams.get('focus_main')?.trim().toLowerCase()
  const intention = searchParams.get('intention_key')?.trim().toLowerCase()
  const tool = searchParams.get('tool_preset_key')?.trim().toLowerCase()
  const conversationStage = searchParams.get('conversation_stage')?.trim().toLowerCase()

  async function runSelect(selectList: string, canFilterStage: boolean) {
    let q = supabaseAdmin
      .from('pro_lideres_script_templates')
      .select(selectList)
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
    if (canFilterStage && conversationStage && conversationStage.length <= 32) {
      q = q.eq('conversation_stage', conversationStage)
    }
    return await q
  }

  let { data, error } = await runSelect(TEMPLATE_SELECT_325, true)

  if (error && isMissingColumnOrSchemaError(error)) {
    console.warn('[pro-lideres/script-templates GET] retry sem colunas 325:', error.message)
    const r2 = await runSelect(TEMPLATE_SELECT_322, false)
    data = r2.data
    error = r2.error
  }

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
    const tk = clipToolPresetKey(r.tool_preset_key)
    const title = typeof r.title === 'string' ? r.title : ''
    const subtitle = r.subtitle == null ? null : String(r.subtitle)
    const usage_hint =
      typeof r.usage_hint === 'string' && r.usage_hint.trim() ? String(r.usage_hint).trim() : null
    const sequence_label =
      typeof r.sequence_label === 'string' && r.sequence_label.trim() ? String(r.sequence_label).trim() : null
    const conversation_stage =
      typeof r.conversation_stage === 'string' && r.conversation_stage.trim()
        ? String(r.conversation_stage).trim()
        : null
    const entries = parseEntries(r.entries)
    if (!id || !title || entries.length < 1) continue
    out.push({
      id,
      focus_main: fm,
      intention_key: ik,
      tool_preset_key: tk,
      title,
      subtitle,
      usage_hint,
      sequence_label,
      conversation_stage,
      entries,
      sort_order: typeof r.sort_order === 'number' ? r.sort_order : 0,
      vertical_code: vcRaw == null ? null : String(vcRaw),
      created_at: String(r.created_at ?? ''),
      updated_at: String(r.updated_at ?? ''),
    })
  }

  return NextResponse.json({ templates: out })
}
