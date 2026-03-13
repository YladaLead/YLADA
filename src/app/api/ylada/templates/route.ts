/**
 * GET /api/ylada/templates — lista templates ativos para gerar links.
 * @see docs/PROGRAMACAO-ESTRUTURAL-YLADA.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...YLADA_API_ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data, error } = await supabaseAdmin
      .from('ylada_link_templates')
      .select('id, name, type, version, suggested_prompts')
      .eq('active', true)
      .order('name')

    if (error) {
      console.error('[ylada/templates]', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (e) {
    console.error('[ylada/templates]', e)
    return NextResponse.json({ success: false, error: 'Erro ao listar templates' }, { status: 500 })
  }
}
