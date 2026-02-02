import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireApiAuth } from '@/lib/api-auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function normalizeContext(input: any): Record<string, any> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {}
  return input as Record<string, any>
}

function getTags(context: any): string[] {
  const ctx = normalizeContext(context)
  const tags = (ctx as any).tags
  return Array.isArray(tags) ? tags.filter((t) => typeof t === 'string') : []
}

/**
 * POST /api/admin/whatsapp/v2/manual-mode
 * Marca conversas como "modo manual" (pausa respostas automáticas) ou reativa.
 *
 * Body:
 * - ids: string[] (obrigatório)
 * - enabled: boolean (obrigatório) // true = manual, false = automático
 */
export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json().catch(() => ({}))
    const ids = Array.isArray(body?.ids) ? body.ids.filter((x: any) => typeof x === 'string' && x.trim()) : []
    const enabled = body?.enabled === true
    const now = new Date().toISOString()

    if (ids.length === 0) {
      return NextResponse.json({ error: 'ids é obrigatório (array de IDs)' }, { status: 400 })
    }

    // Buscar context atual para preservar tags e mergear manual_mode
    const { data: rows, error: fetchError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, context')
      .in('id', ids)

    if (fetchError) throw fetchError

    const payload = (rows || []).map((r: any) => {
      const prev = normalizeContext(r.context)
      const prevTags = getTags(prev)
      const nextTags = enabled
        ? Array.from(new Set([...prevTags, 'manual_mode', 'atendimento_manual']))
        : prevTags.filter((t) => t !== 'manual_mode' && t !== 'atendimento_manual')

      const next = {
        ...prev,
        manual_mode: enabled,
        tags: nextTags,
      }

      return {
        id: r.id,
        context: next,
        updated_at: now,
      }
    })

    if (payload.length === 0) {
      return NextResponse.json({ success: true, updated: 0 })
    }

    // ⚠️ Importante: NÃO usar upsert aqui.
    // Em algumas configurações o upsert tenta inserir primeiro, e isso falha por colunas NOT NULL (ex.: instance_id).
    // Aqui nós só queremos atualizar conversas EXISTENTES.
    let updated = 0
    const errors: Array<{ id: string; error: string }> = []
    for (const row of payload) {
      const { error: updateError } = await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context: row.context,
          updated_at: now,
        })
        .eq('id', row.id)
      if (updateError) {
        errors.push({ id: row.id, error: updateError.message })
      } else {
        updated++
      }
    }

    return NextResponse.json({
      success: true,
      updated,
      errors: errors.length ? errors : undefined,
      enabled,
    })
  } catch (error: any) {
    console.error('[WhatsApp v2 Manual Mode] Erro:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao atualizar modo manual' },
      { status: 500 }
    )
  }
}

