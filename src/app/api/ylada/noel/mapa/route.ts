/**
 * GET /api/ylada/noel/mapa
 * Retorna o Mapa Estratégico do Profissional (progresso nas etapas).
 * Query: segment (opcional, default 'ylada')
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_SEGMENT_CODES } from '@/config/ylada-areas'
import { getNoelMemory } from '@/lib/noel-wellness/noel-memory'
import {
  getStrategyMap,
  formatStrategyMapForApi,
} from '@/lib/noel-wellness/noel-strategy-map'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'seller', 'perfumaria', 'estetica', 'fitness', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const { searchParams } = new URL(request.url)
    const segment = (searchParams.get('segment') || 'ylada').toLowerCase()
    const validSegment = YLADA_SEGMENT_CODES.includes(segment as (typeof YLADA_SEGMENT_CODES)[number]) ? segment : 'ylada'

    const memory = await getNoelMemory(user.id, validSegment)
    const map = await getStrategyMap(user.id, validSegment, memory)

    const formatted = formatStrategyMapForApi(map)

    return NextResponse.json({
      success: true,
      data: formatted,
      segment: validSegment,
    })
  } catch (error: unknown) {
    console.error('[/api/ylada/noel/mapa]', error)
    const message = error instanceof Error ? error.message : 'Erro ao buscar mapa.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
