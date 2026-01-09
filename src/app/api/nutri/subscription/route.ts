import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getActiveSubscription } from '@/lib/subscription-helpers'

/**
 * GET /api/nutri/subscription
 * Obtém detalhes da assinatura ativa do usuário para área nutri
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Buscar assinatura ativa
    const subscription = await getActiveSubscription(user.id, 'nutri')

    if (!subscription) {
      return NextResponse.json({
        hasActiveSubscription: false,
        subscription: null,
      })
    }

    return NextResponse.json({
      hasActiveSubscription: true,
      subscription,
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar assinatura nutri:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar assinatura' },
      { status: 500 }
    )
  }
}

