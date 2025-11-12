import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/wellness/modulos/[id]/areas
 * Busca as áreas associadas a um módulo
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('curso_modulos_areas')
      .select('area')
      .eq('modulo_id', params.id)

    if (error) {
      return NextResponse.json(
        { error: `Erro ao buscar áreas: ${error.message}` },
        { status: 500 }
      )
    }

    const areas = (data || []).map((item: any) => item.area)

    return NextResponse.json({ areas })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

