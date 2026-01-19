import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/wellness/trial/presidentes-list
 * Retorna lista de presidentes autorizados (apenas ativos)
 * Endpoint público para usar no dropdown
 */
export async function GET(request: NextRequest) {
  try {
    const { data: presidentes, error } = await supabaseAdmin
      .from('presidentes_autorizados')
      .select('id, nome_completo')
      .eq('status', 'ativo')
      .order('nome_completo', { ascending: true })

    if (error) {
      console.error('❌ Erro ao buscar presidentes:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar lista de presidentes' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      presidentes: presidentes || [],
    })
  } catch (error: any) {
    console.error('❌ Erro ao listar presidentes:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao listar presidentes' },
      { status: 500 }
    )
  }
}
