import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { clips, script } = body

    if (!clips || clips.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum clip fornecido' },
        { status: 400 }
      )
    }

    // Por enquanto, retornar sucesso e indicar que o vídeo está na timeline
    // O usuário pode usar o VideoExporter para exportar
    // TODO: Implementar renderização server-side com Remotion quando necessário
    
    // Calcular duração total
    const totalDuration = clips.reduce((max: number, clip: any) => {
      return Math.max(max, clip.endTime || 0)
    }, 0)

    return NextResponse.json({
      success: true,
      message: 'Vídeo montado na timeline! Use o botão "Exportar Vídeo" para baixar.',
      clipsCount: clips.length,
      duration: totalDuration,
      status: 'ready',
    })
  } catch (error: any) {
    console.error('Erro ao gerar vídeo:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar vídeo' },
      { status: 500 }
    )
  }
}
