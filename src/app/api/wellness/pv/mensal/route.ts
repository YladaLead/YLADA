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

/**
 * PUT /api/wellness/pv/mensal
 * Atualiza meta de PV mensal do consultor
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { mes_ano, meta_pv } = body

    const mesAnoFinal = mes_ano || new Date().toISOString().slice(0, 7)

    // Validar meta_pv
    if (meta_pv !== undefined && meta_pv !== null) {
      const pvValue = typeof meta_pv === 'string' ? parseInt(meta_pv) : meta_pv
      if (isNaN(pvValue) || pvValue < 100 || pvValue > 50000) {
        return NextResponse.json(
          { error: 'Meta de PV deve estar entre 100 e 50.000' },
          { status: 400 }
        )
      }

      // Atualizar ou criar registro mensal
      const { data, error } = await supabaseAdmin
        .from('wellness_consultant_pv_monthly')
        .upsert({
          consultant_id: user.id,
          mes_ano: mesAnoFinal,
          meta_pv: pvValue,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'consultant_id,mes_ano'
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao atualizar meta de PV:', error)
        return NextResponse.json(
          { error: 'Erro ao atualizar meta de PV', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        pv_mensal: data
      })
    }

    return NextResponse.json(
      { error: 'meta_pv é obrigatório' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('❌ Erro no PUT /api/wellness/pv/mensal:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

