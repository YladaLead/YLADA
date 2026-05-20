import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { sanitizeProLideresScriptCopy } from '@/lib/pro-lideres-script-copy-sanitize'

const VALID_STAGES = ['gerar_contato', 'abordagem', 'followup', 'objecoes']
type Params = { params: Promise<{ toolId: string }> }

// GET — lista scripts de uma ferramenta
export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })

  const { toolId } = await params
  const isOwner = ctx.role === 'leader'

  let query = supabaseAdmin
    .from('prolider_scripts')
    .select('*')
    .eq('tool_id', toolId)
    .eq('tenant_id', ctx.tenant.id)
    .order('stage')
    .order('display_order', { ascending: true })

  if (!isOwner) query = query.eq('is_active', true)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ scripts: data, canEdit: isOwner })
}

// POST — cria script na ferramenta
export async function POST(request: NextRequest, { params }: Params) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  if (!supabaseAdmin) return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, auth.user)
  if (!ctx) return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  if (ctx.role !== 'leader') return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })

  const { toolId } = await params
  let body: { stage?: string; title?: string; content?: string; contexto?: string; canal?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const stage = String(body.stage ?? '').trim()
  const content = String(body.content ?? '').trim()
  const title = String(body.title ?? '').trim()
  const VALID_PUBLICOS = ['geral', 'lista_quente', 'lista_fria', 'indicacao']
  const VALID_CANAIS   = ['geral', 'presencial', 'online']
  const contexto = VALID_PUBLICOS.includes(String(body.contexto ?? '')) ? String(body.contexto) : 'geral'
  const canal    = VALID_CANAIS.includes(String(body.canal ?? ''))   ? String(body.canal)    : 'geral'

  if (!VALID_STAGES.includes(stage)) return NextResponse.json({ error: 'stage inválido' }, { status: 400 })
  if (!content) return NextResponse.json({ error: 'Conteúdo obrigatório' }, { status: 400 })

  // Garante que a ferramenta pertence ao tenant
  const { data: tool } = await supabaseAdmin
    .from('prolider_tools')
    .select('id')
    .eq('id', toolId)
    .eq('tenant_id', ctx.tenant.id)
    .single()
  if (!tool) return NextResponse.json({ error: 'Ferramenta não encontrada' }, { status: 404 })

  const { data: last } = await supabaseAdmin
    .from('prolider_scripts')
    .select('display_order')
    .eq('tool_id', toolId)
    .eq('stage', stage)
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const { data, error } = await supabaseAdmin
    .from('prolider_scripts')
    .insert({
      tenant_id: ctx.tenant.id,
      tool_id: toolId,
      stage,
      contexto,
      canal,
      title: title ? sanitizeProLideresScriptCopy(title) : null,
      content: sanitizeProLideresScriptCopy(content),
      display_order: (last?.display_order ?? 0) + 1,
      is_active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ script: data })
}
