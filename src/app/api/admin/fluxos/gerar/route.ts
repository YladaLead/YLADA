/**
 * POST /api/admin/fluxos/gerar
 * 
 * Gera um novo fluxo/diagnóstico usando o agente criador IA.
 * Apenas admin pode acessar.
 * 
 * Body:
 * - tema?: string (opcional)
 * - segmento: string (obrigatório)
 * - arquitetura: 'RISK_DIAGNOSIS' | 'BLOCKER_DIAGNOSIS' | 'PROFILE_TYPE'
 * - comando?: string (opcional - comando personalizado)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { gerarFluxoComAgente } from '@/lib/flux-creator-handler'
import { supabaseAdmin } from '@/lib/supabase'
import type { BibliotecaSegmentCode } from '@/config/ylada-biblioteca'

export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { tema, segmentos, segmento, arquitetura, comando } = body

    // Suportar tanto array (novo) quanto string (compatibilidade)
    const segmentosArray: BibliotecaSegmentCode[] = segmentos 
      ? (Array.isArray(segmentos) ? segmentos : [segmentos])
      : (segmento ? [segmento] : [])

    // Validações
    if (!segmentosArray || segmentosArray.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Selecione pelo menos um segmento' },
        { status: 400 }
      )
    }

    if (!arquitetura || !['RISK_DIAGNOSIS', 'BLOCKER_DIAGNOSIS', 'PROFILE_TYPE'].includes(arquitetura)) {
      return NextResponse.json(
        { success: false, message: 'Arquitetura inválida' },
        { status: 400 }
      )
    }

    if (!tema && !comando) {
      return NextResponse.json(
        { success: false, message: 'Tema ou comando personalizado é obrigatório' },
        { status: 400 }
      )
    }

    // Gerar fluxo com agente (usa o primeiro segmento para gerar, mas salva para todos)
    const resultado = await gerarFluxoComAgente({
      tema,
      segmento: segmentosArray[0], // Usa o primeiro para gerar o conteúdo
      arquitetura,
      comando,
    })

    if (!resultado.success || !resultado.fluxo) {
      return NextResponse.json(
        {
          success: false,
          message: resultado.message,
        },
        { status: 500 }
      )
    }

    // Salvar na biblioteca automaticamente (com todos os segmentos selecionados)
    const { data: itemBiblioteca, error: insertError } = await supabaseAdmin
      .from('ylada_biblioteca_itens')
      .insert({
        tipo: 'quiz',
        segment_codes: segmentosArray, // Array com todos os segmentos selecionados
        tema: resultado.fluxo.tema,
        titulo: resultado.fluxo.titulo,
        description: resultado.fluxo.description,
        source_type: 'custom',
        flow_id: resultado.fluxo.flow_id,
        architecture: resultado.fluxo.architecture,
        meta: {
          ...resultado.fluxo.meta,
          questions: resultado.fluxo.questions,
          generated_by: 'flux_creator_agent',
          generated_at: new Date().toISOString(),
        },
        active: true,
        sort_order: 0,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Erro ao salvar na biblioteca:', insertError)
      return NextResponse.json(
        {
          success: false,
          message: `Fluxo gerado, mas erro ao salvar na biblioteca: ${insertError.message}`,
          data: resultado.fluxo,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Fluxo gerado e salvo na biblioteca com sucesso!',
      data: {
        fluxo: resultado.fluxo,
        biblioteca_item: itemBiblioteca,
      },
    })
  } catch (error: any) {
    console.error('Erro ao gerar fluxo:', error)
    return NextResponse.json(
      {
        success: false,
        message: `Erro interno: ${error.message}`,
      },
      { status: 500 }
    )
  }
}
