import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { hasFeatureAccess, hasAnyFeature, type Feature } from '@/lib/feature-helpers'
import { canBypassSubscription, hasActiveSubscription } from '@/lib/subscription-helpers'

/**
 * GET /api/[area]/feature/check?feature=gestao
 * Verifica se usuário tem acesso a uma feature específica
 * 
 * Query params:
 * - feature: Feature a verificar (gestao, ferramentas, cursos, completo)
 * - features: Array de features (separado por vírgula) - verifica se tem qualquer uma
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { area: string } }
) {
  try {
    const area = params.area as 'nutri' | 'coach' | 'nutra' | 'wellness'
    
    // Validar área
    if (!['nutri', 'coach', 'nutra', 'wellness'].includes(area)) {
      return NextResponse.json(
        { error: 'Área inválida' },
        { status: 400 }
      )
    }

    // Verificar autenticação
    const authResult = await requireApiAuth(request, [area, 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    // Admin e suporte podem bypassar
    const canBypass = await canBypassSubscription(user.id)
    if (canBypass) {
      return NextResponse.json({
        hasAccess: true,
        bypassed: true,
        reason: profile?.is_admin ? 'admin' : 'support',
      })
    }

    // Buscar parâmetros
    const { searchParams } = new URL(request.url)
    const featureParam = searchParams.get('feature')
    const featuresParam = searchParams.get('features')

    // Validar que pelo menos um parâmetro foi fornecido
    if (!featureParam && !featuresParam) {
      return NextResponse.json(
        { error: 'Parâmetro "feature" ou "features" é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar acesso
    let hasAccess = false

    if (featuresParam) {
      const features = featuresParam.split(',').map(f => f.trim()) as Feature[]
      hasAccess = await hasAnyFeature(user.id, area, features)
    } else if (featureParam) {
      hasAccess = await hasFeatureAccess(user.id, area, featureParam as Feature)
    }

    // Nutri: se ainda negado, conceder acesso a ferramentas/cursos/completo quando houver assinatura ativa
    // (evita bloqueio por features vazias, migração ou dados antigos)
    if (!hasAccess && area === 'nutri') {
      const hasActive = await hasActiveSubscription(user.id, 'nutri')
      const requestedFeatures = featuresParam
        ? (featuresParam.split(',').map(f => f.trim()) as Feature[])
        : (featureParam ? [featureParam.trim() as Feature] : [])
      const nutriPlatformFeatures: Feature[] = ['ferramentas', 'cursos', 'completo']
      const requestedNutriAccess = requestedFeatures.some(f => nutriPlatformFeatures.includes(f))
      if (hasActive && requestedNutriAccess) {
        hasAccess = true
      }
    }

    return NextResponse.json({
      hasAccess,
      bypassed: false,
      feature: featureParam || featuresParam,
    })
  } catch (error: any) {
    console.error(`❌ Erro ao verificar feature para ${params.area}:`, error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar feature' },
      { status: 500 }
    )
  }
}

