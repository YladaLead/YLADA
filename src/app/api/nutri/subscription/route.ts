import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import {
  getActiveSubscription,
  hasYladaProPlan,
  subscriptionRowIsMatrixSegmentCommercialUnlimited,
} from '@/lib/subscription-helpers'
import { getNoelUsageCount } from '@/lib/noel-usage-helpers'
import { FREEMIUM_LIMITS } from '@/config/freemium-limits'

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
        nutriCommercialTier: 'none' as const,
      })
    }

    const unlimited = subscriptionRowIsMatrixSegmentCommercialUnlimited(subscription)
    const nutriCommercialTier = unlimited ? ('pro' as const) : ('freedom' as const)
    const noelAdvancedLimitPerMonth = FREEMIUM_LIMITS.FREE_LIMIT_NOEL_ADVANCED_ANALYSES_PER_MONTH
    const isYladaPro = await hasYladaProPlan(user.id)
    const noelAdvancedUsedThisMonth = !isYladaPro ? await getNoelUsageCount(user.id) : 0

    return NextResponse.json({
      hasActiveSubscription: true,
      subscription,
      nutriCommercialTier,
      noelAdvancedUsedThisMonth,
      noelAdvancedLimitPerMonth,
      upgradePath: '/pt/precos/checkout',
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar assinatura nutri:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar assinatura' },
      { status: 500 }
    )
  }
}

