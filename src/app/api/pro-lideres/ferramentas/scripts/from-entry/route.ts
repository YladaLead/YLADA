import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'

const VALID_STAGES = ['gerar_contato', 'abordagem', 'followup', 'objecoes']

/**
 * POST — Copia um script do Noel (script_entry) para uma ferramenta.
 * Body: { entry_id, tool_id, stage }
 * Não apaga o original — o líder decide depois.
 */
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (ctx.role !== 'leader') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  let body: { entry_id?: string; tool_id?: string; stage?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const entry_id = String(body.entry_id ?? '').trim()
  const tool_id = String(body.tool_id ?? '').trim()
  const stage = String(body.stage ?? '').trim()

  if (!entry_id) return NextResponse.json({ error: 'entry_id obrigatório' }, { status: 400 })
  if (!tool_id) return NextResponse.json({ error: 'tool_id obrigatório' }, { status: 400 })
  if (!VALID_STAGES.includes(stage)) return NextResponse.json({ error: 'stage inválido' }, { status: 400 })

  // Busca a entry do Noel (tabela leader_tenant_pl_script_entries)
  const { data: entry, error: entryErr } = await supabaseAdmin
    .from('leader_tenant_pl_script_entries')
    .select('id, title, subtitle, body, how_to_use, section_id')
    .eq('id', entry_id)
    .single()

  if (entryErr || !entry) return NextResponse.json({ error: 'Script não encontrado' }, { status: 404 })

  // Confirma que a ferramenta pertence ao tenant
  const { data: tool } = await supabaseAdmin
    .from('prolider_tools')
    .select('id')
    .eq('id', tool_id)
    .eq('tenant_id', ctx.tenant.id)
    .single()

  if (!tool) return NextResponse.json({ error: 'Ferramenta não encontrada' }, { status: 404 })

  // Monta conteúdo: junta título + subtítulo + corpo do script Noel
  const lines: string[] = []
  if (entry.title?.trim()) lines.push(entry.title.trim())
  if (entry.subtitle?.trim()) lines.push(entry.subtitle.trim())
  if (entry.body?.trim()) lines.push('', entry.body.trim())
  const content = lines.join('\n').trim()

  if (!content) return NextResponse.json({ error: 'Script sem conteúdo para mover' }, { status: 400 })

  // Pega maior display_order para colocar no final
  const { data: last } = await supabaseAdmin
    .from('prolider_scripts')
    .select('display_order')
    .eq('tool_id', tool_id)
    .eq('stage', stage)
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const { data: newScript, error: insertErr } = await supabaseAdmin
    .from('prolider_scripts')
    .insert({
      tenant_id: ctx.tenant.id,
      tool_id,
      stage,
      title: entry.title?.trim() || null,
      content,
      display_order: (last?.display_order ?? 0) + 1,
      is_active: true,
    })
    .select()
    .single()

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

  return NextResponse.json({ script: newScript, ok: true })
}
