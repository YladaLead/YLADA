import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { hasActiveSubscription, canBypassSubscription } from '@/lib/subscription-helpers'

/**
 * GET /api/wellness/subscription/check
 * Verifica se usuário tem assinatura ativa
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    // Admin e suporte podem bypassar verificação de assinatura
    const canBypass = await canBypassSubscription(user.id)
    if (canBypass) {
      return NextResponse.json({
        hasActiveSubscription: true,
        bypassed: true,
        reason: profile?.is_admin ? 'admin' : 'support',
      })
    }

    // Verificar assinatura ativa
    const hasSubscription = await hasActiveSubscription(user.id, 'wellness')

    return NextResponse.json({
      hasActiveSubscription: hasSubscription,
      bypassed: false,
    })
  } catch (error: any) {
    console.error('❌ Erro ao verificar assinatura:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar assinatura' },
      { status: 500 }
    )
  }
}

