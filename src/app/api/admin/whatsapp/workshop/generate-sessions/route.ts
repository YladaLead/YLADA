import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { generateWorkshopSessions } from '@/lib/whatsapp-workshop-schedule'

/**
 * POST /api/admin/whatsapp/workshop/generate-sessions
 * Gera sessões automaticamente baseado nos horários fixos configurados
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json().catch(() => ({}))
    const weeksAhead = typeof body.weeksAhead === 'number' ? body.weeksAhead : 4

    const result = await generateWorkshopSessions(weeksAhead)

    if (result.error) {
      return NextResponse.json(
        { 
          success: false,
          error: result.error,
          created: result.created,
          errors: result.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      ...result,
      message: `Criadas ${result.created} sessões. ${result.errors > 0 ? `${result.errors} erros.` : ''}`,
    })
  } catch (error: any) {
    console.error('[Workshop Generate] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar sessões', details: error.message },
      { status: 500 }
    )
  }
}
