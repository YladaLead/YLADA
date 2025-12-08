import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/wellness/pv/mensal
 * Obtém PV mensal do consultor e histórico
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const mesAno = searchParams.get('mes_ano') || new Date().toISOString().slice(0, 7) // '2025-01'

    // Buscar PV mensal atual
    const { data: pvMensal } = await supabaseAdmin
      .from('wellness_consultant_pv_monthly')
      .select('*')
      .eq('consultant_id', user.id)
      .eq('mes_ano', mesAno)
      .single()

    // Buscar histórico dos últimos 6 meses
    const { data: historico } = await supabaseAdmin
      .from('wellness_consultant_pv_monthly')
      .select('*')
      .eq('consultant_id', user.id)
      .order('mes_ano', { ascending: false })
      .limit(6)

    // Calcular PV total atual (se não existir registro)
    let pvTotal = pvMensal?.pv_total || 0
    if (!pvMensal) {
      const resultado = await supabaseAdmin.rpc('calcular_pv_mensal_consultor', {
        consultant_uuid: user.id,
        mes_ano_param: mesAno
      })
      pvTotal = resultado.data || 0
    }

    return NextResponse.json({
      success: true,
      pv_mensal: {
        mes_ano: mesAno,
        pv_total: pvTotal,
        pv_kits: pvMensal?.pv_kits || 0,
        pv_produtos_fechados: pvMensal?.pv_produtos_fechados || 0,
        meta_pv: pvMensal?.meta_pv || null
      },
      historico: historico || []
    })
  } catch (error: any) {
    console.error('❌ Erro no GET /api/wellness/pv/mensal:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

