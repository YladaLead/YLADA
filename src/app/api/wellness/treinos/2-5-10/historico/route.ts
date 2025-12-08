/**
 * GET /api/wellness/treinos/2-5-10/historico
 * Retorna o histórico semanal do 2-5-10
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const dias = parseInt(searchParams.get('dias') || '7')

    // Calcular data inicial (hoje - dias)
    const dataFim = new Date()
    const dataInicio = new Date()
    dataInicio.setDate(dataInicio.getDate() - dias)

    // Buscar histórico
    const { data: historico, error } = await supabaseAdmin
      .from('wellness_progresso_2510')
      .select('*')
      .eq('user_id', user.id)
      .gte('data', dataInicio.toISOString().split('T')[0])
      .lte('data', dataFim.toISOString().split('T')[0])
      .order('data', { ascending: false })

    if (error) {
      console.error('❌ Erro ao buscar histórico:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar histórico' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: historico || []
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar histórico:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
