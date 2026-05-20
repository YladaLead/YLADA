import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'

export type ProliderToolRow = {
  id: string
  name: string
  emoji: string
  description: string | null
  is_active: boolean
  display_order: number
}

export type ProliderScriptRow = {
  id: string
  tool_id: string
  stage: string
  contexto: string | null
  canal: string | null
  title: string | null
  content: string
  is_active: boolean
  display_order: number
}

export type YScriptsFolderPayload = {
  tool: ProliderToolRow
  scripts: ProliderScriptRow[]
}

// GET — pastas (ferramentas) + scripts do tenant para Y-Scripts
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })

  const isOwner = ctx.role === 'leader'

  let toolsQuery = supabaseAdmin
    .from('prolider_tools')
    .select('id, name, emoji, description, is_active, display_order')
    .eq('tenant_id', ctx.tenant.id)
    .order('display_order', { ascending: true })

  if (!isOwner) toolsQuery = toolsQuery.eq('is_active', true)

  const { data: tools, error: toolsErr } = await toolsQuery
  if (toolsErr) return NextResponse.json({ error: toolsErr.message }, { status: 500 })

  const toolRows = (tools ?? []) as ProliderToolRow[]
  if (toolRows.length === 0) {
    return NextResponse.json({ folders: [] as YScriptsFolderPayload[] })
  }

  const toolIds = toolRows.map((t) => t.id)

  let scriptsQuery = supabaseAdmin
    .from('prolider_scripts')
    .select('id, tool_id, stage, contexto, canal, title, content, is_active, display_order')
    .eq('tenant_id', ctx.tenant.id)
    .in('tool_id', toolIds)
    .order('stage')
    .order('display_order', { ascending: true })

  if (!isOwner) scriptsQuery = scriptsQuery.eq('is_active', true)

  const { data: scripts, error: scriptsErr } = await scriptsQuery
  if (scriptsErr) return NextResponse.json({ error: scriptsErr.message }, { status: 500 })

  const byTool = new Map<string, ProliderScriptRow[]>()
  for (const s of (scripts ?? []) as ProliderScriptRow[]) {
    const list = byTool.get(s.tool_id) ?? []
    list.push(s)
    byTool.set(s.tool_id, list)
  }

  const folders: YScriptsFolderPayload[] = toolRows.map((tool) => ({
    tool,
    scripts: byTool.get(tool.id) ?? [],
  }))

  return NextResponse.json({ folders })
}
