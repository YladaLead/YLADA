import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { checkModuleUnlocked, calculateModuleProgress } from '@/lib/cursos-helpers'

/**
 * GET /api/nutri/cursos/liberacao?modulo_id=xxx
 * Verifica se módulo está liberado para o usuário
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth(request, ['nutri', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const moduloId = searchParams.get('modulo_id')

    if (!moduloId) {
      return NextResponse.json(
        { error: 'modulo_id é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se está liberado
    const isUnlocked = await checkModuleUnlocked(user.id, moduloId)

    // Se não está liberado, buscar motivo
    let motivo = null
    if (!isUnlocked) {
      // Calcular progresso do módulo anterior
      // (lógica já está em checkModuleUnlocked)
      motivo = 'Complete o módulo anterior para desbloquear este módulo.'
    }

    // Calcular progresso atual do módulo
    const progresso = await calculateModuleProgress(user.id, moduloId)

    return NextResponse.json({
      success: true,
      data: {
        unlocked: isUnlocked,
        progress_percentage: progresso,
        motivo,
      },
    })
  } catch (error: any) {
    console.error('❌ Erro ao verificar liberação:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar liberação', details: error.message },
      { status: 500 }
    )
  }
}

