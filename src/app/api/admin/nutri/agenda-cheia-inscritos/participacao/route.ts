import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * PATCH /api/admin/nutri/agenda-cheia-inscritos/participacao
 * Marca participação na aula paga: participou | nao_participou.
 * Body: { id: string, participacao: 'participou' | 'nao_participou' }
 */
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json().catch(() => ({}))
    const { id, participacao } = body as { id?: string; participacao?: string }

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ success: false, error: 'Informe o id do inscrito.' }, { status: 400 })
    }
    if (participacao !== 'participou' && participacao !== 'nao_participou') {
      return NextResponse.json({ success: false, error: 'participacao deve ser "participou" ou "nao_participou".' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('workshop_inscricoes')
      .update({
        participacao_aula: participacao,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('workshop_type', 'aula_paga')

    if (error) {
      console.error('[Agenda Cheia Participação]', error)
      return NextResponse.json(
        { success: false, error: error.message || 'Erro ao atualizar.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, participacao })
  } catch (error: any) {
    console.error('[Agenda Cheia Participação]', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao atualizar participação' },
      { status: 500 }
    )
  }
}
