/**
 * GET /api/ylada/link-template-schema?template_id=<uuid>
 * Schema público do template (preview na biblioteca) — utilizador autenticado matriz / Pro.
 */
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAuthForYladaLinkCreation } from '@/lib/ylada-link-api-auth'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuthForYladaLinkCreation(request)
    if (auth instanceof NextResponse) return auth

    const templateId = request.nextUrl.searchParams.get('template_id')?.trim() ?? ''
    if (!templateId) {
      return NextResponse.json({ success: false, error: 'template_id é obrigatório' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: row, error } = await supabaseAdmin
      .from('ylada_link_templates')
      .select('id, name, type, schema_json')
      .eq('id', templateId)
      .eq('active', true)
      .maybeSingle()

    if (error) {
      console.error('[ylada/link-template-schema]', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    if (!row) {
      return NextResponse.json({ success: false, error: 'Template não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        type: row.type,
        schema_json: row.schema_json,
      },
    })
  } catch (e) {
    console.error('[ylada/link-template-schema]', e)
    return NextResponse.json({ success: false, error: 'Erro ao carregar template' }, { status: 500 })
  }
}
