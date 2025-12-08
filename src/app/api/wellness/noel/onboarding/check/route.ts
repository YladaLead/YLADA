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

    // Buscar perfil NOEL
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

    // Buscar profile_type de user_profiles também
    let profileType = null
    try {
      const { data: userProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('profile_type')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (userProfile?.profile_type) {
        profileType = userProfile.profile_type
      } else if (perfil?.profile_type) {
        profileType = perfil.profile_type
      }
    } catch (err) {
      console.warn('⚠️ Erro ao buscar profile_type:', err)
    }

    return NextResponse.json({
      hasProfile: !!perfil && !!perfil.onboarding_completo,
      onboardingComplete: !!perfil?.onboarding_completo,
      profile: perfil || null,
      profile_type: profileType
    })

  } catch (error: any) {
    console.error('❌ Erro ao verificar onboarding:', error)
    return NextResponse.json(
      { hasProfile: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
