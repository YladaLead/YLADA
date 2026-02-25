import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/wellness/presidente/status
 * Retorna se o usuário logado é presidente (tem conta vinculada em presidentes_autorizados).
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data, error } = await supabaseAdmin
      .from('presidentes_autorizados')
      .select('id, autoriza_equipe_automatico, data_autorizacao_equipe_automatico')
      .eq('user_id', user.id)
      .eq('status', 'ativo')
      .maybeSingle()

    if (error) {
      console.error('Erro ao verificar presidente:', error)
      return NextResponse.json({ isPresidente: false })
    }

    return NextResponse.json({
      isPresidente: !!data,
      presidenteId: data?.id ?? null,
      autorizaEquipeAutomatico: data?.autoriza_equipe_automatico ?? false,
      dataAutorizacaoEquipe: data?.data_autorizacao_equipe_automatico ?? null,
    })
  } catch {
    return NextResponse.json({ isPresidente: false })
  }
}
