/**
 * GET /api/ylada/links — lista links do usuário logado.
 * @see docs/PROGRAMACAO-ESTRUTURAL-YLADA.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data, error } = await supabaseAdmin
      .from('ylada_links')
      .select('id, slug, title, template_id, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[ylada/links]', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    const host = request.headers.get('host') || ''
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const baseUrl = host ? `${protocol}://${host}` : ''
    const list = (data ?? []).map((row) => ({
      ...row,
      url: baseUrl ? `${baseUrl}/l/${row.slug}` : `/l/${row.slug}`,
    }))

    return NextResponse.json({ success: true, data: list })
  } catch (e) {
    console.error('[ylada/links]', e)
    return NextResponse.json({ success: false, error: 'Erro ao listar links' }, { status: 500 })
  }
}
