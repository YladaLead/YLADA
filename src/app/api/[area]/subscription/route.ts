import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getActiveSubscription } from '@/lib/subscription-helpers'

/**
 * GET /api/[area]/subscription
 * Obtém detalhes da assinatura ativa do usuário para qualquer área
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
    const { user } = authResult

    // Buscar assinatura ativa
    const subscription = await getActiveSubscription(user.id, area)

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
    console.error(`❌ Erro ao buscar assinatura para ${params.area}:`, error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar assinatura' },
      { status: 500 }
    )
  }
}

