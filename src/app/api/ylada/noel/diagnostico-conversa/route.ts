/**
 * GET /api/ylada/noel/diagnostico-conversa
 * Lista o histórico de diagnósticos da conversa do profissional.
 * Query: segment (opcional), limit (default 20)
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_SEGMENT_CODES } from '@/config/ylada-areas'
import { supabaseAdmin } from '@/lib/supabase'

const ALLOWED_PROFILES = [
  'ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller',
  'perfumaria', 'estetica', 'fitness', 'nutri', 'admin',
] as const

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const { searchParams } = new URL(request.url)
    const segment = (searchParams.get('segment') || 'ylada').toLowerCase()
    const validSegment = YLADA_SEGMENT_CODES.includes(segment as (typeof YLADA_SEGMENT_CODES)[number])
      ? segment
      : 'ylada'
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10) || 20, 50)

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { data, error } = await supabaseAdmin
      .from('ylada_noel_conversation_diagnosis')
      .select('id, user_message, bloqueio, estrategia, exemplo, assistant_response, created_at')
      .eq('user_id', user.id)
      .eq('segment', validSegment)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[/api/ylada/noel/diagnostico-conversa]', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
      segment: validSegment,
    })
  } catch (error: unknown) {
    console.error('[/api/ylada/noel/diagnostico-conversa]', error)
    const message = error instanceof Error ? error.message : 'Erro ao buscar histórico.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
