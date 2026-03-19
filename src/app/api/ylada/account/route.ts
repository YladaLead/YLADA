/**
 * GET /api/ylada/account — dados da conta (user_profiles) para áreas YLADA.
 * PUT /api/ylada/account — atualiza nome, email, whatsapp, bio.
 * Aceita: psi, psicanalise, odonto, fitness, estetica, med, ylada, nutra, coach, perfumaria, seller, admin.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { translateError } from '@/lib/error-messages'

const YLADA_ACCOUNT_PROFILES = [
  'psi', 'psicanalise', 'odonto', 'fitness', 'estetica', 'med', 'ylada',
  'nutra', 'nutri', 'coach', 'perfumaria', 'seller', 'admin',
] as const

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, [...YLADA_ACCOUNT_PROFILES])
    if (authResult instanceof NextResponse) return authResult
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('nome_completo, email, whatsapp, bio, country_code')
      .eq('user_id', user.id)
      .maybeSingle()

    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user.id)

    return NextResponse.json({
      success: true,
      profile: {
        nome: profile?.nome_completo || authUser?.user?.user_metadata?.full_name || '',
        email: authUser?.user?.email || profile?.email || '',
        telefone: profile?.whatsapp || '',
        whatsapp: profile?.whatsapp || '',
        countryCode: profile?.country_code || 'BR',
        bio: profile?.bio || '',
      },
    })
  } catch (error: any) {
    console.error('[ylada/account] GET', error)
    return NextResponse.json(
      { error: translateError(error) },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, [...YLADA_ACCOUNT_PROFILES])
    if (authResult instanceof NextResponse) return authResult
    const { user, profile } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { nome, telefone, whatsapp, countryCode, bio } = body

    const profileData: Record<string, unknown> = {
      nome_completo: nome ?? undefined,
      updated_at: new Date().toISOString(),
    }

    const whatsappValue = whatsapp || telefone
    if (whatsappValue !== undefined) {
      const limpo = String(whatsappValue).replace(/\D/g, '')
      profileData.whatsapp = limpo.length > 0 ? limpo : null
    }
    if (bio !== undefined) profileData.bio = bio || null
    if (countryCode) profileData.country_code = countryCode

    const { data: current } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (current) {
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', user.id)

      if (error) throw error
    } else {
      const perfil = profile?.perfil || 'ylada'
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: user.id,
          nome_completo: nome || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          email: user.email,
          whatsapp: profileData.whatsapp ?? null,
          bio: profileData.bio ?? null,
          country_code: profileData.country_code || 'BR',
          perfil,
        })

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[ylada/account] PUT', error)
    return NextResponse.json(
      { error: translateError(error) },
      { status: 500 }
    )
  }
}
