/**
 * GET /api/wellness/biblioteca/fluxos/[codigo]
 * 
 * Retorna um fluxo específico com todos os passos, scripts e dicas
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { codigo } = await params

    // Buscar fluxo
    const { data: fluxo, error: fluxoError } = await supabaseAdmin
      .from('wellness_fluxos')
      .select('*')
      .eq('codigo', codigo)
      .eq('ativo', true)
      .single()

    if (fluxoError || !fluxo) {
      return NextResponse.json(
        { error: 'Fluxo não encontrado' },
        { status: 404 }
      )
    }

    // Buscar passos
    const { data: passos, error: passosError } = await supabaseAdmin
      .from('wellness_fluxos_passos')
      .select('*')
      .eq('fluxo_id', fluxo.id)
      .order('numero', { ascending: true })

    // Buscar scripts e dicas para cada passo
    const passosCompletos = await Promise.all(
      (passos || []).map(async (passo) => {
        const [scriptsResult, dicasResult] = await Promise.all([
          supabaseAdmin
            .from('wellness_fluxos_scripts')
            .select('*')
            .eq('passo_id', passo.id)
            .order('ordem', { ascending: true }),
          supabaseAdmin
            .from('wellness_fluxos_dicas')
            .select('*')
            .eq('passo_id', passo.id)
            .order('ordem', { ascending: true })
        ])

        return {
          ...passo,
          scripts: scriptsResult.data || [],
          dicas: dicasResult.data || []
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        ...fluxo,
        passos: passosCompletos
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar fluxo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
