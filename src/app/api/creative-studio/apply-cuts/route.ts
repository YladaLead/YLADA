import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * API Route para aplicar cortes automáticos em vídeo
 * Recebe timestamps e cria clips segmentados
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (apenas admin)
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { videoUrl, cuts, clipId } = body

    if (!videoUrl || !cuts || !Array.isArray(cuts)) {
      return NextResponse.json(
        { error: 'videoUrl e cuts (array) são obrigatórios' },
        { status: 400 }
      )
    }

    // cuts deve ser um array de objetos { start: number, end: number }
    // Retornar estrutura de clips para adicionar à timeline
    const clips = cuts.map((cut: { start: number; end: number }, index: number) => ({
      id: `${clipId || 'cut'}-${index}`,
      startTime: cut.start,
      endTime: cut.end,
      source: videoUrl,
      type: 'video' as const,
      originalStart: cut.start,
      originalEnd: cut.end,
    }))

    return NextResponse.json({
      clips,
      message: `Vídeo segmentado em ${clips.length} clip(s)`,
    })
  } catch (error: any) {
    console.error('Erro ao aplicar cortes:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao aplicar cortes' },
      { status: 500 }
    )
  }
}

