import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import {
  getActiveSubscription,
  hasYladaProPlan,
  perfilMatrizToSubscriptionArea,
  subscriptionRowIsMatrixSegmentCommercialUnlimited,
} from '@/lib/subscription-helpers'
import { isPerfilMatrizYlada } from '@/lib/admin-matriz-constants'
import { getNoelUsageCount } from '@/lib/noel-usage-helpers'
import { FREEMIUM_LIMITS } from '@/config/freemium-limits'

/** Perfis que podem chamar esta rota (autenticados na matriz ou wellness/admin). */
const ALLOWED = [
  'nutri',
  'wellness',
  'coach',
  'nutra',
  'admin',
  'ylada',
  'psi',
  'psicanalise',
  'odonto',
  'fitness',
  'joias',
  'estetica',
  'med',
  'perfumaria',
  'seller',
  'coach-bem-estar',
] as const

/**
 * GET /api/matrix/commercial-tier
 * Tier comercial no lado matriz YLADA (/pt): pro vs freedom vs fora da matriz.
 * Usado pelo app para banner Freedom e métricas de freemium (ex.: análises estratégicas do Noel).
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, [...ALLOWED])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult
    const perfil = (profile?.perfil as string | undefined) || ''

    if (!isPerfilMatrizYlada(perfil)) {
      return NextResponse.json({
        onMatrix: false,
        perfil,
        matrixCommercialTier: null,
        subscriptionArea: null,
        noelAdvancedUsedThisMonth: 0,
        noelAdvancedLimitPerMonth: FREEMIUM_LIMITS.FREE_LIMIT_NOEL_ADVANCED_ANALYSES_PER_MONTH,
        upgradePath: null,
      })
    }

    const subscriptionArea = perfilMatrizToSubscriptionArea(perfil)
    if (!subscriptionArea) {
      return NextResponse.json({
        onMatrix: true,
        perfil,
        matrixCommercialTier: 'none' as const,
        subscriptionArea: null,
        noelAdvancedUsedThisMonth: 0,
        noelAdvancedLimitPerMonth: FREEMIUM_LIMITS.FREE_LIMIT_NOEL_ADVANCED_ANALYSES_PER_MONTH,
        upgradePath: `/pt/${perfil}/checkout`,
      })
    }

    const isYladaPro = await hasYladaProPlan(user.id)
    const noelAdvancedLimitPerMonth = FREEMIUM_LIMITS.FREE_LIMIT_NOEL_ADVANCED_ANALYSES_PER_MONTH

    const subscription = await getActiveSubscription(user.id, subscriptionArea)
    if (!subscription) {
      if (isYladaPro) {
        return NextResponse.json({
          onMatrix: true,
          perfil,
          matrixCommercialTier: 'pro' as const,
          subscriptionArea,
          noelAdvancedUsedThisMonth: 0,
          noelAdvancedLimitPerMonth,
          upgradePath: `/pt/${perfil}/checkout`,
        })
      }
      return NextResponse.json({
        onMatrix: true,
        perfil,
        matrixCommercialTier: 'none' as const,
        subscriptionArea,
        noelAdvancedUsedThisMonth: 0,
        noelAdvancedLimitPerMonth,
        upgradePath: `/pt/${perfil}/checkout`,
      })
    }

    const unlimited = subscriptionRowIsMatrixSegmentCommercialUnlimited(subscription)
    const matrixCommercialTier =
      isYladaPro || unlimited ? ('pro' as const) : ('freedom' as const)
    const noelAdvancedUsedThisMonth =
      !isYladaPro ? await getNoelUsageCount(user.id) : 0

    return NextResponse.json({
      onMatrix: true,
      perfil,
      matrixCommercialTier,
      subscriptionArea,
      noelAdvancedUsedThisMonth,
      noelAdvancedLimitPerMonth,
      upgradePath: `/pt/${perfil}/checkout`,
    })
  } catch (error: any) {
    console.error('❌ GET /api/matrix/commercial-tier:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao obter tier comercial' },
      { status: 500 }
    )
  }
}
