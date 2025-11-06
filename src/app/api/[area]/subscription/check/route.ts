import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { hasActiveSubscription, canBypassSubscription } from '@/lib/subscription-helpers'

/**
 * GET /api/[area]/subscription/check
 * Verifica se usuário tem assinatura ativa para qualquer área
 * 
 * Áreas suportadas: wellness, nutri, coach, nutra
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { area: string } }
) {
  try {
    const area = params.area as 'wellness' | 'nutri' | 'coach' | 'nutra'
    
    // Validar área
    if (!['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
      return NextResponse.json(
        { error: 'Área inválida. Use: wellness, nutri, coach ou nutra' },
        { status: 400 }
      )
    }

    // Verificar autenticação
    const authResult = await requireApiAuth(request, [area, 'admin'])
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
    const hasSubscription = await hasActiveSubscription(user.id, area)

    return NextResponse.json({
      hasActiveSubscription: hasSubscription,
      bypassed: false,
    })
  } catch (error: any) {
    console.error(`❌ Erro ao verificar assinatura para ${params.area}:`, error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar assinatura' },
      { status: 500 }
    )
  }
}

