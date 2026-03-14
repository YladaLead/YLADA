/**
 * GET /api/ylada/stats/links-created-today
 * Retorna quantos diagnósticos (links) foram criados hoje na plataforma (todos os usuários).
 * Usado na biblioteca para contador "Hoje já foram criados X diagnósticos na plataforma".
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

    const now = new Date()
    const startOfToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    const startIso = startOfToday.toISOString()

    const { count, error } = await supabaseAdmin
      .from('ylada_links')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startIso)

    if (error) {
      console.error('[ylada/stats/links-created-today]', error)
      return NextResponse.json({ success: false, error: 'Erro ao contar' }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: typeof count === 'number' ? count : 0 })
  } catch (e) {
    console.error('[ylada/stats/links-created-today]', e)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}
