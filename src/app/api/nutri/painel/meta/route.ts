import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

const MIN_META = 1
const MAX_META = 50

/**
 * PATCH - Atualizar meta semanal de conversas (Sistema de Conversas Ativas).
 * Body: { meta_conversas_semana: number }
 * Preparado para multiárea: mesmo campo pode ser usado por segmento no futuro.
 */
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta.' },
        { status: 500 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const raw = body.meta_conversas_semana ?? body.metaSemanal
    const value = typeof raw === 'string' ? parseInt(raw, 10) : Number(raw)

    if (Number.isNaN(value) || value < MIN_META || value > MAX_META) {
      return NextResponse.json(
        { error: `Meta semanal deve ser entre ${MIN_META} e ${MAX_META}.` },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({
        meta_conversas_semana: value,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)

    if (error) {
      if (error.message?.includes('column') || error.code === '42703') {
        return NextResponse.json(
          { error: 'Recurso ainda não disponível. Execute a migration 214.' },
          { status: 501 }
        )
      }
      console.error('Erro ao atualizar meta_conversas_semana:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar meta.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { meta_conversas_semana: value }
    })
  } catch (e: any) {
    console.error('Erro PATCH /api/nutri/painel/meta:', e)
    return NextResponse.json(
      { error: e?.message || 'Erro ao atualizar meta.' },
      { status: 500 }
    )
  }
}
