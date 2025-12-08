import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/wellness/noel/onboarding/check
 * 
 * Verifica se o usuário já completou o onboarding
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Buscar perfil
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('wellness_noel_profile')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (perfilError && perfilError.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar perfil:', perfilError)
      return NextResponse.json(
        { hasProfile: false, error: 'Erro ao buscar perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      hasProfile: !!perfil && !!perfil.onboarding_completo,
      onboardingComplete: !!perfil?.onboarding_completo
    })

  } catch (error: any) {
    console.error('❌ Erro ao verificar onboarding:', error)
    return NextResponse.json(
      { hasProfile: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
