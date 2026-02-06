import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/nutri/agenda-cheia-inscritos
 * Lista inscritos da aula paga (workshop_type = aula_paga) para controle e lembretes.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { data: inscricoes, error } = await supabaseAdmin
      .from('workshop_inscricoes')
      .select('id, nome, email, telefone, status, created_at, updated_at, participacao_aula')
      .eq('workshop_type', 'aula_paga')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      inscricoes: inscricoes || [],
      total: (inscricoes || []).length,
    })
  } catch (error: any) {
    console.error('[Agenda Cheia Inscritos] Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao listar inscritos' },
      { status: 500 }
    )
  }
}
