import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getActiveSubscription } from '@/lib/subscription-helpers'

/**
 * GET /api/wellness/subscription
 * Obtém detalhes da assinatura ativa do usuário
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Buscar assinatura ativa
    const subscription = await getActiveSubscription(user.id, 'wellness')

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
    console.error('❌ Erro ao buscar assinatura:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar assinatura' },
      { status: 500 }
    )
  }
}

